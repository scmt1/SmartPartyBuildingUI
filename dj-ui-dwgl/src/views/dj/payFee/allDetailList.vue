<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"></organization-tree>
            </template>
            <template v-slot:search>
                <div style="text-align: left;">
                    <div class="search-div">
                        姓名：<el-input v-model="whereMap.name" placeholder="请输入姓名" size="small" style="width: 200px;margin-left: 15px"></el-input>
                    </div>

                    <div class="search-div">
                        缴纳状态：
                        <el-select v-model="whereMap.status" placeholder="请选择" clearable size="small" style="width: 120px;margin-left: 15px">
                            <el-option label="未缴纳" value=0></el-option>
                            <el-option label="已缴纳" value=1></el-option>
                        </el-select>
                    </div>

                    <div class="search-div">
                        缴纳月份：
                        <el-date-picker
                            style="margin-left: 15px; width:200px;"
                            default-value
                            size="small"
                            v-model="whereMap.startPayMonth"
                            type="month"
                            placeholder="选择日期"
                            format="yyyy-MM"
                            value-format="yyyy-MM"
                        >
                        </el-date-picker>
                        &nbsp;&nbsp;至&nbsp;&nbsp;
                        <el-date-picker
                            style="width:200px;"
                            default-value
                            size="small"
                            v-model="whereMap.endPayMonth"
                            type="month"
                            placeholder="选择日期"
                            format="yyyy-MM"
                            value-format="yyyy-MM"
                        >
                        </el-date-picker>
                    </div>

                    <div class="search-div">
                        缴纳时间：
                        <el-date-picker
                            style="margin-left: 15px; width:200px;"
                            default-value
                            size="small"
                            v-model="whereMap.startPayTime"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                        &nbsp;&nbsp;至&nbsp;&nbsp;
                        <el-date-picker
                            style="width:200px;"
                            default-value
                            size="small"
                            v-model="whereMap.endPayTime"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </div>

                    <div class="search-div">
                        是否代缴：<el-select v-model="whereMap.isInsteadPay" placeholder="请选择" clearable size="small"
                                            style="width: 100px;margin-left: 15px">
                        <el-option label="否" value=0></el-option>
                        <el-option label="是" value=1></el-option>
                    </el-select>
                    </div>

                    <div class="search-div">
                        是否补缴：<el-select v-model="whereMap.isBackTax" placeholder="请选择" clearable size="small"
                                            style="width: 100px;margin-left: 15px">
                        <el-option label="否" :value="'0'"></el-option>
                        <el-option label="是" :value="'1'"></el-option>
                    </el-select>
                    </div>

                    <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);;color:#ffffff" @click="ok">搜索</el-button>
                    <el-button size="small" @click="reset()" icon="el-icon-refresh-left" style="margin-left: 10px; background: #ffffff;color: rgba(228, 53, 43, 1);border: 1px solid rgba(228, 53, 43, 1);">重置</el-button>
                    <el-button size="small" plain type="danger" icon="el-icon-return" @click="exportDetail()" style="margin-left: 10px;">导出党员缴费详情</el-button>
                </div>
            </template>
            <template v-slot:table>
                <el-table
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column fixed="left" type="index" width="40"></el-table-column>
                    <el-table-column prop="name" label="姓名" width="90"></el-table-column>
                    <el-table-column prop="deptName" label="所属单位" width="400"></el-table-column>
                    <el-table-column  prop="payMonth" label="缴纳月份">
                        <template slot-scope="scope">
                            {{ formartDate(scope.row.payMonth, 'yyyy-MM') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="actuallyPay" label="实缴金额" width="110">
                        <template slot-scope="scope">
                            {{ scope.row.actuallyPay.toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="缴纳状态">
                        <template slot-scope="scope">
                            {{ scope.row.status == 0 ? '未缴纳' : '已缴纳' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="缴纳时间" width="170">
                        <template slot-scope="scope">
                            {{ formartDate(scope.row.payTime, 'yyyy-MM-dd HH:mm:ss') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="代缴">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status == 1">
                                <template v-if="scope.row.isInsteadPay == 0">
                                    否
                                </template>
                                <template v-else-if="scope.row.isInsteadPay == 1">
                                    {{ scope.row.insteadPayPartyMemberName }}
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="补缴">
                        <template slot-scope="scope">
                            <template v-if="isBackTax(scope.row) == '是'">
                                <span style="color: red;">是</span>
                            </template>
                            <template v-else>
                                {{ isBackTax(scope.row) }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" min-width="110">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status == 0">
                                <el-button v-permission-contrast="scope.row.deptId" plain size="mini" type="danger" @click="editPay(scope.row.id)">编辑</el-button>
                            </template>
                            <template v-if="scope.row.payNum > 1">
                                <el-badge :value="scope.row.payNum" class="item">
                                    <el-button plain size="mini" type="danger" @click="viewLog(scope.row.id)">查看详情</el-button>
                                </el-badge>
                            </template>
                            <template v-else>
                                <el-button plain size="mini" type="primary" @click="viewLog(scope.row.id)">查看详情</el-button>
                            </template>
                        </template>
                    </el-table-column>
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
        <detail-log :show="detailLogShow" :id="selectDetailId" @close="close"></detail-log>
    </div>
</template>

<script>
import organizationTree from '@/views/dj/components/organizationTree'
import TreeAndTable from "@/components/TreeAndTable.vue";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {queryAllTzPayFeeDetailList} from "@/api/jcxfPayFeeDetail";
import detailLog from "@/views/dj/payFee/detailLog.vue";

export default {
    name: "allDetailList",
    components: {
        TreeAndTable,
        organizationTree,
        detailLog
    },
    data() {
        return {
            show: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                deptId: '',
                name: '',
                status: '',
                isInsteadPay: '',
                personType: '',
                isBackTax: '',
                startPayMonth: null,
                endPayMonth: null,
                startPayTime: null,
                endPayTime: null
            },
            dataListLoading: false,
            tableDataNow: [],  // 显示的数据,
            detailLogShow: false,
            selectDetailId: null,
        }
    },
    methods: {
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.getDataById()
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            this.getDataById()
        },
        isBackTax(data) {
            if (data.status == 1) {
                let payTime = new Date(this.formartDate(data.payTime, 'yyyy-MM'))
                let payMonth = new Date(data.payMonth)
                if (payTime > payMonth) {
                    return '是'
                } else {
                    return '否'
                }
            } else {
                return ''
            }
        },
        editPay(id) {
            this.selectDetailId = id
        },
        close() {
            this.detailLogShow = false
            // this.getDataById()
        },
        viewLog(id) {
            this.selectDetailId = id
            this.detailLogShow = true
        },
        getDict(type) {
            getDictByCode(type).then(res => {
                let data = res.data.data
                if (type == 'nation') {
                    this.nationList = data
                } else if (type == 'position') {
                    this.positionList = data
                } else if (type == 'personType') {
                    this.personTypeList = data
                } else if (type == 'education') {
                    this.educationList = data
                } else if (type == 'partyState') {
                    this.partyStateList = data
                }
            })
        },
        back() {
            this.$router.push({path: 'payFeePerson'})
        },
        reset() {
            this.whereMap.name = ''
            this.whereMap.status = ''
            this.whereMap.isInsteadPay = ''
            this.whereMap.personType = ''

            this.whereMap.startPayMonth = null
            this.whereMap.endPayMonth = null
            this.whereMap.startPayTime = null
            this.whereMap.endPayTime = null

            this.pageNum = 1
            this.pageSize = 10
        },
        ok() {
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        exportDetail() {
            this.$confirm("是否确认导出当前页数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let exportList = this.tableDataNow
                import("@/vendor/Export2Excel").then((excel) => {
                    // 设置导出表格的头部
                    const tHeader = [
                        "序号",
                        "姓名",
                        "所属部门",
                        "缴纳月份",
                        "缴纳金额",
                        "缴纳状态",
                        "缴纳时间",
                        "是否代缴",
                        "代缴人",
                        "是否补缴"
                    ]
                    // 将要导出的数据进行一个过滤
                    /**
                     * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                     */
                    const data = exportList.map((item, index) => {
                        return [
                            index + 1,
                            item.name,
                            item.deptName,
                            item.payMonth,
                            item.shouldPay ? item.shouldPay.toFixed(2) : 0.00,
                            item.actuallyPay.toFixed(2),
                            item.status == 0 ? '未缴纳' : '已缴纳',
                            this.formartDate(item.payTime, 'yyyy-MM-dd HH:mm:ss'),
                            item.status == 0?'': item.isInsteadPay == 0?'否':'是',
                            item.status == 0?'': item.isInsteadPay == 0?'无': item.insteadPayPartyMemberName,
                            this.isBackTax(item)
                        ]
                    })
                    // 调用我们封装好的方法进行导出Excel
                    excel.export_json_to_excel({
                        // 导出的头部
                        header: tHeader,
                        // 导出的内容
                        data,
                        // 导出的文件名称
                        filename: "缴费详情" + this.formartDate(new Date(), 'yyyy-MM-dd'),
                        // 导出的表格宽度是否自动
                        autoWidth: true,
                        // 导出文件的后缀类型
                        bookType: "xlsx",
                    })
                });
                this.$message.success("导出成功")
            })
        },
        // 获取分页信息
        getDataById() {
            if (this.whereMap.startPayMonth !=null && this.whereMap.endPayMonth !=null && this.whereMap.startPayMonth.length > 0 && this.whereMap.endPayMonth.length > 0 ) {
                const start = new Date(this.whereMap.startPayMonth)
                const end = new Date(this.whereMap.endPayMonth)

                if (start <= end) {
                    this.$message.info('缴纳月份开始时间不应大于结束时间')
                    return
                }
            }

            if (this.whereMap.startPayTime !=null && this.whereMap.endPayTime !=null && this.whereMap.startPayTime.length > 0 && this.whereMap.endPayTime.length > 0 ) {
                const start = new Date(this.whereMap.startPayTime)
                const end = new Date(this.whereMap.endPayTime)

                if (start <= end) {
                    this.$message.info('缴纳时间开始时间不应大于结束时间')
                    return
                }
            }


            this.dataListLoading = true

            let data = {
                deptId: this.whereMap.deptId + '',
                tzPayFeeDetail: {
                    name: this.whereMap.name,
                    status: this.whereMap.status,
                    isInsteadPay: this.whereMap.isInsteadPay,
                    isBackTax: this.whereMap.isBackTax
                },
                startPayMonth: this.whereMap.startPayMonth,
                endPayMonth: this.whereMap.endPayMonth,
                startPayTime: this.whereMap.startPayTime,
                endPayTime: this.whereMap.endPayTime,
                isBackTax: this.whereMap.isBackTax,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryAllTzPayFeeDetailList({ data: data }).then(res => {
                this.dataListLoading = false

                let data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                    if (this.tableDataNow) {
                        for (let i = 0; i < this.tableDataNow.length; i++) {
                            this.tableDataNow[i].doTime = this.formartDate(this.tableDataNow[i].doTime, 'yyyy-MM-dd')
                        }
                    }
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
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

<style scoped lang="scss">
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

.el-button+.el-button {
    margin-left: 0;
}
</style>
