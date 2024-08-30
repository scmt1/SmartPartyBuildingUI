<template>
    <el-container style="height: 100%">
        <el-dialog title="搜索"
                   center
                   :visible.sync="display"
                   :width="'30%'"
        >
            <el-form ref="form" style="margin-left: -25px;margin-bottom: -30px">
                <el-form-item label="条件" :label-width="formLabelWidth" prop="name">
                    <div style="display: flex">
                        <el-input value="姓名" placeholder="请输入姓名" autocomplete="off" size="small"
                                  style="width:200px;" :disabled="true"></el-input>
                        <el-input v-model="whereMap.realName" placeholder="请输入姓名" size="small"
                                  style="width: 200px;margin-left: 15px"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="条件" :label-width="formLabelWidth" prop="username" style="margin-top:-15px">
                    <div style="display: flex">
                        <el-input value="登录账号" placeholder="请输入登录账号" autocomplete="off" size="small"
                                  style="width:200px;" :disabled="true"></el-input>
                        <el-input v-model="whereMap.username" placeholder="请输入登录账号" size="small"
                                  style="width: 200px;margin-left: 15px"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="条件" :label-width="formLabelWidth" prop="idCard" style="margin-top:-15px">
                    <div style="display: flex">
                        <el-input value="身份证号" size="small" style="width:200px;" :disabled="true"></el-input>
                        <el-input v-model="whereMap.idcard" placeholder="请输入身份证号" size="small"
                                  style="width: 200px;margin-left: 15px"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="条件" :label-width="formLabelWidth" style="margin-top:-15px">
                    <div style="display: flex">
                        <el-input value="手机号码" placeholder="请输入电话" autocomplete="off" size="small"
                                  style="width:200px;" :disabled="true"></el-input>
                        <el-input v-model="whereMap.phone" placeholder="请输入手机号码" size="small"
                                  style="width: 200px;margin-left: 15px"></el-input>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">关 闭</el-button>
                <el-button @click="reset()">重 置</el-button>
                <el-button type="primary" @click="ok">搜 索</el-button>
            </div>
        </el-dialog>
        <!--      顶部按钮-->
        <el-header style="height: 40px;background-color: #fff">
            <el-row>
                <Form ref="searchForm" :label-width="60">

                    <el-button size="small" style="background: #b20000;color:#ffffff" @click="search">搜索</el-button>
                    <el-button plain size="small" style="background: #b20000;color:#ffffff" icon="el-icon-refresh"
                               @click="refresh">刷新
                    </el-button>
                    <el-button plain size="small" style="background: #b20000;color:#ffffff" @click="deleteAll()">
                        批量恢复
                    </el-button>
                </Form>
            </el-row>
        </el-header>
        <!--      主体-->
        <el-container style="height: 825px; border: 1px solid #eee;">
            <el-aside style="background-color: #fff;height:auto">
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"
                                   :loading="dataListLoading"></organization-tree>
            </el-aside>

            <el-container style="display:flex">
                <el-main>
                    <el-table
                        :row-class-name="tableRowClassName" @row-click="onRowClick"
                        v-loading="loading"
                        ref="multipleTable"
                        :data="tableDataNow"
                        border
                        :cell-style="{'text-align':'center'}"
                        :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                        tooltip-effect="dark"
                        style="width: 100%;margin-top: -9px;"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            fixed="left"
                            type="selection"
                            width="40">
                        </el-table-column>
                        <el-table-column
                            prop="username"
                            label="登录账号"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="deptName"
                            label="归属部门"
                            width="315">
                        </el-table-column>
                        <el-table-column
                            prop="realName"
                            label="姓名"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="phone"
                            label="手机号码"
                            width="120">
                            <template slot-scope="scope">
