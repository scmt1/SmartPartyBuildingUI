<template>
    <div class="con">
        <div style="text-align: left">
            <div class="search-div">
                试题编号：
                <el-input v-model="form.id" placeholder="" size="small" style="width: 200px;"></el-input>
            </div>
            <div class="search-div">
                试题题目：
                <el-input v-model="form.title" placeholder="" size="small" style="width: 200px;"></el-input>
            </div>
            <div class="search-div">试题类型：
                <el-select v-model="form.testType" size="small" placeholder="请选择试题类型">
                    <el-option v-for="(item,index) in testType" :key="index" :label="item.title"
                               :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="search-div">所属题库：
                <el-select v-model="form.questionId" size="small" placeholder="请选择所属题库">
                    <el-option v-for="(item,index) in questionList" :key="index" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </div>
            <div class="search-div">创建时间：
                <el-date-picker
                    size="small"
                    v-model="form.startDate"
                    type="date"
                    placeholder="开始日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    class="input-row">
                </el-date-picker>
                &nbsp&nbsp至&nbsp&nbsp
                <el-date-picker
                    size="small"
                    v-model="form.endDate"
                    type="date"
                    placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    class="input-row">
                </el-date-picker>
                <el-button size="small" @click="search" style="background: #b20000;color:#ffffff;margin-left:20px">
                    搜索
                </el-button>
                <el-button size="small" @click="reset" style="background: #b20000;color:#ffffff;margin-left:20px">重置
                </el-button>
            </div>

        </div>
        <div class="con-header">
            <el-button size="small" style="background: #b20000;color:#ffffff;" plain icon="el-icon-plus"
                       @click="addQuestion">添加试题
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
                style="width: 100%"
            >
                <el-table-column
                    fixed="left"
                    type="selection"
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="试题编号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="title"
                    width=""
                    label="试题题目">
                </el-table-column>
                <el-table-column
                    prop="records"
                    width="180"
                    label="试题类型">
                    <template slot-scope="scope">
                        {{ convertTestType(scope.row.testType) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    width=""
                    label="所属题库">
                    <template slot-scope="scope">
                        {{ convertBank((scope.row.questionId)) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    width="200"
                    label="创建时间"
                >
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="360">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click.native.prevent="handleDelete(scope.row.id)">删除
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
        <addTest v-model="show" @close="close" :modalTitle="title" :testId="testId"></addTest>
    </div>
</template>

<script>
import {queryTestByPage} from '@/api/tzTest.js'
import {findAllBankBy} from '@/api/tzQuestionBank.js'
import addTest from './addTest'
import {mapGetters} from "vuex";

export default {
    name: "testManage",
    components: {
        addTest
    },
    data() {
        return {
            testType: [{value: 1, title: '单选'}, {value: 2, title: '多选'}, {value: 3, title: '判断'}],
            questionList: [],
            deptId: '',
            dataListLoading: false,
            total: 0,
            pageNum: 1,
            pageSize: 10,
            tableDataNow: [],
            form: {},
            show: false,
            title: '',
            testId: '',
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptId = this.deptInfo.id.toString()
        this.findQuestionBankById(this.deptId)
        this.$nextTick(i => {
            this.queryTestByPage(this.deptId)
        })
    },
    methods: {
        search() {
            this.queryTestByPage()
        },
        reset() {
            this.form = {}
            this.form.deptId = this.deptId
            this.queryTestByPage()
        },
        findQuestionBankById(deptId) {
            findAllBankBy({deptId: deptId}).then(res => {
                if (res.data.code = '00000') {
                    this.questionList = res.data.data
                }
            })
        },
        convertBank(id) {
            let tmp = ''
            this.questionList.forEach(i => {
                if (i.id.toString() == id.toString()) {
                    tmp = i.name
                }
            })
            return tmp
        },
        convertTestType(type) {
            if (type == '1') {
                return '单选题'
            } else if (type == '2') {
                return '多选题'
            } else if (type == '3') {
                return '判断题'
            }
        },
        queryTestByPage() {
            this.dataListLoading = true
            this.form.deptId = this.deptId
            let data = this.form
            queryTestByPage({data: data}).then(res => {
                if (res.data.code == '00000') {
                    this.tableDataNow = res.data.data.records
                    this.total = res.data.data.total
                }
                this.dataListLoading = false
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        close() {
            this.show = false
            this.queryTestByPage()
        },
        edit(id) {
            this.testId = id.toString()
            this.show = true
            this.title = '编辑'
        },
        addQuestion() {
            this.show = true
            this.title = '新增'
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryTestByPage()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryTestByPage()
        },
    }
}
</script>

<style scoped lang="less">
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

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
