<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree ref="organization_tree" @selectByTree="selectByTree" @getDeptId="getDeptId"
                ></organization-tree>
            </template>
            <template v-slot:search>
                <div class="search-div">
                    <div class="label">
                        届次(及以上)：
                    </div>
                    <div class="input-box">
                        <el-input type="number" v-model="search.teamSession" placeholder="请输入届次" size="small"></el-input>
                    </div>
                </div>

                <div class="search-div" v-if="!isZb">
                    <div class="label">
                        是否完成换届：
                    </div>
                    <div class="input-box">
                        <el-select clearable v-model="search.accomplishBranchReelection" placeholder="请选择"
                                   size="small">
                            <el-option label="已换届" :value="'1'"></el-option>
                            <el-option label="未换届" :value="'2'"></el-option>
                            <el-option label="超过换届时间" :value="'3'"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="search-div" v-if="!isZb" style="width: 300px">
                    <div class="label">
                        换届剩余月数(及以内)：
                    </div>
                    <div class="input-box">
                        <el-input type="number" v-model="search.monthNum" placeholder="请输入月数"
                                  size="small"></el-input>
                    </div>
                </div>

                <el-button size="small" @click="searchData()" icon="el-icon-search"
                           style="background:  rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);">
                    搜索
                </el-button>
                <el-button size="small" type="danger" plain icon="el-icon-refresh"
                           @click="refresh">刷新
                </el-button>
                <el-button v-if="!isZb" size="small" type="danger" plain
                           @click="handDetail2('')">党组织换届信息
                </el-button>
                <el-button v-else size="small" type="danger" plain
                           @click="addInfo()" icon="el-icon-plus">新增
                </el-button>

                <div class="head">
                    <span class="amount">
                        <span class="red-text">{{ statistics.count1 }}</span>
                        <br>
                        <span class="black-text">已完成换届</span>
                        <span class="line"></span>
                    </span>
                    <span class="amount">
                        <span class="red-text">
                            {{ statistics.count2 }}
                        </span>
                        <br>
                        <span class="black-text">
                            未换届
                        </span>
                        <span class="line"></span>
                    </span>
                    <span class="amount">
                        <span class="red-text">{{ statistics.count3 }}</span>
                        <br>
                        <span class="black-text">超过换届时间</span>
                    </span>
                </div>
            </template>

            <template v-slot:table>
                <div style="font-size: 20px;background-color: #fff;margin-bottom:10px" v-if="tipContent!=''">
                    <div
                            style="width: 100%;margin-top: 10px;border-radius: 5px;background-color: #d9edf7;;padding:10px;color: red">
                        {{ tipContent }}
                    </div>
                </div>

                <template v-if="isZb">
                    <el-table
                            v-loading="tableLoading"
                            ref="multipleTable"
                            :data="tableDataNow"
                            border
                            max-height="600"
                            :cell-style="{'text-align':'center'}"
                            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :key="Math.random()">
                        <el-table-column prop="teamSession" label="班子届次" width="110"></el-table-column>
                        <el-table-column prop="lastSessionFinishTime" label="上届换届时间" width="130">
                            <template slot-scope="scope">
                                {{ formartDate(scope.row.lastSessionFinishTime, 'yyyy-MM-dd') }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="thisSessionStartTime" label="本届起始时间" width="130">
                            <template slot-scope="scope">
                                {{ formartDate(scope.row.thisSessionStartTime, 'yyyy-MM-dd') }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="thisSessionFinishTime" label="本届届满时间" width="130">
                            <template slot-scope="scope">
                                {{ formartDate(scope.row.thisSessionFinishTime, 'yyyy-MM-dd') }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="voteType" label="选举方式" width="120">
                            <template slot-scope="scope">
                                {{
                                    convertFiled(scope.row.voteType, electTypeList) ? convertFiled(scope.row.voteType, electTypeList) : '&#45;&#45;'
                                }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" label="记录添加时间"></el-table-column>
                        <el-table-column prop="createDate" label="最后一次编辑时间"></el-table-column>
                        <el-table-column label="操作" fixed="right" width="230">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handDetail(scope.row.id)">详情</el-button>
                                <el-button v-permission-contrast="scope.row.deptId" plain type="primary" size="mini"
                                           @click="handleEdit(scope.row.id)">编辑
                                </el-button>
                                <el-button v-permission-contrast="scope.row.deptId" plain type="danger" size="mini"
                                           @click="handleDelete(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>

                <template v-else>
                    <el-table
                            v-loading="tableLoading"
                            ref="multipleTable"
                            :data="tableDataNow"
                            border
                            max-height="600"
                            :cell-style="{'text-align':'center'}"
                            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :key="Math.random()">
                        <el-table-column prop="name" label="组织名称" min-width="200"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="accomplishBranchReelection" label="是否完成换届" width="120">
                            <template slot-scope="scope">
                                <template v-if="scope.row.accomplishBranchReelection == '1'">已换届</template>
                                <template v-else-if="scope.row.accomplishBranchReelection == '2'">未换届</template>
                            </template>
                        </el-table-column>
                        <el-table-column label="组织类别" min-width="150" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ convertFiled(scope.row.type, typeNameList) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="organizationType" label="组织类型" width="150">
                            <template slot-scope="scope">
                                {{
                                    convertFiled(scope.row.organizationType, organizationTypeList)
                                }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="130">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handDetail2(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>

            </template>
            <template v-slot:pagination>
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
            </template>
        </tree-and-table>
        <updateChange v-model="updateChangeShow" :modal-title="selectInfo.title" :parentId="selectInfo.deptId + ''"
                      :partyId="selectInfo.id + ''"
                      @close="refresh()"></updateChange>
        <term-change v-model="termShow" :deptId="String(selectInfo.deptId)" :modal-title="selectInfo.title"
                     @close="close()"></term-change>
    </div>

</template>
<script>

import {formartDate} from '@/utils/tool.js'
import updateChange from './updateChange'
import organizationTree from '@/views/dj/components/organizationTree'
import treeAndTable from "@/components/TreeAndTable.vue";
import {
    deleteTzTermDept,
    queryTzTermDeptByDeptPage,
    queryTzTermDeptList,
    getTzTermStatistics
} from "@/api/jcxfTermDept";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import termChange from "@/views/dj/organization/termChange.vue";
import {mapGetters} from "vuex";

export default {
    components: {
        updateChange,
        organizationTree,
        treeAndTable,
        termChange
    },
    data() {
        return {
            deptId: '',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            tableDataNow: [],
            updateChangeShow: false,
            selectInfo: {
                id: '',
                title: '',
                deptId: ''
            },
            tipContent: '',
            tableLoading: false,
            electTypeList: [],
            isZb: false,
            termShow: false,
            search: {
                teamSession: '',
                accomplishBranchReelection: null,
                monthNum: ''
            },
            statistics: {
                count1: 0,
                count2: 0,
                count3: 0,
            },
            typeNameList: [],
            organizationTypeList: [],
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    created() {
        this.getdict('voteType')
        this.getdict('partyType')
        this.getdict('organizationType')
        this.getStatistics()
    },
    methods: {
        getStatistics() {
            getTzTermStatistics(this.deptInfo.id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.statistics.count1 = data.data.count1
                    this.statistics.count2 = data.data.count2
                    this.statistics.count3 = data.data.count3
                }
            })
        },
        searchData() {
            this.pageNum = 1
            this.getDataById()
        },
        getdict(type) {
            getDictByCode(type).then(res => {
                const data = res.data.data
                if (type === 'voteType') {
                    this.electTypeList = data
                } else if (type === 'partyType') {
                    this.typeNameList = data
                } else if (type === 'organizationType') {
                    this.organizationTypeList = data
                }
                this.$forceUpdate()
            })
        },
        convertFiled(val, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == val) {
                    return dic[i].label
                }
            }
        },
        getDeptId(data) {
            this.deptId = data.deptId + ''

            const typeList = [631, 632, 931, 932]
            if (typeList.indexOf(data.type) < 0) {
                this.isZb = false
            } else {
                this.isZb = true
            }

            this.getDataById()
        },
        close() {
            this.updateChangeShow = false
        },
        reset() {
            this.pageNum = 1
            this.pageSize = 10
        },
        handDetail(id) {
            this.selectInfo.title = '详情'
            this.selectInfo.id = id.toString()
            this.updateChangeShow = true
        },
        handDetail2(data) {
            if (data == '') {
                this.selectInfo.deptId = this.deptInfo.id.toString()
                this.selectInfo.title = this.deptInfo.name
            } else {
                this.selectInfo.id = data.id
                this.selectInfo.deptId = data.id
                this.selectInfo.title = data.name
            }
            this.termShow = true
        },
        handleEdit(id) {
            this.updateChangeShow = true
            this.selectInfo.title = '编辑'
            this.selectInfo.id = id.toString()
            this.selectInfo.deptId = this.deptInfo.id.toString()
        },
        selectByTree(data) {
            this.deptId = data.whereMap.deptId + ''
            this.selectInfo.deptId = data.whereMap.deptId + ''
            const typeList = [631, 632, 931, 932]
            if (typeList.indexOf(data.whereMap.type) < 0) {
                this.isZb = false
            } else {
                this.isZb = true
            }
            this.pageNumber = 1
            this.getDataById()
        },
        // 获取分页信息
        getDataById() {
            this.tableLoading = true

            if (this.isZb) {
                let data = {
                    tzTermDept: {
                        deptId: this.deptId,
                        teamSession: this.search.teamSession,
                    },
                    pageVo: {
                        pageNumber: this.pageNum,
                        pageSize: this.pageSize
                    },
                    type: '1',
                }
                queryTzTermDeptList({data: data}).then(res => {
                    this.tableLoading = false
                    const data = res.data
                    if (data.code == '00000') {
                        this.tableDataNow = data.data.result.records
                        this.total = data.data.result.total
                    }
                    this.$forceUpdate()
                })
            } else {
                let data = {
                    tzTermDept: {
                        deptId: this.deptId
                    },
                    pageVo: {
                        pageNumber: this.pageNum,
                        pageSize: this.pageSize
                    },
                    teamSession: this.search.teamSession,
                    accomplishBranchReelection: this.search.accomplishBranchReelection,
                    monthNum: this.search.monthNum
                }

                queryTzTermDeptByDeptPage({data: data}).then(res => {
                    this.tableLoading = false
                    const data = res.data
                    if (data.code == '00000') {
                        this.tableDataNow = data.data.records
                        this.total = data.data.total
                    }
                    this.$forceUpdate()
                })
            }
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
                showClose: false,
                type: 'warning'
            }).then(() => {
                var ids = []
                if (row != null || row != undefined) {
                    ids.push(row)
                } else {
                    ids = this.partyMemberIds
                }
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids == undefined || ids == null || ids.length == 0) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteTzTermDept(ids).then(res => {
                if (res) {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500
                    })

                    this.getDataById()
                }
            })
        },
        refresh() {
            this.getStatistics()
            this.updateChangeShow = false
            this.getDataById()
        },
        addInfo() {
            this.selectInfo.title = '新增'
            if (!this.selectInfo.deptId) {
                this.selectInfo.deptId = this.deptInfo.id.toString()
            }
            this.updateChangeShow = true
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
        }
    }
}
</script>

<style scoped lang="scss">
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

.head {
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    width: 100%;
    margin-top: 5px;
    border-radius: 5px;
    background-color: rgba(255, 248, 247, 1);;
    margin-bottom: 10px;
}

.amount {
    font-size: 15px;
    width: 33.3%;
    word-break: break-all;
    text-align: center;
    padding: 10px;
    position: relative;

    .red-text {
        color: rgba(228, 53, 43, 1);
        font-size: 24px;
        font-weight: 700;
    }

    .black-text {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
        font-weight: 400;
    }

    .line {
        position: absolute;
        top: 20px;
        right: 0;
        width: 1px;
        height: 40px;
        background: rgba(242, 228, 228, 1);
    }
}
</style>
