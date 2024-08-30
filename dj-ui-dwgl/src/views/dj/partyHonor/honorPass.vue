<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId" :loading="dataListLoading"></organization-tree>
            </template>
           <!-- <template v-slot:search>
                <div class="search-div">
                    获奖人姓名：<el-input v-model="search.partyMemberName" placeholder="请输入姓名" size="small" style="width: 200px;"></el-input>
                </div>
                <div class="search-div">
                    荣誉名称：<el-input v-model="search.honorName" placeholder="请输入名称" size="small" style="width: 200px;"></el-input>
                </div>
                <div class="search-div">
                    荣誉类型：
                    <el-select v-model="search.honorType" clearable placeholder="请选择" size="small" style="width: 200px;">
                        <el-option v-for="item in honorTypeOptions" :key="item.id" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </div>
                <div class="search-div">
                    荣誉等级：
                    <el-select v-model="search.honorClass" clearable placeholder="请选择" size="small" style="width: 200px;">
                        <el-option v-for="item in honorClassOptions" :key="item.id" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </div>
                <div class="search-div">
                    获奖年份：
                    <el-date-picker v-model="search.getYear" type="year" placeholder="选择年份" size="small" style="width: 200px;"></el-date-picker>
                </div>

                <el-button size="small" @click="reset()" style="background: #b20000;color:#ffffff">重置</el-button>
                <el-button size="small" @click="ok" style="background: #b20000;color:#ffffff">搜索</el-button>
                <el-button v-if="leaf" plain size="small" icon="el-icon-plus" @click="addInfo()" style="background: #b20000;color:#ffffff">新增</el-button>
            </template>-->

            <template v-slot:table>
                <el-table
                    v-loading="tableLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <!--<el-table-column fixed="left" type="selection" width="40"></el-table-column>-->
                    <el-table-column fixed="left" type="index" label="序号" width="80"></el-table-column>
                    <el-table-column label="对象名称">
                        <template slot-scope="scope">
                            <template v-if="scope.row.honorType == 1">
                                {{ scope.row.tzSysDept.name }}
                            </template>
                            <template v-else-if="scope.row.honorType == 2">
                                {{ scope.row.partyMember.realName }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="honorName" label="荣誉名称"></el-table-column>
                    <el-table-column label="荣誉图片" width="100">
                        <template slot-scope="scope">
                            <el-image style="width: 100%;" :src="base + scope.row.imagePath" :preview-src-list="[base + scope.row.imagePath]"></el-image>
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
                    <el-table-column prop="createTime" label="上传时间" width="170">
                        <template slot-scope="scope">
                            {{scope.row.createTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  fixed="right" width="150">
                        <template slot-scope="scope">
<!--                            <el-button size="mini" @click="handDetail(scope.row.id)">详情</el-button>-->
                            <span style="color:#e24240; cursor: pointer;" @click="pass(scope.row.id)">通过</span>
                            <span style="margin-left:5px;color:#333333; cursor: pointer;" @click="unPass(scope.row.id)">驳回</span>
                            <!--<el-button size="mini" class="button-success" @click="handleEdit(scope.row.id)">通过</el-button>-->
                            <!--<el-button size="mini" class="button-delete" @click="handleDelete(scope.row.id)">驳回</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>.
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

        <unPass ref="unPass" @refresh="getDataById"></unPass>
    </div>
</template>

<script>
import TreeAndTable from "@/components/TreeAndTable.vue";
import {queryTzPartyHonorList, passHonor} from "@/api/TzPartyHonor";
import util from "@/libs/util";
import unPass from "./unPass.vue";
import organizationTree from '@/views/dj/components/organizationTree'
import {getTzSysDept} from "@/api/jcxfSysDept";
import {getDictByType2} from "@/api/tDictData";
import {mapGetters} from "vuex";

export default {
    name: "index",
    components: {
        unPass,
        TreeAndTable,
        organizationTree
    },
    data() {
        return {
            createId:null,
            base: util.nginxUrl,
            dataListLoading: false,
            search: {
                deptId: '',
                partyMemberName: '',
                honorName: '',
                honorType: '',
                honorClass: '',
                getYear: '',
                status:1
            },
            pageNum: 1,
            pageSize: 10,
            tableDataNow: [],
            total: 0,
            tableLoading: false,
            tableSelectedHonorIds: [],
            leaf: false,
            honorTypeOptions: [],
            honorClassOptions: [],
        }
    },
    mounted() {
        this.getDict('honorType')
        this.getDict('honorClass')
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        getDict(type) {
            getDictByType2(type).then(res => {
                if (res.code == '00000') {
                    let data = res.data
                    if (type == 'honorType') {
                        this.honorTypeOptions = data
                    } else if (type == 'honorClass') {
                        this.honorClassOptions = data
                    }
                }
            })
        },
        selectByTree(data) {
            this.search.deptId = data.whereMap.deptId
            this.getDataById()
        },
        getDeptId(data) {
            this.search.deptId = data.deptId
            getTzSysDept(data.deptId).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.leaf = result.data.isLeaf
                }
            })
            this.getDataById()
        },
        getDataById() {
            this.createId = this.deptInfo.id
            this.tableLoading = true
            const data = {
                tzPartyHonor: this.search,
                realName: this.search.partyMemberName,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryTzPartyHonorList({ data: data} ).then(res =>{
                this.tableLoading = false
                const result = res.data
                if (result.code = '00000') {
                    this.tableDataNow = result.data.records
                    this.total = result.data.total
                }
            })
        },
        reset() {
            this.search.partyMemberName = ''
            this.search.honorName = ''
            this.search.honorType = ''
            this.search.honorClass = ''
            this.search.getYear = ''
            this.search.status = 1
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
                if (value == direct[i].value) {
                    return direct[i].label
                }
            }
        },

        unPass(id) {
            this.$refs.unPass.init(id)
        },
        pass(id) {
            let data = {
                id:id.toString(),
                createId :this.createId.toString()
            }
            this.$confirm('确定通过吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                passHonor(data).then(res =>{
                    const result = res.data
                    if (result.code == '00000') {
                        this.$message.success('审核成功')
                        this.getDataById()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

</style>
