<template>
    <div style="padding: 15px; background: white;">
        <div class="flex-box">
            <div class="search-div" style="width: 300px;">
                <div class="label">
                    部门名称：
                </div>
                <div class="input-box" style="width: 200px;">
                    <el-input clearable v-model="search.deptName" placeholder="请输入部门名称" size="small"
                              style="width: 200px;"></el-input>
                </div>
            </div>
            <div class="search-div" style="300px;">
                <div class="label">
                    权限：
                </div>
                <div class="input-box" style="width: 200px;">
                    <el-select v-model="search.autoMessageRole" placeholder="请选择" clearable size="small" style="width: 200px;">
                        <el-option v-for="(item, index) in autoMessageList" :key="index" :label="item.missionName" :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <el-button size="small" icon="el-icon-plus" @click="add()" type="danger"
                       style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);">新增</el-button>
            <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);"
                       @click="searchPage">搜索
            </el-button>
        </div>

        <div>
            <el-table
                v-loading="dataListLoading"
                ref="multipleTable"
                :data="tableDataNow"
                border
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="deptName" label="部门"></el-table-column>
                <el-table-column label="权限">
                    <template slot-scope="scope">
                        <template v-for="item in scope.row.autoList">
                            <el-tag style="margin: 5px;">
                                {{ item.missionName }}<!--（{{ item.isOpen == '1'?'启用':'关闭' }})-->
                            </el-tag>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.delFlag == 0">
                            生效中
                        </span>
                        <span v-else>
                            已无效
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="170">
                    <template slot-scope="scope">
                        <el-button size="mini" plain type="primary" @click="edit(scope.row)">编辑</el-button>
                        <el-button size="mini" plain type="danger" @click="deleteAutoMessageRole(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div style="margin: 10px;">
            <el-pagination
                v-if="tableDataNow!=null&&tableDataNow.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNumber"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>


        <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="500px">
            <p style="text-align: left;"><b>{{ editInfo.name }}</b></p>

            <div style="margin-top: 10px;">
                <template v-for="(item, index) in autoMessageList">
                    <el-tag style="margin: 5px; cursor: pointer" :type="editInfo.autoMessageRole.split(',').indexOf(item.id+'') > -1?'':'info'" @click="selectAutoMessageRole(item.id+'')">
                        {{ item.missionName }}
                    </el-tag>
                </template>
            </div>

            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgb(238, 241, 246)">
                <el-button @click="updateAutoMessageRole()" size="small">保存权限</el-button>
            </div>
        </el-dialog>


        <el-dialog
            title="新增"
            :visible.sync="addDialogVisible"
            width="900px">
            <tree-and-content>
                <template v-slot:tree>
                    <div style="height: 400px; width: 100%;">
                        <organization-tree ref="organization_tree"  @selectByTree="selectByTree" :loading="dataListLoading"></organization-tree>
                    </div>
                </template>
                <template v-slot:content>
                    <div style="width: 410px; text-align: center; margin: auto;">
                        <p><b>{{ editInfo.name != ''?editInfo.name: '请选择部门' }}</b></p>
                        <template v-for="(item, index) in autoMessageList">
                            <el-tag style="margin: 5px; cursor: pointer" :type="editInfo.autoMessageRole.split(',').indexOf(item.id+'') > -1?'':'info'" @click="selectAutoMessageRole(item.id+'')">
                                {{ item.missionName }}
                            </el-tag>
                        </template>
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgb(238, 241, 246)">
                            <el-button @click="addAutoMessageRole()" size="small">保存权限</el-button>
                        </div>
                    </div>
                </template>
            </tree-and-content>

        </el-dialog>

    </div>

</template>

<script>
import TreeAndContent from "@/components/TreeAndContent.vue";
import organizationTree from '@/views/dj/components/organizationTree'
import {getDeptAutoMessageRoleByPage, updateDeptAutoMessageRole, getAutoMessageRoleByDeptId} from "@/api/tzMessageAutoRole";
import {getMessageAutoList} from "@/api/tzAutoMessage";


