<template>
    <el-dialog :visible.sync="dialogShow" :title="'上传文件 - '+this.tradeDeptName" top="15%" width="1250px" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="close">
        <Upload
            name="file"
            type="drag"
            :show-upload-list="false"
            :format="fileTypeArr"
            action=""
            accept=".xlsx, .xls"
            :before-upload="handleUpload"
            ref="upload">
            <div>
                <!--                <Button icon="ios-cloud-upload-outline"
                                        style="background: #E4352B;color:#ffffff;">上传文件
                                </Button>-->
                <div style="padding: 20px 0">
                    <i class="el-icon-upload"></i>
                    <p>点击或将文件拖拽到这里上传</p>
                </div>
            </div>
        </Upload>

        <div style="margin-top: 10px;">
            <el-button plain size="small" @click="exportPersonTable()"
                       style="background: #E4352B;color:#ffffff;">下载模板
            </el-button>
        </div>
        <template v-if="tableDataAll.length > 0">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="item.label" :name="item.itemValue" v-for=" (item,index) in showUnitedObjectList"
                             :key="index">
                </el-tab-pane>
            </el-tabs>

            <el-table
                ref="tableDate"
                :data="tableData"
                strip
                row-class-name="table-row"
                :header-cell-style="{ 'text-align': 'center' ,  color : '#fffff' , background : '#eef1f6'}"
                :row-style="{height: '10px'}"
                :cell-style="{ 'text-align': 'center' , 'padding' : '5px 0px'}"
                border
                :key="activeName"
                style="width: 100%; margin-top: 10px;">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="name" label="姓名" width=""></el-table-column>
                <el-table-column prop="sex" label="性别" width="">
                    <template slot-scope="scope">
                        {{ getLabelForItemValue(scope.row.sex, sexList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="national" label="民族" width="">
                    <template slot-scope="scope">
                        {{ getLabelForItemValue(scope.row.national, nationalList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="nativePlace" label="籍贯" width=""></el-table-column>
                <el-table-column prop="education" label="学历" width="">
                    <template slot-scope="scope">
                        {{ getLabelForItemValue(scope.row.education, educationList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="degree" label="学位" width="">
                    <template slot-scope="scope">
                        {{ getLabelForItemValue(scope.row.degree, degreeList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="university" label="毕业院校及专业" width=""></el-table-column>
                <el-table-column prop="position" label="职务" width=""></el-table-column>
                <el-table-column prop="technology" label="专业技术职称" width=""></el-table-column>
                <el-table-column prop="level" label="职级" width=""></el-table-column>
                <el-table-column prop="officeTime" label="现任职时间" width=""></el-table-column>

                <template>
                    <el-table-column v-if="['0'].indexOf(selectUnitedObject) > -1" prop="politicalOutlook"
                                     label="政治面貌" width=""></el-table-column>
                </template>
                <template v-if="[0, 2, 4, 5].indexOf(selectUnitedObject) > -1">
                    <el-table-column prop="politicalArrangements" label="政治安排情况" width=""></el-table-column>
                </template>
                <template v-if="[1].indexOf(selectUnitedObject) > -1">
                    <el-table-column prop="joinParty" label="加入何民主党派" width=""></el-table-column>
                </template>
                <template v-if="[1].indexOf(selectUnitedObject) > -1">
                    <el-table-column prop="positionParty" label="民主党派所任职" width=""></el-table-column>
                </template>
                <template v-if="[2].indexOf(selectUnitedObject) > -1">
                    <el-table-column prop="identifyTime" label="认定时间" width=""></el-table-column>
                </template>

                <el-table-column prop="phone" label="电话" width=""></el-table-column>
            </el-table>
            <div style="text-align: center; margin-top: 10px;">
                <el-button type="primary" @click="addUnitedPerson">保存</el-button>
            </div>
        </template>

    </el-dialog>
</template>

<script>
import XLSX from "xlsx";
import {addUnitedPersonList} from "@/api/tzUnitedPerson";
import axios from "axios";
import fileDownload from "js-file-download";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {getDictByType2} from "@/api/tDictData";
import util from '@/libs/util.js'
import {getFileDateForDown} from "@/api/attachFile";
import {fileByteToBlob} from "@/utils/fileUtils";

export default {
    name: "uploadPerson",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        tradeDeptName: {
            default: null
        },
        tradeDeptId: {
            default: null
        }
    },
    data() {
        return {
            fileTypeArr: ['xls', 'xlsx'],
            dialogShow: false,
            tableData: [],
            tableDataAll: [],
            tableLoading: false,
            nationalList: [],
            educationList: [],
            politicalOutlookList: [],
            unitedObjectList: [],
            showUnitedObjectList: [],
            selectUnitedObject: '',
            sexList: [
                {label: '男', itemValue: '1'},
                {label: '女', itemValue: '2'}
            ],
            activeName: '1',
            degreeList: [],
            base: util.nginxUrl
        }
    },
    watch: {
        show() {
            this.dialogShow = this.show
            if (this.show) {
                this.getDict2('nation')
                this.getDict2('education')
                this.getDict('politicalOutlook')
                this.getDict('unitedObject')
                this.getDict('degree')
            }
        }
    },
    methods: {
        handleClick(tab, e) {
            this.selectUnitedObject = Number(tab.name) - 1
            this.tableData = this.tableDataAll[this.selectUnitedObject]
        },
        rest() {
            this.tableData = []
        },
        close() {
            this.rest()
            this.$emit('close')
        },
        getDict2(type) {
            return new Promise((resolve, reject) => {
                getDictByCode(type).then(res => {
                    let data = res.data.data
                    if (type === 'nation') {
                        this.nationalList = data
                    } else if (type === 'education') {
                        this.educationList = data
                    }
                    resolve()
                })
            })
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByType2(type).then(res => {
                    let data = res.data
                    if (type === 'unitedObject') {
                        this.unitedObjectList = data
                    } else if (type === 'politicalOutlook') {
                        this.politicalOutlookList = data
                    } else if (type === 'degree') {
                        this.degreeList = data
                    }
                    resolve()
                })
            })
        },
        getItemValueForLabel(label, dic) {
            for (let i = 0; i < dic.length; i++) {
                let dicLabel = dic[i].label
                if (dicLabel.includes(label)) {
                    return dic[i].itemValue
                }
            }
            return ''
        },
        getLabelForItemValue(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == value) {
                    return dic[i].label
                }
            }
            return ''
        },
        exportPersonTable() {
            getFileDateForDown(this.base + '/excelTemplate/统战人员导入模板.xlsx').then(res => {
                const data = res.data
                if (data.code === '00000') {
                    let result = res.data.data
                    let blob = fileByteToBlob(result)
                    let fileName = "统战人员导入模板.xlsx"
                    fileDownload(blob, fileName)  //this.fileName 文件名
                }
            })
            /*let path = this.base + '/excelTemplate/统战人员导入模板.xlsx'
            let name = '统战人员导入模板.xlsx'
            axios.get(path, {
                responseType: 'blob' //返回的数据类型
            }).then(res => {
                fileDownload(res.data, name)  //this.fileName 文件名
            })*/
        },
        handleUpload(file) {
            this.tableLoading = true
            this.showUnitedObjectList = []

            const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (fileType !== 'xls' && fileType !== 'xlsx') {
                this.$message.error('只能上传 Excel 文件')
                this.tableLoading = false
                return false
            }

            // 读取 Excel 文件
            const reader = new FileReader();
            let arr = []
            reader.onload = (e) => {
                const data = e.target.result
                const workbook = XLSX.read(data, {type: 'binary', cellDates: true})
                // const sheetName = workbook.SheetNames[0];
                const sheetNames = workbook.SheetNames;
                let isAdd = true
                sheetNames.forEach((item, index) => {
                    const worksheet = workbook.Sheets[item]
                    let test2 = XLSX.utils.sheet_to_json(worksheet, {header: 1})
                    let tmp = test2.slice(2)
                    if (isAdd == false) {
                        return false
                    }
                    if (tmp) {
                        tmp.forEach(i => {
                            let national = ''
                            let education = ''
                            let degree = ''
                            if (!i[0] || !i[1] || !i[2] || !i[3] || !i[4]) {
                                this.$message.warning('有非空字段未填，请检查表格！')
                                isAdd = false
                                return false
                            }
                            national = this.getItemValueForLabel(i[2], this.nationalList)
                            education = this.getItemValueForLabel(i[4], this.educationList)
                            degree = this.getItemValueForLabel(i[5], this.degreeList)
                            /*this.nationalList.forEach(i1 => {
                                if (i1.label.includes()) {
                                    national = i1.itemValue
                                }
                            })
                            this.educationList.forEach(i1 => {
                                if (i1.label.includes(i[4])) {
                                    education = i1.itemValue
                                }
                            })*/
                            if (!education) {
                                education = '99'
                            }
                            let row = {}
                            if (index == 0) {
                                if (!i[13]) {
                                    this.$message.warning('有非空字段未填，请检查表格！')
                                    isAdd = false
                                    return false
                                }
                                let politicalOutlook = this.getItemValueForLabel(i[11], this.politicalOutlookList)
                                /*this.politicalOutlookList.forEach(i1 => {
                                    if (i1.label == i[11]) {
                                        politicalOutlook = i1.itemValue
                                    }
                                })*/
                                row = {
                                    name: i[0],
                                    sex: i[1] == '男' ? 1 : 2,
                                    national: national,
                                    unitedId: this.tradeDeptId,
                                    unitedObject: index + 1 + '',
                                    unitedName: this.tradeDeptName,
                                    nativePlace: i[3],
                                    education: education,
                                    degree: degree,
                                    university: i[6] || '',
                                    position: i[7] || '',
                                    technology: i[8] || '',
                                    level: i[9] || '',
                                    officeTime: this.formartDate(i[10], 'yyyy-MM-dd') || '',
                                    politicalOutlook: politicalOutlook,
                                    politicalArrangements: i[12] || '',
                                    phone: i[13] || ''
                                }
                            } else if (index == 1) {
                                if (!i[13]) {
                                    this.$message.warning('有非空字段未填，请检查表格！')
                                    isAdd = false
                                    return false
                                }
                                row = {
                                    name: i[0],
                                    sex: i[1] == '男' ? 1 : 2,
                                    national: national,
                                    unitedId: this.tradeDeptId,
                                    unitedObject: index + 1 + '',
                                    unitedName: this.tradeDeptName,
                                    nativePlace: i[3],
                                    education: education,
                                    degree: degree,
                                    university: i[6] || '',
                                    position: i[7] || '',
                                    technology: i[8] || '',
                                    level: i[9] || '',
                                    officeTime: this.formartDate(i[10], 'yyyy-MM-dd') || '',
                                    joinParty: i[11] || '',
                                    positionParty: i[12] || '',
                                    phone: i[13] || ''
                                }
                            } else if (index == 2) {
                                if (!i[13]) {
                                    this.$message.warning('有非空字段未填，请检查表格！')
                                    isAdd = false
                                    return false
                                }
                                row = {
                                    name: i[0],
                                    sex: i[1] == '男' ? 1 : 2,
                                    national: national,
                                    unitedId: this.tradeDeptId,
                                    unitedObject: index + 1 + '',
                                    unitedName: this.tradeDeptName,
                                    nativePlace: i[3],
                                    education: education,
                                    degree: degree,
                                    university: i[6] || '',
                                    position: i[7] || '',
                                    technology: i[8] || '',
                                    level: i[9] || '',
                                    officeTime: this.formartDate(i[10], 'yyyy-MM-dd') || '',
                                    identifyTime: this.formartDate(i[11], 'yyyy-MM-dd') || '',
                                    politicalArrangements: i[12] || '',
                                    phone: i[13] || ''
                                }
                            } else if (index == 3) {
                                if (!i[11]) {
                                    this.$message.warning('有非空字段未填，请检查表格！')
                                    isAdd = false
                                    return false
                                }
                                row = {
                                    name: i[0],
                                    sex: i[1] == '男' ? 1 : 2,
                                    national: national,
                                    unitedId: this.tradeDeptId,
                                    unitedObject: index + 1 + '',
                                    unitedName: this.tradeDeptName,
                                    nativePlace: i[3],
                                    education: education,
                                    degree: degree,
                                    university: i[6] || '',
                                    position: i[7] || '',
                                    technology: i[8] || '',
                                    level: i[9] || '',
                                    officeTime: this.formartDate(i[10], 'yyyy-MM-dd') || '',
                                    phone: i[11] || ''
                                }
                            } else if (index == 4 || index == 5) {
                                if (!i[12]) {
                                    this.$message.warning('有非空字段未填，请检查表格！')
                                    isAdd = false
                                    return false
                                }
                                row = {
                                    name: i[0],
                                    sex: i[1] == '男' ? 1 : 2,
                                    national: national,
                                    unitedId: this.tradeDeptId,
                                    unitedObject: index + 1 + '',
                                    unitedName: this.tradeDeptName,
                                    nativePlace: i[3],
                                    education: education,
                                    degree: degree,
                                    university: i[6] || '',
                                    position: i[7] || '',
                                    technology: i[8] || '',
                                    level: i[9] || '',
                                    officeTime: this.formartDate(i[10], 'yyyy-MM-dd') || '',
                                    politicalArrangements: i[11] || '',
                                    phone: i[12] || ''
                                }
                            } else if (index == 6) {
                                if (!i[12]) {
                                    this.$message.warning('有非空字段未填，请检查表格！')
                                    isAdd = false
                                    return false
                                }
                                row = {
                                    name: i[0],
                                    sex: i[1] == '男' ? 1 : 2,
                                    national: national,
                                    unitedId: this.tradeDeptId,
                                    unitedObject: index + 1 + '',
                                    unitedName: this.tradeDeptName,
                                    nativePlace: i[3],
                                    education: education,
                                    degree: degree,
                                    university: i[6] || '',
                                    position: i[7] || '',
                                    technology: i[8] || '',
                                    level: i[9] || '',
                                    officeTime: i[10] || '',
                                    supportAssociation: i[11] || '',
                                    phone: i[12] || ''
                                }
                            }
                            if (!arr[index]) {
                                arr[index] = []
                            }
                            arr[index].push(row)
                        })
                    }
                })
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i]) {
                        this.showUnitedObjectList.push(this.unitedObjectList[i])
                    }
                }

                this.tableDataAll = arr
                this.tableData = arr[0]

                if (isAdd == false) {
                    this.tableLoading = false
                    return false
                }

                this.tableLoading = false

                if (this.showUnitedObjectList.length > 0) {
                    this.activeName = this.showUnitedObjectList[0].itemValue
                    this.selectUnitedObject = this.activeName - 1
                    this.tableData = this.tableDataAll[this.selectUnitedObject]
                }
            }
            reader.readAsBinaryString(file)
            return false
        },
        addUnitedPerson() {
            let data = []
            for (let i = 0; i < this.tableDataAll.length; i++) {
                if (this.tableDataAll[i]) {
                    data = data.concat(this.tableDataAll[i])
                }
            }
            addUnitedPersonList(data).then(res => {
                if (res.data.code == '00000') {
                    this.$message({
                        message: '保存成功' + res.data.data.success + '条,' + '保存失败' + res.data.data.error + '条',
                        type: 'info',
                        duration: 2000
                    })
                    this.rest()
                    this.$emit('refresh')
                } else {
                    this.$message({
                        message: '保存失败',
                        type: 'error',
                        duration: 1000
                    })
                }
            })
        },
        formartDate(date, fmt) {
            if (date == undefined || date == null || date.toString().trim().length <= 0) {
                return ''
            }
            if (typeof date === 'string') {
                date = new Date(date)
            }
            date = date == undefined ? new Date() : date
            date = typeof date == 'number' ? new Date(date) : date
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
            let obj = {
                'y': date.getFullYear(), // 年份，注意必须用getFullYear
                'M': date.getMonth() + 1, // 月份，注意是从0-11
                'd': date.getDate(), // 日期
                'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                'w': date.getDay(), // 星期，注意是0-6
                'H': date.getHours(), // 24小时制
                'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                'm': date.getMinutes(), // 分钟
                's': date.getSeconds(), // 秒
                'S': date.getMilliseconds() // 毫秒
            }
            let week = ['天', '一', '二', '三', '四', '五', '六']
            for (let i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    let val = obj[i] + ''
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
                    for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
    }
}
</script>

<style scoped>

</style>
