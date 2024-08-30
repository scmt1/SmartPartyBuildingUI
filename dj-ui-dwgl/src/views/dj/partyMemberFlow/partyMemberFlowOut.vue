<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId" :loading="dataListLoading"></organization-tree>
            </template>
            <template v-slot:search>
                <el-form ref="searchForm" :model="whereMap" label-width="115px" inline size="medium" style="text-align: left;">
                    <el-form-item prop="realName" label="姓名：">
                        <el-input clearable v-model="whereMap.realName" placeholder="请输入姓名" size="small"
                                  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="idcard" label="身份证号：">
                        <el-input clearable v-model="whereMap.idcard" placeholder="请输入身份证号" size="small"
                                  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号码：">
                        <el-input clearable v-model="whereMap.phone" placeholder="请输入手机号码" size="small"
                                  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="outType" label="流动类型：" v-if="drop">
                        <el-select v-model="whereMap.outType" clearable placeholder="请选择" size="small" style="width: 180px;">
                            <el-option v-for="(item,index) in floatingOutTypeList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="outType" label="流动状态：" v-if="drop">
                        <el-select v-model="whereMap.floatingStatus" clearable placeholder="请选择" size="small" style="width: 180px;">
                            <el-option v-for="(item,index) in floatingStatusList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
<!--                    <el-form-item prop="outType" label="从事职业：" v-if="drop">-->
<!--                        <el-select v-model="whereMap.working" clearable placeholder="请选择" size="small" style="width: 180px;">-->
<!--                            <el-option v-for="(item,index) in flowTypeList" :key="index" :label="item.label" :value="item.itemValue"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <el-form-item>
                        <a class="drop-down" @click="dropDown">
                            {{ dropDownContent }}
                            <i :class="dropDownIcon"></i>
                        </a>
                        <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);;color:#ffffff;border-color: rgb(228, 53, 43);" @click="ok">搜索</el-button>
                        <el-button size="small" @click="reset()">重置</el-button>
                        <el-button type="danger" plain size="small" icon="el-icon-plus" @click="addInfo()">新增</el-button>
                        <el-button type="danger" plain size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:table>
                <el-table
                    :row-class-name="tableRowClassName" @row-click="onRowClick"
                    v-loading="loading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    max-height="700"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6', color: '#333'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column fixed="left" type="selection" min-width="60"></el-table-column>
                    <el-table-column prop="realName" label="姓名" min-width="90"></el-table-column>
                    <el-table-column prop="sex" label="性别" min-width="70">
                        <template slot-scope="scope">
                            {{ scope.row.sex == 2 ? '女' : '男' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nation" label="民族" min-width="80">
                        <template slot-scope="scope">
                            {{convertFiled(scope.row.national, 'nation') ? convertFiled(scope.row.national, 'nation') : '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号码" min-width="120">
                        <template slot-scope="scope">
                            {{ hidePhoneNumber(scope.row.phone) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="floatingType" label="流转类型" min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.floatingType === 1 ? '流入' : scope.row.floatingType === 2 ? '流出' : '- -' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deptName" label="党支部" min-width="250" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="floatingPlace" label="流动地点" width="230" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.floatingPlace ? scope.row.floatingPlace : '- -' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="floatingOutType" label="流动类型" min-width="230" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{convertFiled(scope.row.outType, 'floatingOutType') ? convertFiled(scope.row.outType, 'floatingOutType') : '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="320">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handDetail(scope.row.id)">详情</el-button>
                            <el-button size="mini" class="button-success" @click="handleEdit(scope.row.id)">编辑</el-button>
                            <el-button size="mini" class="button-delete" @click="handleRecover(scope.row.id)">删除</el-button>
                            <el-button size="mini" @click="handleReturn(scope.row.partyId)">流回</el-button>
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
        <updatePartyFlowOut :show="show" :modal-title="title" :id="id" @close="close()" @refresh="refresh()" :floatingType="'2'"></updatePartyFlowOut>
    </div>

</template>
<script>
import updatePartyFlowOut from './updatePartyFlowOut'
import organizationTree from '@/views/dj/components/organizationTree'
//import {flowOutPartyMemberList, setReturnPartyMember, delPartyMember} from "@/api/jcxfPartyMember";
import {delFloatingMember, setReturnPartyMember, flowOutPartyMemberList} from "@/api/jcxfPartyFloatingMember";
import {getDictByType, getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import TreeAndTable from "@/components/TreeAndTable.vue";

export default {
    name: 'partyMemberFlowOut',
    components: {
        TreeAndTable,
        updatePartyFlowOut,
        organizationTree
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            deptId: '',
            floatingOutTypeList: [],
            id: '', // 传入编辑和详情页的党员id
            title: '',
            show: false,
            partyMemberIds: '',
            floatingStatusList: [],
            partyNum: '',
            nationList: [],
            flowTypeList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                deptId: '',
                realName: '',
                idcard: '',
                phone: '',
                outType: '',
                floatingStatus: '',
                working: ''
            },
            dataListLoading: false,
            dataList: [],
            tableDataNow: [],  // 显示的数据
            loading: false,
            //删除项
            deleteItmes: [],
        }
    },
    created() {
        this.getDict('nation')
        this.getDict('floatingOutType')
        this.getDict('floatingStatus')
        this.getDict('flowType')
        this.initTreeData()
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
        refresh() {
            this.show = false
            this.getDataById()
        },
        close() {
            //this.getDataById()
            this.show = false
        },
        // 党员流回操作
        handleReturn(row) {
            this.$confirm('您确认要流回所点击选的数据?', '提示', {
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
                this.ReturnOk(ids)
            }).catch(() => {

            });
        },
        addInfo() {
            this.show = true
            this.id = null
            this.title = '新增'
        },
        reset() {
            this.whereMap.realName = ''
            this.whereMap.idcard = ''
            this.whereMap.phone = ''
            this.whereMap.outType = ''
            this.whereMap.floatingStatus = ''
            this.whereMap.working = ''

            this.pageNum = 1
            this.pageSize = 10
        },
        ok() {
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        handDetail(id) {
            this.show = true
            this.title = '详情'
            this.id = id.toString()
        },
        handleEdit(id) {
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
            }else if (type == 'floatingOutType') {
                this.floatingOutTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.getDataById()
        },
        initTreeData() {
            this.dataListLoading = true
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            this.pageSize = data.pageSize
            this.pageNumber = data.pageNum
            this.getDataById()
        },
        // 获取分页信息
        getDataById() {
            this.dataListLoading = true
            let data = {
                partyMember: this.whereMap,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }

            this.loading = true
            flowOutPartyMemberList({ data: data }).then(res =>{
                const data = res.data.data
                this.tableDataNow = data.records
                this.total = data.total
                /*if (this.tableDataNow) {
                    for (let i = 0; i < this.tableDataNow.length; i++) {
                        this.tableDataNow[i].birthday = this.formartDate(this.tableDataNow[i].birthday, 'yyyy-MM-dd')
                        this.tableDataNow[i].updateDate = this.formartDate(this.tableDataNow[i].updateDate, 'yyyy-MM-dd')
                        this.tableDataNow[i].partyTime = formartDate(this.tableDataNow[i].partyTime, 'yyyy-MM-dd')
                        this.tableDataNow[i].collectiveIncome = this.tableDataNow[i].collectiveIncome ? this.tableDataNow[i].collectiveIncome : 0.0
                    }
                }*/
                this.dataListLoading = false
                this.loading = false
            }).catch(e => {
                this.dataListLoading = false
                this.loading = false
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        onRowClick(row) {
            this.deleteItmes.push(row.row_index)
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.partyMemberIds = tmp
        },
        getDict(type) {
            getDictByCode(type).then(res =>{
                let data = res.data.data
                if (type === 'nation') {
                    this.nationList = data
                } else if (type === 'flowType') {
                    this.flowTypeList = data
                } else if (type === 'floatingOutType') {
                    this.floatingOutTypeList = data
                } else if (type === 'floatingStatus') {
                    this.floatingStatusList = data
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        handleRecover(row) {
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
                this.RecoverOk(ids)
            }).catch(() => {

            });
        },
        ReturnOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            setReturnPartyMember(ids).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        //duration: 1500,
                    })
                    //this.whereMap.deptId = this.deptId
                    this.getDataById()
                }
            })
        },
        RecoverOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            delFloatingMember(ids).then(res => {
                if (res.data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500,
                    })
                    //this.whereMap.deptId = this.deptId
                    this.getDataById()
                }
            })
        },
        deleteAll(index, rows) {
            if (this.partyMemberIds == undefined || this.partyMemberIds == null || this.partyMemberIds.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            this.handleRecover()
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
                    for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        }
    }
}
</script>

<style lang="scss" scoped>
.button-success {
    border: 1px solid rgb(103, 194, 58);
    color: rgb(103, 194, 58);
}

.button-delete {
    border: 1px solid rgb(58, 144, 232);
    color: rgb(58, 144, 232);
}

.search-div {
    padding: 0 10px 10px 0;
    box-sizing: border-box;
    width: 260px;
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

.flex-box {
    display: flex;
    justify-content: space-between;
}
</style>
