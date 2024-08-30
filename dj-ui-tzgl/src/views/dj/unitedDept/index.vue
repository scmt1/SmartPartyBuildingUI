<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <united-dept-tree :refreshInit="refreshTreeInit" :refreshTradeId="refreshTradeId + ''"
                                  ref="organization_tree" @selectByTree="selectByTree" @refreshInit="refreshTreeInit = false"
                                  @getUnionDeptInfo="getUnionDeptInfo">
                </united-dept-tree>
            </template>
            <template v-slot:search>
                <div style="display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <div style="height: 20px;width: 5px;background: red"></div>
                        <div style="margin-left: 10px">工作机构</div>
                    </div>
                    <div>
                        <el-button plain size="small" @click="addUnited"
                                   style="background: #E4352B;color:#ffffff">新增下级机构
                        </el-button>
                        <el-button v-if="unitedDeptRole" plain size="small" @click="updateUnited"
                                   style="background: #E4352B;color:#ffffff">查看详情/编辑
                        </el-button>
                        <el-button v-if="unitedDeptRole" plain size="small" @click="deleteUnitedDept"
                                   style="background: #E4352B;color:#ffffff">删除机构
                        </el-button>
                    </div>
                </div>
                <div style="margin-top:10px">
                    <el-table
                        ref="tableDate"
                        :data="baseTableData"
                        :show-header="false"
                        :row-style="{height: '20px'}"
                        :cell-style="cellClassName"
                        border
                        style="width: 100%">
                        <el-table-column prop="cell1"></el-table-column>
                        <el-table-column prop="cell2"></el-table-column>
                        <el-table-column prop="cell3">
                        </el-table-column>
                        <el-table-column prop="cell4">
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-slot:table>
                <div style="background: #f5f7fa;height: 40px;margin-bottom: 10px;">
                    <div
                        style=" height: 100%;background: #D8001B;text-align: center;width: 80px;color:white;font-size:15px;font-weight: 500;display: flex;align-items: center">
                        <div style="text-align: center;margin:auto">统战对象</div>
                    </div>
                </div>

                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="unitedObjectNumber[item.itemValue +'_index']?item.label +'('+ unitedObjectNumber[item.itemValue +'_index'] +')':item.label "
                                 :name="item.itemValue" v-for=" (item,index) in unitedObjectList"
                                 :key="index">
                        <div style="box-shadow: 3px 3px 10px #888888;">
                            <div style=";padding-bottom: 10px;text-align: left;display: flex">
                                <el-button plain size="small" @click="addPerson(item.itemValue)" v-if="unitedDeptRole"
                                           style="background: #E4352B;color:#ffffff;">
                                    新增{{ getLabelForItemValue(unitedObject, unitedObjectList) }}
                                </el-button>
