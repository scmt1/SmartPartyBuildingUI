<template>
    <div style="padding: 15px; background: white;">
        <el-form ref="searchForm" :model="search" label-width="90px" inline size="medium" style="text-align: left;">
            <el-form-item prop="title" label="标题：">
                <el-input style="width: 230px;" maxlength="150" v-model="search.title" placeholder="标题"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="status" label="状态：">
                <el-select clearable v-model="search.status" placeholder="请选择" class="input-row">
                    <el-option v-for="(item, index) in statusOptions" :label="item.label" :value="item.itemValue"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传时间：">
                <el-date-picker v-model="dateRange" type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" icon="el-icon-search" @click="searchByPage()"
                           style="background: rgba(228, 53, 43, 1);color:#ffffff;border-color: rgb(228, 53, 43);">搜索
                </el-button>
                <el-button size="small" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="margin-top: 10px;">
            <el-table
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :key="Math.random()">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column label="提交简况">
                    <template slot-scope="scope">
                        <template v-if="scope.row.pass + scope.row.audit
                        + scope.row.auditing + scope.row.turnDown == 0">
                            暂无提交记录
                        </template>
                        <template v-else>
                            <template v-if="scope.row.pass > 0">
                                审核通过：{{ scope.row.pass }}<br>
                            </template>
                            <template v-if="scope.row.audit > 0">
                                待提交：{{ scope.row.audit }}<br>
                            </template>
                            <template v-if="scope.row.auditing > 0">
                                审核中：{{ scope.row.auditing }}<br>
                            </template>
                            <template v-if="scope.row.turnDown > 0">
                                审核驳回：{{ scope.row.turnDown }}
                            </template>
                        </template>
                    </template>
                </el-table-column>
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
                <el-table-column label="操作" fixed="right" width="230">
                    <template slot-scope="scope">
                        <el-button class="button button-red" size="mini" v-if="checkTimeRange(scope.row.upStartTime, scope.row.upEndTime)"
                                   @click="addInfo(scope.row.id, scope.row.title,scope.row.deptId)">上传申请
                        </el-button>
                        <el-button v-permission-leaf class="button button-blue" size="mini"
                                   @click="detail(scope.row.id,scope.row.deptId)">提交记录
                        </el-button>
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
        <TimeIndexList :timeId="selectTimeId" :show="timeIndexListShow" :deptId="timeDeptId"
                       @close="timeIndexListShow = false"></TimeIndexList>
        <edit ref="edit" :value="editShow" :id="null" :deptId="timeDeptId" :timeId="selectTimeId" :timeTitle="selectTimeTitle"
              @close="editShow = false" @refresh="refresh"></edit>
    </div>
</template>

<script>
import {queryTimeByContent, deleteTzTwoBestOneFirstTimeById, updateTimeStatusById} from "@/api/tzTwoBestOneFirstTime";
import TimeIndexList from "@/views/dj/twoBestOneFirst/timeIndexList.vue";
import {mapGetters} from "vuex";
import Edit from "./edit.vue";
import {formatStringDate} from '@/utils/index'

export default {
    name: "index",
    components: {
        TimeIndexList,
        Edit
    },
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
                {label: '未启用', itemValue: "0"},
                {label: '已启用', itemValue: "1"}
            ],
            dataListLoading: false,
            tableDataNow: [],
            timeIndexListShow: false,
            selectTimeId: null,
            selectTimeTitle: '',
            editShow: false,
            dateRange: [],
            timeDeptId:""
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
        checkTimeRange(startTime, endTime) {
            let currentTime = new Date();
            currentTime = formatStringDate()
            // 判断当前时间是否在时间区间内
            if (currentTime >= startTime && currentTime <= endTime) {
               return true
            } else {
                return false
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.dateRange = []
        },
        addInfo(id, title,deptId) {
            this.selectTimeTitle = title
            this.selectTimeId = id
            this.timeDeptId = deptId
            this.editShow = true
        },
        detail(id,deptId) {
            this.selectTimeId = id
            this.timeDeptId = deptId
            this.timeIndexListShow = true
        },
        refresh() {
            this.editShow = false
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
            queryTimeByContent({data: data}).then(res => {
                this.dataListLoading = false
                let data = res.data
                if (data.code == '00000' && data.data) {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                    for (let i = 0; i < this.tableDataNow.length; i++) {
                        // 是否在可提交时间内
                        if (Date.parse(this.tableDataNow[i].upStartTime) <= new Date().getTime() <= Date.parse(this.tableDataNow[i].upEndTime)) {
                            this.tableDataNow[i].addTime = true
                        } else {
                            this.tableDataNow[i].addTime = false
                        }
                    }
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

.button-gray {
    border: 1px solid gray;
    color: gray;
    cursor: no-drop;
}

/deep/ .el-table__empty-block {
    height: 0 !important;
}
</style>
