<template>
    <div style="padding: 15px; background: white;">
        <el-form ref="searchForm" :model="search" label-width="90px" inline size="medium" style="text-align: left;">
            <el-form-item prop="title" label="标题：">
                <el-input style="width: 230px;" maxlength="150" v-model="search.title" placeholder="标题" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="status" label="状态：">
                <el-select clearable v-model="search.status" placeholder="请选择" class="input-row">
                    <el-option v-for="(item, index) in statusOptions" :label="item.label" :value="item.itemValue" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传时间：">
                <el-date-picker v-model="dateRange" type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" icon="el-icon-plus" @click="add" style="background: rgba(228, 53, 43, 1);color:#ffffff;border-color: rgb(228, 53, 43);">新增</el-button>
                <el-button size="small" icon="el-icon-search" @click="searchByPage()" style="background: rgba(228, 53, 43, 1);color:#ffffff;border-color: rgb(228, 53, 43);">搜索</el-button>
                <el-button size="small" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>
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
                <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
                <el-table-column label="上传时间">
                    <template slot-scope="scope">
                        {{ scope.row.upStartTime }}&nbsp;&nbsp;至&nbsp;&nbsp;{{ scope.row.upEndTime }}
                    </template>
                </el-table-column>
                <el-table-column label="审核时间">
                    <template slot-scope="scope">
                        {{ scope.row.auditStartTime }}&nbsp;&nbsp;至&nbsp;&nbsp;{{ scope.row.auditEndTime }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        {{ getDirectLabelByValue(scope.row.status, statusOptions) }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" width="180"></el-table-column>
                <el-table-column label="操作" fixed="right" width="230">
                    <template slot-scope="scope">
                        <el-popconfirm v-permission-contrast="scope.row.deptId" v-if="scope.row.status == '0'" title="确定要启用该设置吗？" @confirm="updateStatus(scope.row.id, '1')">
                            <el-button  slot="reference" class="button button-green" size="mini">启用</el-button>
                        </el-popconfirm>
                        <el-popconfirm v-permission-contrast="scope.row.deptId" v-if="scope.row.status == '1'" title="确定要停用该设置吗？" @confirm="updateStatus(scope.row.id, '0')">
                            <el-button  slot="reference" class="button button-red" size="mini">停用</el-button>
                        </el-popconfirm>
                        <el-button v-permission-contrast="scope.row.deptId" class="button button-blue" size="mini" @click="edit(scope.row.id)">编辑</el-button>
                        <el-popconfirm title="删除后提交记录也会被删除，确定要删除该设置吗？" @confirm="delTime(scope.row.id)">
                            <el-button v-permission-contrast="scope.row.deptId" slot="reference" class="button button-red" size="mini">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin: 10px;">
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

        <edit :value="showEdit" :id="selectId" @close="showEdit = false" @refresh="refresh()"></edit>
    </div>
</template>

<script>
import {queryTzTwoBestOneFirstTimePage, deleteTzTwoBestOneFirstTimeById, updateTimeStatusById} from "@/api/tzTwoBestOneFirstTime";
import Edit from "@/views/dj/twoBestOneFirstTime/edit.vue";
import {mapGetters} from "vuex";

export default {
    name: "index",
    components: {Edit},
    data() {
        return {
            userDeptId: null,
            search: {
                title: '',
                status: '',
                upStartTime: null,
                upEndTime: null
            },
            pageNum: 1,
            pageSize: 10,
            total: 0,
            statusOptions: [
                { label: '未启用', itemValue: "0" },
                { label: '已启用', itemValue: "1" }
            ],
            dataListLoading: false,
            dateRange:[],
            tableDataNow: [],
            selectId: null,
            showEdit: false
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    mounted() {
        this.userDeptId = this.deptInfo.id + ''
        this.queryPage()
    },
    methods: {
        resetForm (formName) {
            this.$refs[formName].resetFields()
            this.dateRange = []
        },
        refresh () {
            this.showEdit = false
            this.queryPage()
        },
        queryPage() {
            this.dataListLoading = true
            let data = {
                deptId: this.userDeptId,
                upStartTime: this.dateRange === null ? null : this.dateRange[0],
                upEndTime: this.dateRange === null ? null : this.dateRange[1],
                tzTwoBestOneFirstTime: this.search,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryTzTwoBestOneFirstTimePage({data: data}).then(res => {
                this.dataListLoading = false
                let data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryPage()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryPage()
        },
        getDirectLabelByValue(value, direct) {
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        },
        searchByPage() {
            this.pageNum = 1
            this.queryPage()
        },
        add() {
            this.selectId = null
            this.showEdit = true
        },
        edit(id) {
            this.selectId = id
            this.showEdit = true
        },
        updateStatus(id, status) {
            let data = {
                id: id + '',
                status: status
            }
            updateTimeStatusById({data: data}).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.$message.success('修改成功')
                    this.queryPage()
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        delTime(id) {
            deleteTzTwoBestOneFirstTimeById(id).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.$message.success('删除成功')
                    this.queryPage()
                } else {
                    this.$message.error(data.msg)
                }
            })
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
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
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
</style>
