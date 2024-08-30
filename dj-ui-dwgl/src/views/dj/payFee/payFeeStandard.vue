<template>
    <tree-and-table>
        <template v-slot:tree>
            <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"></organization-tree>
        </template>

        <template v-slot:search>
            <div class="search-div" style="margin-top: 10px">
                <el-form ref="searchForm" :model="whereMap" label-width="70px" inline size="medium"
                         style="text-align: left;">
                    <el-form-item prop="realName" label="年份：">
                        <el-select v-model="whereMap.payYear" placeholder="请选择" clearable size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item, index) in yearsArray" :key="index" :label="item"
                                       :value="item"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="realName" label="姓名：">
                        <el-input v-model="whereMap.name" clearable placeholder="请输入姓名" size="small"
                                  style="width: 180px;"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button size="small" icon="el-icon-search"
                                   style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);margin-left: 10px;"
                                   @click="pageNum=1;getDataList()">搜索
                        </el-button>
                        <el-button size="small" @click="handReset()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-button size="small" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);" @click="handPaySetting()">补交/删除配置</el-button>
                <el-button size="small" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);" @click="handImport()">批量导入交纳基数</el-button>
                <el-button size="small" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);" @click="handExport()">导出</el-button>
                <el-button size="small" style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);" @click="syncPartyMember" v-loading="syncLoading">同步党员
                </el-button>
                <span style="color: red;margin-left: 5px;">注：党员党费数据后台自动生成，新增加的党员需点击同步后生成党费数据</span>
            </div>
        </template>

        <template v-slot:table>

            <el-table v-loading="dataListLoading" :data="tableData" border :cell-class-name="cellClassName"
                      :cell-style="{'text-align':'center'}"
                      :header-cell-style="{'text-align':'center',background : '#eef1f6'}" tooltip-effect="dark"
                      :key="Math.random()">
                <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
                <el-table-column v-for="(item,index) in tableColumn" :key="index" :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <div v-if="currentMonth > (index+1) && scope.row[item.prop]===0">
                            -
                        </div>
                        <div v-else-if="currentMonth <= (index+1) && scope.row[item.prop]===0" @click="showPayFeeStandardModal(scope.row, item.month, scope.row[item.status])">
                            未设置
                        </div>
                        <div v-else @click="showPayFeeStandardModal(scope.row, item.month, scope.row[item.status])">
                            <p>{{ scope.row[item.prop] }}</p>
                            <p>
                                {{ scope.row[item.status] == 0 ? '未交' : '' }}
                            </p>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
            <el-pagination
                    style="margin-top: 10px;margin-bottom: 10px;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <payFeeStandardModal ref="payFeeStandardModalRef" @refresh="getDataList"></payFeeStandardModal>
            <repayModal ref="repayModal" @refresh="getDataList"></repayModal>
            <importModal ref="importModalRef" @refresh="getDataList"></importModal>
        </template>
    </tree-and-table>
</template>

<script>
import organizationTree from '@/views/dj/components/organizationTree'
import TreeAndTable from "@/components/TreeAndTable.vue";
import {
    getPayFeeDetailPersonList,
    addPartMemberToPayFee,
    exportPayFeeDetailPersonList
} from "../../../api/jcxfPayFeeDetail";
import payFeeStandardModal from "./payFeeStandardModal";
import repayModal from "./repayModal";
import importModal from "./importModal";

