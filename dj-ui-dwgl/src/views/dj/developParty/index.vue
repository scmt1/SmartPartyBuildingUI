<template>
    <div style="background-color: white;">
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" :loading="dataListLoading"  @getDeptId="getDeptId"></organization-tree>
            </template>
            <template v-slot:search>
                <el-form ref="searchForm" :model="whereMap" label-width="110px" inline size="medium" style="text-align: left;">
                    <el-form-item prop="realName" label="姓名：">
                        <el-input v-model="whereMap.realName" clearable placeholder="请输入姓名" size="small" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="idcard" label="身份证号：">
                        <el-input v-model="whereMap.idcard" clearable placeholder="请输入身份证号" size="small" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号码：">
                        <el-input v-model="whereMap.phone" clearable placeholder="请输入手机号码" size="small" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="sex" label="性别：" v-if="drop">
                        <el-select v-model="whereMap.sex" placeholder="请选择" clearable size="small" style="width: 180px;">
                            <el-option label="男" value=1></el-option>
                            <el-option label="女" value=2></el-option>
                            <el-option label="其他" value=0></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="national" label="民族：" v-if="drop">
                        <el-select v-model="whereMap.national" clearable placeholder="请选择" size="small" style="width: 180px;">
                            <el-option v-for="(item,index) in nationList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="education" label="学历：" v-if="drop">
                        <el-select v-model="whereMap.education" clearable placeholder="请选择" size="small" style="width: 180px;">
                            <el-option v-for="(item,index) in educationList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="personType" label="发展纪实阶段：" v-if="drop">
                        <el-select v-model="whereMap.personType" clearable placeholder="请选择" size="small" style="width: 180px;">
                            <el-option v-for="(item,index) in developStateList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <a class="drop-down" @click="dropDown">
                            {{ dropDownContent }}
                            <i :class="dropDownIcon"></i>
                        </a>
                        <el-button size="small" type="primary" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);;color:#ffffff;border-color: rgb(228, 53, 43);" @click="ok">搜索</el-button>
                        <el-button size="small" @click="reset()">重置</el-button>
                        <el-button v-permission-leaf-zb="selectDeptInfo" type="danger" plain size="small" icon="el-icon-plus" @click="addInfo()">新增</el-button>
                    </el-form-item>
                </el-form>
            </template>

            <template v-slot:table>
                <div class="head">
                    <div class="amount"><span class="red-text">{{ total }}</span><br><span class="black-text">发展党员总数</span><span class="line"></span></div>
                    <div class="amount"><span class="red-text">{{ activeTotal }}</span><br><span class="black-text">入党积极分子</span><span class="line"></span></div>
                    <div class="amount"><span class="red-text">{{ developTotal }}</span><br><span class="black-text">发展对象</span><span class="line"></span></div>
                    <div class="amount"><span class="red-text">{{ preTotal }}</span><br><span class="black-text">预备党员</span><span class="line"></span></div>
                    <div class="amount"><span class="red-text">{{ officialTotal }}</span><br><span class="black-text">正式党员</span></div>
                </div>

                <el-table
                    :row-class-name="tableRowClassName" @row-click="onRowClick"
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :max-height="drop ? 550 : 750"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6', color: '#333'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
<!--                    <el-table-column fixed="left" type="selection" width="40"></el-table-column>-->
                    <el-table-column prop="deptName" label="部门" width="400" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="realName" label="姓名" width="140"></el-table-column>
                    <el-table-column prop="personType" label="发展纪实阶段" width="240">
                        <template slot-scope="scope">
                            {{convertFiled(scope.row.personType, 'developType') ? convertFiled(scope.row.personType, 'developType') : '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.sex == 2 ? '女' : '男' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nation" label="民族" width="140">
                        <template slot-scope="scope">
                            {{convertFiled(scope.row.national, 'nation') ? convertFiled(scope.row.national, 'nation') : '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="birthday" label="出生日期" width="160">
                        <template slot-scope="scope">
                            {{ formartDate(scope.row.birthday, 'yyyy-MM-dd') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号码" width="160">
                        <template slot-scope="scope">
                            {{ hidePhoneNumber(scope.row.phone) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="250">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handDetail(scope.$index, scope.row.id)">详情</el-button>
                            <el-button size="mini" class="button-success" @click="handleEdit(scope.$index, scope.row.id)">编辑</el-button>
                            <el-button size="mini" class="button-delete" @click="handleDelete(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-slot:pagination>
                <el-pagination
                    v-if="tableDataNow.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </template>
        </tree-and-table>
        <updateDevelop v-model="show" :modal-title="title" :parentId="whereMap.deptId+''" :id="id" @close="close()" @refresh="refreshThis()"></updateDevelop>
    </div>

</template>
<script>
import treeAndTable from "@/components/TreeAndTable.vue";
import updateDevelop from './updateDevelop'
import organizationTree from '@/views/dj/components/organizationTree'
import {queryPartyMemberList} from '@/api/jcxfPartyMember'
import {queryDevelopPartyList, deleteDevelopParty, getBaseCount} from '@/api/jcxfDevelopParty'
import {getDictByType, getDictByType2} from '@/api/tDictData'
import {getDictByCode} from "@/api/jcxfSysDictionary";

export default {
    components: {
        updateDevelop,
        organizationTree,
        treeAndTable
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            selectDeptInfo: {},
            developStateList: [],
            id: '',
            title: '',
            show: false,
            input2: '',
            partyMemberIds: '',
            partyStateList: [],
            educationList: [],
            display2: false,
            newAdd: '',
            active: '',
            inactive: '',
            partyNum: '',
            personTypeList: [],
            positionList: [],
            nationList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            submitTotal: 0,
            activeTotal: 0,
            developTotal: 0,
            preTotal: 0,
            officialTotal: 0,
            whereMap: {
                deptId: '',
                realName: '',
                idcard: '',
                sex: '',
                national: '',
                education: '',
                phone: '',
                personType: ''
            },
            dataListLoading: false,
            dataList: [],
            tableDataNow: [],  // 显示的数据
            // 输入状态
            input: '',
            // 删除项
            deleteItmes: []
        }
    },
    created() {
        this.getDict(1, 'nation')
        this.getDict(2, 'position')
        this.getDict(3, 'personType')
        this.getDict(4, 'education')
        this.getDict(5, 'partyState')
        this.getDict(6, 'developType')
    },
    methods: {
        //展开 收起
        dropDown() {
            if (this.drop) {
                this.dropDownContent = "展开";
                this.dropDownIcon = "el-icon-arrow-down";
            } else {
                this.dropDownContent = "收起";
                this.dropDownIcon = "el-icon-arrow-up";
            }
            this.drop = !this.drop;
        },
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.selectDeptInfo.type = data.type
            this.selectDeptInfo.isLeaf = data.isLeaf
            this.getDataById()
        },
        close() {
            this.show = false
        },
        refreshThis() {
            this.show = false
            this.getDataById()
            this.getnewPerson()
        },
        reset() {
            /*const selectDeptId = this.whereMap.deptId
            this.whereMap = {
                deptId: selectDeptId
            }*/

            this.whereMap.realName = ''
            this.whereMap.idcard = ''
            this.whereMap.sex = ''
            this.whereMap.national = ''
            this.whereMap.education = ''
            this.whereMap.phone = ''
            this.whereMap.personType = ''
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        ok() {
            this.pageNum = 1
            this.getDataById()
        },
        handDetail(type, id) {
            this.show = true
            this.title = '详情'
            this.id = id.toString()
        },
        handleEdit(type, id) {
            this.show = true
            this.title = '编辑'
            this.id = id.toString()
        },
        // 表格部分数据字段显示转换
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'nation') {
                this.nationList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'position') {
                this.positionList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'personType') {
                this.personTypeList.forEach(i => {
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
            } else if (type == 'developType') {
                this.developStateList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            this.selectDeptInfo = data.whereMap
            this.pageSize = data.pageSize
            this.pageNumber = data.pageNum
            this.getDataById()
            this.getnewPerson()
        },
        //查询当日新增党员数
        getnewPerson() {
            let date = new Date()
            this.createDate = this.formartDate(date, 'yyyy-MM-dd')
            let data = {
                deptId: this.whereMap.deptId,
                startDate: this.createDate,
                today: this.createDate.toString()
            }
            queryPartyMemberList({ data: data }).then(res =>{
                const data = res.data.data
                this.newAdd = data.total
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        // 获取分页信息
        getDataById() {
            this.getBaseNumber()

            this.dataListLoading = true
            let data = {
                developParty: this.whereMap,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }

            queryDevelopPartyList({ data: data }).then(res =>{
                const data = res.data
                if (data.code == '00000' && data.data) {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                    for (let i = 0; i < this.tableDataNow.length; i++) {
                        this.tableDataNow[i].notice = "--"
                        if(this.tableDataNow[i].partyTime && this.tableDataNow[i].personType == 4 && ((new Date().getTime()-Date.parse(this.tableDataNow[i].partyTime))/ (1000 * 60 * 60 * 24)) > 182.5){
                            this.tableDataNow[i].notice = "讨论为预备党员满半年"
                        }
                        if(this.tableDataNow[i].developDate && this.tableDataNow[i].personType == 3 && ((new Date().getTime()-Date.parse(this.tableDataNow[i].developDate))/ (1000 * 60 * 60 * 24)) > 182.5){
                            this.tableDataNow[i].notice = "确定为发展对象已满半年"
                        }
                        if(this.tableDataNow[i].activeDate && this.tableDataNow[i].personType == 2 && ((new Date().getTime()-Date.parse(this.tableDataNow[i].activeDate))/ (1000 * 60 * 60 * 24)) > 365){
                            this.tableDataNow[i].notice = "列为入党积极分子已满一年"
                        }
                        if(this.tableDataNow[i].submitDate && this.tableDataNow[i].personType == 1 && ((new Date().getTime()-Date.parse(this.tableDataNow[i].submitDate))/ (1000 * 60 * 60 * 24)) > 182.5){
                            this.tableDataNow[i].notice = "提交入党申请书已满半年"
                        }
                    }
                }

                this.dataListLoading = false
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        getBaseNumber() {
            let data = {
                developParty: this.whereMap,
            }
            getBaseCount({ data: data }).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.submitTotal = data.data.submitTotal
                    this.activeTotal = data.data.activeTotal
                    this.developTotal = data.data.developTotal
                    this.preTotal = data.data.preTotal
                    this.officialTotal = data.data.officialTotal
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        onRowClick(row) {
            this.deleteItmes.push(row.row_index)
        },
        // 分页
        sizeChange(data) {
            let num = data * 9 - 9
            this.tableDataNow = this.tableData.slice(num, num + 9)
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.partyMemberIds = tmp
        },
        getDict(ret, type) {
            let tmp = []
            getDictByCode(type).then(res =>{
                let data = res.data.data
                if (ret === 1) {
                    this.nationList = data
                } else if (ret === 2) {
                    this.positionList = data
                } else if (ret === 3) {
                    this.personTypeList = data
                } else if (ret === 4) {
                    this.educationList = data
                } else if (ret === 5) {
                    this.partyStateList = data
                } else if (ret === 6) {
                    this.developStateList = data
                }
            })
            return tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        handleDelete(row) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                let ids = []
                if (row != null || row != undefined) {
                    ids.push(row)
                } else {
                    ids = this.partyMemberIds
                }
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }

            deleteDevelopParty(ids).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500,
                    })
                    this.getDataById()
                }
            })
        },
        refresh() {
            this.whereMap = {}
            // this.whereMap.dept_id_child = '1',
            // this.whereMap.parentIdChild = '1',
            this.whereMap.deptId = '1',
            this.pageNum = 1
            this.pageSize = 10
            this.getDataList()
            this.getDataById()
            this.getnewPerson()
        },

        addInfo() {
            this.show = true
            this.title = '新增'
        },
        deleteAll(index, rows) {
            if (this.partyMemberIds == undefined || this.partyMemberIds == null || this.partyMemberIds.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            this.handleDelete()
            this.deleteItmes = []
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
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
    },
    watch: {
        input(val) {
            this.$refs.tree.filter(val)
        },
        input2(val) {
            this.$refs.tree2.filter(val)
        }
    },
}
</script>

<style lang="scss" scoped>
.search-div {
    padding: 0 10px 10px 0;
    box-sizing: border-box;
    width: 280px;
    display: inline-flex;
    align-items: center;
    .input-box {
        width: 180px;
    }
    .label {
        flex: 1;
        text-align: right;
    }
}

.button-success {
    border: 1px solid rgb(103, 194, 58) !important;
    color: rgb(103, 194, 58) !important;
}

.button-delete {
    border: 1px solid rgb(58, 144, 232) !important;
    color: rgb(58, 144, 232) !important;
}

.head {
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    width: 100%;
    margin-top: 5px;
    border-radius: 5px;
    background-color: rgba(255, 248, 247, 1);;
    margin-bottom: 10px;
}

.amount {
    font-size: 15px;
    width: 25%;
    word-break: break-all;
    text-align: center;
    padding: 10px;
    position: relative;
    .red-text {
        color: rgba(228, 53, 43, 1);
        font-size: 24px;
        font-weight: 700;
    }
    .black-text {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
        font-weight: 400;
    }
    .line {
        position: absolute;
        top: 20px;
        right: 0;
        width: 1px;
        height: 40px;
        background: rgba(242, 228, 228, 1);
    }
}

.flex-box {
    display: flex;
    justify-content: space-between;
}

</style>
