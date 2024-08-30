<template>
    <el-dialog title="提交记录" :visible.sync="dialogVisible" width="80%" @close="close(false)">

        <el-form ref="searchForm" :model="search" label-width="90px" inline size="medium" style="text-align: left;">
            <el-form-item prop="tableType" label="类型：">
                <el-select v-model="search.tableType" placeholder="请选择" size="small"
                           style="width: 200px;" @change="twoBestOneFirstTableTypeChange">
                    <el-option v-for="(item,index) in twoBestOneFirstTable" :key="index" :label="item.label"
                               :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="commendType" label="表彰/表扬：">
                <el-select v-model="search.commendType" placeholder="请选择" size="small" clearable
                           style="width: 200px;">
                    <el-option v-for="(item,index) in commendTypeList" :key="index" :label="item.label"
                               :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="status" label="审核状态：">
                <el-select v-model="search.status" placeholder="请选择" size="small" clearable>
                    <el-option v-for="(item,index) in twoBestOneFirstStatusList" :key="index" :label="item.label"
                               :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提交时间：" v-if="drop">
                <el-date-picker v-model="dateRange" type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <a class="drop-down" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </a>
                <el-button size="small" @click="ok" icon="el-icon-search" style="background: rgba(228, 53, 43, 1);color:#ffffff">搜索</el-button>
                <el-button size="small" @click="resetForm('searchForm')" icon="el-icon-refresh-left" style="background: #ffffff;color: rgba(228, 53, 43, 1);border: 1px solid rgba(228, 53, 43, 1);">重置</el-button>
                <el-button size="small" type="danger" plain icon="el-icon-download" @click="exportProvinceData">导出勾选</el-button>
            </el-form-item>
        </el-form>
        <el-table
            v-if="search.tableType == '1' || search.tableType == '2'"
            v-loading="dataListLoading"
            ref="multipleTable"
            :data="tableDataNow"
            border
            :cell-style="{'text-align':'center'}"
            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            style="width: 100%"
            :key="Math.random()">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="申请批次" width="140" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.timeInfo && scope.row.timeInfo !=null?scope.row.timeInfo.title: ''  }}
                </template>
            </el-table-column>
            <el-table-column label="姓名" width="100">
                <template slot-scope="scope">
                    {{ scope.row.partyMember?scope.row.partyMember.realName:'' }}
                </template>
            </el-table-column>
            <el-table-column label="性别" width="50">
                <template slot-scope="scope">
                    {{ scope.row.partyMember?findTitleByValue(scope.row.partyMember.sex, sexList):'' }}
                </template>
            </el-table-column>
            <el-table-column label="民族" width="80">
                <template slot-scope="scope">
                    {{ scope.row.partyMember?findTitleByValue(scope.row.partyMember.national, nationList):'' }}
                </template>
            </el-table-column>
            <el-table-column label="出生年月" prop="" width="120">
                <template slot-scope="scope">
                    {{ scope.row.partyMember?formartDate(scope.row.partyMember.birthday, 'yyyy-MM-dd'):'' }}
                </template>
            </el-table-column>
            <el-table-column label="学历" prop="" width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.partyMember?findTitleByValue(scope.row.partyMember.education, educationList):'' }}
                </template>
            </el-table-column>
            <el-table-column label="工作单位" width="240" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.tzSysDept?scope.row.tzSysDept.name:'' }}
                </template>
            </el-table-column>
<!--            <el-table-column label="职务-职称" width="120">-->
<!--                <template slot-scope="scope">-->
<!--                    {{ scope.row.partyMember?findTitleByValue(scope.row.partyMember.position, positionList ):'无' }} - -->
<!--                    {{ scope.row.partyMember?scope.row.partyMember.professional:'无' }}-->
<!--                </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="简要事迹">-->
<!--                <template slot-scope="scope">-->
<!--                    <template v-if="scope.row.mainDeed.length < 30">-->
<!--                        {{ scope.row.mainDeed }}-->
<!--                    </template>-->
<!--                    <template v-else>-->
<!--                        {{ scope.row.mainDeed.substring(0, 30) + '...' }}-->
<!--                    </template>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column label="审核状态" width="120">
                <template slot-scope="scope">
                    {{ findTitleByValue(scope.row.status, twoBestOneFirstStatusList) }}
                </template>
            </el-table-column>