<!--                                <el-button plain size="small" @click="uploadFile" v-if="unitedDeptRole"-->
<!--                                           style="background: #E4352B;color:#ffffff;">导入人员-->
<!--                                </el-button>-->
                                <el-button plain size="small" @click="exportProvinceData()" v-if="unitedDeptRole"
                                           style="background: #E4352B;color:#ffffff;">导出人员
                                </el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <el-table
                    :loading="tableLoading"
                    ref="tableDate"
                    :data="tableDate"
                    strip
                    row-class-name="table-row"
                    :header-cell-style="{ 'text-align': 'center' ,  color : '#fffff' , background : '#eef1f6'}"
                    :row-style="{height: '10px'}"
                    :cell-style="{ 'text-align': 'center' , 'padding' : '5px 0px'}"
                    border
                    style="width: 100%">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="unitedName" label="所属机构" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="姓名" width="140">
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.sex == 1 ? '男' : '女' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="national" label="民族" width="140">
                        <template slot-scope="scope">
                            {{ getLabelForItemValue(scope.row.national, nationalList) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nativePlace" label="籍贯">
                    </el-table-column>
                    <el-table-column prop="degree" label="学位" width="100">
                        <template slot-scope="scope">
                            {{ getLabelForItemValue(scope.row.degree, degreeList) }}
                        </template>
                    </el-table-column>
                    <el-table-column width="220" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="updatePerson(scope.row.id)">查看详情/编辑
                            </el-button>
                            <el-button class="button-delete" size="mini" @click="deleteById(scope.row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 10px; text-align: center;">
                    <el-pagination
                        v-if="tableDate.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>

            </template>
            <template v-slot:pagination>

            </template>
        </tree-and-table>
        <updateUnitedDept v-model="tradeShow" :tradeDeptName="tradeName" :parentId="tradeId" :parentDeptId="tradeDeptParentId+''"
                          :modeTitle="modeTitle2" @close="close2" @refresh="refresh2"></updateUnitedDept>
        <updateNonParty v-model="addPersonShow" :tradeDeptName="tradeName" :unitedId="tradeId"
                        :personId="personId" :unitedObject="unitedObject" :modeTitle="modeTitle"
                        @close="close"></updateNonParty>

        <upload-person :show="uploadShow" :tradeDeptName="tradeName" :tradeDeptId="tradeId"
                       @close="uploadShow = false"
                       @refresh="uploadShow = false; getPersonNumber(); queryUnitedPersonList()"></upload-person>
    </div>
</template>

<script>
import XLSX from "xlsx";
import treeAndTable from "@/components/TreeAndTable.vue";
import unitedDeptTree from '@/views/dj/components/unitedDeptTree.vue'
import {getDictByType, getDictByType2} from "@/api/tDictData";
import {getDictByCode} from '@/api/jcxfSysDictionary'
import {getUnitedDept, deleteUnitedDept, determineNode} from "@/api/tzUnitedDept";
import updateUnitedDept from "./updateUnitedDept";
import updateNonParty from "./updateNonParty";
import {queryUnitedPersonList, deleteUnitePerson, addUnitedPersonList} from "@/api/tzUnitedPerson";
import util from '@/libs/util.js'
import UploadPerson from "@/views/dj/unitedDept/uploadPerson.vue";
import {mapGetters} from "vuex";
import {getPersonNumberByUnitedObject} from "@/api/tzUnitedPerson";

export default {
    name: 'index',
    components: {
        UploadPerson,
        treeAndTable,
        unitedDeptTree,
        updateUnitedDept,
        updateNonParty
    },
    data() {
        return {
            // base: util.minionUrl,
            personId: null,
            unitedObject: '1',
            activeName: '1',
            deptId: '', // 查询党员总数带的组织id
            parentName: '',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {},
            tableDate: [],
            tableLoading: false,
            baseTableData: [],
            tradeId: null,
            tradeParentId: null,
            tradeName: '',
            tradeDeptId: null,
            tradeDeptParentId: null,
            modeTitle: '',
            tradeShow: false,
            addPersonShow: false,
            modeTitle2: '',
            unitedObjectList: [],
            politicalOutlookList: [],
            uploadShow: false,
            degreeList: [],
            nationalList: [],
            refreshTradeId: null,
            refreshTreeInit: false,
            unitedObjectNumber: {},
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo',
            'unitedDeptRole'
        ]),
    },
    created() {
        document.title = "机关统战";
        this.deptId = this.deptInfo.id
        this.init()
    },
    methods: {
        async init() {
            await this.getDict('unitedObject')
            await this.getDict2('nation')
            await this.getDict2('education')
            await this.getDict('politicalOutlook')
            await this.getDict('degree')
        },
        close() {
            this.addPersonShow = false
            this.queryUnitedPersonList()
        },
        close2() {
            this.tradeShow = false
        },
        refresh2() {
            this.tradeShow = false
            this.refreshTreeInit = true
            this.queryUnitedPersonList()
        },
        cellClassName({row, column, rowIndex, columnIndex}) {
            if (columnIndex == 1 || columnIndex == 3) {
                return {'text-align': 'center', 'height': '60px', 'background': 'white'}
            } else {
                return {'text-align': 'center', 'height': '60px', 'background': '#F2F2F2'}
            }
        },
        handleClick(tab, e) {
            this.unitedObject = tab.name
            this.queryUnitedPersonList()
        },
        addPerson(e) {
            this.modeTitle = '新增'
            this.unitedObject = e
            this.addPersonShow = true
        },
        uploadFile() {
            this.uploadShow = true
        },
        addUnited() {
            this.modeTitle2 = '新增'
            this.tradeShow = true
        },
        updateUnited() {
            this.modeTitle2 = '编辑'
            this.tradeShow = true
        },
        deleteUnitedDept() {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                this.deleteTradeOk(this.tradeId)
            }).catch(() => {

            });
        },
        deleteTradeOk(id) {
            if (id == undefined || id == null) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteUnitedDept(id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                    })
                    this.refreshTradeId = this.tradeParentId
                    this.refreshTreeInit = true
                }
            })
        },
        updatePerson(id) {
            this.addPersonShow = true
            this.personId = id
            this.modeTitle = '编辑'
        },
        async selectByTree(data) {
            this.tradeName = data.name
            this.tradeId = data.id
            this.refreshTradeId = this.tradeId
            this.tradeParentId = data.parentId
            this.tradeDeptId = data.deptId
            if (this.unitedObjectList.length == 0) {
                await this.getDict('unitedObject')
            }
            this.getPersonNumber()

            this.reset()
            this.getUnitedDeptData()
            this.queryUnitedPersonList()

            /* let date = {
                id: data.whereMap.id + '',
                deptId: this.deptId + ''
            }
            determineNode(date).then(res => {
                if (!res.data.data) {
                    this.statusShow = false
                    return false
                } else {
                    this.statusShow = true
                    this.getUnitedDeptData()
                    this.queryUnitedPersonList()
                }
            })*/

        },
        getPersonNumber() {
            let objectList = []
            for (let i = 0; i < this.unitedObjectList.length; i++) {
                objectList.push(this.unitedObjectList[i].itemValue)
                this.unitedObjectNumber[this.unitedObjectList[i].itemValue + '_index'] = 0
            }
            const val = {
                unitedId: this.tradeId + '',
                objectList: objectList
            }
            getPersonNumberByUnitedObject({data: val}).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    for (let n = 0; n < this.unitedObjectList.length; n++) {
                        for (let i = 0; i < data.data.length; i++) {
                            if (data.data[i].unitedObject == this.unitedObjectList[n].itemValue) {
                                this.unitedObjectNumber[this.unitedObjectList[n].itemValue + '_index'] = data.data[i].num
                            }
                        }
                    }
                }
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
        getUnitedDeptData() {
            this.baseTableData = []
            getUnitedDept(this.tradeId).then(res => {
                if (res.data.code == '00000') {
                    let tmp = res.data.data
                    let type = ''
                    if (tmp.isUnited == 0) {
                        type = '否'
                    } else if (tmp.isUnited == 1) {
                        type = '是'
                    }
                    let obj1 = {
                        cell1: '上级组织',
                        cell2: tmp.parentName,
                        cell3: '党组织名称',
                        cell4: tmp.name,
                    }
                    let obj2 = {
                        cell1: '是否成立统战机构',
                        cell2: type,
                        cell3: '党外知识分子人数',
                        cell4: 2 + '人'
                    }
                    let obj3 = {
                        cell1: '所属部门',
                        cell2: tmp.jcxfSysDept && tmp.jcxfSysDept != null ? tmp.jcxfSysDept.name : '-',

                    }
                    this.baseTableData.push(obj1, obj2, obj3)
                }
            })
        },
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'nation') {
                this.nationalList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'degree') {
                this.degreeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'education') {
                this.educationList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        async getUnionDeptInfo(data) {
            console.log(data)

            if(data) {
                this.tradeName = data.name
                this.tradeId = data.id
                this.tradeDeptParentId = data.deptParentId
                this.pageNum = 1
                if (this.unitedObjectList.length == 0) {
                    await this.getDict('unitedObject')
                }
                this.getPersonNumber()
                this.getUnitedDeptData()
                this.queryUnitedPersonList()
            }else {
                this.tradeId = ''
                this.baseTableData = []
                this.tableDate = []
                this.total = 0
                for (let i = 0; i < this.unitedObjectList.length; i++) {
                    this.unitedObjectNumber[this.unitedObjectList[i].itemValue + '_index'] = 0
                }
            }
        },
        exportProvinceData() {
            this.$confirm("是否确认导出当前页数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.exportUsers(this.tableDate)
            })
        },
        exportUsers(exportList) {
            import("@/vendor/Export2Excel").then((excel) => {
                // 设置导出表格的头部
                let tHeader = [
                    "序号",
                    "所属党组织",
                    "姓名",
                    "性别",
                    "民族",
                    "籍贯",
                    "学历",
                    "学位",
                    "毕业院校及专业",
                    "职务",
                    "专业技术职称",
                    "职级",
                    "现任职时间",
                    "联系电话"
                ]

                if (['1'].indexOf(this.activeName) > -1) {
                    tHeader.push("政治面貌")
                }
                if (['3'].indexOf(this.activeName) > -1) {
                    tHeader.push("认定时间")
                }

                if (['1', '3', '5', '6'].indexOf(this.activeName) > -1) {
                    tHeader.push("政治安排情况")
                }
                if (['2'].indexOf(this.activeName) > -1) {
                    tHeader.push("民主党派所任职")
                    tHeader.push("加入何民主党派")
                }
                // 将要导出的数据进行一个过滤
                /**
                 * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                 */
                const data = exportList.map((item, index) => {
                    let data = [
                        index + 1,
                        item.unitedName,
                        item.name,
                        item.sex == 1 ? '男' : '女',
                        this.getLabelForItemValue(item.national, this.nationalList),
                        item.nativePlace,
                        this.getLabelForItemValue(item.education, this.educationList),
                        this.getLabelForItemValue(item.degree, this.degreeList),
                        item.university,
                        item.position,
                        item.technology,
                        item.level,
                        this.formartDate(item.officeTime, 'yyyy-MM-dd'),
                        item.phone
                    ]

                    if (['1'].indexOf(this.activeName) > -1) {
                        data.push(this.getLabelForItemValue(item.politicalOutlook, this.politicalOutlookList))
                    }
                    if (['3'].indexOf(this.activeName) > -1) {
                        data.push(this.formartDate(item.identifyTime, 'yyyy-MM-dd'))
                    }

                    if (['1', '3', '5', '6'].indexOf(this.activeName) > -1) {
                        data.push(item.politicalArrangements)
                    }
                    if (['2'].indexOf(this.activeName) > -1) {
                        data.push(item.joinParty)
                        data.push(item.positionParty)
                    }
                    return data
                })
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                    // 导出的头部
                    header: tHeader,
                    // 导出的内容
                    data,
                    // 导出的文件名称
                    filename: this.tradeName + "统战人员 - " + this.getLabelForItemValue(this.activeName, this.unitedObjectList) + this.formartDate(new Date(), 'yyyy-MM-dd'),
                    // 导出的表格宽度是否自动
                    autoWidth: true,
                    // 导出文件的后缀类型
                    bookType: "xlsx",
                })
            });
            this.$message.success("导出成功")
        },
        deleteById(id) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                let ids = []
                ids.push(id)
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteUnitePerson(ids).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                    })
                    this.queryUnitedPersonList()
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error',
                        duration: 1500,
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
        reset() {
            this.pageNum = 1
            this.pageSize = 10
        },
        refresh() {
            this.pageSize = 10
            this.pageNumber = 1
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryUnitedPersonList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryUnitedPersonList()
        },
        queryUnitedPersonList() {
            this.tableLoading = true

            this.whereMap.unitedObject = this.activeName
            this.whereMap.unitedId = this.tradeId
            let data = {
                unitedPerson: this.whereMap,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            queryUnitedPersonList({data: data}).then(res => {
                this.tableLoading = false
                const data = res.data.data
                this.tableDate = data.records
                this.total = data.total
            }).catch(e => {
            })
        },
        getLabelForItemValue(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == value) {
                    return dic[i].label
                }
            }
            return ''
        }
    }
}
</script>
<style lang="scss" scoped>
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
/deep/.el-form-item__label{
    line-height: 32px;
}
.el-button.is-plain:focus, .el-button.is-plain:hover {
    border-color: red;
}

