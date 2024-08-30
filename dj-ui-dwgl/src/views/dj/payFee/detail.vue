<template>
    <div style="background: white; padding: 15px; height: calc(100vh - 66px);">
        <el-form ref="searchForm" :model="whereMap" label-width="90px" inline size="medium" style="text-align: left;">
            <el-form-item prop="name" label="姓名：">
                <el-input style="width: 230px;" maxlength="150" v-model="whereMap.name" placeholder="姓名"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="status" label="缴纳状态：">
                <el-select v-model="whereMap.status" placeholder="请选择" clearable size="small"
                           style="width: 200px;margin-left: 15px">
                    <el-option label="未缴纳" value=0></el-option>
                    <el-option label="已缴纳" value=1></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="isInsteadPay" label="是否代缴：">
                <el-select v-model="whereMap.isInsteadPay" placeholder="请选择" clearable size="small"
                           style="width: 200px;margin-left: 15px">
                    <el-option label="否" value=0></el-option>
                    <el-option label="是" value=1></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="isBackTax" label="是否补缴：" v-if="drop">
                <el-select v-model="whereMap.isBackTax" placeholder="请选择" clearable size="small"
                           style="width: 200px;margin-left: 15px">
                    <el-option label="否" :value="'0'"></el-option>
                    <el-option label="是" :value="'1'"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <a class="drop-down" @click="dropDown">
                    {{ dropDownContent }}
                    <i :class="dropDownIcon"></i>
                </a>
                <el-button size="small" icon="el-icon-search" class="topBtn"
                           @click="ok">搜索
                </el-button>
                <el-button size="small" @click="reset('searchForm')" style="margin-left: 10px;">重置</el-button>
                <el-button size="small" icon="el-icon-download" @click="exportDetail()"
                           style="margin-left: 10px;" class="topBtn">导出党员缴费详情
                </el-button>
                <el-button size="small" plain type="danger" icon="el-icon-return" :loading="syncLoading"
                           @click="syncPayResult()"
                           style="margin-left: 10px;">同步支付结果
                </el-button>
                <el-button size="small" class="topBtn" style="margin-left: 10px;" type="danger"
                           icon="el-icon-arrow-left" @click="back()">
                    返回
                </el-button>
            </el-form-item>
        </el-form>
        <div style="margin-top: 10px;">
            <el-table
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    max-height="700"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column fixed="left" label="序号" type="index" width="60"></el-table-column>
                <el-table-column prop="name" label="姓名" width="90"></el-table-column>
                <el-table-column prop="deptName" label="所属单位" width="400"></el-table-column>
                <el-table-column prop="payMonth" label="缴纳月份" width="150">
                    <template slot-scope="scope">
                        {{ formartDate(scope.row.payMonth, 'yyyy-MM') }}
                    </template>
                </el-table-column>
                <el-table-column prop="shouldPay" label="应缴金额" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.shouldPay.toFixed(2) }}
                    </template>
                </el-table-column>
<!--                <el-table-column prop="actuallyPay" label="实缴金额" width="150">-->
<!--                    <template slot-scope="scope">-->
<!--                        {{ scope.row.actuallyPay.toFixed(2) }}-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column prop="paymentType" label="缴纳类型" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.paymentType ? scope.row.paymentType : '--' }}
                    </template>
                </el-table-column>
                <el-table-column prop="paymentBase" label="缴纳基数" width="100"></el-table-column>
                <el-table-column prop="paymentRatio" label="缴纳比例" width="100"></el-table-column>
                <el-table-column prop="status" label="缴纳状态" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.status == 0 ? '未缴纳' : '已缴纳' }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="缴纳时间" width="170">
                    <template slot-scope="scope">
                        {{ scope.row.payTime ? formartDate(scope.row.payTime, 'yyyy-MM-dd HH:mm:ss') : '--' }}
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
                        <template v-else>--</template>
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
                <el-table-column label="操作" fixed="right" min-width="130">
                    <template slot-scope="scope">