export default {
    name: "autoMessageRole",
    components: {
        TreeAndContent,
        organizationTree
    },
    data() {
        return {
            dataListLoading: false,
            tableDataNow: [],
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            autoMessageList: [],
            search: {
                deptName: '',
                autoMessageRole: '',
            },
            editDialogVisible: false,
            editInfo: {
                id: '',
                name: '',
                autoMessageRole: ''
            },
            addDialogVisible: false
        }
    },
    created() {
        document.title = "自动发送任务权限管理";
    },
    mounted() {
        this.getMessageAuto()
        this.init()
    },
    methods: {
        init() {
            this.getPage()
        },
        getMessageAuto() {
            getMessageAutoList().then(res => {
                const data = res.data
                if (data.code === '00000') {
                    this.autoMessageList = data.data
                }
            })
        },
        getDeptAutoMessageRole() {
            return new Promise((resolve, reject) => {
                getAutoMessageRoleByDeptId().then(res => {
                    const data = res.data
                    if (data.code === '00000') {
                        resolve(data.data)
                    }
                })
            })
        },
        searchPage() {
            this.pageNumber = 1
            this.getPage()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getPage()
        },
        handleCurrentChange(val) {
            this.pageNumber = val
            this.getPage()
        },
        getPage() {
            this.dataListLoading = true

            let data = {
                deptName: this.search.deptName,
                autoMessageRoleId: this.search.autoMessageRole + '',
                pageVo: {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                }
            }

            getDeptAutoMessageRoleByPage({data: data}).then(res => {
                this.dataListLoading = false
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        add() {
            this.rest()
            this.getMessageAuto()
            this.addDialogVisible = true
        },
        edit(item) {
            this.rest()
            this.getMessageAuto()
            this.editInfo.id = item.deptId
            this.editInfo.name = item.deptName
            this.editInfo.autoMessageRole = item.autoIdList

            this.editDialogVisible = true
        },
        rest() {
            this.editInfo.id = ''
            this.editInfo.name = ''
            this.editInfo.autoMessageRole = ''
        },
        selectAutoMessageRole(role) {
            let roles = this.editInfo.autoMessageRole.split(",")
            if (roles.indexOf(role) > -1) {
                roles.splice(roles.indexOf(role), 1)

                this.editInfo.autoMessageRole = roles.toString().replace('[', '').replace(']', '').replace(' ', '')
            } else {
                if (this.editInfo.autoMessageRole.length == 0) {
                    this.editInfo.autoMessageRole += role
                } else {
                    this.editInfo.autoMessageRole += ',' + role
                }
            }
        },
        deleteAutoMessageRole(item) {
            this.$confirm('确认要删除该数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                let data = {
                    deptId: item.deptId + '',
                    autoMessageRole: ''
                }
                updateDeptAutoMessageRole({data:data}).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        this.$message.success('删除成功')
                        this.rest()
                        this.editDialogVisible = false
                        this.getPage()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }).catch(() => {

            });
        },
        updateAutoMessageRole() {
            let data = {
                deptId: this.editInfo.id + '',
                autoMessageRole: this.editInfo.autoMessageRole
            }
            updateDeptAutoMessageRole({data:data}).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('保存成功')
                    this.rest()
                    this.editDialogVisible = false
                    this.getPage()
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        async addAutoMessageRole() {
            if (!this.editInfo.id || this.editInfo.id == '') {
                this.$message.info('请选择部门')
                return
            }

            const deptData = await this.getDeptAutoMessageRole()
            if (deptData.length > 0) {
                this.$message.info('该部门已有权限信息')
                return
            }

            let data = {
                deptId: this.editInfo.id + '',
                autoMessageRole: this.editInfo.autoMessageRole
            }
            updateDeptAutoMessageRole({data:data}).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('保存成功')
                    this.rest()
                    this.addDialogVisible = false
                    this.getPage()
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        selectByTree(event) {
            this.editInfo.id = event.whereMap.deptId
            this.editInfo.name = event.whereMap.deptName
        }
    }
}
</script>

<style scoped lang="scss">
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

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
</style>
