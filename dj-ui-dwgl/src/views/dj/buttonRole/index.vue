<template>
    <div style="padding: 15px; background: white;">
        <div class="flex-box">
            <el-button size="small" icon="el-icon-plus" @click="add()" type="danger" plain>新增</el-button>
            <div class="search-div">
                <div class="label">
                    部门名称：
                </div>
                <div class="input-box">
                    <el-input clearable v-model="search.deptName" placeholder="请输入部门名称" size="small"
                              style="width: 200px;"></el-input>
                </div>
            </div>
            <div class="search-div">
                <div class="label">
                    权限：
                </div>
                <div class="input-box">
                    <el-select v-model="search.buttonRole" placeholder="请选择" clearable size="small" style="width: 150px;">
                        <el-option v-for="(item, index) in buttonRole" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                    </el-select>
                </div>
            </div>
            <el-button size="small" @click="reset()" icon="el-icon-refresh-left" style="background: #ffffff;color: rgba(228, 53, 43, 1);border: 1px solid rgba(228, 53, 43, 1);">重置</el-button>

            <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);;color:#ffffff"
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
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column label="权限">
                    <template slot-scope="scope">
                        <el-tag style="margin: 5px;" v-for="(item, index) in scope.row.buttonRole.split(',')" :key="index">
                            {{ getDirectLabelByValue(item, buttonRole) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" plain type="primary" @click="edit(scope.row)">编辑</el-button>
                        <el-button size="mini" plain type="danger" @click="deleteButtonRole(scope.row)">删除</el-button>
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
                <template v-for="(item, index) in buttonRole">
                    <el-tag style="margin: 5px; cursor: pointer" :type="editInfo.buttonRole.split(',').indexOf(item.itemValue) > -1?'':'info'" @click="selectButtonRole(item.itemValue)">
                        {{ item.label }}
                    </el-tag>
                </template>
            </div>

            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgb(238, 241, 246)">
                <el-button @click="updateButtonRole()" size="small">保存权限</el-button>
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
                        <template v-for="(item, index) in buttonRole">
                            <el-tag style="margin: 5px; cursor: pointer" :type="editInfo.buttonRole.split(',').indexOf(item.itemValue) > -1?'':'info'" @click="selectButtonRole(item.itemValue)">
                                {{ item.label }}
                            </el-tag>
                        </template>
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgb(238, 241, 246)">
                            <el-button @click="addButtonRole()" size="small">保存权限</el-button>
                        </div>
                    </div>
                </template>
            </tree-and-content>

        </el-dialog>

    </div>
</template>

<script>
import {getDeptButtonRoleByPage, updateDeptButtonRole} from "@/api/jcxfSysDeptButtonRole";
import TreeAndContent from "@/components/TreeAndContent.vue";
import organizationTree from '@/views/dj/components/organizationTree'
import {getDictByType2} from "@/api/tDictData";

export default {
    name: "index",
    components: {
        TreeAndContent,
        organizationTree
    },
    data() {
        return {
            search: {
                deptName: '',
                buttonRole: ''
            },
            dataListLoading: false,
            tableDataNow: [],
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            buttonRole: [
                /*{ label: '党内荣誉编辑', itemValue: 'honor_edit' },
                { label: '党内荣誉通过', itemValue: 'honor_pass' },
                { label: '党内荣誉拒绝', itemValue: 'honor_unPass' },
                { label: '党内荣誉删除', itemValue: 'honor_delete' },
                { label: '两优一先审核', itemValue: 'auditTBOF' },
                { label: '部门标签设置', itemValue: 'deptTag' },
                { label: '手机看板权限', itemValue: 'phone_billboard' },*/
            ],
            editDialogVisible: false,
            editInfo: {
                id: '',
                name: '',
                buttonRole: ''
            },
            addDialogVisible: false
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            await this.getDict('buttonRole')
            this.getPage()
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByType2(type).then((res) => {
                    let data = res.data
                    if (type === 'buttonRole') {
                        this.buttonRole = data
                    }
                    resolve()
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
                buttonRole: this.search.buttonRole,
                pageVo: {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                }
            }
            getDeptButtonRoleByPage({data: data}).then(res => {
                this.dataListLoading = false
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        getDirectLabelByValue(value, direct) {
            if (!value) {
                return
            }
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        },
        add() {
            this.rest()
            this.addDialogVisible = true
        },
        edit(item) {
            this.rest()

            this.editInfo.id = item.id
            this.editInfo.name = item.name
            this.editInfo.buttonRole = item.buttonRole

            this.editDialogVisible = true
        },
        deleteButtonRole() {

        },
        rest() {
            this.editInfo.id = ''
            this.editInfo.name = ''
            this.editInfo.buttonRole = ''
        },
        selectButtonRole(role) {
            let buttonRoles = this.editInfo.buttonRole.split(",")
            if (buttonRoles.indexOf(role) > -1) {
                buttonRoles.splice(buttonRoles.indexOf(role), 1)

                this.editInfo.buttonRole = buttonRoles.toString().replace('[', '').replace(']', '').replace(' ', '')
            } else {
                if (this.editInfo.buttonRole.length == 0) {
                    this.editInfo.buttonRole += role
                } else {
                    this.editInfo.buttonRole += ',' + role
                }
            }
        },
        updateButtonRole() {
            let data = {
                id: this.editInfo.id + '',
                buttonRole: this.editInfo.buttonRole
            }
            updateDeptButtonRole(data).then(res => {
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
        addButtonRole() {
            if (!this.editInfo.id || this.editInfo.id == '') {
                this.$message.info('请选择部门')
                return
            }
            let data = {
                id: this.editInfo.id + '',
                buttonRole: this.editInfo.buttonRole
            }
            updateDeptButtonRole(data).then(res => {
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