<!--            <el-table-column label="表彰/表扬" width="120">-->
<!--                <template slot-scope="scope">-->
<!--                    {{ findTitleByValue(scope.row.commendType, commendTypeList) }}-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column label="提交时间" prop="updateTime" width="160"></el-table-column>
            <el-table-column label="操作" fixed="right" width="260">
                <template slot-scope="scope">
                    <el-button size="mini" class="button button-blue" @click="handDetail(scope.row.id)">详情/审核</el-button>
                    <template v-if="['2', '4', '6'].indexOf(scope.row.status) < 0">
                        <el-button :disabled="!isAddTime" v-permission-contrast="scope.row.createDeptId" size="mini" class="button button-blue" @click="handleEdit(scope.row.id)">编辑</el-button>
                    </template>
                    <el-popconfirm v-permission-contrast="scope.row.createDeptId" title="确定要删除吗？" @confirm="handleDelete(scope.row.id)">
                        <el-button slot="reference" size="mini" class="button button-red">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-table
            v-if="search.tableType == '3'"
            v-loading="dataListLoading"
            ref="multipleTable"
            :data="tableDataNow"
            border
            :cell-style="{'text-align':'center'}"
            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            style="width: 100%"
            :key="Math.random()">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="申请批次" width="120">
                <template slot-scope="scope">
                    {{ scope.row.timeInfo && scope.row.timeInfo !=null?scope.row.timeInfo.title: ''  }}
                </template>
            </el-table-column>
            <el-table-column label="先进基层党组织" width="240" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.tzSysDept?scope.row.tzSysDept.name:'' }}
                </template>
            </el-table-column>
<!--            <el-table-column label="党员人数" width="90">-->
<!--                <template slot-scope="scope">-->
<!--                    {{ scope.row.tzSysDept?scope.row.tzSysDept.partyMemberTotal:0 }}-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column label="党组织负责人" width="140">
                <template slot-scope="scope">
                    {{ scope.row.partyMember?scope.row.partyMember.realName: '' }}
                </template>
            </el-table-column>
            <el-table-column label="党组织负责人电话" width="140">
                <template slot-scope="scope">
                    {{ scope.row.partyMember?scope.row.partyMember.phone:'' }}
                </template>
            </el-table-column>
            <el-table-column label="简要事迹">
                <template slot-scope="scope">
                    <template v-if="scope.row.mainDeed.length < 30">
                        {{ scope.row.mainDeed }}
                    </template>
                    <template v-else>
                        {{ scope.row.mainDeed.substring(0, 30) + '...' }}
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" width="120">
                <template slot-scope="scope">
                    {{ findTitleByValue(scope.row.status, twoBestOneFirstStatusList) }}
                </template>
            </el-table-column>
            <el-table-column label="表彰/表扬" width="120">
                <template slot-scope="scope">
                    {{ findTitleByValue(scope.row.commendType, commendTypeList) }}
                </template>
            </el-table-column>
            <el-table-column label="提交时间" prop="updateTime" width="160"></el-table-column>
            <el-table-column label="操作" fixed="right" width="260">
                <template slot-scope="scope">
                    <el-button size="mini" class="button button-blue" @click="handDetail(scope.row.id)">详情/审核</el-button>
                    <template v-if="['2', '4', '6'].indexOf(scope.row.status) < 0">
                        <el-button v-permission-contrast="scope.row.createDeptId" size="mini" class="button button-blue" @click="handleEdit(scope.row.id)">编辑</el-button>
                    </template>
                    <el-popconfirm v-permission-contrast="scope.row.createDeptId" title="确定要删除吗？" @confirm="handleDelete(scope.row.id)">
                        <el-button slot="reference" size="mini" class="button button-red">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 10px;"
            v-if="tableDataNow!=null&&tableDataNow.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <edit ref="edit" :value="editShow" :id="selectId" :deptId="deptId" @close="editShow = false" @refresh="refresh"></edit>
        <detail :value="detailShow" :id="selectId" @close="detailShow = false"></detail>

    </el-dialog>
</template>

<script>
import OrganizationTree from "@/views/dj/components/organizationTree.vue";
import TreeAndTable from "@/components/TreeAndTable.vue";
import {queryTzTwoBestOneFirstPage, deleteTzTwoBestOneFirstById} from "@/api/tzTwoBestOneFirst";
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {getIsAddTime} from "@/api/tzTwoBestOneFirstTime";
import Edit from "./edit.vue";
import Detail from "./detail.vue"
import {mapGetters} from "vuex";

