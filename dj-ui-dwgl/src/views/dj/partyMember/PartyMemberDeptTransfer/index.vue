<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"
                                   :loading="dataListLoading"></organization-tree>
            </template>
            <template v-slot:search>
                <el-form ref="searchForm" label-width="105px" inline size="medium" style="text-align: left;">
                    <el-form-item prop="realName" label="党员姓名：">
                        <el-input clearable v-model="search.party.realName" placeholder="请输入姓名" size="small"
                                  style="width: 180px;"></el-input>
                    </el-form-item>
<!--                    <el-form-item prop="idcard" label="身份证号：">-->
<!--                        <el-input clearable v-model="search.party.idcard" placeholder="请输入身份证" size="small"-->
<!--                                  style="width: 180px;"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item prop="acceptStatus" label="审核状态：">
                        <el-select v-model="search.log.acceptStatus" placeholder="请选择" clearable size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item, index) in transferStatus" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="transferType" label="接收地：">
                        <el-select v-model="search.log.transferType" placeholder="请选择" clearable size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item, index) in changeType" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
<!--                        <a class="drop-down" @click="dropDown">-->
<!--                            {{ dropDownContent }}-->
<!--                            <i :class="dropDownIcon"></i>-->
<!--                        </a>-->
                        <el-button size="small" icon="el-icon-search"
                                   style="background:  rgba(228, 53, 43, 1);;color:#ffffff;border-color: rgb(228, 53, 43);" @click="ok">搜索
                        </el-button>
                        <el-button size="small" @click="reset()">重 置
                        </el-button>
                        <el-button type="danger" plain size="small" icon="el-icon-plus" @click="addInfo()">新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:table>
                <el-table
                    :row-class-name="tableRowClassName"
                    v-loading="tableLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    max-height="700"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6', color: '#333'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :key="Math.random()">
                    <el-table-column label="姓名" fixed="left" width="110">
                        <template slot-scope="scope">
                            {{ scope.row.partyMember?.realName }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column label="手机号" width="120">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{scope.row.partyMember?.phone ? hidePhoneNumber(scope.row.partyMember?.phone) : ""}}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column label="身份证号" width="180">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{scope.row.partyMember?.idcard ? hideIdCardNumber(scope.row.partyMember?.idcard) : ""}}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column label="申请部门" width="400" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.oldTzSysDept?.name }}
                        </template>
                    </el-table-column>
                    <el-table-column label="接收地" width="400" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <template v-if="scope.row.transferType == 1">
                                {{ scope.row.newTzSysDept?.name }}
                            </template>
                            <template v-else-if="scope.row.transferType == 2">
                                {{ scope.row.areaName?.replaceAll(',', '') }}-{{ scope.row.inBranchName }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template slot-scope="scope">
                            {{ getDirectLabelByValue(scope.row.acceptStatus, transferStatus) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="申请时间" width="200">
                        <template slot-scope="scope">
                            {{ scope.row.createDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="buttons" size="mini" plain type="primary" @click="handDetail(scope.row.id)">详情</el-button>
                            <!-- 处理状态(0:待处理,1:接收,2：打回) -->
                            <template v-if="scope.row.acceptStatus == 0">
                                <el-button v-if="treeSelectDeptId == scope.row.oldTzSysDept.id"
                                            class="buttons" size="mini" plain type="danger" @click="handleDelete(scope.row.id)">撤回
                                </el-button>
                                <el-button v-if="treeSelectDeptId == scope.row.newTzSysDept.id"
                                           class="buttons" size="mini" plain type="primary" @click="audit(scope.row.id, 1)">通过
                                </el-button>
                                <el-button v-if="treeSelectDeptId == scope.row.newTzSysDept.id"
                                           lass="buttons" size="mini" plain type="danger" @click="audit(scope.row.id, 2)">拒绝
                                </el-button>
<!--                                <el-button v-permission-contrast="scope.row.oldTzSysDept?scope.row.oldTzSysDept.id:null"-->
<!--                                           class="buttons" size="mini" plain type="danger" @click="handleDelete(scope.row.id)">撤回-->
<!--                                </el-button>-->
<!--                                <el-button v-permission-contrast="scope.row.newTzSysDept?scope.row.newTzSysDept.id:null"-->
<!--                                           class="buttons" size="mini" plain type="primary" @click="audit(scope.row.id, 1)">通过-->
<!--                                </el-button>-->
<!--                                <el-button v-permission-contrast="scope.row.newTzSysDept?scope.row.newTzSysDept.id:null"-->
<!--                                           lass="buttons" size="mini" plain type="danger" @click="audit(scope.row.id, 2)">拒绝-->
<!--                                </el-button>-->
                            </template>
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
        <add ref="add" @getDataById="getDataById" :treeSelectDeptId="treeSelectDeptId"></add>
        <ViewLog ref="viewLog"></ViewLog>
        <el-dialog title="审核" :visible.sync="auditDialogVisible" width="600px">
            <div style="text-align: left; padding: 0 20px;">
                <div>
                    审核：{{ getDirectLabelByValue(auditInfo.acceptStatus, transferStatus) }}
                </div>
                <div style="display: flex; margin-top: 10px;">
                    <div>留言：</div>
                    <div style="flex: 1;">
                        <el-input type="textarea" :rows="4" maxlength="50" show-word-limit placeholder="请输入内容"
                                  v-model="auditInfo.rejectReason"></el-input>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="auditDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="updateStatus">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TreeAndTable from "@/components/TreeAndTable.vue";
import OrganizationTree from "@/views/dj/components/organizationTree.vue";
import Add from "./add.vue";
import {
    delPartyMemberDeptTransfer,
    queryPartyMemberDeptTransferLogList,
    updateTransferStatusById
} from "@/api/jcxfPartyMemberTransfer";
import ViewLog from "./viewLog.vue";
import {getDictByCode} from "@/api/jcxfSysDictionary";

export default {
    name: "partyDeptChange",
    components: {
        TreeAndTable,
        OrganizationTree,
        Add,
        ViewLog
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            // leaf: false,
            treeSelectDeptId: '',
            dataListLoading: false,
            auditDialogVisible: false,
            tableLoading: '',
            search: {
                log: {
                    acceptStatus: '',
                    transferType: ''
                },
                party: {
                    realName: '',
                    idcard: ''
                }
            },
            tableDataNow: [],
            selectedIds: [],
            pageSize: 10,
            pageNum: 1,
            total: 0,
            transferStatus: [],
            changeType: [],
            auditInfo: {
                id: '',
                acceptStatus: '',
                rejectReason: ''
            },
        }
    },
    mounted() {
        this.getDict('partyTransferAcceptStatus')
        this.getDict('partyTransferType')
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
        getDict(type) {
            getDictByCode(type).then(res => {
                let data = res.data.data
                if (type === 'partyTransferAcceptStatus') {
                    this.transferStatus = data
                } else if (type === 'partyTransferType') {
                    this.changeType = data
                }
            })
        },
        selectByTree(data) {
            this.treeSelectDeptId = data.whereMap.deptId
            this.orgType = data.whereMap.type
            this.pageSize = data.pageSize
            this.pageNum = data.pageNum
            this.getDataById()
        },
        getDeptId(data) {
            // 获取初始化时默认选中的部门信息，判断是否叶子节点
            /*getTzSysDept(deptId).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.leaf = result.data.isLeaf
                }
            })*/

            this.treeSelectDeptId = data.deptId
            this.getDataById()
        },
        getDataById() {
            this.tableLoading = true

            let data = {
                partyMemberDeptTransferLog: this.search.log,
                partyMember: this.search.party,
                deptId: this.treeSelectDeptId + '',
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryPartyMemberDeptTransferLogList({data: data}).then(res => {
                this.tableLoading = false
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.selectedIds = tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        ok() {
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        reset() {
            this.search.log.acceptStatus = ''
            this.search.log.transferType = ''
            this.search.party.realName = ''
            this.search.party.idcard = ''
        },
        addInfo() {
            this.$refs.add.init()
        },
        getDirectLabelByValue(value, direct) {
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        },
        handDetail(id) {
            this.$refs.viewLog.init(id)
        },
        audit(id, status) {
            this.auditInfo.id = id + ''
            this.auditInfo.acceptStatus = status + '' //处理状态(0:待处理,1:接收,2：打回)
            this.auditInfo.rejectReason = ''
            this.auditDialogVisible = true
        },
        updateStatus() {
            let data = this.auditInfo

            let userInformation = JSON.parse(window.localStorage.getItem("userInformation"))
            data.updateBy = userInformation.userId
            updateTransferStatusById({data: this.auditInfo}).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.$message.success('审核成功')
                    this.auditDialogVisible = false
                    this.getDataById()
                } else {
                    this.$message.error(result.msg)
                }
            })
        },
        handleDelete(id) {
            this.$confirm('您确认要撤回所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                this.deleteOk(id)
            }).catch(() => {

            });
        },
        deleteOk(id) {
            delPartyMemberDeptTransfer(id).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.$message.success('撤回成功')
                    this.getDataById()
                } else {
                    this.$message.error(result.msg)
                }
            })
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
        width: 150px;
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

.buttons {
    margin: 5px;
}

.flex-box {
    display: flex;
    justify-content: space-between;
}

</style>