<!--                        <el-button plain-->
<!--                                   size="mini" type="danger"-->
<!--                                   @click="editPay(scope.row.id)">编辑-->
<!--                        </el-button>-->
                        <el-badge :value="scope.row.payNum" class="item" v-if="scope.row.payNum > 1">
                            <el-button plain size="mini" type="danger" @click="viewLog(scope.row.id)">查看详情
                            </el-button>
                        </el-badge>
                        <el-button class="item" v-else plain size="mini" type="primary" @click="viewLog(scope.row.id)">查看详情
                        </el-button>
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

        <detail-log :show="detailLogShow" :id="selectDetailId" @close="close"></detail-log>
<!--        <edit-pay-fee :show="editModalShow" :id="selectDetailId" @close="close"></edit-pay-fee>-->
    </div>

</template>
<script>
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {queryTzPayFeeDetailList, downloadTzPayFeeDetailList} from "@/api/jcxfPayFeeDetail";
import detailLog from "@/views/dj/payFee/detailLog.vue";
import {downloadTzPayFeeList, syncPayResultById} from "@/api/jcxfPayFee";
import EditPayFee from "@/views/dj/payFee/editPayFee.vue";

export default {
    name: 'detail',
    components: {
        EditPayFee,
        detailLog
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            show: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                payFeeId: '',
                name: '',
                status: '',
                isInsteadPay: '',
                personType: '',
                isBackTax: ''
            },
            dataListLoading: false,
            tableDataNow: [],  // 显示的数据,
            detailLogShow: false,
            selectDetailId: null,
            syncLoading: false,
            editModalShow: false
        }
    },
    created() {
        if (this.$route.query.id) {
            this.whereMap.payFeeId = this.$route.query.id
        } else {
            this.whereMap.deptId = this.$route.query.deptId
            this.whereMap.payMonth = this.$route.query.payMonth
        }
        this.getDataById()
    },
    methods: {
        //展开 收起
        dropDown() {
            if (this.drop) {
                this.dropDownContent = "展开";
                this.dropDownIcon = "el-icon-arrow-down";
            } else {
                this.dropDownContent = "收起";
                this.dropDownIcon = "el-icon-arrow-up";
            }
            this.drop = !this.drop;
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
                return '--'
            }
        },
        editPay(id) {
            this.selectDetailId = id
            this.editModalShow = true
        },
        syncPayResult() {
            this.$confirm("确定要同步支付结果吗?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                // type: "warning"
            }).then(() => {
                this.syncLoading = true
                syncPayResultById(this.whereMap.payFeeId).then(res => {
                    this.syncLoading = false

                    const data = res.data
                    if (data.code == '00000') {
                        this.$message.success('同步成功')
                        this.pageNum = 1
                        this.getDataById()
                    } else {
                        this.$message.info(data.msg)
                    }
                })
            })
        },
        close() {
            this.detailLogShow = false
            this.editModalShow = false
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
            //this.$router.push({path: 'payFeePerson'})
            //返回上一级
            this.$router.back()
        },
        reset(formName) {
            this.$refs[formName].resetFields()
        },
        ok() {
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        exportDetail() {
            this.$confirm("是否确认导出数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let data = {
                    tzPayFeeDetail: this.whereMap,
                    isBackTax: this.whereMap.isBackTax,
                }
                downloadTzPayFeeDetailList({data: data}).then(res => {
                    let exportList = res.data.data
                    import("@/vendor/Export2Excel").then((excel) => {
                        // 设置导出表格的头部
                        const tHeader = [
                            "序号",
                            "姓名",
                            "所属部门",
                            "缴纳月份",
                            "应缴金额",
                            "实缴金额",
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
                                item.shouldPay.toFixed(2),
                                item.actuallyPay.toFixed(2),
                                item.status == 0 ? '未缴纳' : '已缴纳',
                                this.formartDate(item.payTime, 'yyyy-MM-dd HH:mm:ss'),
                                item.status == 0 ? '' : item.isInsteadPay == 0 ? '否' : '是',
                                item.status == 0 ? '' : item.isInsteadPay == 0 ? '无' : item.insteadPayPartyMemberName,
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
            })
        },
        // 获取分页信息
        getDataById() {
            this.dataListLoading = true
            // this.whereMap.payFeeId = this.payFeeId

            let data = {
                tzPayFeeDetail: this.whereMap,
                isBackTax: this.whereMap.isBackTax,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryTzPayFeeDetailList({data: data}).then(res => {
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
</style>
