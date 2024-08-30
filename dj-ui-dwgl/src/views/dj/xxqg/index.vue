<template>
    <div style="background-color: white; padding: 15px;">
        <div style="text-align: left; margin-bottom: 10px;">
            <el-button size="small" icon="el-icon-upload2" type="danger" plain @click="downTemplate2()">数据导入
            </el-button>
        </div>

        <div>
            <el-table
                v-loading="dataListLoading"
                ref="multipleTable"
                :data="tableDataNow"
                border
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column label="序号" type="index" width="80"></el-table-column>
                <el-table-column prop="deptName" label="组织名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="memberCount" width="150" label="学员总数">
                </el-table-column>

                <el-table-column label="激活总数" prop="activationCount" width="150"></el-table-column>
                <el-table-column prop="activeCount" width="150" label="活跃学员">
                </el-table-column>
                <el-table-column prop="joinPercent" width="150" label="参与度">
                    <template slot-scope="scope">
                        {{ scope.row.joinPercent != null && scope.row.joinPercent != '' ? formatFloat(scope.row.joinPercent) + '%' : '0.00%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="activePercent" width="160" label="活跃学员参与度">
                    <template slot-scope="scope">
                        {{ scope.row.activePercent != null && scope.row.activePercent != '' ? formatFloat(scope.row.activePercent) + '%' : '0.00%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="totalScore" width="150" label="总获得积分">
                </el-table-column>
                <el-table-column prop="averageScore" width="150" label="人均积分">
                </el-table-column>
                <!--                <el-table-column prop="isPartyPercent" width="180" label="是否党员填写率">
                                    <template slot-scope="scope">
                                        {{scope.row.isPartyPercent !=null ?scope.row.isPartyPercent * 100 +'%' : '0%'}}
                                    </template>
                                </el-table-column>-->
                <!--  <el-table-column prop="playCount" width="" label="点击数"></el-table-column>
                  <el-table-column prop="likeCount" width="" label="点赞数"></el-table-column>
                  <el-table-column prop="collectCount" width="" label="收藏数"></el-table-column>-->
                <el-table-column prop="importTime" width="200" label="导入时间"></el-table-column>
            </el-table>
        </div>

        <div style="margin-top: 10px;">
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

        <importData v-model="show" :modalTitle="title" @close="close"></importData>
    </div>
</template>
<script>
import TreeAndTable from "@/components/TreeAndTable.vue"
import util from '@/libs/util.js'
import {downTemplate, queryByPage} from "@/api/tzXxqg";
import importData from "./importData.vue";
import {mapGetters} from "vuex";

export default {
    name: '',
    components: {
        importData
    },
    data() {
        return {
            one: 'cesjo',
            deptId: '',
            base: util.nginxUrl,
            content: '',
            detailShow: false,
            tmpId: null,
            ids: [],
            id: '',
            show: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            tableDataNow: [{}],
            parentName: '',
            parentId: '',
            isAdd: true,
            dataList: [],
            columnId: '0',
            title: '',
            dataListLoading: false,
            formLabelWidth: '200px',
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.deptId = this.deptInfo.id
        this.queryByPage()
    },
    methods: {
        queryByPage() {
            let data = {
                deptId: this.deptId,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            queryByPage({data: data}).then(res => {
                if (res.data.code == '00000') {
                    this.tableDataNow = res.data.data.records
                    this.total = res.data.data.total
                }
            })
        },
        downTemplate2() {
            this.show = true
            this.title = '数据导入'
            /*downTemplate().then(res => {
                // 将响应数据转化为Blob类型
                const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
                // 创建下载链接并模拟点击下载
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'provinces.xls'
                link.click()
                window.URL.revokeObjectURL(url)
            }).catch(error => {
                    console.error(error)
                })*/
        },
        downTemplate1() {
            let exportList = this.tableDataNow
            import("@/vendor/Export2Excel").then((excel) => {
                // 设置导出表格的头部
                const mergeHeaderTitle = '中共泸州市国资委委员会下级组织'; // 合并的表头标题
                const mergeHeaderRowNum = 2; // 合并的表头行数
                const tHeader = [
                    // 修改为第三行开始作为表头
                    this.one + '-1',
                    this.one + '-2',
                ];
                // 将要导出的数据进行一个过滤
                /**
                 * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                 */
                const data = exportList.map((item, index) => {
                    return [
                        index + 1,
                        item.deptName,
                    ];
                });
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                    // 导出的表格数据
                    header: tHeader,
                    data,
                    // 合并的表头信息
                    merges: [{
                        s: {r: 0, c: 0}, // 合并第一行第一列的单元格
                        e: {r: mergeHeaderRowNum - 1, c: 0} // 合并到第二行第一列
                    }, {
                        s: {r: 0, c: 1}, // 合并第一行第二列的单元格
                        e: {r: mergeHeaderRowNum - 1, c: tHeader.length - 1} // 合并到第二行最后一列
                    }],
                    // 导出的文件名称
                    filename: "数据统计",
                    // 导出的表格宽度是否自动
                    autoWidth: true,
                    // 导出文件的后缀类型
                    bookType: "xlsx",
                    // 重写表头部分
                    customize: function (wb) {
                        const ws = wb.getWorksheet(1);
                        const mergeHeaderRange = {
                            s: {r: 0, c: 0},
                            e: {r: mergeHeaderRowNum - 1, c: tHeader.length - 1}
                        };
                        const mergeHeaderCell = ws.getCell(mergeHeaderRange.s.r, mergeHeaderRange.s.c);
                        mergeHeaderCell.value = mergeHeaderTitle;
                        mergeHeaderCell.alignment = {vertical: 'middle', horizontal: 'center'};
                        ws.mergeCells(mergeHeaderRange.s.r, mergeHeaderRange.s.c, mergeHeaderRange.e.r, mergeHeaderRange.e.c);

                        // 设置第二行单元格合并
                        const mergeRowRange = {
                            s: {r: mergeHeaderRowNum, c: 0},
                            e: {r: mergeHeaderRowNum, c: tHeader.length - 1}
                        };
                        const mergeRowCell = ws.getCell(mergeRowRange.s.r, mergeRowRange.s.c);
                        mergeRowCell.value = '测试';
                        mergeRowCell.alignment = {vertical: 'middle', horizontal: 'center'};
                        ws.mergeCells(mergeRowRange.s.r, mergeRowRange.s.c, mergeRowRange.e.r, mergeRowRange.e.c);
                    }
                })
            });
        },
        downTemplate() {
            // 引入相关库
            this.tableDataNow = [{deptName: '某某组织'}]//测试数据
            this.one = '测试' //测试数据
            const XLSX = require('xlsx');
            const {export_json_to_excel} = require('@/vendor/Export2Excel');
            const tHeader = ['序号', '组织'];
            const multiHeader = [
                ["中共泸州市国资委委员会下级组织", ""], ["【数据说明】\n" +
                "1、以下数据的统计范围为该组织及管理的所有下级组织。\n" +
                "2、数据截止时间为昨日24:00，数据更新时间为每日07:00。\n" +
                "3、可在“本组织及下级-学情分析”页面最上方查看数据指", ""]
            ];

            // 将要导出的数据进行一个过滤
            const data = this.tableDataNow.map((item, index) => {
                return [1, item.deptName];
            });
            let merges = [
                "A1:I1", 'A2:I2'
            ];
            const headerStyle = {
                alignment: {horizontal: "center", vertical: "center"} // 设置水平和垂直方向居中
            };
            // 调用导出方法
            export_json_to_excel({
                multiHeader, // 这里是第一行的表头

                header: tHeader, // 这里是第三行的表头
                data,
                filename: "excelname",
                merges,
                headerStyle: headerStyle
                /*   customize: function (wb) {
                       // 重写表头部分
                       const ws = wb.getWorksheet(1);
                       const mergeHeaderRange = {
                           s: { r: 0, c: 0 },
                           e: { r: mergeHeaderRowNum - 1, c: tHeader.length - 1 }
                       };
                       const mergeHeaderCell = ws.getCell(mergeHeaderRange.s.r, mergeHeaderRange.s.c);
                       mergeHeaderCell.value = mergeHeaderTitle;
                       mergeHeaderCell.alignment = { vertical: 'middle', horizontal: 'center' };
                       ws.mergeCells(mergeHeaderRange.s.r, mergeHeaderRange.s.c, mergeHeaderRange.e.r, mergeHeaderRange.e.c);

                       // 设置第二行单元格合并
                       const mergeRowRange = {
                           s: { r: mergeHeaderRowNum, c: 0 },
                           e: { r: mergeHeaderRowNum, c: tHeader.length - 1 }
                       };
                       const mergeRowCell = ws.getCell(mergeRowRange.s.r, mergeRowRange.s.c);
                       // mergeRowCell.value = '测试';
                       // mergeRowCell.alignment = { vertical: 'middle', horizontal: 'center' };
                       // ws.mergeCells(mergeRowRange.s.r, mergeRowRange.s.c, mergeRowRange.e.r, mergeRowRange.e.c);

                       mergeRowCell.value ='天龙八部'; // 将单元格值更改为表头的第一个元素
                       mergeRowCell.alignment = { vertical: 'middle', horizontal: 'center' };
                       ws.mergeCells(mergeRowRange.s.r, mergeRowRange.s.c, mergeRowRange.e.r, mergeRowRange.e.c);
                   }*/
            });
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.ids = tmp
        },
        close() {
            this.show = false
            this.queryByPage()
        },
        closeDetail() {
            this.detailShow = false
        },

        handleSizeChange(val) {
            this.pageSize = val
            // this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            // this.getDataById()
        },
        reset() {

        },
        formatFloat(num) {
            let n = 2
            let a = num.toString().split('.')
            if (a.length === 2 && a[1].toString().length > 2) {
                n = a[1].toString().length - 2
            }

            num = num * 100

            let f = parseFloat(num)
            if (isNaN(f)) return false
            f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // floor 舍 round 四舍五入 ceil 入
            let s = f.toString()
            let rs = s.indexOf('.')
            //判定如果是整数，增加小数点再补0
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + n) {
                s += '0'
            }
            return s
        }
    }
}
</script>

<style lang="scss" scoped>
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}
</style>
