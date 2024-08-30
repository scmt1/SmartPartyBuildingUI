<template>
    <div class="payFeeHistory">
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"></organization-tree>
            </template>
            <template v-slot:search>
                <div class="search-div" style="margin-top: 10px">
                    <div class="label">
                        缴纳月份：
                    </div>
                    <el-date-picker
                            value-format="yyyy-MM"
                            size="small"
                            v-model="dateValue"
                            type="monthrange"
                            range-separator="至"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                    </el-date-picker>
                    <div class="label">
                        缴纳人员：
                    </div>
                    <el-input v-model="whereMap.userName" placeholder="请输入姓名" size="small" style="width: 200px;margin-left: 15px"></el-input>

                    <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);margin-left: 10px;" @click="search">搜索</el-button>
                    <el-button size="small" @click="reset()">重置</el-button>
                </div>
            </template>

            <template v-slot:table>
                <el-table
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    max-height="700"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :key="Math.random()">
                    <el-table-column prop="orgName" label="单位名称" min-width="340" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="应缴人员" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="payUserName" label="实缴人员" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="payAlready" label="缴纳金额" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ Number(scope.row.payAlready) / 100 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payFor" label="缴纳月份"  min-width="180"></el-table-column>
                </el-table>
                <el-pagination
                    style="margin-top: 10px;"
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
    </div>
</template>
<script>
import TreeAndTable from "@/components/TreeAndTable.vue";
import {mapGetters} from "vuex";
import organizationTree from '@/views/dj/components/cqOrganizationTree'
import {getPayFeeHistoryList} from "../../../api/cqPayFeeHistory";
export default {
    name: 'index',
    components: {
        TreeAndTable,
        organizationTree
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                deptId: '',
                startPayMonth: '',
                endPayMonth: '',
                status: ''
            },
            dataListLoading: false,
            tableDataNow: [],  // 显示的数据
            dateValue: []
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        getDeptId(data) {
            this.whereMap.orgId = data.deptId
            this.getDataList()
        },
        selectByTree(data) {
            this.whereMap.orgId = data.whereMap.deptId
            this.getDataList()
        },
        reset() {
            this.whereMap.status = ''
            this.whereMap.startPayMonth = ''
            this.whereMap.endPayMonth = ''
            this.whereMap.userName = ''
            this.dateValue = []
            this.pageNum = 1
            this.pageSize = 10
        },
        search() {
            this.pageNum = 1
            this.getDataList();
        },
        // 获取分页信息
        getDataList() {
            if(this.dateValue) {
                this.whereMap.startPayMonth = this.dateValue[0]
                this.whereMap.endPayMonth = this.dateValue[1]
            }else {
                this.whereMap.startPayMonth = null
                this.whereMap.endPayMonth = null
            }
            this.dataListLoading = true
            let data = {
                cqPayFeeHistory: this.whereMap,
                startPayMonth: this.whereMap.startPayMonth,
                endPayMonth: this.whereMap.endPayMonth,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            getPayFeeHistoryList({data: data}).then(res => {
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
            this.getDataList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataList()
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
            for (var i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    var val = obj[i] + ''
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
    }
}
</script>

<style scoped lang="scss">
.payFeeHistory {
    .search-div {
        padding: 0 10px 10px 0;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;

        .input-box {
            width: 150px;
        }

        .label {
            width: 90px;
            text-align: right;
        }
    }

    .flex-box {
        display: flex;
        justify-content: space-between;
    }
}
</style>