.button-success {
    border: 1px solid rgb(103, 194, 58);
    color: rgb(103, 194, 58);
}

.button-delete {
    border: 1px solid rgb(58, 144, 232);
    color: rgb(58, 144, 232);
}

.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

.mod-sys-area {
    display: flex;

    .left-info {
        & > > > .el-date-editor--daterange.el-input,
        .el-date-editor--daterange.el-input__inner,
        .el-date-editor--timerange.el-input,
        .el-date-editor--timerange.el-input__inner,
        .el-cascader {
            width: 100%;
        }
    }

    .left-info {
        width: 30%;
        min-width: 320px;

        .price-unit-text {
            font-size: 14px;
            color: #666;
            margin-left: 15px;
        }

        .capital-int {
            & > > > .el-input__inner {
                padding-right: 0;
            }
        }
    }

    .search-bar {
        margin-top: 20px;
        background: transparent;
        margin-bottom: 15px;
        padding: 0;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .area-search-input {
        width: 30%;
    }

    .area-add-btn {
        float: right;
    }

    .right-info {
        width: calc(100% - 300px);
        padding-right: 10px;

        .business-license-box {
            .license-content {
                display: flex;

                & .single-image-upload {
                    height: 130px;

                    & > > > .el-upload-list--picture-card .el-upload-list__item {
                        width: 130px;
                        height: 130px;
                        margin: 0;
                    }
                }
            }
        }

        .id-box {
            .upload-content {
                .upload-img {
                    display: flex;

                    div {
                        &:nth-child(2) {
                            margin-left: 20px;
                        }
                    }

                    .disabled-upload {
                        & > > > .el-upload {
                            background: #f5f7fa;
                        }
                    }

                    & .single-image-upload {
                        height: 130px;

                        & > > > .el-upload-list--picture-card .el-upload-list__item {
                            width: 130px;
                            height: 130px;
                            margin: 0;
                        }
                    }
                }

                .upload-example {
                    display: flex;
                    // margin-top: 15px;
                    margin-left: 120px;

                    .example-box {
                        margin-left: 0;

                        &:nth-child(2) {
                            margin-left: 20px;
                        }
                    }
                }

                .upload-tips {
                    margin-left: 120px;
                }
            }
        }

        .img-static {
            display: block;
            width: 130px;
            height: 130px;
            cursor: pointer;
        }

        .img-static:not(:first-child) {
            margin-left: 20px;
        }

        // 示例框
        .example-box {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 130px;
            height: 130px;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            border-radius: 3px;
            box-sizing: border-box;
            margin-left: 20px;

            img {
                display: block;
                width: auto;
                max-width: 100%;
                height: auto;
                max-height: 100%;
            }

            .tips {
                position: absolute;
                left: -1px;
                bottom: 0;
                width: 130px;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                color: #fff;
                background: rgba(51, 51, 51, 0.5);
                text-align: center;
                border-radius: 0px 0px 3px 3px;
            }
        }

        .upload-tips {
            font-size: 12px;
            color: #999;
            height: 16px;
            line-height: 20px;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        // 图片上传框样式修改
        & > > > .el-upload {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 130px;
            height: 130px;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            border-radius: 3px;
            box-sizing: border-box;

            img {
                width: 100%;
            }

            .el-icon-plus {
                font-size: 22px;
                color: #EAEAEA;
            }
        }

        // 背景图
        .bg-img {
            display: flex;
            justify-content: flex-start;

            .business-license-box {
                margin-right: 20px;

                .img-tips {
                    display: block;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    line-height: 1.5em;
                    margin-top: 8px;

                    p {
                        margin: 0;
                        padding: 0;
                    }
                }
            }
        }
    }
}
/deep/.el-table__empty-block{
    height: 40px !important;
}
</style>
