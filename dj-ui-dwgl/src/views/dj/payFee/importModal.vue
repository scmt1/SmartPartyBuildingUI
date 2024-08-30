<template>
    <el-dialog title="批量导入交纳基数" :visible.sync="dialogVisible" width="60%" @close="dialogVisible = false"
               class="importModal" append-to-body>
        <div style="height: 150px">
            <el-steps :active="3" align-center>
                <el-step title="第一步：下载模板"></el-step>
                <el-step title="第二步：上传修改完毕的模板表"></el-step>
                <el-step title="第三步：设置生效时间" description="（若生效时间选择从本月开始，则本月已交费的党员从下月开始按新标准执行）"></el-step>
            </el-steps>
        </div>

        <el-form ref="form" :model="form" label-width="120px" :rules="formRules" v-loading="saveLoading">
            <el-form-item label="已选择支部：">
                {{ deptName }}
            </el-form-item>
            <el-form-item label="模板下载：">
                <el-button @click="downloadTemp" size="small">模板下载</el-button>
            </el-form-item>
            <el-form-item label="文件上传：">
                <Upload
                        size="small"
                        name="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12"
                        :format="['xls','xlsx']"
                        :before-upload="(e) =>handleUpload(e)"
                        :show-upload-list="false"
                        :headers="upHeaders"
                        :on-success="uploadSuccess"
                        action="#"
                        ref="upload">
                    <div>
                        <el-input :value="input" placeholder="需要上传的文件" size="mini" autocomplete="off"
                                  style="width:240px;" :disabled="true"></el-input>
                        <el-button size="mini" style="width: 100px;height: 30px">上传文件
                        </el-button>
                    </div>
                </Upload>
                <span style="color: #f46e65;">注：请确认党员姓名、手机号填写无误！</span>
            </el-form-item>
            <el-form-item label="生效时间：" prop="payMonth">
                <el-date-picker
                        default-value
                        size="small"
                        v-model="form.payMonth"
                        type="month"
                        placeholder="选择日期"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        class="input-row">
                </el-date-picker>
                开始按新的基数交纳
            </el-form-item>
        </el-form>
        <div slot="footer" class="footer">
            <el-button size="small" @click="dialogVisible=false">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm()" v-loading="saveLoading">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Vue from "vue";
import XLSX from "xlsx";
import {queryPartyMemberListByDeptId, importPayFeeStandard} from "../../../api/jcxfPayFeeDetail";

export default {
    name: "importModal",
    components: {},

    data() {
        return {
            dialogVisible: false,
            saveLoading: false,
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_vs')
            },
            input: '请选择需要上传的文件',
            form: {
                payMonth: ''
            },
            formRules: {
                payMonth: [
                    {required: true, message: '生效时间不能为空', trigger: 'blur', pattern: /.+/},
                ],
            },
            deptId: '',
            deptName: '',
        }
    },
    methods: {
        initOpen(deptId, deptName) {
            this.deptName = deptName
            this.dialogVisible = true
            this.saveLoading = false
            this.deptId = deptId
            this.form = {}
            this.input = ''
        },
        handleUpload(file) {
            this.input = file.name
            const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (fileType !== 'xls' && fileType !== 'xlsx') {
                this.$message.error('只能上传 Excel 文件')
                return false
            }
            // 读取 Excel 文件
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result
                const workbook = XLSX.read(data, {type: 'binary'})
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName]
                let header = this.getColumns(worksheet)
                let test2 = XLSX.utils.sheet_to_json(worksheet)
                let tmp = test2.slice(0)
                if (tmp) {
                    this.allColumns = []
                    tmp.forEach(i => {
                        let row = {
                            name: i[header[0].title],
                            phone: i[header[1].title],
                            paymentBase: i[header[2].title],
                        }
                        this.allColumns.push(row)
                    })
                }
            }
            reader.readAsBinaryString(file)
            return false
        },
        getColumns(worksheet) {
            let columns = []
            const range = XLSX.utils.decode_range(worksheet['!ref'])
            for (let i = range.s.c; i <= range.e.c; i++) {
                const cell = worksheet[XLSX.utils.encode_cell({r: range.s.r, c: i})]
                if (cell && cell.t === 's') {
                    columns.push({
                        title: cell.v,
                        key: XLSX.utils.encode_col(i)
                    })
                }
            }
            return columns
        },
        uploadSuccess(response, file, fileList) {
            this.input = file.name
            if (response.success) {
                this.$message({
                    message: '保存成功',
                    type: 'success',
                })
                this.dialogVisible = false
                this.$emit('refresh')
            } else {
                this.$message.error(response.msg)
            }
        },
        submitForm() {
            if (!this.allColumns || this.allColumns.length < 1) {
                this.$message.error("上传的文件不能为空！")
                return
            }
            this.saveLoading = true
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    this.saveLoading = false
                    return false
                }
                let reqData = {
                    deptId: String(this.deptId),
                    payPersonList: this.allColumns,
                    payMonth: this.form.payMonth
                }
                importPayFeeStandard({reqData: reqData}).then(res => {
                    let data = res.data
                    if (data.code == '00000') {
                        this.$message.success("导入成功")
                        this.$emit('refresh')
                    }
                    this.dialogVisible = false
                    this.saveLoading = false
                }).catch(() =>{
                    this.dialogVisible = false
                    this.saveLoading = false
                })
            })
        },
        downloadTemp() {
            // let url = window.location.protocol + "//" + window.location.host
            // const link = document.createElement('a')
            // link.style.display = 'none'
            // link.href = url + "/excel/党员党费标准导入模版.xlsx"
            // link.setAttribute('download', "党员党费标准导入模版.xlsx")
            // document.body.appendChild(link)
            // link.click()
            // document.body.removeChild(link)

            this.$confirm("模板下载会自动把本支部的党员信息导出，只需完善党费基数即可", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let data = {
                    deptId: String(this.deptId)
                }
                queryPartyMemberListByDeptId(data).then(res => {
                    let exportList = res.data.data
                    import("@/vendor/Export2Excel").then((excel) => {
                        // 设置导出表格的头部
                        const tHeader = [
                            "党员姓名",
                            "手机号",
                            "党费计算基数"
                        ]
                        // 将要导出的数据进行一个过滤
                        /**
                         * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                         */
                        const data = exportList.map((item, index) => {
                            return [
                                item.realName,
                                item.phone,
                                ''
                            ]
                        })
                        // 调用我们封装好的方法进行导出Excel
                        excel.export_json_to_excel({
                            // 导出的头部
                            header: tHeader,
                            // 导出的内容
                            data,
                            // 导出的文件名称
                            filename: this.deptName + "党员党费标准导入模板",
                            // 导出的表格宽度是否自动
                            autoWidth: true,
                            // 导出文件的后缀类型
                            bookType: "xlsx",
                            cellStyle: {alignment: {vertical: 'middle', horizontal: 'center', wrapText: 1}},
                            headerStyle: {alignment: {horizontal: "center", vertical: "center"}},
                        })
                    });
                    this.$message.success("导出成功")
                })

            })


        }
    }
}
</script>

<style lang="less">
.importModal {
    .el-step__title.is-finish, .el-step__head.is-finish, .el-step__description.is-finish {
        color: #f46e65 !important;
        border-color: #f46e65 !important;
    }
}
</style>
