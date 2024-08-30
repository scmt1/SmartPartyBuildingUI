<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="900px">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
            <div class="body">
                <Upload
                    :on-success="uploadSuccess"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12"
                    multiple
                    :format="['xls','xlsx','xlsm']"
                    :before-upload="(e) =>handleUpload(e)"
                    :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                    type="drag"
                    action="">
                    <div style="padding: 20px 0">
                        <i class="el-icon-upload"></i>
                        <p>请选择上传的文件</p>
                    </div>
                </Upload>
                <div style="color: red; font-weight: bold; margin-top: 10px;">
                    <p>提示:</p>
                    <p>1、请按模板填写数据，模板格式禁止调整</p>
                    <p>2、导入会覆盖之前数据（请慎重操作）</p>
                    <p>3、上传文件类型只能为"xls", "xlsx", "xlsm"</p>
                    <p>
                        <el-button size="small" style="margin-left: 20px;border-color:#E4352B; background: #E4352B;color:white"
                                   @click="fileDown">模板下载
                        </el-button>
                    </p>
                </div>
            </div>
        </div>
        <el-table
            v-if="columns.length > 0"
            v-loading="dataListLoading"
            ref="multipleTable"
            :data="columns"
            border
            :cell-style="{'text-align':'center'}"
            :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
            tooltip-effect="dark"
            style="width: 100%; margin-top: 10px;">
            <el-table-column label="序号" type="index" width="80"></el-table-column>
            <el-table-column prop="deptName" label="组织名称"></el-table-column>
            <el-table-column prop="memberCount" width="80" label="学员总数">
            </el-table-column>

            <el-table-column label="激活总数" prop="activationCount" width="80"></el-table-column>
            <el-table-column prop="activeCount" width="80" label="活跃学员">
            </el-table-column>
            <el-table-column prop="joinPercent" width="80" label="参与度">
                <template slot-scope="scope">
                    {{ scope.row.joinPercent != null && scope.row.joinPercent != '' ? formatFloat(scope.row.joinPercent) + '%': '0.00%' }}
                </template>
            </el-table-column>
            <el-table-column prop="activePercent" width="80" label="活跃学员参与度">
                <template slot-scope="scope">
                    {{ scope.row.activePercent != null && scope.row.activePercent != '' ? formatFloat(scope.row.activePercent) + '%' : '0.00%' }}
                </template>
            </el-table-column>
            <el-table-column prop="totalScore" width="80" label="总获得积分"></el-table-column>
            <el-table-column prop="averageScore" width="80" label="人均积分"></el-table-column>
        </el-table>
        <div v-if="columns.length > 0" style="margin: 10px 0; text-align: center;">
            <el-button type="primary" @click="add">保存该信息</el-button>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
        </div>
    </Modal>
</template>

<script>
import XLSX from 'xlsx';
import util from '@/libs/util'
import defaultImg from "@/assets/defaultImg.png"
import {downTemplate, addXxqgList} from "@/api/tzXxqg";
import fileDownload from 'js-file-download'
import axios from 'axios'
import {mapGetters} from "vuex";
import {getFileDateForDown,downloadLocalFile} from "@/api/attachFile";
import {fileByteToBlob} from "@/utils/fileUtils";

export default {
    name: 'addPayFee',
    components: {},
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        //父组件传来的id
        id1: {
            type: String
        }
    },
    data() {
        return {
            deptId: '',
            columns: [],
            defaultImg: defaultImg,
            attachFileList: [],
            input: '',
            fileList: [],
            attachFile: null,
            id: '',
            show: this.value,
            disabled: false,
            base: util.nginxUrl,
            type: '',
            title: '',
            formLabelWidth: '90px',
            dataListLoading: false
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptId = this.deptInfo.id
    },
    methods: {
        fileDown() {
            downloadLocalFile('/excelTemplate/学习强国模板.xlsx').then(res => {
                const data = res.data
                if (data.code === '00000') {
                    let result = res.data.data
                    let blob = fileByteToBlob(result)
                    let fileName = "学习强国模板.xlsx"
                    fileDownload(blob, fileName)  //this.fileName 文件名
                }
            })
        },
        uploadSuccess(response, file, fileList) {
            this.input = file.name
            if (response.success) {
                this.fileList.push(file)
                this.$message({
                    message: this.$i18n.t('保存成功'),
                    type: 'success',
                    //duration: 1000
                })
                this.close()
            } else {
                this.$message.error(response.msg)
            }
        },
        getColumns(worksheet) {
            const columns = [];
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            for (let i = range.s.c; i <= range.e.c; i++) {
                const cell = worksheet[XLSX.utils.encode_cell({r: range.s.r, c: i})];
                if (cell && cell.t === 's') {
                    columns.push({
                        title: cell.v,
                        key: XLSX.utils.encode_col(i),
                    });
                }
            }
            return columns;
        },
        handleUpload(file) {
            // 检查文件类型是否为 Excel
            const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
            if (fileType !== 'xls' && fileType !== 'xlsx') {
                this.$message.error('只能上传 Excel 文件');
                return false;
            }

            // 读取 Excel 文件
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, {type: 'binary'});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName]
                let test1 = this.getColumns(worksheet);
                // this.columns = this.getColumns(worksheet);
                let title = test1[0].title
                let test2 = XLSX.utils.sheet_to_json(worksheet);
                let tmp = test2.slice(2)
                if (tmp) {
                    this.dataListLoading = true
                    this.columns = []
                    tmp.forEach(i => {
                        let row = {}
                        row.sort = i[title]
                        row.deptName = i.__EMPTY
                        row.memberCount = i.__EMPTY_1
                        row.activationCount = i.__EMPTY_2
                        row.activeCount = i.__EMPTY_3
                        row.joinPercent = i.__EMPTY_4
                        row.activePercent = i.__EMPTY_5
                        row.totalScore = i.__EMPTY_6
                        row.averageScore = i.__EMPTY_7
                        this.columns.push(row)
                    })

                    this.dataListLoading = false
                }
                // this.add()
            };
            reader.readAsBinaryString(file);

            return false;
        },
        add() {
            let data = {
                deptId: this.deptId.toString(),
                tzXxqgs: this.columns
            }
            addXxqgList(data).then(res => {
                if (res.data.code == '00000') {
                    this.$message.success('导入成功')
                    this.close()
                }
            })
        },
        close() {
            this.reset()
            this.attachFile = null
            this.attachFileList = []
            this.show = false
            this.$emit('close')
        },
        reset() {
            this.form = {}
            this.fileList = []
            this.input = ''
            this.disabled = false
            this.title = ''
            this.columns = []
        },
        formatFloat(num) {
            let n = 2
            let a = num.toString().split('.')
            if (a.length === 2 && a[1].toString().length > 2) {
                n = a[1].toString().length - 2
            }

            num = num * 100

            let f = parseFloat(num)
            if (isNaN(f)) return false
            f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // floor 舍 round 四舍五入 ceil 入
            let s = f.toString()
            let rs = s.indexOf('.')
            //判定如果是整数，增加小数点再补0
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + n) {
                s += '0'
            }
            return s
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.title = this.modalTitle
            }
        }
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
            font-size: 26px;
        }
    }
}
</style>
