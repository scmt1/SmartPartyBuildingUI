<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree ref="organization_tree" @selectByTree="selectByTree" @getDeptId="getDeptId"
                                   @getDeptName="getDeptName" :loading="dataListLoading"
                                   :refreshInit="refreshTreeInit" :refreshTradeId="refreshTradeId + ''"
                                   @refreshInit="refreshTreeInit = false"></organization-tree>
            </template>
            <template v-slot:search>
                <el-form ref="searchForm" :model="whereMap" label-width="110px" inline size="medium"
                         style="text-align: left;">
                    <el-form-item prop="title" label="电话：">
                        <el-input clearable v-model="whereMap.phone" placeholder="输入电话" size="small"
                                  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="undoFlag" label="机构状态：">
                        <el-select clearable v-model="whereMap.undoFlag" placeholder="请选择" clearable size="small"
                                   style="width: 180px;">
                            <el-option label="已撤销" value=1></el-option>
                            <el-option label="未撤销" value=0></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="partyOrgType" label="单位类别：">
                        <el-select v-model="whereMap.partyOrgType" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item,index) in partyOrgTypeList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="organizationType" label="组织类型：" v-if="drop">
                        <el-select v-model="whereMap.organizationType" clearable placeholder="请选择" size="small"
                                   style="width: 180px;">
                            <el-option v-for="(item,index) in organizationTypeList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="veteran" label="是否退休支部：" v-if="drop">
                        <el-select v-model="whereMap.veteran" placeholder="请选择" clearable size="small"
                                   style="width: 180px;">
                            <el-option label="是" value=1></el-option>
                            <el-option label="否" value=0></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <a class="drop-down" @click="dropDown">
                            {{ dropDownContent }}
                            <i :class="dropDownIcon"></i>
                        </a>
                    </el-form-item>
                    <el-form-item style="margin-left: 20px;">
                        <el-button size="small" icon="el-icon-search"
                                   style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);"
                                   @click="ok">搜索
                        </el-button>
                        <el-button size="small" @click="reset()">重置
                        </el-button>

                        <el-button v-permission-notZb="selectDeptInfo" size="small" type="danger" plain
                                   icon="el-icon-plus" @click="addInfo">新增
                        </el-button>
                        <el-button size="small" type="danger" plain icon="el-icon-download" @click="exportProvinceData">
                            导出
                        </el-button>
                        <el-button size="small" type="danger" plain icon="el-icon-refresh" @click="refresh">刷新
                        </el-button>
                        <el-button @click="toIndex()" size="small" icon="el-icon-arrow-left" class="topBtn">返回
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:table>
                <el-table
                        ref="tableDate"
                        :data="tableDate"
                        v-loading="tableLoading"
                        strip
                        max-height="550"
                        row-class-name="table-row"
                        :header-cell-style="{ 'text-align': 'center', color: '#333' , background : '#eef1f6'}"
                        :row-style="{height: '10px'}"
                        :cell-style="{ 'text-align': 'center' , 'padding' : '10px 0px'}"
                        border
                        @selection-change="handleSelectionChange"
                        style="width: 100%"
                        :key="Math.random()">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="name" label="党组织名称" width="340" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="table-cell-con">
                                <span class="table-cell-text">{{ scope.row.name }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="组织类别" min-width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ convertFiled(scope.row.type, 'partyType') }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="partyNum" label="党员数" width="90"></el-table-column>-->
                    <!--                    <el-table-column prop="partyOrgType" label="单位类别" width="120">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            {{-->
                    <!--                                convertFiled(scope.row.partyOrgType, 'partyOrgType') ? convertFiled(scope.row.partyOrgType, 'partyOrgType') : '&#45;&#45;'-->
                    <!--                            }}-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column prop="organizationType" label="组织类型" width="150">
                        <template slot-scope="scope">
                            {{
                                convertFiled(scope.row.organizationType, 'organizationType') ? convertFiled(scope.row.organizationType, 'organizationType') : '&#45;&#45;'
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="partyOrgManager" label="党组织书记" width="120"></el-table-column>
                    <el-table-column prop="partyOrgContact" label="党组织联系人" width="120"></el-table-column>
                    <!--                    <el-table-column prop="phone" label="联系电话" width="140">-->
                    <!--                        <template slot-scope="scope">-->
                    <!--                            {{scope.row.phone ? hidePhoneNumber(scope.row.phone) : ""}}-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column min-width="200" align="center" fixed="right" width="330" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="auditHandle(scope.row.id, 1)">查看</el-button>
                            <el-button class="button-success" size="mini" @click="auditHandle(scope.row.id, 0)">编辑
                            </el-button>
                            <el-button class="button-delete" size="mini" @click="deleteById(scope.row.id)">删除
                            </el-button>
                            <el-button v-permission-contrast="scope.row.id" size="mini"
                                       @click="detailTerm(scope.row.id)">党组织换届
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
        <term-change v-model="termShow" :deptId="deptId" :modal-title="title" @close="closeTerm"></term-change>
        <addEditView ref="addEditViewRef" @changeOrganization="changeOrganization"></addEditView>
    </div>
</template>

<script>
import {treeDataTranslate} from '@/utils'
import treeAndTable from "@/components/TreeAndTable.vue";
import organizationTree from '@/views/dj/components/organizationTree'
import termChange from "@/views/dj/organization/termChange.vue";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {
    deleteTzSysDept,
    queryTzSysDeptList
} from "@/api/jcxfSysDept";
import addEditView from "./list-add-edit-new"

export default {
    name: 'organization',
    components: {
        organizationTree,
        termChange,
        treeAndTable,
        addEditView
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            idFromOrganization: '',
            title: '',
            termShow: false,
            formLabelWidth: '100px',
            deptId: '', // 查询党员总数带的组织id
            parentId: '0',
            parentName: '',
            ids: [],
            org2: [],
            organizationList: [],
            totalBase: '',
            dangweiNum: '',
            dangzongNum: '',
            dangzhiNum: '',
            unitdangzhi: '',
            timedangzhi: '',
            timeunitdangzhi: '',
            partyNum: '',
            nextNum: '',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                id: '',
                deptId: '',
                phone: '',
                undoFlag: '',
                veteran: '',
                partyOrgType: '',
                organizationType: ''
            },
            tableDate: [],
            dataListLoading: false,
            addOrUpdateVisible: false,
            name: '',
            props: {
                id: 'id',
                label: 'name',
                children: 'children'
            },
            dataList: [],
            partyOrgTypeList: [],
            organizationTypeList: [],
            unitOrgSituationList: [],
            partyOrgSituationList: [],
            partyOrgCreateTypeList: [],
            tableLoading: false,
            typeNameList: [],
            selectDeptInfo: {},
            refreshTreeInit: false,
            refreshTradeId: null,
        }
    },
    created() {
        this.getDict('partyOrgType')
        this.getDict('organizationType')
        this.getDict('partyOrgSituation')
        this.getDict('unitOrgSituation')
        this.getDict('partyOrgCreateType')
        this.getDict('partyType')

        this.beforeLoad()
    },
    watch: {
        name(val) {
            this.$refs.tree2.filter(val)
        }
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
        beforeLoad() {
            if (this.$route.query != null) {
                this.whereMap.deptId = this.$route.query.deptId;
                this.getDeptId()
            }
        },
        toIndex() {
            this.$router.push({
                path: '/dwgl/organization',
                query: {deptId: this.whereMap.deptId, deptName: this.deptName}
            })
        },
        closeTerm() {
            this.termShow = false
            // this.getDataById()
        },
        selectByTree(data) {
            this.parentId = data.whereMap.deptId
            this.parentName = data.whereMap.deptName
            this.selectDeptInfo = data.whereMap
            this.whereMap.deptId = data.whereMap.deptId
            this.pageSize = data.pageSize
            this.pageNum = data.pageNum
            this.getDataById()
        },
        detailTerm(id) {
            this.title = '党组织换届信息'
            this.deptId = id.toString()
            this.termShow = true
        },
        getDict(type) {
            getDictByCode(type).then(res => {
                let data = res.data.data

                if (type === 'partyOrgType') {
                    this.partyOrgTypeList = data
                } else if (type === 'organizationType') {
                    this.organizationTypeList = data
                } else if (type === 'partyOrgSituation') {
                    this.partyOrgSituationList = data
                } else if (type === 'unitOrgSituation') {
                    this.unitOrgSituationList = data
                } else if (type === 'partyOrgCreateType') {
                    this.partyOrgCreateTypeList = data
                } else if (type === 'partyType') {
                    this.typeNameList = data
                }
            })
        },
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'partyOrgType') {
                this.partyOrgTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'organizationType') {
                this.organizationTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'partyOrgSituation') {
                this.partyOrgSituationList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'unitOrgSituation') {
                this.unitOrgSituationList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'partyOrgCreateType') {
                this.partyOrgCreateTypeList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'partyType') {
                this.typeNameList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        getDeptName(e) {
            this.parentName = e
        },
        getDeptId(data) {
            this.selectDeptInfo = data
            if (this.$route.query.deptId && this.$route.query.deptId != null && this.$route.query.deptId != '') {
                this.whereMap.deptId = this.$route.query.deptId
                this.parentId = this.$route.query.deptId
            }

            this.getDataById()
        },
        exportProvinceData() {
            this.$confirm("是否确认导出当前页数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.exportUsers(this.tableDate)
            })
        },
        exportUsers(exportList) {
            import("@/vendor/Export2Excel").then((excel) => {
                // 设置导出表格的头部
                const tHeader = [
                    "序号",
                    "党组织名称",
                    "本届起始时间",
                    "本届届满时间",
                    "党员数",
                    "单位类别",
                    "组织类型",
                    "党组织所在单位情况",
                    "党组织书记",
                    "党组织联系人",
                    "联系电话",
                    "单位名称",
                    "单位建立党组织情况",
                    "党组织所在单位代码",
                    "组建方式",
                    "批准建立日期",
                    "地址"
                ]
                // 将要导出的数据进行一个过滤
                /**
                 * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                 */
                const data = exportList.map((item, index) => {
                    return [
                        index + 1,
                        item.name,
                        item.thisChangeTime,
                        item.thisFinishTime,
                        item.partyNum,
                        /*this.partyOrgTypeList.find(i => {
                            if (i.itemValue = item.partyOrgType) return i
                        }).label,
                        this.organizationTypeList.find(i => {
                            if (i.itemValue = item.organizationType) return i
                        }).label,
                        this.partyOrgSituationList.find(i => {
                            if (i.itemValue = item.partyOrgSituation) return i
                        }).label,*/
                        this.convertFiled(item.partyOrgType, 'partyOrgType'),
                        this.convertFiled(item.organizationType, 'organizationType'),
                        this.convertFiled(item.partyOrgSituation, 'partyOrgSituation'),
                        item.partyOrgManager,
                        item.partyOrgContact,
                        item.phone,
                        item.unitName,
                        this.convertFiled(item.unitOrgSituation, 'unitOrgSituation') ? this.convertFiled(item.unitOrgSituation, 'unitOrgSituation') : '&#45;&#45;',
                        item.unitCode,
                        this.convertFiled(item.partyOrgCreateType, 'partyOrgCreateType') ? this.convertFiled(item.partyOrgCreateType, 'partyOrgCreateType') : '&#45;&#45;',
                        this.formartDate(item.createDate, 'yyyy-MM-dd'),
                        item.address
                    ];
                });
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                    // 导出的头部
                    header: tHeader,
                    // 导出的内容
                    data,
                    // 导出的文件名称
                    filename: "组织结构" + this.formartDate(new Date(), 'yyyy-MM-dd'),
                    // 导出的表格宽度是否自动
                    autoWidth: true,
                    // 导出文件的后缀类型
                    bookType: "xlsx",
                })
            });
            this.$message.success("导出成功")
        },
        deleteById(id) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                type: 'warning'
            }).then(() => {
                this.deleteOk(id)
            }).catch(() => {

            });
        },
        deleteOk(id) {
            deleteTzSysDept(id + '').then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500,
                    })
                    this.getDataById()
                    this.refreshTradeId = id + ''
                    this.refreshTreeInit = true
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
        auditHandle(id, type) {
            // 查看
            if (type === 1) {
                this.id = id
                // this.addOrUpdateVisible = true
                // 路由跳转方式
                this.$router.push({
                    path: '/dwgl/organization/detail',
                    query: {id: id, type: 1}
                })
                // 编辑
            }else {
                this.$refs.addEditViewRef.openDialog(id, type)
            }

            // else if (type === 0) {
            //     this.id = id
            //     // this.addOrUpdateVisible = true
            //     // 路由跳转方式
            //     this.$router.push({
            //         path: '/dwgl/list-add-edit-new',
            //         query: {id: id, type: 0}
            //     })
            // }

        },
        addInfo() {
            this.$refs.addEditViewRef.openDialog('', 3, this.parentId, this.parentName)
            // this.$router.push({
            //     path: '/dwgl/list-add-edit-new',
            //     query: {
            //         parentId: this.parentId,
            //         type: 3,
            //         parentName: this.parentName
            //     }
            // })
        },
        ok() {
            this.pageSize = 10
            this.pageNumber = 1
            this.getDataById()
        },
        reset() {
            this.whereMap.phone = ''
            this.whereMap.undoFlag = ''
            this.whereMap.veteran = ''
            this.whereMap.partyOrgType = ''
            this.whereMap.organizationType = ''
            this.pageNum = 1
            this.pageSize = 10
            this.getDataById()
        },
        handleDelete(row) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                type: 'warning'
            }).then(() => {
                let ids = []
                if (row != null || row != undefined) {
                    ids.push(row)
                } else {
                    ids = this.ids
                }
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteAll() {
            if (this.ids == undefined || this.ids == null || this.ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            this.handleDelete()
        },
        refresh() {
            this.pageSize = 10
            this.pageNumber = 1
            this.getDataById()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getDataById()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getDataById()
        },
        handleSelectionChange(val, a, b) {
            let tmp = []
            val.forEach(i => {
                tmp.push(i.id)
            })
            this.ids = tmp
        },
        changeOrganization(){
            this.pageSize = 10
            this.pageNumber = 1
            this.getDataById()
        },
        getDataById() {
            this.dataListLoading = true
            let data = {
                tzSysDept: this.whereMap,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            data.tzSysDept.id = this.whereMap.deptId
            data.tzSysDept.parentId = this.whereMap.deptId
            this.getTzSysDeptList(data)
        },
        getTzSysDeptList(data) {
            this.tableLoading = true
            queryTzSysDeptList({data: data}).then(res => {
                this.tableLoading = false
                const data = res.data.data
                this.total = data.total
                this.tableDate = treeDataTranslate(data.records, 'id', 'pId')
                if (this.tableDate) {
                    this.partyNum = this.tableDate[0].partyNum
                }
            }).catch(e => {
                this.dataListLoading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
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
    padding: 0 10px 10px 0;
    box-sizing: border-box;
    width: 260px;
    display: inline-flex;
    align-items: center;

    .input-box {
        width: 150px;
    }

    .label {
        flex: 1;
        text-align: right;
    }
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

.flex-box {
    display: flex;
    justify-content: space-between;
}

</style>
