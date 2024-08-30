<template>
    <el-dialog
        title="详情"
        :visible.sync="detailLogShow"
        width="1000px"
        @close="close">
        <div style="background: white;">
            <div style="text-align: left;">
                <div class="search-div">
                    单号：
                    <el-input v-model="search.orderNo" placeholder="请输入单号" size="small"
                              style="width: 200px;margin-left: 15px"></el-input>
                </div>
                <div class="search-div">
                    状态：
                    <el-select v-model="search.orderStatus" placeholder="请选择" size="small"
                               style="width: 200px;margin-left: 15px">
                        <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label"
                                   :value="item.itemValue"></el-option>
                    </el-select>
                </div>
                <el-button size="small" icon="el-icon-search" class="topBtn"
                           @click="searchPage">搜索
                </el-button>
            </div>
            <div style="margin-top: 10px;">
                <el-table
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column prop="orderNo" label="订单号" width="240"></el-table-column>
                    <el-table-column prop="orderStatus" label="状态" width="110">
                        <template slot-scope="scope">
                            {{ getDirectLabelByValue(scope.row.orderStatus, orderStatusList) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="金额（元）" width="120">
                        <template slot-scope="scope">
                            <template v-if="scope.row.amount != null">
<!--                                {{ scope.row.amount / 100 }}-->
                                {{  scope.row.shouldPay }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发起时间" width="190"></el-table-column>
                    <el-table-column prop="successTime" label="支付成功时间" width="190"></el-table-column>
                    <el-table-column label="支付人">
                        <template slot-scope="scope">
                            <template v-if="scope.row.partMemberName && scope.row.partMemberName != null">
                                {{ scope.row.partMemberName }}
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
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {queryTzPayFeeDetailLogPage} from "@/api/tzPayFeeDetailLog";

export default {
    name: "detailLog",
    props: {
        id: {
            required: true,
            default: null
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        show(val) {
            this.detailLogShow = this.show
            if (this.detailLogShow && this.id != null) {
                this.search.payFeeDetailId = this.id
                this.pageNum = 1
                this.pageSize = 10
                this.getPage()
            }
        }
    },
    data() {
        return {
            detailLogShow: false,
            search: {
                payFeeDetailId: '',
                orderNo: '',
                orderStatus: 99,
            },
            orderStatusList: [
                // {label: '订单生成', itemValue: 0},
                {label: '全部', itemValue: 99},
                {label: '支付中', itemValue: 1},
                {label: '支付成功', itemValue: 2},
                // {label: '支付失败', itemValue: 3},
                {label: '已退款', itemValue: 5},
                // {label: '订单关闭', itemValue: 6},
            ],
            dataListLoading: false,
            tableDataNow: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
        }
    },
    methods: {
        close() {
            this.search.orderStatus = 99;
            this.$emit('close')
        },
        searchPage() {
            this.pageNum = 1
            this.getPage()
        },
        getPage() {
            this.dataListLoading = true
            let data = {
                tzPayFeeDetailLog: this.search,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryTzPayFeeDetailLogPage({data: data}).then(res => {
                this.dataListLoading = false
                let data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getPage()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getPage()
        },
        getDirectLabelByValue(value, direct) {
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
            return '异常'
        }
    }
}
</script>

<style scoped lang="scss">
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}
/deep/.el-table__empty-block{
    height: 0 !important;
}
</style>
