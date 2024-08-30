<template>
    <div style="background: white; padding: 20px;">
        <!--<tree-and-table>-->
        <div style="display: flex">
            <el-button  size="small" icon="el-icon-arrow-left" class="topBtn" @click="returnLast">返回</el-button>
        </div>
        <div style="margin-top: 10px;">
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
                            {{getUser}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="honorName" label="荣誉名称">
                        {{honorName}}
                    </el-table-column>
                    <el-table-column label="审核状态" width="100" prop="status">
                        <template slot-scope="scope"  >
                           <span :style="scope.row.isPass === 1 ? 'color: green' : 'color: red'">
                               {{ scope.row.isPass === 1 ? '已通过' : '已驳回' }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="reason" label="驳回原因" width="720"  show-overflow-tooltip>
                        <template slot-scope="scope"  >
                               {{ scope.row.reason  ? scope.row.reason  : '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="审核时间" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.createTime }}
                        </template>
                    </el-table-column>
                </el-table>
        </div>
<!--
                <el-pagination v-if="tableDataNow.length"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pageNum"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>-->

        <!--</tree-and-table>-->

    </div>
</template>

<script>
    import {queryHonorRecord} from "@/api/TzPartyHonor";



    export default {
        name: "index",
        data() {
            return {
                honorName:'',
                getUser:'',
                honorId:'',
                pageNum: 1,
                pageSize: 10,
                tableDataNow: [],
                total: 0,
                tableLoading: false,
                tableSelectedHonorIds: []
            }
        },
        created(){
            this.honorName = this.$route.query.honorName
            this.honorId = this.$route.query.honorId
            this.getUser = this.$route.query.getUser
            this.getDataById()
        },
        methods: {
            returnLast(){
                this.$router.push({
                    path: '/dwgl/partyHonor/index'
                })
            },
            getDataById() {
                this.tableLoading = true
                queryHonorRecord(this.honorId).then(res =>{
                    const result = res.data
                    if (result.code = '00000') {
                        this.tableDataNow = result.data
                        // this.total = result.data.total
                    }
                    this.tableLoading = false

                })
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