export default {
    name: "index",
    components: {
        Edit,
        OrganizationTree,
        TreeAndTable,
        Detail
    },
    props: {
        timeId: {
            default: null,
        },
        show: {
            default: null,
        },
        deptId: {
            default: null
        },
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            dialogVisible: false,
            editShow: false,
            detailShow: false,
            selectDeptId: null,
            auditStatus: '',
            selectId: '',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataListLoading: false,
            tableDataNow: [],
            search: {
                tableType: '',
                commendType: '',
                status: '',
                upStartTime: null,
                upEndTime: null,
                timeId: null
            },
            twoBestOneFirstTable: [],
            sexList: [{'label': '男', 'itemValue': 1}, {'label': '女', 'itemValue': 2}],
            nationList: [],
            educationList: [],
            positionList: [],
            twoBestOneFirstStatusList: [],
            commendTypeList: [],
            isAddTime: false,
            selectItem: [],
            dateRange:[],
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    watch: {
        show() {
            this.dialogVisible = this.show
            this.search.timeId = this.timeId
            if (this.show) {
                this.init()
            }
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
        resetForm (formName) {
            this.search.commendType = ''
            this.search.status = ''
            this.dateRange = []
        },
        async init() {
            this.tableDataNow = []
            await this.getDict('twoBestOneFirstTable')
            await this.getDict2('nation')
            await this.getDict2('education')
            await this.getDict2('position')
            await this.getDict('twoBestOneFirstStatus')
            await this.getDict('twoBestOneFirstCommend')

            getIsAddTime({deptId: this.deptInfo.id + '' }).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.isAddTime = data.data
                }
            })

            this.selectDeptId = this.deptInfo.id + ''
            this.queryPage()
        },
        close() {
            this.reset()
            this.$emit('close')
        },
        handleSelectionChange(item) {
            this.selectItem = item
        },
        exportProvinceData() {
            if (this.selectItem.length == 0) {
                this.$message.info('请选择数据')
                return
            }
            this.$confirm("是否确认导出当选中数据?", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.exportUsers(this.selectItem)
            })
        },
        exportUsers(exportList) {
            import("@/vendor/Export2Excel").then((excel) => {
                // 设置导出表格的头部
                let tHeader = []
                if (this.search.tableType == '1' || this.search.tableType == '2') {
                    tHeader = [
                        "序号",
                        "姓名",
                        "性别",
                        "民族",
                        "出生年月",
                        "学历",
                        "工作单位",
                        "职务-职称",
                        "简要事迹"
                    ]
                } else if (this.search.tableType == '3') {
                    tHeader = [
                        "序号",
                        "先进基层党组织",
                        "党员人数",
                        "党组织负责人",
                        "党组织负责人电话",
                        "简要事迹"
                    ]
                }

                // 将要导出的数据进行一个过滤
                /**
                 * 源数据导入到excel的数据每一条重新拼成一个数组,数组里的每个元素就是filterVal里的每个字段
                 */
                const data = exportList.map((item, index) => {
                    let mainDeed = ''
                    if (item.mainDeed.length < 30) {
                        mainDeed = item.mainDeed
                    } else {
                        mainDeed = mainDeed.substring(0, 30) + '...'
                    }
                    if (this.search.tableType == '1' || this.search.tableType == '2') {
                        return [
                            index + 1,
                            item.partyMember.realName,
                            this.findTitleByValue(item.partyMember.sex, this.sexList),
                            this.findTitleByValue(item.partyMember.national, this.nationList),
                            this.formartDate(item.partyMember.birthday, 'yyyy-MM-dd'),
                            this.findTitleByValue(item.partyMember.education, this.educationList),
                            item.tzSysDept.name,
                            this.findTitleByValue(item.partyMember.position, this.positionList) + ' - ' + item.partyMember.professional,
                            mainDeed
                        ]
                    } else if (this.search.tableType == '3') {
                        return [
                            index + 1,
                            item.tzSysDept.name,
                            item.tzSysDept.partyMemberTotal,
                            item.partyMember.realName,
                            item.partyMember.phone,
                            mainDeed
                        ]
                    }
                })
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                    // 导出的头部
                    header: tHeader,
                    // 导出的内容
                    data,
                    // 导出的文件名称
                    filename: this.findTitleByValue(this.search.tableType, this.twoBestOneFirstTable) + this.formartDate(new Date(), 'yyyy-MM-dd'),
                    // 导出的表格宽度是否自动
                    autoWidth: true,
                    // 导出文件的后缀类型
                    bookType: "xlsx"
                })
            });
            this.$message.success("导出成功")
        },
        refresh() {
            this.editShow = false
            this.detailShow = false
            this.queryPage()
        },
        twoBestOneFirstTableTypeChange() {
            this.pageNum = 1
            this.queryPage()
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByType2(type).then((res) => {
                    let data = res.data
                    if (type === 'twoBestOneFirstTable') {
                        this.twoBestOneFirstTable = data
                        this.search.tableType = data[0].itemValue
                    } else if (type === 'twoBestOneFirstStatus') {
                        this.twoBestOneFirstStatusList = data
                    } else if (type === 'twoBestOneFirstCommend') {
                        this.commendTypeList = data
                    }
                    resolve()
                })
            })

        },
        getDict2(type) {
            return new Promise((resolve, reject) => {
                getDictByCode(type).then(res => {
                    let data = res.data.data
                    if (type === 'nation') {
                        this.nationList = data
                    } else if (type === 'education') {
                        this.educationList = data
                    } else if (type === 'position') {
                        this.positionList = data
                    }
                    resolve()
                })
            })
        },
        reset() {
            this.pageNum = 1

            this.search.tableType = '1'
            this.search.commendType = ''
            this.search.status = ''
            this.search.upStartTime = null
            this.search.upEndTime = null
        },
        ok() {
            this.pageNum = 1
            this.queryPage()
        },
        addInfo() {
            this.selectId = null
            this.editShow = true
        },
        handDetail(id) {
            this.selectId = id
            this.detailShow = true
        },
        handleEdit(id) {
            this.selectId = id
            this.editShow = true
        },
        handleDelete(id) {
            this.$confirm('您确认要删除所点击选的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                if (id != null || id != undefined) {
                    deleteTzTwoBestOneFirstById(id + '').then(res => {
                        this.$Modal.remove()
                        let data = res.data
                        if (data.code == '00000') {
                            this.queryPage()
                            this.$message.success('删除成功')
                        }
                    })
                }
            }).catch(() => {

            });
        },
        queryPage() {
            this.dataListLoading = true
            let data = {
                onlyThisDept: true,
                deptId: this.selectDeptId + '',
                upStartTime: this.dateRange === null ? null : this.dateRange[0],
                upEndTime: this.dateRange === null ? null : this.dateRange[1],
                tzTwoBestOneFirst: {
                    tableType: this.search.tableType,
                    status: this.search.status,
                    commendType: this.search.commendType,
                    timeId: this.search.timeId
                },
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            if (data.upStartTime && data.upStartTime != '') {
                data.upStartTime = this.formartDate(data.upStartTime, "yyyy-MM-dd") + " 00:00:00"
            }
            if (data.upEndTime && data.upEndTime != '') {
                data.upEndTime = this.formartDate(data.upEndTime, "yyyy-MM-dd") + " 23:59:59"
            }

            queryTzTwoBestOneFirstPage({data: data}).then(res => {
                this.dataListLoading = false
                let data = res.data
                if (data.code == '00000') {
                    for (let i = 0; i < data.data.records.length; i++) {
                        data.data.records[i].tzSysDept = JSON.parse(data.data.records[i].deptInfo)
                        data.data.records[i].partyMember = JSON.parse(data.data.records[i].partyMemberInfo)
                    }
                    this.tableDataNow = data.data.records
                    this.total = data.data.total
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryPage()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.queryPage()
        },
        findTitleByValue(value, dic) {
            const data = dic.find(i => {
                if (i.itemValue == value) {
                    return i
                }
            })

            if (data && data.label) {
                return data.label
            }
            return '无'
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

<style lang="scss" scoped>
.search-div {
    display: inline-block;
    padding: 0 10px 10px 0;
}
.button {
    margin: 4px;
}

.button-green {
    border: 1px solid rgb(103, 194, 58);
    color: rgb(103, 194, 58);
}

.button-blue {
    border: 1px solid rgb(58, 144, 232);
    color: rgb(58, 144, 232);
}

.button-red {
    border: 1px solid red;
    color: red;
}

.flex-box {
    display: flex;
    justify-content: space-between;
}
</style>
