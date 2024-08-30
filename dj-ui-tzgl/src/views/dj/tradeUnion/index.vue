<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <trade-union-tree :refreshInit="refreshTreeInit" :refreshTradeId="refreshTradeId + ''" ref="organization_tree" @selectByTree="selectByTree"
                                  @getTradeUnionInfo="getTradeUnionInfo" @refreshInit="refreshTreeInit = false">
                </trade-union-tree>
            </template>
            <template v-slot:search>
                <div style="display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <div style="height: 20px;width: 5px;background: red"></div>
                        <div style="margin-left: 10px">工作机构</div>
                    </div>
                    <div>
                        <el-button plain size="small" @click="addTrade"
                                   style="background: #E4352B;color:#ffffff">新增下级机构
                        </el-button>
                        <el-button v-if="tradeUnionRole" plain size="small" @click="updateTrade"
                                   style="background: #E4352B;color:#ffffff">查看详情/编辑
                        </el-button>
                        <el-button v-if="tradeUnionRole" plain size="small" @click="deleteTrade"
                                   style="background: #E4352B;color:#ffffff">删除机构
                        </el-button>
                    </div>
                </div>
                <div style="margin-top:10px">
                    <el-table
                        ref="tableDate"
                        :data="baseTableData"
                        v-loading="tableLoading"
                        :show-header="false"
                        :row-style="{height: '20px'}"
                        :cell-style="cellClassName"
                        border
                        style="width: 100%">
                        <el-table-column prop="cell1"></el-table-column>
                        <el-table-column prop="cell2"></el-table-column>
                        <el-table-column prop="cell3">
                        </el-table-column>
                        <el-table-column prop="cell4">
                        </el-table-column>

                        <!-- <el-table-column min-width="200" align="center" fixed="right" width="330" label="操作">
                             <template slot-scope="scope">

                             </template>
                         </el-table-column>-->
                    </el-table>
                </div>
            </template>
            <template v-slot:table>

                <div style="background: #f5f7fa;height: 40px">
                    <!--<div style=" display: inline-block;height: 100%;background: #D8001B;text-align: center">-->
                    <div
                        style=" height: 100%;background: #D8001B;text-align: center;width: 80px;color:white;font-size:15px;font-weight: 500;display: flex;align-items: center">
                        <!--  <div style="display:flex;align-items: center">
                              <div style="font-size: 18px;color:white">工会活动</div>
                          </div>-->
                        <div style="text-align: center;margin:auto;">工会活动</div>

                    </div>
                </div>
                <div style="padding: 10px;box-shadow: 3px 3px 10px #888888;margin-top: 10px;">
                    <div style="padding-top: 10px;padding-bottom: 10px;text-align: left">
                        <el-button v-if="tradeUnionRole" plain size="small" @click="addActive"
                                   style="background: #E4352B;color:#ffffff;">新增工会活动
                        </el-button>
                    </div>

                    <el-table
                        ref="tableDate"
                        :data="tableDate"
                        v-loading="tableLoading"
                        strip
                        row-class-name="table-row"
                        :header-cell-style="{ 'text-align': 'center' ,  color : '#fffff' , background : '#eef1f6'}"
                        :row-style="{height: '10px'}"
                        :cell-style="{ 'text-align': 'center' , 'padding' : '5px 0px'}"
                        border
                        style="width: 100%">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="tradeName" label="所属工会"></el-table-column>
                        <el-table-column prop="activityName" label="活动名称"></el-table-column>
                        <el-table-column prop="tradeName" label="所属机构" width="200"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="160">
                            <template slot-scope="scope">
                                {{ scope.row.createTime ? formartDate(scope.row.createTime, 'yyyy-MM-dd') : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="updateActive(scope.row.id)">查看详情/编辑</el-button>
                                <el-button class="button-delete" size="mini" @click="deleteById(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-slot:pagination>
                <el-pagination
                    v-if="tableDate.length"
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
        <updateActive v-model="activeShow" :tradeName="tradeName" :tradeId="tradeId" :activeId="activeId"
                      :modeTitle="modeTitle" @close="close"></updateActive>
        <updateTrade v-model="tradeShow" :tradeName="tradeName" :parentId="tradeId" :modeTitle="modeTitle2"
                     @close="close2" @refresh="refresh2"></updateTrade>
    </div>
</template>

<script>
import treeAndTable from "@/components/TreeAndTable.vue";
import tradeUnionTree from '@/views/dj/components/tradeUnionTree'
import {getDictByType2} from "@/api/tDictData";
import {getTradeUnion, deleteTrade, determineNode} from "@/api/tzTradeUnion.js";
import {deleteTradeActive, queryTradeActiveList} from '@/api/tzTradeActive'
import updateActive from "./updateActive";
import updateTrade from "./updateTrade";
import {mapGetters} from "vuex";

export default {
    name: 'index',
    components: {
        treeAndTable,
        tradeUnionTree,
        updateActive,
        updateTrade
    },
    data() {
        return {
            idFromOrganization: '',
            title: '',
            formLabelWidth: '100px',
            deptId: '', // 查询党员总数带的组织id
            parentName: '',
            ids: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            tableDate: [],
            tableLoading: false,
            baseTableData: [],
            activeShow: false,
            tradeName: '',
            tradeId: null,
            tradeParentId: null,
            tradeDeptId: null,
            tradeDeptParentId: null,
            activeId: null,
            modeTitle: '',
            tradeShow: false,
            modeTitle2: '',
            tradeTypeList: [],
            statusShow: false,
            refreshTreeInit: false,
            refreshTradeId: null
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo',
            'tradeUnionRole'
        ]),
    },

    created() {
        document.title = "工会组织管理";
        this.getDict('tradeType')
        // this.queryTradeActiveList()
    },
    methods: {
        close() {
            this.activeShow = false
            this.queryTradeActiveList()
        },
        close2() {
            this.tradeShow = false
        },
        refresh2(id) {
            console.log(id)
            this.tradeId = id
            this.tradeShow = false
            this.refreshTradeId = this.tradeId
            this.refreshTreeInit = true
            this.getTradeUnionData()
            this.queryTradeActiveList()
        },
        cellClassName({row, column, rowIndex, columnIndex}) {
            if (columnIndex == 1 || columnIndex == 3) {
                return {'text-align': 'center', 'height': '60px', 'background': 'white'}
            } else {
                return {'text-align': 'center', 'height': '60px', 'background': '#F2F2F2'}
            }
        },
        addActive() {
            // if (this.statusShow) {
                this.modeTitle = '新增'
                this.activeShow = true
            // } else {
            //    this.$message.info("请选择下级机构")
            // }
        },
        addTrade() {
            this.modeTitle2 = '新增'
            this.tradeShow = true
        },
        updateTrade() {
            if (!this.tradeId == null) {
                this.$message.info('未选中要编辑的工会')
                return false
            }
            this.modeTitle2 = '编辑'
            this.tradeShow = true
        },
        deleteTrade() {
            if (this.tradeId == null) {
                this.$message.info('请选择要删除的工会')
                return false
            }
            this.$confirm('您确认要删除所点击选的工会吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                this.deleteTradeOk(this.tradeId)
            }).catch(() => {

            });
        },
        deleteTradeOk(id) {
            if (id == undefined || id == null) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteTrade(id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                    })
                    this.refreshTradeId = this.tradeParentId
                    this.refreshTreeInit = true
                    this.baseTableData = []
                    this.tableDate = []
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        updateActive(id) {
            this.activeShow = true
            this.activeId = id
            this.modeTitle = '编辑'
        },
        selectByTree(data) {
            this.tradeName = data.name
            this.tradeId = data.id
            this.tradeParentId = data.parentId
            this.tradeDeptId = data.deptId
            this.reset()
            /*let date = {
                id: data.whereMap.id + '',
                deptId: data.deptId + ''
            }
            determineNode(date).then(res => {
                if (!res.data.data) {
                    this.statusShow = false
                    return false
                } else {
                    this.statusShow = true
                    this.getTradeUnion(data.whereMap.id)
                }
            })*/
            this.getTradeUnionData()
            this.queryTradeActiveList()
        },
        getDict(type) {
            getDictByType2(type).then(res => {
                let data = res.data
                if (type === 'tradeType') {
                    this.tradeTypeList = data
                }
            })
        },
        getTradeUnionData() {
            this.baseTableData = []
            getTradeUnion(this.tradeId).then(res => {
                if (res.data.code == '00000') {
                    if(res.data.data){
                        let tmp = res.data.data
                        let type = ''
                        this.tradeTypeList.forEach(i => {
                            if (i.itemValue == tmp.type) {
                                type = i.label
                            }
                        })
                        let obj1 = {
                            cell1: '工会名称',
                            cell2: tmp.name,
                            cell3: '工会类型',
                            cell4: type
                        }
                        let obj2 = {
                            cell1: '工会负责人',
                            cell2: tmp.master,
                            cell3: '公司职务',
                            cell4: tmp.position
                        }
                        let obj3 = {
                            cell1: '工会人数',
                            cell2: tmp.personCount,
                            cell3: '联系电话',
                            cell4: tmp.phone
                        }
                        let obj4 = {
                            cell1: '所属部门',
                            cell2: tmp.jcxfSysDept && tmp.jcxfSysDept != null?tmp.jcxfSysDept.name: '-',

                        }
                        this.baseTableData.push(obj1, obj2, obj3, obj4)
                    }
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getTradeUnionInfo(data) {
            this.tradeName = data.name
            this.tradeId = data.id
            this.tradeParentId = data.parentId
            this.tradeDeptId = data.deptId
            this.getTradeUnionData()
            this.queryTradeActiveList()
        },
        deleteById(id) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                let ids = []
                ids.push(id)
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteTradeActive(ids).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                    })
                    this.queryTradeActiveList()
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
        },
        reset() {
            this.pageNum = 1
            this.pageSize = 10
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryTradeActiveList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryTradeActiveList()
        },
        queryTradeActiveList() {
            let data = {
                tzActive: {
                    tradeId: this.tradeId
                },
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            queryTradeActiveList({data: data}).then(res => {
                this.tableLoading = false
                const data = res.data.data
                this.tableDate = data.records
                this.total = data.total
            }).catch(e => {
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

.el-button.is-plain:focus, .el-button.is-plain:hover {
    border-color: red;
}

.button-success {
    border: 1px solid rgb(103, 194, 58);
    color: rgb(103, 194, 58);
}

.button-delete {
    border: 1px solid rgb(58, 144, 232);
    color: rgb(58, 144, 232);
}

.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}

.mod-sys-area {
    display: flex;

    .left-info {
        & > > > .el-date-editor--daterange.el-input,
        .el-date-editor--daterange.el-input__inner,
        .el-date-editor--timerange.el-input,
        .el-date-editor--timerange.el-input__inner,
        .el-cascader {
            width: 100%;
        }
    }

    .left-info {
        width: 30%;
        min-width: 320px;

        .price-unit-text {
            font-size: 14px;
            color: #666;
            margin-left: 15px;
        }

        .capital-int {
            & > > > .el-input__inner {
                padding-right: 0;
            }
        }
    }

    .search-bar {
        margin-top: 20px;
        background: transparent;
        margin-bottom: 15px;
        padding: 0;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .area-search-input {
        width: 30%;
    }

    .area-add-btn {
        float: right;
    }

    .right-info {
        width: calc(100% - 300px);
        padding-right: 10px;

        .business-license-box {
            .license-content {
                display: flex;

                & .single-image-upload {
                    height: 130px;

                    & > > > .el-upload-list--picture-card .el-upload-list__item {
                        width: 130px;
                        height: 130px;
                        margin: 0;
                    }
                }
            }
        }

        .id-box {
            .upload-content {
                .upload-img {
                    display: flex;

                    div {
                        &:nth-child(2) {
                            margin-left: 20px;
                        }
                    }

                    .disabled-upload {
                        & > > > .el-upload {
                            background: #f5f7fa;
                        }
                    }

                    & .single-image-upload {
                        height: 130px;

                        & > > > .el-upload-list--picture-card .el-upload-list__item {
                            width: 130px;
                            height: 130px;
                            margin: 0;
                        }
                    }
                }

                .upload-example {
                    display: flex;
                    // margin-top: 15px;
                    margin-left: 120px;

                    .example-box {
                        margin-left: 0;

                        &:nth-child(2) {
                            margin-left: 20px;
                        }
                    }
                }

                .upload-tips {
                    margin-left: 120px;
                }
            }
        }

        .img-static {
            display: block;
            width: 130px;
            height: 130px;
            cursor: pointer;
        }

        .img-static:not(:first-child) {
            margin-left: 20px;
        }

        // 示例框
        .example-box {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 130px;
            height: 130px;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            border-radius: 3px;
            box-sizing: border-box;
            margin-left: 20px;

            img {
                display: block;
                width: auto;
                max-width: 100%;
                height: auto;
                max-height: 100%;
            }

            .tips {
                position: absolute;
                left: -1px;
                bottom: 0;
                width: 130px;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                color: #fff;
                background: rgba(51, 51, 51, 0.5);
                text-align: center;
                border-radius: 0px 0px 3px 3px;
            }
        }

        .upload-tips {
            font-size: 12px;
            color: #999;
            height: 16px;
            line-height: 20px;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        // 图片上传框样式修改
        & > > > .el-upload {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 130px;
            height: 130px;
            background: #FFFFFF;
            border: 1px solid #EAEAEA;
            border-radius: 3px;
            box-sizing: border-box;

            img {
                width: 100%;
            }

            .el-icon-plus {
                font-size: 22px;
                color: #EAEAEA;
            }
        }

        // 背景图
        .bg-img {
            display: flex;
            justify-content: flex-start;

            .business-license-box {
                margin-right: 20px;

                .img-tips {
                    display: block;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    line-height: 1.5em;
                    margin-top: 8px;

                    p {
                        margin: 0;
                        padding: 0;
                    }
                }
            }
        }
    }
}
/deep/.el-table__empty-block{
    height: 40px !important;
}
</style>
