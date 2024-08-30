<template>
    <div>
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
                            style="margin-left: 15px;width:200px;"
                            default-value
                            size="small"
                            v-model="whereMap.startPayMonth"
                            type="month"
                            placeholder="选择日期"
                            format="yyyy-MM"
                            value-format="yyyy-MM"
                            :clearable="false"
                            :picker-options="setDisabled"
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
                            :clearable="false"
                            :picker-options="setDisabled"
                    >
                    </el-date-picker>
                    <el-button size="small" icon="el-icon-search"
                               style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);margin-left: 10px;"
                               @click="ok">搜索
                    </el-button>
<!--                    <el-button size="small" @click="reset()">重置</el-button>-->
                    <!--                    <el-button v-permission-leaf plain size="small" icon="el-icon-plus" @click="addInfo()" type="danger">新增本部门党费缴纳</el-button>-->
                    <!--                    <el-button v-permission-leaf size="small" @click="downloadTemplate('this')" icon="el-icon-download" type="danger" plain>下载本部门党员缴费导入模板</el-button>-->
                    <el-button size="small" icon="el-icon-download" @click="exportDetail()"
                               style="margin-left: 10px;background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);"
                               v-loading="exportLoading">导出缴费情况
                    </el-button>
                    <el-button plain size="small" icon="el-icon-refresh" @click="refresh" type="danger">刷新</el-button>
                </div>
                <div class="data-statistics" style="background: rgb(250, 250, 250);">
                    <div class="statistics-list">
                        <div class="item">
                            <div class="title">应收党费(元)</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);"><span
                                class="amount-num">{{partyFeeStatistic.allPartyMoney ? partyFeeStatistic.allPartyMoney : 0}}</span>元
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">应交人数(人)</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);">
                                <span class="amount-num">{{partyFeeStatistic.allPartyNum ? partyFeeStatistic.allPartyNum : 0}}</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">已交纳党费(元)</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);">
                                <span class="amount-num">{{partyFeeStatistic.alreadyPartyMoney ? partyFeeStatistic.alreadyPartyMoney : 0}}</span>元
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">已交纳人数(人)</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);">
                                <span class="amount-num">{{partyFeeStatistic.alreadyPartyNum ? partyFeeStatistic.alreadyPartyNum : 0}}</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">未交党费(元)</div>
                            <div class="amount"  style="color: red;">
                                <span class="amount-num">{{partyFeeStatistic.notPartyMoney ? partyFeeStatistic.notPartyMoney : 0}}</span>元
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">未交人数(人)</div>
                            <div class="amount"  style="color: red;">
                                <span class="amount-num">{{partyFeeStatistic.notPartyNum ? partyFeeStatistic.notPartyNum : 0}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:table>
                <el-table
                    :row-class-name="tableRowClassName"
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
                    <el-table-column prop="deptName" label="上传单位" width="400" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="payMonth" label="缴纳月份">
                        <template slot-scope="scope">
                            {{ formartDate(scope.row.payMonth, 'yyyy-MM') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="shouldPay" label="应缴纳金额(元)">
                        <template slot-scope="scope">
                            {{ scope.row.shouldPay ? scope.row.shouldPay.toFixed(2) : 0.00 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="actuallyPay" label="实缴纳金额(元)">
                        <template slot-scope="scope">
                            {{ scope.row.actuallyPay.toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="shouldPayNum" label="应缴人数"></el-table-column>
                    <el-table-column prop="actuallyPayNum" label="实缴人数"></el-table-column>
<!--                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.status == 0 ? '未发布' : '已发布' }}
                        </template>
                    </el-table-column>-->
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
<!--                            <el-button v-permission-contrast="scope.row.deptId" size="mini" @click="handleDelete( scope.row.id)">删除</el-button>-->
                            <el-button size="mini" @click="handleDetail(scope.row)">详情</el-button>
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

        <add v-model="show" :modal-title="title" :dept-id="whereMap.deptId.toString()"
             @close="close()"></add>
    </div>
</template>
<script>
import add from './addPayFee'
import organizationTree from '@/views/dj/components/organizationTree'
import TreeAndTable from "@/components/TreeAndTable.vue";
import {queryTzPayFeeList, deleteById,downloadTzPayFeeList} from '@/api/jcxfPayFee'
import {getPayFeePartyMemberByDeptId} from "@/api/jcxfPartyMember";
import {getPayFeeStatistics} from "@/api/jcxfPayFeeDetail";
import {mapGetters} from "vuex";

export default {
    name: 'index',
    components: {
        add,
        organizationTree,
        TreeAndTable
    },
    data() {
        return {
            deptId: '',
            show: false,
            exportLoading: false,
            title: '新增',
            partyMemberIds: '',
            partyStateList: [],
            educationList: [],
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
            dialogFormVisible: false,
            downThisLoading: false,
            downAllLoading: false,
            setDisabled:{
                disabledDate(time) {
                    return time.getTime() > Date.now();  // 可选历史天、可选当前天、不可选未来天
                },
            },
            partyFeeStatistic:{
                allPartyMoney:0.00,
                alreadyPartyMoney:0.00,
                allPartyNum:0,
                alreadyPartyNum:0,
                notPartyMoney:0.00,
                notPartyNum:0
            }
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            let date = new Date();

            this.whereMap.startPayMonth = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1)
            this.whereMap.endPayMonth = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1)

            this.getDataById()
        },
        getPartyFeeStatistics(){
            getPayFeeStatistics({deptId:this.whereMap.deptId+'',startMonth:this.whereMap.startPayMonth,endMonth:this.whereMap.endPayMonth}).then(res =>{
                let data = res.data
                if (data.code == '00000') {
                    this.partyFeeStatistic = data.data
                }
            })
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            let date = new Date();
            if(!this.whereMap.startPayMonth) {
                this.whereMap.startPayMonth = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1)
            }
            if(!this.whereMap.endPayMonth) {
                this.whereMap.endPayMonth = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1)
            }

            this.getDataById()
        },
        handleDetail(row) {
            this.$router.push({
                path: 'payFeeDetail',
                query: {
                    id: row.id,
                    type: 1,
                    payMonth: row.payMonth
                }
            })
        },
        close() {
            this.show = false
            this.getDataById()
        },
        addInfo() {
            this.show = true
            this.title = '新增'
        },
        reset() {
            this.whereMap.status = ''
            this.whereMap.startPayMonth = ''
            this.whereMap.endPayMonth = ''
            this.pageNum = 1
            this.pageSize = 10
        },
        ok() {
            if(!this.whereMap.startPayMonth || !this.whereMap.endPayMonth){
                this.$message.warning("请选择开始时间与结束时间！")
                return
            }
            this.whereMap.status = ''
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        downloadTemplate(type) {
            if (type == 'this') {
                this.downThisLoading = true
                this.downAllLoading = false
            } else if (type == 'all') {
                this.downThisLoading = false
                this.downAllLoading = true
            }
            // 获取当前部门的党员信息

            // 暂定只获取本部门党员
            let data = {
                //deptId: this.whereMap.deptId + '',
                deptId: this.deptInfo.id + '',
                type: type
            }
            getPayFeePartyMemberByDeptId(data).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    if (data.data.length == 0) {
                        this.$message.info('未查询到党员信息')
                        return
                    }
                    let exportList = data.data

                    import("@/vendor/Export2Excel").then((excel) => {
                        // 设置导出表格的头部
                        const tHeader = [
                            "序号",
                            "id",
                            "党员姓名",
                            "身份证后六位",
                            "党费（单位：元，格式：xx.xx）",
                        ]
                        // 将要导出的数据进行一个过滤
                        /**
                         * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                         */
                        const data = exportList.map((item, index) => {
                            return [
                                index + 1,
                                item.id,
                                item.realName,
                                item.idcard,
                                ''
                            ]
                        })
                        // 调用我们封装好的方法进行导出Excel
                        excel.export_json_to_excel({
                            // 导出的头部
                            header: tHeader,
                            // 导出的内容
                            data,
                            // 导出的文件名称
                            filename: "党员列表" + this.formartDate(new Date(), 'yyyy-MM-dd'),
                            // 导出的表格宽度是否自动
                            autoWidth: true,
                            // 导出文件的后缀类型
                            bookType: "xlsx",
                        })
                    })
                    this.downThisLoading = false
                    this.downAllLoading = false
                } else {
                    this.downThisLoading = false
                    this.downAllLoading = false
                    this.$message.error(data.msg)
                }
            })
        },
        exportDetail() {
            this.$confirm("是否确认导出数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let data = {
                    tzPayFee: this.whereMap,
                    startPayMonth: this.whereMap.startPayMonth,
                    endPayMonth: this.whereMap.endPayMonth,
                }
                this.exportLoading = true

                downloadTzPayFeeList({data: data}).then(res => {
                    let exportList = res.data.data
                    import("@/vendor/Export2Excel").then((excel) => {
                        // 设置导出表格的头部
                        const tHeader = [
                            "单位",
                            "缴纳月份",
                            "应缴金额",
                            "实缴金额"
                        ]
                        // 将要导出的数据进行一个过滤
                        /**
                         * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                         */
                        const data = exportList.map((item, index) => {
                            return [
                                item.deptName,
                                item.payMonth,
                                item.shouldPay ? item.shouldPay.toFixed(2) : 0.00,
                                item.actuallyPay.toFixed(2),
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
                    this.exportLoading = false
                })
            })
        },
        search() {
            this.reset()
        },
        handDetail(type, id) {
            this.dialogFormVisible = true
            this.$router.push({
                path: 'updatePerson',
                query: {
                    id: id,
                    type: 1
                }
            })
        },
        handleEdit(type, id) {
            this.dialogFormVisible = true
            this.$router.push({
                path: 'updatePerson',
                query: {
                    id: id,
                    type: 0
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        // 获取分页信息
        getDataById() {
            if (this.whereMap.startPayMonth !=null && this.whereMap.endPayMonth !=null && this.whereMap.startPayMonth.length > 0 && this.whereMap.endPayMonth.length > 0 ) {
                const start = new Date(this.whereMap.startPayMonth)
                const end = new Date(this.whereMap.endPayMonth)

                if (start > end) {
                    this.$message.info('开始时间不应大于结束时间')
                    return
                }
            }

            this.dataListLoading = true
            let data = {
                tzPayFee: this.whereMap,
                startPayMonth: this.whereMap.startPayMonth,
                endPayMonth: this.whereMap.endPayMonth,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            this.getPartyFeeStatistics()
            queryTzPayFeeList({data: data}).then(res => {
                this.dataListLoading = false

                let data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        handleDelete(row) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                if (row != null || row != undefined) {
                    this.deleteOk(row)
                }
            }).catch(() => {

            });
        },
        deleteOk(id) {
            deleteById(id).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.$message.info('删除成功')
                    this.getDataById()
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        partyMemberReceive() {
            this.$router.push({path: 'receive'})
        },
        refresh() {
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
    .data-statistics {
        margin: 15px 0 0;
        border-radius: 3px;
        border: 1px solid #EBEBEB;
        .statistics-list {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            .item {
                flex: 1;
                text-align: center;
                padding: 10px 20px 0px 0;
                box-sizing: border-box;
                width: calc((100% - 60px) / 4);
                min-width: calc((100% - 60px) / 4);
                max-width: calc((100% - 60px) / 4);
                &:nth-child(4n + 4) {
                    margin-right: 0;
                }
                .title {
                    color: gray;
                    font-size: 13px;
                }
                .amount {
                    margin-bottom: 10px;
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    .amount-num {
                        padding-right: 3px;
                        font-weight: 600;
                        font-size: 20px;
                    }
                }
                .detail {
                    display: flex;
                    justify-content: center;
                }
                .detail-text {
                    color: #1965ff;
                    cursor: pointer;
                }
            }
        }
    }

</style>