export default {
    components: {TreeAndTable, organizationTree, payFeeStandardModal, repayModal, importModal},
    name: "payFeeStandard",
    data() {
        return {
            dataListLoading: false,
            syncLoading: false,
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                payYear: String(new Date().getFullYear()),
                name: '',
                deptId: '',
            },
            yearsArray: [],
            currentMonth: new Date().getMonth() + 1,
            tableColumn: [
                {
                    prop: 'january',
                    label: '一月',
                    month: '01',
                    status: 'status1'
                },
                {
                    prop: 'february',
                    label: '二月',
                    month: '02',
                    status: 'status2'
                },
                {
                    prop: 'march',
                    label: '三月',
                    month: '03',
                    status: 'status3'
                },
                {
                    prop: 'april',
                    label: '四月',
                    month: '04',
                    status: 'status4'
                },
                {
                    prop: 'may',
                    label: '五月',
                    month: '05',
                    status: 'status5'
                },
                {
                    prop: 'june',
                    label: '六月',
                    month: '06',
                    status: 'status6'
                },
                {
                    prop: 'july',
                    label: '七月',
                    month: '07',
                    status: 'status7'
                },
                {
                    prop: 'august',
                    label: '八月',
                    month: '08',
                    status: 'status8'
                },
                {
                    prop: 'september',
                    label: '九月',
                    month: '09',
                    status: 'status9'
                },
                {
                    prop: 'october',
                    label: '十月',
                    month: '10',
                    status: 'status10'
                },
                {
                    prop: 'november',
                    label: '十一月',
                    month: '11',
                    status: 'status11'
                },
                {
                    prop: 'december',
                    label: '十二月',
                    month: '12',
                    status: 'status12'
                }
            ],
            selectDept:{}

        }
    },
    methods: {
        getDeptId(data) {
            this.selectDept = data
            this.whereMap.deptId = String(data.deptId)
            this.whereMap.deptName = String(data.deptName)
            this.getDataList()
        },
        selectByTree(data) {
            this.whereMap.deptId = String(data.whereMap.deptId)
            this.whereMap.deptName = String(data.whereMap.deptName)
            this.selectDept = data.whereMap
            this.pageNum = 1;
            this.getDataList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataList()
        },
        getDataList() {
            this.dataListLoading = true
            let data = {
                ...this.whereMap,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            getPayFeeDetailPersonList(data).then(res => {
                this.dataListLoading = false
                let data = res.data
                if (data.code == '00000') {
                    this.tableData = data.data.records
                    this.total = data.data.total
                }
            })
        },
        handReset() {
            this.whereMap.payYear = String(new Date().getFullYear())
            this.whereMap.name = ''
            this.pageNum = 1
            this.getDataList()
        },
        showPayFeeStandardModal(row, month, status) {
            let flag = this.currentMonth > month ? true : false
            flag = status == 1 ? true : flag
            this.$refs.payFeeStandardModalRef.initOpen(row, this.whereMap.payYear, month, flag)
        },
        cellClassName({row, column, rowIndex, columnIndex}) {
            if (column.property != "name") {
                let columnProperty = this.tableData[rowIndex][column.property];
                let status = this.tableData[rowIndex]['status' + (columnIndex)];
                if (columnProperty > 0 && status != 1) {
                    return 'warning-cell';
                }
            }
        },
        syncPartyMember() {
            this.syncLoading = true
            addPartMemberToPayFee({
                deptId: this.whereMap.deptId
            }).then(res => {
                this.syncLoading = false
                let data = res.data
                if (data.code == '00000') {
                    this.$message.success("同步成功")
                    this.getDataList()
                }
            })
        },
        handPaySetting() {
            this.$refs.repayModal.initOpen(this.whereMap.deptId)
        },
        handImport() {
            if(!this.selectDept) {
                this.$message.error("请点击左侧树形选择部门！")
                return;
            }
            if(!this.selectDept.isLeaf) {
                this.$message.error("请点击左侧树形选择对应的支部！")
                return;
            }
            this.$refs.importModalRef.initOpen(this.whereMap.deptId, this.selectDept.deptName);
        },
        handExport() {
            this.$confirm("是否确认导出数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let data = {
                    ...this.whereMap,
                }
                exportPayFeeDetailPersonList(data).then(res => {
                    let exportList = res.data.data
                    import("@/vendor/Export2Excel").then((excel) => {
                        // 设置导出表格的头部
                        const tHeader = [
                            "姓名",
                            "一月",
                            "二月",
                            "三月",
                            "四月",
                            "五月",
                            "六月",
                            "七月",
                            "八月",
                            "九月",
                            "十月",
                            "十一月",
                            "十二月"
                        ]
                        // 将要导出的数据进行一个过滤
                        /**
                         * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                         */
                        const data = exportList.map((item, index) => {
                            return [
                                item.name,
                                this.currentMonth > 1 && item.january == 0 ? '-' : this.currentMonth <= 1 && item.january == 0 ? '未设置' :  item.january + (item.status1 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.february == 0 ? '-' : this.currentMonth <= 1 && item.february == 0 ? '未设置' :  item.february + (item.status2 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.march == 0 ? '-' : this.currentMonth <= 1 && item.march == 0 ? '未设置' :  item.march + (item.status3 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.april == 0 ? '-' : this.currentMonth <= 1 && item.april == 0 ? '未设置' :  item.april + (item.status4 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.may == 0 ? '-' : this.currentMonth <= 1 && item.may == 0 ? '未设置' :  item.may + (item.status5 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.june == 0 ? '-' : this.currentMonth <= 1 && item.june == 0 ? '未设置' :  item.june + (item.status6 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.july == 0 ? '-' : this.currentMonth <= 1 && item.july == 0 ? '未设置' :  item.july + (item.status7 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.august == 0 ? '-' : this.currentMonth <= 1 && item.august == 0 ? '未设置' :  item.august + (item.status8 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.september == 0 ? '-' : this.currentMonth <= 1 && item.september == 0 ? '未设置' :  item.september + (item.status9 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.october == 0 ? '-' : this.currentMonth <= 1 && item.october == 0 ? '未设置' :  item.october + (item.status10 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.november == 0 ? '-' : this.currentMonth <= 1 && item.november == 0 ? '未设置' :  item.november + (item.status11 == 1 ? '' : '\n未交'),
                                this.currentMonth > 1 && item.december == 0 ? '-' : this.currentMonth <= 1 && item.december == 0 ? '未设置' :  item.december + (item.status12 == 1 ? '' : '\n未交')
                            ]
                        })
                        // 调用我们封装好的方法进行导出Excel
                        excel.export_json_to_excel({
                            // 导出的头部
                            header: tHeader,
                            // 导出的内容
                            data,
                            // 导出的文件名称
                            filename: this.whereMap.deptName + "缴费详情",
                            // 导出的表格宽度是否自动
                            autoWidth: true,
                            // 导出文件的后缀类型
                            bookType: "xlsx",
                            cellStyle: {alignment: {vertical: 'middle', horizontal: 'center', wrapText: 1}},
                            headerStyle: {alignment: {horizontal: "center", vertical: "center"}},
                        })
                    });
                    this.$message.success("导出成功")
                })

            })

        }
    },
    mounted() {
        for (let i = 2024; i <= new Date().getFullYear(); i++) {
            this.yearsArray.push(String(i))
        }
    }
}
</script>

<style lang="less">
.warning-cell {
    background: oldlace;
}
</style>
