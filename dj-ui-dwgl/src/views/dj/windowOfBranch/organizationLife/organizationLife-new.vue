<template>
    <div>
        <tree-and-table>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId"></organization-tree>
            </template>
            <template v-slot:btngroup>
                <div class="flex-box">
                    <div>
<!--                        <el-button style="background: rgba(228, 53, 43, 1);color:#ffffff;border-color:rgba(228, 53, 43, 1)"-->
<!--                                   plain size="small" icon="el-icon-plus" @click="gotoOrg()" v-permission-leaf-zb="whereMap">进入支部</el-button>-->
                        <el-button plain size="small" icon="el-icon-plus" type="danger" @click="postMeeting" v-permission-leaf-zb="whereMap" style="margin-right: 15px;">发起会议</el-button>
                        <el-button plain size="small" @click="meetingClassEvent(1)" :style="whereMap.meetingType === '1' ? 'background:  rgba(228, 53, 43, 1);color:white;border-color:rgba(228, 53, 43, 1);' : '' ">
                            三会一课
                        </el-button>
                        <el-button plain size="small" @click="meetingClassEvent(6)" :style="whereMap.meetingType === '6' ? 'background:  rgba(228, 53, 43, 1);color:white;border-color:rgba(228, 53, 43, 1);' : '' ">
                            组织生活会(民主评议党员)
                        </el-button>
                    </div>
                </div>
                <div class="head">
                    <span class="amount">
                        <span class="red-text">{{ statistics.zwhyCount }}</span>
                        <br>
                        <span class="black-text">支委会</span>
                        <span class="line"></span>
                    </span>

                    <span class="amount">
                        <span class="red-text">
                            {{ statistics.zbdhCount }}
                        </span>
                        <br>
                        <span class="black-text">
                            支部党员大会
                        </span>
                        <span class="line"></span>
                    </span>

                    <span class="amount">
                        <span class="red-text">{{ statistics.dkCount }}</span>
                        <br>
                        <span class="black-text">党课</span>
                        <span class="line"></span>
                    </span>
                    <span class="amount">
                        <span class="red-text">{{ statistics.dxzhCount }}</span>
                        <br>
                        <span class="black-text">党小组会</span>
                    </span>
                </div>
            </template>
            <template v-slot:search>
                <div class="search-div">
                    <div class="label">
                        名称：
                    </div>
                    <div class="input-box">
                        <el-input clearable v-model="whereMap.meetingTopic" placeholder="名称" size="small" style="width: 100%;"></el-input>
                    </div>
                </div>
                <div class="search-div">
                    <div class="label">
                        状态：
                    </div>
                    <div class="input-box">
                        <el-select v-model="whereMap.meetingStatus" placeholder="请选择" clearable size="small" style="width: 100%;">
                            <el-option v-for="(item, index) in meetingStatusList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search-div">
                    <div class="label">
                        选择日期：
                    </div>
                    <div>
                        <el-date-picker
                            style="width: 280px;"
                            size="small"
                            @change="dateChange"
                            placeholder="选择日期"
                            v-model="daterange"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <el-button size="small" @click="reset()" style="margin-right: 10px;">重置</el-button>
                <el-button size="small" icon="el-icon-search" style="background:  rgba(228, 53, 43, 1);border-color: rgba(228, 53, 43, 1);color:#ffffff" @click="search">搜索</el-button>
                <el-button plain size="small" icon="el-icon-refresh" type="danger" @click="refresh">刷新</el-button>
            </template>
            <template v-slot:table>
                <el-table
                    :row-class-name="tableRowClassName"
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column prop="" width="200" label="图片">
                        <template slot-scope="scope">
                            <el-image v-if="scope.row.imgUrl&&scope.row.imgUrl!=null&&scope.row.imgUrl.length > 0" style="height: 70px" fit="cover" :src="base + scope.row.imgUrl" :preview-src-list="[base + scope.row.imgUrl]"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="meetingTopic" label="名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="meetingType" width="220" label="类型">
                        <template slot-scope="scope">
                            {{ convertFiled(scope.row.meetingType, meetingTypeList) }}
                            <template v-if="scope.row.meetingType == '1'">
                                &nbsp;-&nbsp;{{ convertFiled(scope.row.classType, meetingSHYK) != '--'?convertFiled(scope.row.classType, meetingSHYK):'' }}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" width="180" label="开始时间">
                    </el-table-column>
                    <el-table-column prop="meetingStatus" label="状态" width="100">
                        <template slot-scope="scope">
                            {{ convertFiled(scope.row.meetingStatus, meetingStatusList) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="400">
                        <template slot-scope="scope">
                            <template v-if="scope.row.meetingStatus == '1'">
                                <el-button class="buttons" size="mini" @click="confirmMeeting(scope.row.id.toString())">
                                    <template v-if="scope.row.meetingType == '3'">
                                        开始活动
                                    </template>
                                    <template v-else>
                                        开始会议
                                    </template>
                                </el-button>
                                <el-button class="buttons" size="mini" @click="open(scope.row.id.toString())">参加人员</el-button>
                                <el-button class="buttons" size="mini" @click="edit(scope.row.id.toString(), false)">编辑</el-button>
                                <el-button class="buttons" size="mini" @click="sendMessage(scope.row.id)">发送短信</el-button>
                                <div v-if="scope.row.lastSendTime">上次发送时间：{{scope.row.lastSendTime}}</div>
                            </template>

                            <template v-if="scope.row.meetingStatus == '2'">
                                <el-button class="buttons" type="primary" size="mini" @click="edit(scope.row.id.toString(), true)">查看</el-button>

                                <el-button class="buttons" size="mini" @click="endMeeting(scope.row.id)">
                                    <template v-if="scope.row.meetingType == '3'">
                                        结束活动
                                    </template>
                                    <template v-else>
                                        结束会议
                                    </template>
                                </el-button>
                                <el-button class="buttons" size="mini" @click="cancelMeeting(scope.row.id)">
                                    <template v-if="scope.row.meetingType == '3'">
                                        取消活动
                                    </template>
                                    <template v-else>
                                        取消会议
                                    </template>
                                </el-button>
                                <br>
                                <el-button class="buttons" size="mini" @click="uploadImg(scope.row.id)">上传照片</el-button>
                            </template>
                            <template v-if="scope.row.meetingStatus == '3'">
                                <el-button class="buttons" size="mini" @click="detail(scope.row.id)">查看详情</el-button>
                                <el-button class="buttons" size="mini" @click="editMeetingRecord(scope.row.id)">
                                    <template v-if="scope.row.meetingType == '3'">
                                        备注
                                    </template>
                                    <template v-else>
                                        会议记录
                                    </template>
                                </el-button>
                            </template>
                            <el-button class="buttons" size="mini" @click="studyFile(scope.row.id)">
                                <template v-if="scope.row.meetingType == '3'">
                                    活动资料
                                </template>
                                <template v-else>
                                    学习资料
                                </template>
                            </el-button>
                            <el-button class="buttons" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
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
        <meetingCompoent v-model="show" :deptId="whereMap.deptId+''" :deptName="deptName" :meetingId="meetingId+''" :modalTitle="title" @close="close" @refresh="refresh()" :editDisabled="editDisabled"></meetingCompoent>
    </div>
</template>
<script>
import organizationTree from '@/views/dj/components/organizationTree'
import {
    getMeetingDecadeCount,
    getMeetingDecadeCountGroupByYear,
    getMeetingCountByDeptId, queryTzOrganizationLifeList
} from "@/api/jcxfOrganizationLife";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import TreeAndTable from "@/components/TreeAndTable.vue";
import meetingCompoent from '@/views/dj/windowOfBranch/organizationLife/meetingCompoent'
import util from "@/libs/util";

export default {
    components: {
        TreeAndTable,
        organizationTree,
        meetingCompoent
    },
    data() {
        return {
            base: util.jcxfUrl,
            title: '',
            show: false,
            meetingId:'',
            editDisabled: false,
            deptId: '',
            deptName: '',
            meetingClass: [],
            display: false,
            organizationTypeList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                meetingType: '1',
                deptId: '',
                meetingTopic: '',
                meetingStatus:'',
                startTime: '',
                endTime: ''
            },
            daterange:[],
            dataListLoading: false,
            statistics:{
                zwhyCount:0,
                zbdhCount:0,
                dkCount:0,
                dxzhCount:0
            },
            meetingStatusList: [],
            meetingTypeList: [],
            meetingSHYK: [],
            tableDataNow:[]
        }
    },
    created() {
        this.getDict( 'organizationType')
        this.getDict('meetingStatus')
        this.getDict('meetingType')
        this.getDict('meetingSHYK')
    },
    methods: {
        // 发起会议
        postMeeting() {
            this.title = '发起会议'
            this.show = true
        },
        //页数改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getMeetingList()
        },
        //页码改变
        handleCurrentChange(val) {
            this.pageNum = val
            this.getMeetingList()
        },
        search() {
            this.getMeetingList()
        },
        //获取会议列表
        getMeetingList(){
            this.dataListLoading = true
            let data = {
                tzOrganizationLife: this.whereMap,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            data.tzOrganizationLife.deptId = this.whereMap.deptId

            queryTzOrganizationLifeList({data: data}).then((res) => {
                this.tableDataNow = res.data.data.records
                this.total = res.data.data.total
                this.dataListLoading = false
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        close() {
            this.show = false
            this.getMeetingList()
        },
        refresh() {
            this.show = false
            this.getMeetingList()
        },
        dateChange(e) {
            if (e !== null && e !== '' && e != undefined) {
                this.whereMap.startTime = e[0]
                this.whereMap.endTime = e[1]
            }
        },
        //重置数据
        reset() {
            this.daterange = []
            this.whereMap.meetingTopic = ''
            this.whereMap.meetingStatus = ''
            this.whereMap.startTime = ''
            this.whereMap.endTime = ''
            this.pageNum = 1
            this.pageSize = 10
        },
        // 表格部分数据字段显示转换
        convertFiled(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (value == dic[i].itemValue) {
                    return dic[i].label
                }
            }
            return '--'
        },
        getDeptId(data) {
            this.whereMap.deptId = data.deptId
            this.whereMap.type = data.type
            this.whereMap.isLeaf = data.isLeaf
            this.deptName = data.deptName
            this.getMeetingList()
        },
        meetingClassEvent(type) {
            this.whereMap.meetingType = type
            this.getMeetingList()
        },
        selectByTree(data) {
            this.whereMap.deptId = data.whereMap.deptId
            this.whereMap.type = data.whereMap.type
            this.whereMap.isLeaf = data.whereMap.isLeaf
            this.deptName = data.whereMap.deptName
            this.getMeetingList()
            if (this.whereMap.meetingType == '1') {
                this.getMeetingCount()
            }
        },
        //获取三会一课统计数量
        getMeetingCount(){
            getMeetingCountByDeptId({deptId:this.whereMap.deptId.toString(),meetingType:this.whereMap.meetingType}).then(res =>{
                if(res.data){
                    this.statistics = res.data.data
                }
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        getDict(type) {
            getDictByCode(type).then((res) => {
                let data = res.data.data
                if (type === 'organizationType') {
                    this.organizationTypeList = data
                }else if (type === 'meetingStatus') {
                    this.meetingStatusList = data
                }else if (type === 'meetingType') {
                    this.meetingTypeList = data
                }else if (type === 'meetingSHYK') {
                    this.meetingSHYK = data
                }
            })
        },
        gotoOrg() {
            this.$router.push({
                path: '/dwgl/organizationLife/startMeeting',
                query: {deptId: this.whereMap.deptId, deptName: this.deptName}
            })
        }
    }
}
</script>

<style scoped lang="scss">
.search-div {
    padding: 0 10px 10px 0;
    box-sizing: border-box;
    //width: 260px;
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

.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-center-modal .ivu-modal {
    top: 0;
}

.partyMember {

.el-dialog el-dialog--center {

::v-deep.el-dialog__body {
    padding: 25px 25px 11px
}

}
}
.cells {
    color: red;
}
.head {
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    width: 100%;
    margin-top: 10px;
    border-radius: 5px;
    background-color: rgba(255, 248, 247, 1);;
    margin-bottom: 10px;
}

.amount {
    font-size: 15px;
    width: 25%;
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
