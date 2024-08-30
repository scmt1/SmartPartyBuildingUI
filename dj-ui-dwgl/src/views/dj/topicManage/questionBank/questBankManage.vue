<template>
    <div class="con">
        <div class="con-header">
            <el-button size="small" style="background: #b20000;color:#ffffff;" plain icon="el-icon-plus"
                       @click="addQuestion">添加题库
            </el-button>
        </div>
        <div>
            <el-table
                v-loading="dataListLoading"
                ref="multipleTable"
                :data="tableDataNow"
                border
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center',background : '#ed8265',color:'#ffffff'}"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column
                    fixed="left"
                    type="index"
                    label="序号"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="name"
                    width=""
                    label="题库名称">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    width="180"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop="countAll"
                    width=""
                    label="试题数量">
                    <template slot-scope="scope">
                        {{ scope.row.countAll ? scope.row.countAll : 0 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="oneSelect"
                    width="200"
                    label="单选题"
                >
                    <template slot-scope="scope">
                        {{ scope.row.oneSelect ? scope.row.oneSelect : 0 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="selects"
                    width="200"
                    label="多选题">
                    <template slot-scope="scope">
                        {{ scope.row.selects ? scope.row.selects : 0 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="isTrueCount"
                    width="200"
                    label="判断题">
                    <template slot-scope="scope">
                        {{ scope.row.isTrueCount ? scope.row.isTrueCount : 0 }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="360">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click.native.prevent="deleteById(scope.row.id)">删除
                        </el-button>
                        <el-button
                            size="mini"
                            @click.native.prevent="edit(scope.row.id)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-if="tableDataNow!=null&&tableDataNow.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <addQuestion v-model="show" @close="close" :modalTitle="title" :questionId="questionId"></addQuestion>
    </div>
</template>

<script>
import {queryQuestionBankByPage, deleteQuestionBank} from '@/api/tzQuestionBank.js'
import addQuestion from './addQuestion'
import {mapGetters} from "vuex";

export default {
    name: "questBankManage",
    components: {
        addQuestion
    },
    data() {
        return {
            total: 0,
            pageSize: 10,
            pageNum: 1,
            questionId: '',
            dataListLoading: false,
            tableDataNow: [],
            form: {deptId: ''},
            deptId: '',
            show: false,
            title: '',
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptId = this.deptInfo.id.toString()
        this.$nextTick(i => {
            this.queryQuestionBankByPage(this.deptId)
        })
    },
    methods: {
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
            deleteQuestionBank(ids).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500
                    })
                    this.queryQuestionBankByPage()
                }
            })
        },
        handleDelete() {

        },
        edit(id) {
            this.show = true
            this.title = '编辑'
            this.questionId = id
        },
        queryQuestionBankByPage() {
            this.dataListLoading = true
            this.form.deptId = this.deptId
            let data = this.form
            queryQuestionBankByPage({data: data}).then(res => {
                if (res.data.code == '00000') {
                    this.tableDataNow = res.data.data.records
                    this.total = res.data.total
                }
                this.dataListLoading = false
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        close() {
            this.show = false
        },
        addQuestion() {
            this.show = true
            this.title = '新增'
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryQuestionBankByPage()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryQuestionBankByPage()
        },
    }
}
</script>

<style scoped lang="less">
.con {
    background: white;
    padding: 15px;

    .con-header {
        height: 40px;
        text-align: left;
        display: flex;
        align-items: center;
    }
}
</style>
