<template>
    <div class="deptPay">
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"></organization-tree>
            </template>
            <template v-slot:search>
                <div style="display: flex">
                    <el-form ref="searchForm" style="display:flex">
                        <el-date-picker
                                @change="changeDate"
                                :picker-options="pickerOptions0"
                                default-value
                                size="small"
                                v-model="whereMap.year"
                                type="year"
                                placeholder="选择日期"
                                format="yyyy"
                                value-format="yyyy"
                                :clearable="false"
                        >
                        </el-date-picker>
                    </el-form>
                    <el-button icon="el-icon-download" size="small" @click="handleExport()"
                               style="margin-left: 20px;background: rgba(228, 53, 43, 1);color:#ffffff;border-color: rgb(228, 53, 43);">
                        导出缴纳信息
                    </el-button>
                </div>
            </template>

            <template v-slot:table>
                <el-table
                        v-loading="dataListLoading"
                        :align="center"
                        :summary-method="getSummaries"
                        :row-class-name="tableRowClassName" @row-click="onRowClick"
                        ref="multipleTable"
                        :data="tableDataNow"
                        border
                        max-height="700"
                        :cell-style="{'text-align':'center'}"
                        :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column fixed="left" type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="deptName" label="组织名称" min-width="250" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="one" :label="one+'-01'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.one.actuallyPay || scope.row.one.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row, one+'-01')">
                                实缴：{{ scope.row.one.actuallyPay ? scope.row.one.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.one.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="two" :label="one+'-02'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.two.actuallyPay || scope.row.two.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row, one+'-02')">
                                实缴：{{ scope.row.two.actuallyPay ? scope.row.two.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.two.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="three" :label="one+'-03'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.three.actuallyPay || scope.row.three.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-03')">
                                实缴：{{ scope.row.three.actuallyPay ? scope.row.three.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.three.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="four" :label="one+'-04'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.four.actuallyPay || scope.row.four.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-04')">
                                实缴：{{ scope.row.four.actuallyPay ? scope.row.four.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.four.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="five" :label="one+'-05'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.five.actuallyPay || scope.row.five.actuallyPay=== 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-05')">
                                实缴：{{ scope.row.five.actuallyPay ? scope.row.five.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.five.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="six" :label="one+'-06'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.six.actuallyPay || scope.row.six.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-06')">
                                实缴：{{ scope.row.six.actuallyPay ? scope.row.six.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.six.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="seven" :label="one+'-07'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.seven.actuallyPay || scope.row.seven.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-07')">
                                实缴：{{ scope.row.seven.actuallyPay ? scope.row.seven.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.seven.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="eight" :label="one+'-08'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.eight.actuallyPay || scope.row.eight.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-08')">
                                实缴：{{ scope.row.eight.actuallyPay ? scope.row.eight.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.eight.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nine" :label="one+'-09'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.nine.actuallyPay || scope.row.nine.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-09')">
                                实缴：{{ scope.row.nine.actuallyPay ? scope.row.nine.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.nine.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ten" :label="one+'-10'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.ten.actuallyPay || scope.row.ten.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-10')">
                                实缴：{{ scope.row.ten.actuallyPay ? scope.row.ten.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.ten.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="eleven" :label="one+'-11'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.eleven.actuallyPay || scope.row.eleven.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-11')">
                                实缴：{{ scope.row.eleven.actuallyPay ? scope.row.eleven.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.eleven.shouldPay }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="twelve" :label="one+'-12'" min-width="120">
                        <template slot-scope="scope">
                            <a :class="!scope.row.twelve.actuallyPay || scope.row.twelve.actuallyPay === 0 ? '' : 'cells'"
                               @click="showDetail(scope.row,one+'-12')">
                                实缴：{{ scope.row.twelve.actuallyPay ? scope.row.twelve.actuallyPay : 0 }} <br/>
                                应缴：{{ scope.row.twelve.shouldPay }}
                            </a>
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
    </div>

</template>
<script>
import organizationTree from '@/views/dj/components/organizationTree'
import {queryFeeTotalByYear2, getDeptCount} from "@/api/jcxfPayFee";
import TreeAndTable from "@/components/TreeAndTable.vue";
import * as XLSX from 'xlsx';
import FileSaver from "file-saver";
import {mapGetters} from "vuex";

export default {
    name: 'deptPay',
    components: {
        organizationTree,
        TreeAndTable
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    data() {
        return {
            tmpYear: '',
            center: 'center',
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6//如果不包括今天。就是return time.getTime() > Date.now() - 24*3600*1000;
                }
            },
            one: this.formartDate(new Date(), 'yyyy'),
            searchForm: {
                payMonth: ''
            },
            display: false,
            total: 0,
            pageNum: 1,
            pageSize: 10,
            whereMap: {
                year: '',
                deptId: ''
            },
            dataListLoading: false,
            tableDataNow: [],  // 显示的数据
            formLabelWidth: '100px',
            // 加载状态
            loading: false,
            // 输入状态
            input: '',
            //删除项
            deleteItmes: [],
        }
    },
    created() {
        this.getdatetime()
        this.initTreeData()
    },
    methods: {
        //导出组局信息
        exportUsers(exportList) {
            import("@/vendor/Export2Excel").then((excel) => {
                // 设置导出表格的头部
                const tHeader = [
                    "序号",
                    "组织名称",
                    this.one + '-1',
                    this.one + '-2',
                    this.one + '-3',
                    this.one + '-4',
                    this.one + '-5',
                    this.one + '-6',
                    this.one + '-7',
                    this.one + '-8',
                    this.one + '-9',
                    this.one + '-10',
                    this.one + '-11',
                    this.one + '-12',
                ];
                // 将要导出的数据进行一个过滤
                /**
                 * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                 */
                const data = exportList.map((item, index) => {
                    return [
                        index + 1,
                        item.deptName,
                        this.getActuallyPayValue(item.one.actuallyPay) + '/' + item.one.shouldPay,
                        this.getActuallyPayValue(item.two.actuallyPay) + '/' + item.two.shouldPay,
                        this.getActuallyPayValue(item.three.actuallyPay) + '/' + item.three.shouldPay,
                        this.getActuallyPayValue(item.four.actuallyPay) + '/' + item.four.shouldPay,
                        this.getActuallyPayValue(item.five.actuallyPay) + '/' + item.five.shouldPay,
                        this.getActuallyPayValue(item.six.actuallyPay) + '/' + item.six.shouldPay,
                        this.getActuallyPayValue(item.seven.actuallyPay) + '/' + item.seven.shouldPay,
                        this.getActuallyPayValue(item.eight.actuallyPay) + '/' + item.eight.shouldPay,
                        this.getActuallyPayValue(item.nine.actuallyPay) + '/' + item.nine.shouldPay,
                        this.getActuallyPayValue(item.ten.actuallyPay) + '/' + item.ten.shouldPay,
                        this.getActuallyPayValue(item.eleven.actuallyPay) + '/' + item.eleven.shouldPay,
                        this.getActuallyPayValue(item.twelve.actuallyPay) + '/' + item.twelve.shouldPay
                    ];
                });
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                    // 导出的头部
                    header: tHeader,
                    // 导出的内容
                    data,
                    // 导出的文件名称
                    filename: "数据统计" + this.formartDate(new Date(), 'yyyy-MM-dd'),
                    // 导出的表格宽度是否自动
                    autoWidth: true,
                    // 导出文件的后缀类型
                    bookType: "xlsx",
                })
            });
        },
        getActuallyPayValue(item) {
            if (item) {
                return item
            } else {
                return 0
            }
        },
        handleExport() {
            this.$confirm("是否确认导出当前数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.exportUsers(this.tableDataNow);
                this.$message.success("导出成功");
            }).catch((err) => {
                this.$message.warning("取消导出");
            });

        },


        exportBtn() {
            // 获取表格元素
            const els = this.$refs.multipleTable;
            debugger
            // 文件名
            const filename = "核销订单.xlsx";
            const wb = XLSX.utils.table_to_book(els);
            const wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "array",
            });
            try {
                FileSaver.saveAs(
                        new Blob([wbout], {type: "application/octet-stream"}),
                        filename
                );
            } catch (e) {

            }
            return wbout;
        },
        handleDownload() {
            var header = [1, 2, 3]
            var filterVal = ['a', 'b', 'c']
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
                debugger
                const list = this.tableDataNow
                const data = this.formatJson(filterVal, list)
                excel.export_json_to_excel({
                    header: header,
                    data,
                    filename: '报名列表 - ',
                    autoWidth: true,
                    bookType: 'xlsx'
                })
                this.downloadLoading = false
            })


        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {

                if (j === 'a') {
                    return v.one
                } else if (j === 'b') {
                    return v.two
                }
                return v[j]
            }))
        },

        formatData(list) {
            // map是用来替换导出的Excel表格的头部标题
            const map = {
                'id': '编号',
                'password': '密码',
                'mobile': '手机号',
                'username': '姓名',
                'timeOfEntry': '入职日期',
                'formOfEmployment': '聘用形式',
                'correctionTime': '转正日期',
                'workNumber': '工号',
                'departmentName': '部门',
                'staffPhoto': '头像地址'
            }
            let data = []
            let header = []
            // 确认可以找到元素
            const one = list[0]
            //如果找不到元素，说明数组中没有数据，直接退出
            if (!one) {
                return {header, data}
            }
            //将原数据中的键全部替换成map中的汉字然后添加到header数组中
            header = Object.keys(one).map(key => {
                return map[key]
            })
            // data把list中每一个对象转成 对应的value数组
            data = list.map(obj => {
                // 把  Obj['formOfEmployment']: 1 , 2   替换成 '正式'， '非正式'
                const key = obj['formOfEmployment']
                let hireTypEnmu = {1: '正式', '2': '非正式'}
                obj['formOfEmployment'] = hireTypEnmu[key]
                return Object.values(obj)
            })

            return {header, data}
        },
        // excel导出
        hExport() {
            // Export2Exce 是按需导入，点点击导出的时候才引入此文件
            import('@/vendor/Export2Excel').then(async excel => {
                // 发ajax请求，获取数据
                // const res = await getEmployee(this.page, this.size)
                //将后端返回的数据存入到list数组中
                const list = this.tableDataNow
                //将获得的数据传入到上面的函数中做处理
                const {header, data} = this.formatData(list)
                // excel表示导入的模块对象
                excel.export_json_to_excel({
                    header: header, // 表头 必填
                    data: data, // 具体数据 必填
                    filename: 'excel-list', // 文件名称
                    autoWidth: true, // 宽度是否自适应
                    bookType: 'xlsx' // 生成的文件类型
                })
            })
            //导出完成
        },


        exportDetail() {
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'ios-loading',
                                size: 18
                            }
                        }),
                        h('div', '数据导出中...')
                    ])
                }
            })
            let data = this.whereMap
            data.deptId = this.whereMap.deptId
            this.$http({
                url: this.$http.adornUrl('/multi/tzPayFee/downloadFeeTotalByYear'),
                method: 'get',
                params: this.$http.adornParams(data),
                // data:params,
                responseType: 'blob', // 解决文件下载乱码问题
            }).then(({data}) => {
                let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
                const fileName = this.$i18n.t(this.whereMap.year + '党费缴纳情况')
                const elink = document.createElement('a')
                if ('download' in elink) {
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    navigator.msSaveBlob(blob, fileName)
                }
                this.$message({
                    message: this.$i18n.t('导出成功'),
                    type: 'success',
                    //duration: 1500
                })
            }).catch(function (error) {
            }).finally(() => {
                this.$Spin.hide()
            })
        },
        selectByTree(data) {
            this.reset()
            this.whereMap.deptId = data.whereMap.deptId ?  data.whereMap.deptId : this.deptInfo.id
            this.pageNum = 1
            this.getDeptCount()
        },

        getSummaries(param) {
            const {columns, data} = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                    }, 0)
                    // sums[index] += ' 元';
                } else {
                    sums[index] = 'N/A'
                }
            })

            return sums

        },
        getdatetime() {
            var tmp = new Date()
            this.whereMap.year = this.formartDate(tmp, 'yyyy')
        },
        changeDate(e) {
            this.one = e
            this.getDeptCount()
        },
        reset() {
            this.whereMap = {
                deptId: this.deptId,
                year: this.formartDate(new Date(), 'yyyy')
            }
        },
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.getDeptCount()
        },
        initTreeData() {
            this.loading = true
        },
        //获取部门数量
        getDeptCount() {
            let data = {
                deptId: this.whereMap.deptId + ''
            }
            getDeptCount({data: data}).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.total = data.data
                    this.getDataById()
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
        // 获取分页信息
        getDataById() {
            this.dataListLoading = true

            let data2 = {
                deptId: this.whereMap.deptId + '',
                year: this.whereMap.year + '',
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            queryFeeTotalByYear2({data: data2}).then(res => {
                this.dataListLoading = false
                const data = res.data
                if (data.code == '00000') {
                    this.tableDataNow = data.data
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        onRowClick(row) {
            this.deleteItmes.push(row.row_index)
        },
        partyMemberReceive() {
            this.$router.push({path: 'receive'})
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
            var obj = {
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
            var week = ['天', '一', '二', '三', '四', '五', '六']
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
        showDetail(row, payMonth) {
            if(row.deptName == '合计') {
                return
            }
            this.$router.push({
                path: 'payFeeDetail',
                query: {
                    deptId: row.deptId,
                    payMonth: payMonth
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
/deep/ .el-table {
    display: flex;
    flex-direction: column;
}


//order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方
/deep/ .el-table__body-wrapper {
    order: 1;
}

.amount {
    color: #31708f;
    font-size: 15px;
    margin-left: 20px;
    margin-right: 100px;
    margin-top: 20px;
}

.search {
    width: 92%;
    //margin-left: 20px;
    margin-top: 10px;
}

.tree {
    margin-left: 20px;
    margin-top: 20px;
}

.cells {
    color: red;
}

.deptPay::-webkit-scrollbar {
    width: 0;
}

</style>