<!--                                {{ scope.row.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}-->
                                {{ scope.row.phone }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="birthday"
                            label="出生日期"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="updateDate"
                            label="最后操作时间"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="partyState"
                            label="是否是死亡党员"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.partyState == 6 ? '是' : '否' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="handleRecover(scope.row.id)">恢复
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>
<script>
import {formartDate} from '@/utils/tool.js'
import {treeDataTranslate} from '@/utils'
import organizationTree from '@/views/dj/components/organizationTree'
import {queryDeletePartyMemberList} from "@/api/jcxfPartyMember";
import {recoverDeletePartyMemberInfo} from "@/api/jcxfPartyMember";
import {getTzSysDeptNameList} from "@/api/jcxfSysDept";

export default {
    name: 'partyMemberRecover',
    components: {
        organizationTree
    },
    data() {
        return {
            deptId: '',
            partyMemberIds: '',
            partyStateList: [],
            educationList: [],
            display: false,
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
            whereMap: {
                deptId: '',
                // dept_id_child: '',
                // parentIdChild: '',
                emptyShell: '',
                undoFlag: '',
                organizationType: '',
                partyOrgType: '',
                partyType: '',
                name: ''
            },
            dataListLoading: false,
            dataList: [],
            tableDataNow: [],  // 显示的数据
            props: {
                id: 'id',
                label: 'name',
                children: 'children'
            },
            // 新增按钮的表单
            formLabelWidth: '100px',
            // 加载状态
            loading: false,
            // 输入状态
            input: '',
            //删除项
            deleteItmes: [],
        }
    },
    created() {
        this.initTreeData()
    },
    methods: {
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.getDataById(0)
        },
        selectByTree(data) {
            this.reset()
            // this.whereMap.parentIdChild = data.whereMap.parentIdChild
            // this.whereMap.dept_id_child = data.whereMap.dept_id_child
            this.whereMap.deptId = data.whereMap.deptId
            this.pageSize = data.pageSize
            this.pageNumber = data.pageNum
            this.getDataById()
        },
        cancel() {
            this.display = false
            this.reset()
        },
        reset() {
            this.whereMap = {}
            this.whereMap.deptId = this.deptId
            this.pageNum = 1
            this.pageSize = 10
        },
        ok() {
            this.getDataById()
            this.reset()
            this.display = false
        },
        search() {
            this.reset()
            this.display = true
        },
        initTreeData() {
            this.dataListLoading = true
            // this.getDataList()
        },
        // 获取分页信息
        getDataById(type) {
            this.dataListLoading = true
            let data = {}
            data = this.whereMap
            data.pageSize = this.pageSize
            data.deptId = this.whereMap.deptId
            data.pageNumber = this.pageNum
            // data = JSON.stringify(data)
            queryDeletePartyMemberList(data).then((res) => {
                this.tableDataNow = res.data.records
                this.total = res.data.total
                if (this.tableDataNow) {
                    for (var i = 0; i < this.tableDataNow.length; i++) {
                        this.tableDataNow[i].birthday = this.formartDate(this.tableDataNow[i].birthday, 'yyyy-MM-dd')
                        this.tableDataNow[i].updateDate = this.formartDate(this.tableDataNow[i].updateDate, 'yyyy-MM-dd')
                        this.tableDataNow[i].partyTime = formartDate(this.tableDataNow[i].partyTime, 'yyyy-MM-dd')
                        this.tableDataNow[i].collectiveIncome = this.tableDataNow[i].collectiveIncome ? this.tableDataNow[i].collectiveIncome : 0.0
                    }
                }
                // if (type === undefined) {
                this.dataListLoading = false
                // }
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        // 获取左侧树形数据
        getDataList() {
            getTzSysDeptNameList().then(({data}) => {
                this.deptId = data.deptId
                this.whereMap.deptId = data.deptId
                this.getDataById()
                this.dataList = treeDataTranslate(data, 'id', 'parentId')
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
            var tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.partyMemberIds = tmp
            /*  for (let i = 0; i < val.length; i++) {
                this.deleteItmes.push(val[i].row_index)
              }*/
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
            this.$confirm('您确认要恢复所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                var ids = []
                if (row != null || row != undefined) {
                    ids.push(row)
                } else {
                    ids = this.partyMemberIds
                }
                this.RecoverOk(ids)
            }).catch(() => {

            });
        },
        RecoverOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            recoverDeletePartyMemberInfo(ids).then(data => {
                if (data.data) {
                    this.$message({
                        message: '恢复成功',
                        type: 'success',
                        //duration: 1500
                    })
                    // this.whereMap.parentIdChild = this.deptId
                    this.whereMap.deptId = this.deptId
                    this.getDataList()
                    this.getDataById()
                }
            })
        },
        refresh() {
            this.whereMap = {}
            // this.whereMap.dept_id_child = this.deptId
            // this.whereMap.parentIdChild = this.deptId
            this.whereMap.deptId = this.deptId
            this.pageNum = 1
            this.pageSize = 10
            this.getDataList()
            this.getDataById()
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
            var obj = {
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
            var week = ['天', '一', '二', '三', '四', '五', '六']
            for (var i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    var val = obj[i] + ''
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        }
    }
}
</script>

<style scoped lang="scss">
.amount {
    color: #31708f;
    font-size: 15px;
    margin-left: 20px;
    margin-right: 100px;
    margin-top: 20px;
}

.search {
    width: 92%;
    margin-left: 20px;
    margin-top: 10px;
}

.tree {
    margin-left: 20px;
    margin-top: 20px;
}

.partyMember {

    .el-dialog el-dialog--center {

        ::v-deep.el-dialog__body {
            padding: 25px 25px 11px
        }

    }
}
</style>
