<template>
    <el-dialog title="新增本部门党费缴纳" :visible.sync="show" width="700px" append-to-body :close-on-click-modal="false" @close="close">
        <div class="modal-content">
            <div class="body">
                <el-form ref="form" :model="form">
                    <el-form-item label="缴费年月:" :label-width="formLabelWidth" class="input-row">
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
                    </el-form-item>
                    <el-form-item label="党费:" :label-width="formLabelWidth" class="input-row">
                        <el-select v-model="form.mode" placeholder="请选择" size="small" class="input-row">
                            <el-option label="导入" value=1></el-option>
                            <el-option label="复制" value=2></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上传的文件:" :label-width="formLabelWidth" v-if="form.mode==='1'">
                        <Upload
                                size="small"
                                name="file"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12"
                                :format="['xls','xlsx']"
                                :before-upload="(e) =>handleUpload(e)"
                                :on-success="uploadSuccess"
                                :show-upload-list="false"
                                :headers="upHeaders"
                                action="#"
                                ref="upload">
                            <div>
                                <el-input :value="input" placeholder="需要上传的文件" size="mini"
                                          autocomplete="off" style="width:240px;" :disabled="true"></el-input>
                                <el-button size="mini" style="width: 100px;height: 30px"
                                           v-if="fileList.length<1">上传文件
                                </el-button>
                            </div>
                        </Upload>
                    </el-form-item>
                    <el-form-item label="复制年月:" :label-width="formLabelWidth" class="input-row" v-if="form.mode==='2'">
                        <div>
                            <el-date-picker
                                    default-value
                                    size="small"
                                    v-model="form.copyMonth"
                                    type="month"
                                    placeholder="选择日期"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM"
                                    class="input-row">
                            </el-date-picker>
                            <el-button size="mini" @click="getCopyInfo()" style="height: 30px">查询</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top: 10px;">
                <div>
                    <el-table v-loading="tableLoading" :data="columns" height="350" border style="width: 100%">
                        <el-table-column prop="sort" label="序号" width="80"></el-table-column>
                        <el-table-column prop="partyMemberId" label="党员id" width="120"></el-table-column>
                        <el-table-column prop="realName" label="党员姓名" width="120"></el-table-column>
                        <el-table-column prop="idcard" label="身份证后六位"></el-table-column>
                        <el-table-column prop="payFee" label="党费（元）">
                            <template slot-scope="scope">
                                {{ scope.row.payFee.toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="校验">
                            <template slot-scope="scope">
                                <template v-if="!scope.row.surplus">
                                    通过
                                </template>
                                <template v-else-if="scope.row.surplus">
                                    无效
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="allColumns.length > pageSize" style="text-align: center; margin-top: 10px;">
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="allColumns.length"
                            @current-change="currentChange">
                    </el-pagination>
                </div>
                <div style="display: flex; margin-top: 10px; font-size: 13px; font-weight: bold;">
                    <div v-if="validTotal > 0">
                        <span>党员数量：{{ validTotal }}人</span>
                    </div>
                    <div v-if="surplusTotal > 0" style="color: red;">
                        无效数据{{ surplusTotal }}条
                    </div>
                    <span style="margin-left: 20px; margin-right: 20px; ">党费合计：{{ payFeeTotal.toFixed(2) }}元</span>
                </div>
                <div v-if="lackInfo.length > 0"
                     style="display: flex; margin-top: 10px; font-size: 13px; font-weight: bold;">
                    <div>未包含的党员：</div>
                    <div>
                        <span style="margin-right: 15px; color: red;" v-for="(item, index) in lackInfo" :key="index">
                            {{ item.id }}：{{ item.realName }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button v-if="validTotal > 0" :disabled="addFlag" type="primary" @click="savePayFee"
                       :loading="addLoading">确认提交党费缴纳数据
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import Vue from 'vue'
import {copyDataByMonth, getCopyInfoByTime} from "@/api/jcxfPayFee";
import XLSX from "xlsx";
import {importPayFee} from "@/api/jcxfPayFeeDetail";
import {importPayFeeVerify} from "@/api/jcxfPayFeeDetail";
import {mapGetters} from "vuex";

export default {
    name: 'addPayFee',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        deptId: {
            type: String
        }
    },
    data() {
        return {
            input: '请选择需要上传的文件',
            fileList: [],
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_vs')
            },
            show: false,
            formLabelWidth: '100px',
            form: {
                mode: '1',
                payMonth: null,
                copyMonth: null
            },
            columns: [],
            allColumns: [],
            lackInfo: [],
            surplusTotal: 0,
            validTotal: 0,
            payFeeTotal: 0,
            pageNum: 1,
            pageSize: 500,
            tableLoading: false,
            addLoading: false,
            addFlag: false
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        getCopyInfo() {
            if (this.form.copyMonth == null || this.form.copyMonth == '') {
                this.$message.info('请选择需要复制的年月')
                return
            }
            this.tableLoading = true

            let data = {
                deptId: this.deptId + '',
                copyMonth: this.form.copyMonth
            }

            getCopyInfoByTime(data).then(res => {
                this.tableLoading = false
                let data = res.data
                if (data.code == '00000') {
                    this.columns = []
                    this.allColumns = []

                    for (let i = 0; i < data.data.tzPayFeeDetailList.length; i++) {
                        const value = data.data.tzPayFeeDetailList[i]
                        let va = {
                            sort: i + 1,
                            partyMemberId: value.partyMemberId,
                            realName: value.name,
                            idcard: value.idCardLast,
                            payFee: value.shouldPay,
                            lack: false,
                            surplus: false
                        }
                        if (value.shouldPay == 0) {
                            va.surplus = true
                        }

                        this.allColumns.push(va)
                    }

                    if (this.allColumns.length > this.pageSize) {
                        this.columns = this.allColumns.slice(this.pageSize * (this.pageNum - 1), this.pageSize * this.pageNum)
                    } else {
                        this.columns = this.allColumns
                    }

                    this.pageNum = 1

                    this.payFeeVerify()
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        getDate() {
            let now = new Date()
            let year = now.getFullYear() //得到年份
            let month = now.getMonth() //得到月份
            month = month + 1
            month = month.toString().padStart(2, '0')
            let defaultDate = `${year}-${month}`//
            return defaultDate
        },
        handleUpload(file) {
            this.tableLoading = true

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
                    this.columns = []
                    this.allColumns = []

                    tmp.forEach(i => {
                        let payFee = i[header[4].title] != null && i[header[4].title] != '' ? i[header[4].title] : 0
                        payFee = Math.ceil(payFee * 100) / 100
                        let row = {
                            sort: i[header[0].title],
                            partyMemberId: i[header[1].title],
                            realName: i[header[2].title],
                            idcard: i[header[3].title],
                            payFee: payFee,
                            lack: false,
                            surplus: false
                        }
                        if (payFee == 0) {
                            row.surplus = true
                        }

                        this.allColumns.push(row)
                    })

                    if (this.allColumns.length > this.pageSize) {
                        this.columns = this.allColumns.slice(this.pageSize * (this.pageNum - 1), this.pageSize * this.pageNum)
                    } else {
                        this.columns = this.allColumns
                    }

                    this.pageNum = 1
                    this.tableLoading = false

                    this.payFeeVerify()
                }
            }
            reader.readAsBinaryString(file)
            return false
        },
        payFeeVerify() {
            let data = []
            for (let i = 0; i < this.columns.length; i++) {
                let val = {
                    shouldPay: this.columns[i].payFee,
                    id: this.columns[i].partyMemberId,
                    idcard: this.columns[i].idcard
                }
                data.push(val)
            }

            let value = {
                deptId: this.deptInfo.id + '',
                partyMemberList: data
            }
            importPayFeeVerify({data: value}).then(res => {
                const result = res.data

                let total = this.allColumns.length
                if (result.code == '00000') {
                    this.addFlag = false
                    this.surplusTotal = result.data.surplus.length

                    if (result.data.lack.length > 0) {
                        this.lackInfo = result.data.lack
                    }
                    if (result.data.surplus.length > 0) {
                        const value = result.data.surplus
                        for (let i = 0; i < this.columns.length; i++) {
                            for (let j = 0; j < value.length; j++) {
                                if (this.columns[i].partyMemberId == value[j].id) {
                                    this.columns[i].surplus = true
                                    total--

                                    break
                                }
                            }
                        }
                    }
                    this.payFeeTotal = result.data.totalPay
                    this.validTotal = total
                } else {
                    this.addFlag = true
                    this.$message.info(result.msg)
                }
            })
        },
        currentChange(val) {
            this.tableLoading = true
            this.pageNum = val
            this.columns = this.allColumns.slice(this.pageSize * (this.pageNum - 1), this.pageSize * this.pageNum)
            this.tableLoading = false
        },
        accAdd(arg1, arg2) {
            let r1, r2, m;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch (e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch (e) {
                r2 = 0
            }
            m = Math.pow(10, Math.max(r1, r2))
            return (arg1 * m + arg2 * m) / m
        },
        uploadSuccess(response, file, fileList) {
            this.input = file.name
            if (response.success) {
                this.fileList.push(file)
                this.$message({
                    message: '保存成功',
                    type: 'success',
                    //duration: 1000
                })
                this.close()
            } else {
                this.$message.error(response.msg)
            }
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
        close() {
            this.reset()
            this.$refs['form'].resetFields()
            this.$emit('close')
        },
        reset() {
            this.fileList = []
            this.columns = []
            this.allColumns = []
            this.pageNum = 1
            this.form = {
                mode: '1',
                payMonth: null,
                copyMonth: null
            }
            this.payFeeTotal = 0

            this.validTotal = 0
            this.surplusTotal = 0

            this.lackInfo = []
        },
        closeModal() {
            this.$emit('close')
        },
        savePayFee() {
            let msg = '确认要上传该数据吗？重复导入将覆盖原始数据！请谨慎操作！'
            if (this.lackInfo.length > 0 && this.surplusTotal == 0) {
                msg = '尚有' + this.lackInfo.length + '位党员未包含其中，确定上传吗？'
            } else if (this.lackInfo.length == 0 && this.surplusTotal > 0) {
                msg = '存在' + this.surplusTotal + '条无效数据，无效数据将不会上传，确定吗？'
            } else if (this.lackInfo.length > 0 && this.surplusTotal > 0) {
                msg = '尚有' + this.lackInfo.length + '位党员未包含其中，且存在' + this.surplusTotal + '条无效数据，无效数据将不会上传，确定吗？'
            }

            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                type: 'warning'
            }).then(() => {
                this.addLoading = true
                let payFeeDto = []
                for (let i = 0; i < this.columns.length; i++) {
                    if (!this.columns[i].surplus) {
                        payFeeDto.push(this.columns[i])
                    }
                }
                let data = {
                    payFeeDto: payFeeDto,
                    deptId: this.deptId + '',
                    payMonth: this.form.payMonth
                }
                importPayFee({data: data}).then(res => {
                    this.addLoading = false
                    let data = res.data
                    if (data.code == '00000') {
                        this.$message.success('导入成功！')
                        this.reset()
                        this.closeModal()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }).catch(() => {

            });
        }
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.form.deptId = this.deptId
                this.form.payMonth = this.getDate()
            }
        },
        show(val) {
            if (val) {
            } else {
                this.closeModal(val)
            }
        },
    }
}
</script>

<style lang="scss" scoped>

.modal-content {
    //margin-top: -28px;
    width: 100%;

    .modal-header {
        padding: 15px 10px;
        text-align: center;

        .modal-title {
            font-size: 16px;
        }
    }

    .body {
        padding: 20px 30px 30px 30px;
        background: #f8fafb;
        width: auto;

        .row {
            //margin-right: -15px;
            //margin-left: -15px;
            display: flex;

            .col-sm-6 {
                width: 100%;
                /*margin-left: 35px;*/

                &:hover {
                    .demo-upload-list-cover {
                        display: block;
                    }
                }

                .demo-upload-list-cover {
                    display: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    /*height: 60px;*/
                    line-height: 60px;
                    background: rgba(0, 0, 0, .6);
                    text-align: center;

                    &:hover {
                        display: block;
                        background: rgba(0, 0, 0, .6);
                    }
                }

                .ivu-modal {
                    width: 660px !important;
                }

                .demo-upload-list {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    text-align: center;
                    line-height: 60px;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    overflow: hidden;
                    background: #fff;
                    position: relative;
                    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
                    margin-right: 4px;
                }

                .demo-upload-list img {
                    width: 100%;
                    height: 100%;
                }

                .demo-upload-list-cover {
                    display: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, .6);
                }

                .demo-upload-list:hover .demo-upload-list-cover {
                    display: block;
                }

                .demo-upload-list-cover i {
                    color: #fff;
                    font-size: 20px;
                    cursor: pointer;
                    margin: 0 2px;
                    margin-top: 30px;
                }

                .label {
                    ::v-deep.el-form-item__label {
                        line-height: 18px;
                    }
                }


                .el-form-item {
                    line-height: 20px;

                    .input-row {
                        width: 80%;
                        margin-right: 10px
                    }

                    padding-left: 10px !important;
                    margin-right: -12px;
                    margin-left: -15px;
                    margin-bottom: 15px;
                }
            }
        }
    }

    .modal-footer {
        padding: 15px;
        text-align: right;
        border-top: 1px solid #e5e5e5;

        .btn-white {
            border-radius: 3px;
            letter-spacing: 1px;
            color: inherit;
            background: white;
            border: 1px solid #e7eaec;

            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
        }

        .btn-blue {
            border-radius: 3px;
            letter-spacing: 1px;

            color: #FFFFFF;
            margin-left: 5px;
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-color: #3d86e7 !important;
            border-color: #3d86e7 !important;
        }
    }
}
</style>
