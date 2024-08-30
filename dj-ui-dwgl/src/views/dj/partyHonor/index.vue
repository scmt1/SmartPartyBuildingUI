<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"
                                   :loading="dataListLoading"></organization-tree>
            </template>
            <template v-slot:search>
                <el-form ref="searchForm" :model="search" label-width="90px" inline size="medium"
                         style="text-align: left;">
<!--                    <el-form-item prop="partyMemberName" label="获奖者：">-->
<!--                        <el-input style="width: 200px;" maxlength="150" v-model="search.partyMemberName"-->
<!--                                  placeholder="获奖者" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item prop="honorName" label="荣誉名称：">
                        <el-input clearable v-model="search.honorName" placeholder="请输入名称"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="honorType" label="荣誉类型：">
                        <el-select v-model="search.honorType" clearable placeholder="请选择" style="width: 200px;">
                            <el-option v-for="item in honorTypeOptions" :key="item.id" :value="item.itemValue"
                                       :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="honorClass" label="荣誉等级：">
                        <el-select v-model="search.honorClass" clearable placeholder="请选择" style="width: 180px;">
                            <el-option v-for="item in honorClassOptions" :key="item.id" :value="item.itemValue"
                                       :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="getYear" label="获奖年份：" v-if="drop">
                        <el-date-picker clearable v-model="search.getYear" type="year" value-format="yyyy"
                                        placeholder="选择年份" size="small" style="width: 180px;"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <a class="drop-down" @click="dropDown">
                            {{ dropDownContent }}
                            <i :class="dropDownIcon"></i>
                        </a>
                    </el-form-item>
                    <el-form-item style="margin-left: 20px;">
                        <el-button size="small" @click="ok" icon="el-icon-search" class="topBtn">搜索</el-button>
                        <el-button size="small" @click="reset('searchForm')">重置</el-button>
                        <el-button class="topBtn" size="small" icon="el-icon-plus" @click="addInfo()">新增</el-button>
                    </el-form-item>
                </el-form>
            </template>

            <template v-slot:table>
                <el-table
                        v-loading="tableLoading"
                        ref="multipleTable"
                        :data="tableDataNow"
                        border
                        max-height="700"
                        :cell-style="{'text-align':'center'}"
                        :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        :key="Math.random()">
                    <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                    <el-table-column label="获奖者" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <template v-if="scope.row.honorType == 1">
                                {{ scope.row.tzSysDept?.name ? scope.row.tzSysDept?.name : '--' }}
                            </template>
                            <template v-else-if="scope.row.honorType == 2">
                                {{ scope.row.partyMember?.realName ? scope.row.partyMember?.realName : '--' }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="awardName" label="颁奖单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="honorName" label="荣誉名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="honorType" label="荣誉类型">
                        <template slot-scope="scope">
                            {{ getDirectLabelByValue(scope.row.honorType, honorTypeOptions) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="honorType" label="审核状态">
                        <template slot-scope="scope">
                             <span :style="getStatusStyle(scope.row.status)">
                                 {{ getDirectLabelByValue(scope.row.status, honorStatusOptions) }}
                             </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="honorClass" label="荣誉级别" width="120">
                        <template slot-scope="scope">
                            {{ getDirectLabelByValue(scope.row.honorClass, honorClassOptions) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="getYear" label="获奖年份" width="120">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.getYear).getFullYear() }}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="400">
                        <!--1待审核 2审核通过 3驳回-->
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status == 1" v-permission-button-role="['honor_pass']"
                                       class="button button-green" size="mini" @click="pass(scope.row.id)">通过
                            </el-button>
                            <el-button v-if="scope.row.status == 1" v-permission-button-role="['honor_unPass']"
                                       class="button button-red" size="mini" @click="unPass(scope.row.id)">驳回
                            </el-button>
                            <el-button v-permission-button-role-dept="['honor_edit', scope.row.deptId]" size="mini"
                                       v-if="scope.row.status!=2" class="button button-blue"
                                       @click="handleEdit(scope.row.id)">{{ scope.row.status == 3 ? '重新编辑' : '编辑' }}
                            </el-button>
                            <el-button v-permission-button-role-dept="['honor_delete', scope.row.deptId]" size="mini"
                                       v-if="scope.row.status!=2" class="button button-red"
                                       @click="handleDelete(scope.row.id)">删除
                            </el-button>
                            <el-button class="button button-blue" size="mini" @click="handleStatus(scope.row)">审核记录
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                .
            </template>
            <template v-slot:pagination>
                <el-pagination v-if="tableDataNow.length"
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

        <edit ref="editHonor" @refresh="getDataById"></edit>
        <unPass ref="unPass" @refresh="getDataById"></unPass>
    </div>
</template>

<script>
import TreeAndTable from "@/components/TreeAndTable.vue";
import {queryTzPartyHonorList, delTzPartyHonor, passHonor} from "@/api/TzPartyHonor";
import util from "@/libs/util";
import Edit from "./edit.vue";
import organizationTree from '@/views/dj/components/organizationTree'
import unPass from "./unPass.vue";
import {getDictByType2} from "@/api/tDictData";
import {mapGetters} from "vuex";

export default {
    name: "index",
    components: {
        Edit,
        TreeAndTable,
        organizationTree,
        unPass
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            base: util.minionUrl,
            dataListLoading: false,
            search: {
                deptId: '',
                partyMemberName: '',
                honorName: '',
                honorType: '',
                honorClass: '',
                getYear: ''
            },
            pageNum: 1,
            pageSize: 10,
            tableDataNow: [],
            total: 0,
            tableLoading: false,
            tableSelectedHonorIds: [],
            honorTypeOptions: [],
            honorClassOptions: [],
            honorStatusOptions: []
        }
    },
    mounted() {
        this.getDict('honorClass')
        this.getDict('honorType')
        this.getDict('honorStatus')
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
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
            getDictByType2(type).then(res => {
                let data = res.data
                if (type === 'honorClass') {
                    this.honorClassOptions = data
                } else if (type === 'honorType') {
                    this.honorTypeOptions = data
                } else if (type === 'honorStatus') {
                    this.honorStatusOptions = data
                }
            })
        },
        getStatusStyle(status) {
            const styleMap = {
                1: 'color: black',
                2: 'color: green',
                3: 'color: red'
            };
            return styleMap[status] || '';
        },
        selectByTree(data) {
            this.search.deptId = data.whereMap.deptId
            this.getDataById()
        },
        getDeptId(data) {
            this.search.deptId = data.deptId
            /*getTzSysDept(deptId).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.leaf = result.data.isLeaf
                }
            })*/
            this.getDataById()
        },
        getDataById() {
            this.tableLoading = true
            const data = {
                tzPartyHonor: this.search,
                realName: this.search.partyMemberName,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryTzPartyHonorList({data: data}).then(res => {
                this.tableLoading = false
                const result = res.data
                if (result.code = '00000') {
                    this.tableDataNow = result.data.records
                    this.total = result.data.total
                }
            })
        },
        reset(formName) {
            this.$refs[formName].resetFields()
        },
        ok() {
            this.pageSize = 10
            this.pageNum = 1
            this.getDataById()
        },
        addInfo() {
            this.$refs.editHonor.init()
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.tableSelectedHonorIds = tmp
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        getDirectLabelByValue(value, direct) {
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        },
        handDetail(id) {

        },
        handleEdit(id) {
            this.$refs.editHonor.init(id)
        },
        handleStatus(row) {
            let getUser = ''
            if (row.honorType == 1) {
                getUser = row.tzSysDept.name
            } else if (row.honorType == 2) {
                getUser = row.partyMember ? row.partyMember.realName : ''
            }
            this.$router.push({
                path: '/dwgl/partyHonor/passRecord',
                query: {honorId: row.id.toString(), honorName: row.honorName, getUser: getUser}
            })
        },
        handleDelete(id) {
            this.$confirm('确定要删除该记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delTzPartyHonor(id).then(res => {
                    const result = res.data
                    if (result.code == '00000') {
                        this.$message.success('删除成功')
                        this.getDataById()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            })
        },
        pass(id) {

            let data = {
                id: id + '',
                createId: this.deptInfo.id + ''
            }
            this.$confirm('确定通过吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                passHonor(data).then(res => {
                    const result = res.data
                    if (result.code == '00000') {
                        this.$message.success('审核成功')
                        this.getDataById()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            })
        },
        unPass(id) {
            this.$refs.unPass.init(id)
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

.button {
    margin: 4px;
}

.button-green {
    border: 1px solid rgb(103, 194, 58);
    color: rgb(103, 194, 58);
}

.button-blue {
    border: 1px solid rgb(58, 144, 232);
    color: rgb(58, 144, 232);
}

.button-red {
    border: 1px solid red;
    color: red;
}

.flex-box {
    display: flex;
    justify-content: space-between;
}

</style>
