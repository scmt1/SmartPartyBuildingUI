<template>
    <div style="background-color: white;height: calc(100vh - 66px);">
        <div style="background-color: #fff; padding: 10px 15px; text-align: left;">
            <el-form ref="searchForm" :model="whereMap" label-width="90px" inline size="medium"
                     style="text-align: left;">
                <el-form-item prop="meetingTopic" label="名称：">
                    <el-input style="width: 200px;" v-model="whereMap.meetingTopic" placeholder="名称"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="meetingType" label="类型：">
                    <el-select v-model="whereMap.meetingType" placeholder="请选择" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in meetingTypeList" :key="index" :label="item.label"
                                   :value="item.itemValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="meetingStatus" label="状态：">
                    <el-select v-model="whereMap.meetingStatus" placeholder="请选择" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in meetingStatusList" :key="index" :label="item.label"
                                   :value="item.itemValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间：" v-if="drop">
                    <el-date-picker v-model="dateRange" type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <a class="drop-down" @click="dropDown">
                        {{ dropDownContent }}
                        <i :class="dropDownIcon"></i>
                    </a>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" icon="el-icon-search" class="topBtn" @click="ok">搜索</el-button>
                    <el-button size="small" @click="reset('searchForm')" style="margin-left: 10px;">重置</el-button>
                    <el-button plain size="small" icon="el-icon-refresh" type="danger" @click="refresh">刷新</el-button>
                    <el-button v-permission-leaf plain size="small" icon="el-icon-plus" class="topBtn" @click="postMeeting">发起会议
                    </el-button>
                    <el-button size="small" icon="el-icon-arrow-left" class="topBtn" @click="returnBack()">返回
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="head" v-if="whereMap.meetingType == 1">
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
        <!--      主体-->
        <div style="padding: 15px;">
            <el-table
                    :row-class-name="tableRowClassName"
                    v-loading="dataListLoading"
                    ref="multipleTable"
                    :data="tableDataNow"
                    border
                    max-height="700"
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column prop="meetingTopic" width="400" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="meetingType" min-width="220" label="类型">
                    <template slot-scope="scope">
                        {{ convertFiled(scope.row.meetingType, meetingTypeList) }}
                        <template v-if="scope.row.meetingType == '1'">
                            &nbsp;-&nbsp;{{
                                convertFiled(scope.row.classType, meetingSHYK) != '--' ? convertFiled(scope.row.classType, meetingSHYK) : ''
                            }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" min-width="190" label="开始时间">
                </el-table-column>
                <el-table-column prop="endTime" min-width="190" label="结束时间">
                </el-table-column>
                <el-table-column prop="meetingStatus" label="状态" min-width="100">
                    <template slot-scope="scope">
                        {{ convertFiled(scope.row.meetingStatus, meetingStatusList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" min-width="190" label="发布时间"></el-table-column>
                <el-table-column label="操作" fixed="right" width="460">
                    <template slot-scope="scope">
                        <template v-permission-leaf v-if="scope.row.meetingStatus == '1'">
                            <el-button class="buttons" size="mini" @click="confirmMeeting(scope.row.id.toString())">
                                <template v-if="scope.row.meetingType == '3'">
                                    开始活动
                                </template>
                                <template v-else>
                                    开始会议
                                </template>
                            </el-button>
                            <el-button class="buttons" size="mini" @click="open(scope.row.id.toString())">参加人员
                            </el-button>
                            <el-button class="buttons" size="mini" @click="edit(scope.row.id.toString(), false)">编辑
                            </el-button>
                            <el-button class="buttons" size="mini" @click="sendMessage(scope.row.id)">发送短信</el-button>
                            <div v-if="scope.row.lastSendTime">上次发送时间：{{ scope.row.lastSendTime }}</div>
                        </template>

                        <template v-if="scope.row.meetingStatus == '2'">
                            <el-button class="buttons" size="mini" @click="edit(scope.row.id.toString(), true)">查看
                            </el-button>
                            <el-button v-permission-leaf class="buttons" size="mini" @click="endMeeting(scope.row.id)">
                                <template v-if="scope.row.meetingType == '3'">
                                    结束活动
                                </template>
                                <template v-else>
                                    结束会议
                                </template>
                            </el-button>
                            <el-button v-permission-leaf class="buttons" size="mini" @click="cancelMeeting(scope.row.id)">
                                <template v-if="scope.row.meetingType == '3'">
                                    取消活动
                                </template>
                                <template v-else>
                                    取消会议
                                </template>
                            </el-button>
                            <el-button v-permission-leaf class="buttons" size="mini" @click="uploadImg(scope.row.id)">上传照片</el-button>
                        </template>
                        <template v-if="scope.row.meetingStatus == '3'">
                            <el-button class="buttons" size="mini" @click="detail(scope.row.id)">查看详情</el-button>
                            <el-button v-permission-leaf class="buttons" size="mini" @click="editMeetingRecord(scope.row.id)">
                                <template v-if="scope.row.meetingType == '3'">
                                    备注
                                </template>
                                <template v-else>
                                    会议记录
                                </template>
                            </el-button>
                        </template>
                        <el-button v-permission-leaf class="buttons" size="mini" @click="studyFile(scope.row.id)">
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
        </div>

        <meetingCompoent v-model="show" :deptId="deptId+''" :deptName="deptName" :meetingId="id+''" :modalTitle="title"
                         @close="close" @refresh="refresh()" :editDisabled="editDisabled"></meetingCompoent>
        <end-meeting-compoent v-model="endShow" @refresh="refresh()" :deptId="deptId+''" :deptName="deptName"
                              :meetingId="id+''"
                              @close="close"></end-meeting-compoent>
        <checkMeetingClass v-model="checkMeetingClassShow" :deptId="deptId+''" :deptName="deptName" :meetingId="id+''"
                           @close="close" :modalTitle="title"></checkMeetingClass>
        <studyFile v-model="studyShow" :deptId="deptId+''" :meetingId="id+''" @close="close"
                   :modalTitle="title"></studyFile>
        <uploadImg v-model="uploadShow" :deptId="deptId+''" :meetingId="id+''" @close="close"
                   :modalTitle="title"></uploadImg>
        <detail v-model="detailShow" :deptId="deptId+''" :meetingId="id+''" @close="close" :modalTitle="title"></detail>
        <editMeetingRecord :show="editRecordShow" :deptId="deptId+''" :id="id+''" @close="close"></editMeetingRecord>

        <Modal v-model="openShow" width="460px" :closable="false" class-name="vertical-center-modal">
            <div style="margin-top: 20px; color:#f60; text-align:center;font-size: 30px;height: 50px;">
                <span v-if="type==='1'">确认开始会议?</span>
                <span v-if="type==='2'">确认取消会议?</span>
            </div>
            <div v-if="type==='1'" style="font-size: 16px; line-height: 30px;">
                <p>开始会议后:</p>
                <p>1. 会议信息将<span style="color: red; font-weight: bold;">不能编辑</span>，可以上传会议照片(最少2张，最多8张)、填写会议记录信息。</p>
                <p>2. 会议结束后，请及时点击 <b>"结束会议"</b> 并按提示完成相关流程，系统将记录会议实际开始时间与结束时间。</p>
                <p>3. 参会人员：</p>
                <div style="max-height: 220px; overflow-y: auto; overflow-x: hidden;">
                    <el-row :gutter="20">
                        <el-col :span="6" v-for="(item, index) in planMeetingPartyMemberInfo" :key="index">
                            <div style="text-align: center; word-break: break-word; margin-top: 10px;">
                                <div style="width: 50px; height: 50px; margin: auto;">
                                    <img v-if="item.avatar===null||item.avatar.length===0" :src="defaultHeader"
                                         style="object-fit: cover; width: 100%; border-radius: 50%;">
                                    <img :src="item.avatar" v-else
                                         style="width: 100%; border-radius: 50%; object-fit: cover;">
                                </div>

                                <div style="font-size: 12px; line-height: 20px;">
                                    {{ item.realName }}<br>
                                    {{ item.phone }}
                                </div>
                            </div>
                        </el-col>
                    </el-row>

                </div>
            </div>
            <div v-if="type==='2'" style="font-size:16px ;text-align:center">
                <p>取消会议后:</p>
                <p>1.当前添加的信息会保留</p>
                <p>2.已取消的会议可以在后台删除</p>
            </div>
            <template #footer>
                <div style="text-align:center;">
                    <Button size="large" type="text" style="background-color: #C1C1C1;color: white" @click="close">取消
                    </Button>
                    <Button v-if="type==='1'" size="large" type="error" style="background-color: rgb(221, 107, 85);"
                            @click="startThisMeeting">确定
                    </Button>
                    <Button v-if="type==='2'" size="large" type="error" style="background-color: rgb(221, 107, 85);"
                            @click="cancelMeetingOk(id)">确定
                    </Button>
                </div>
            </template>
        </Modal>

        <el-drawer title="选择拟参会人员" :visible.sync="joinVisible" size="460px">
            <div class="demo-drawer__content" v-if="!joinLoading" style="height: 90%;border-top: 1px solid #ccc;">
                <div style="line-height: 2;padding: 30px;text-align:center;">
                    <div v-if="personList !=null && personList.length > 0">
                        <el-checkbox-group v-model="personIds">
                            <el-row :gutter="10">
                                <el-col :span="8" v-for="(item,index) in  personList" :key="index" style="margin: 15px 0">
                                    <div>
                                        <img v-if="item.avatar===null||item.avatar.length===0" :src="defaultHeader"
                                             class="img"
                                             style="object-fit: cover;">
                                        <img :src="item.avatar" v-else class="img" style="object-fit: cover;">
                                        <div>
                                            <p class="row_right_img_p">
                                                <el-checkbox :label="item.id+''">
                                                    {{ item.realName }}<br>
                                                    {{ item.phone }}
                                                </el-checkbox>
                                            </p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                    </div>
                    <el-empty v-else description="暂无数据"></el-empty>
                </div>
            </div>
            <div class="demo-drawer__footer">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button @click="joinVisible = false" size="small" style="margin-right: 5px;margin-left: 5px">取消</el-button>
                <el-button type="primary" @click="setPlanParty" size="small" style="margin-left: 5px;">确认选择</el-button>
            </div>
        </el-drawer>

    </div>
</template>
<script>
import defaultHeader from "@/assets/default-header.png"
import {queryOneselfPartyMemberList} from "@/api/jcxfPartyMember";
import meetingCompoent from '@/views/dj/windowOfBranch/organizationLife/meetingCompoent'
import endMeetingCompoent from '@/views/dj/windowOfBranch/organizationLife/endMeetingCompoent'
import checkMeetingClass from '@/views/dj/windowOfBranch/organizationLife/checkMeetingClass'
import studyFile from '@/views/dj/windowOfBranch/organizationLife/studyFile'
import uploadImg from '@/views/dj/windowOfBranch/organizationLife/uploadImg'
import detail from '@/views/dj/windowOfBranch/organizationLife/detail'
import editMeetingRecord from "@/views/dj/windowOfBranch/organizationLife/editMeetingRecord"
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {
    findImgById,
    cancelMeeting,
    deleteTzOrganizationLife,
    queryTzOrganizationLifeList,
    setPlanMeetingParty,
    getOrganizationLifeById,
    getPlanMeetingPartyMemberInfo,
    startMeeting,
    sendMessageByPartyIds, getMeetingCountByDeptId
} from "@/api/jcxfOrganizationLife";
import util from "@/libs/util";
import {mapGetters} from "vuex";

export default {
    name: 'startMeeting',
    components: {
        meetingCompoent,
        endMeetingCompoent,
        checkMeetingClass,
        studyFile,
        uploadImg,
        detail,
        editMeetingRecord
    },
    data() {
        return {
            drop: false,
            dropDownContent: "展开",
            dropDownIcon: "el-icon-arrow-down",
            base: util.jcxfUrl,
            personIds: [],
            defaultHeader: defaultHeader,
            joinVisible: false,
            joinLoading: false,
            type: '',
            openShow: false,
            daterange: [],
            detailShow: false,
            uploadShow: false,
            studyShow: false,
            checkMeetingClassShow: false,
            endShow: false,
            id: '',
            title: '',
            deptId: '',
            deptName: '',
            show: false,
            editDisabled: false,
            partyMemberIds: '',
            newAdd: '',
            active: '',
            inactive: '',
            partyNum: '',
            personTypeList: [],
            meetingStatusList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            whereMap: {
                meetingStatus: '',
                deptId: '',
                emptyShell: '',
                undoFlag: '',
                organizationType: '',
                partyOrgType: '',
                partyType: '',
                name: '',
                startTime: '',
                endTime: ''
            },
            dataListLoading: false,
            // 新增按钮的表单
            dialogFormVisible: false,
            formLabelWidth: '100px',
            tableDataNow: [],
            personList: [],
            planMeetingPartyMemberInfo: [],
            meetingTypeList: [],
            editRecordShow: false,
            meetingSHYK: [],
            statistics: {
                zwhyCount: 0,
                zbdhCount: 0,
                dkCount: 0,
                dxzhCount: 0
            },
            dateRange: [],
            isIndeterminate: true,
            checkAll: false,
            checkAllList: []
        }
    },
    created() {
        this.deptId = this.$route.query.deptId.toString()
        this.whereMap.deptId = this.$route.query.deptId.toString()
        this.deptName = this.$route.query.deptName
        this.getDict2('meetingStatus')
        this.getDict('meetingType')
        this.getDict('meetingSHYK')
        this.initTreeData()
        // this.getDataById()
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        handleCheckAllChange(val) {
            this.personIds = val ? this.checkAllList : [];
            this.isIndeterminate = false;
        },
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
        //获取三会一课统计数量
        getMeetingCount() {
            getMeetingCountByDeptId({
                deptId: this.deptId.toString(),
                meetingType: this.whereMap.meetingType
            }).then(res => {
                if (res.data) {
                    this.statistics = res.data.data
                }
            })
        },
        sendMessage(id) {
            this.$confirm('确认向拟参会人员发送短信通知吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                type: 'warning'
            }).then(() => {
                if (id != null || id != undefined) {
                    this.sendOk(id)
                } else {
                    this.$message.warning('id为空，发送失败')
                }
            }).catch(() => {

            });
        },
        sendOk(id) {
            sendMessageByPartyIds(id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message.info('发送成功' + data.data.successCount + '条' + ',' + '发送失败' + data.data.errorCount + '条')
                } else {
                    this.$message.info(data.msg)
                }
                this.getDataById()
            })
        },
        returnBack() {
            this.$router.push({
                path: '/dwgl/organizationLife',
                query: {
                    deptId: this.$route.query.deptId
                }
            })
        },
        change(e) {
            if (e !== null && e !== '' && e != undefined) {
                this.whereMap.startTime = e[0]
                this.whereMap.endTime = e[1]
            }
        },
        cancel() {
            this.reset()
        },
        ok() {
            this.getMeetingCount()
            this.getDataById()
            // this.reset()
        },
        search() {
            this.reset()
        },
        detail(id) {
            /* this.id = id.toString()
             this.detailShow = true*/
            this.$router.push({
                path: '/dwgl/organizationLife/detailView',
                query: {id: id.toString(), deptName: this.deptName, deptId: this.deptId}
            })
        },
        uploadImg(id) {
            this.id = id.toString()
            this.uploadShow = true
        },
        studyFile(id) {
            this.id = id.toString()
            this.studyShow = true
        },
        // 三会一课考勤表
        checkMeetingClass(type) {
            if (type === '三会一课考勤表') {
                this.title = '三会一课考勤表'
            } else if (type === '组织生活会(民族评议党员)考勤表') {
                this.title = '组织生活会(民族评议党员)考勤表'
            } else if (type === '主题党日考勤表') {
                this.title = '主题党日考勤表'
            }
            this.checkMeetingClassShow = true
        },
        // 结束会议
        endMeeting(id) {
            findImgById(id).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    const list1 = data.data.list1
                    if (list1.length < 2) {
                        this.$message.info('会议照片不足2张，请先上传会议照片后再结束会议')
                        return false
                    }
                }
                this.id = id.toString()
                this.endShow = true
            })
        },
        cancelMeetingOk(id) {

            let data = {
                id: id + '',
                editId: this.deptInfo.id + ''
            }
            cancelMeeting(data).then((res) => {
                if (res.data.code == '00000') {
                    this.close()
                    this.$message.success('操作成功')
                } else {
                    this.$message.error('操作异常')
                }
            }).catch(e => {
                this.$message.error('操作异常')
            }).finally(() => {
                this.getDataById()
            })
        },
        // 取消会议
        cancelMeeting(id) {
            this.id = id
            this.openShow = true
            this.type = '2'
        },
        edit(id, disabled) {
            this.id = id
            this.title = '编辑'
            this.show = true
            this.editDisabled = disabled
        },
        close() {
            this.openShow = false
            this.show = false
            this.checkMeetingClassShow = false
            this.detailShow = false
            this.editRecordShow = false
            this.uploadShow = false
            this.studyShow = false
            this.id = ''
            this.title = ''
        },
        refresh() {
            this.openShow = false
            this.show = false
            this.checkMeetingClassShow = false
            this.detailShow = false
            this.editRecordShow = false
            this.uploadShow = false
            this.studyShow = false

            this.id = ''
            this.title = ''
            this.getDataById()
        },
        // 发起会议
        postMeeting() {
            this.title = '发起会议'
            this.show = true
        },
        open(id) {
            this.id = id
            this.queryOneselfPartyMemberList(id)
        },
        queryOneselfPartyMemberList() {
            this.personList = []
            this.personIds = []

            this.joinLoading = true
            // 获取当前会议的拟参会人员ids
            getOrganizationLifeById(this.id).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    if (result.data.planMeetingPartyIds != null && result.data.planMeetingPartyIds != '') {
                        this.personIds = result.data.planMeetingPartyIds.split(',')
                    }

                    let data = {}
                    let id = this.deptId
                    data.deptId = id
                    queryOneselfPartyMemberList({data: data}).then((res) => {
                        const data = res.data
                        if (data.code == '00000') {
                            this.personList = data.data
                            this.checkAllList = this.personList.map(item => String(item.id))
                            this.$forceUpdate()
                        }
                        this.joinLoading = false
                    })
                }
            })

            this.joinVisible = true

            /* queryOneselfFlowPartyMemberList(data).then((res) => {
               this.fluxList[id+'_index'] = res.data.data
             })*/
        },
        setPlanParty() {
            const data = {
                id: this.id,
                partyIds: this.personIds + ''
            }
            setPlanMeetingParty({data: data}).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.$message.success('保存成功')
                    this.joinVisible = false
                } else {
                    this.$message.error(result.msg)
                }
            })
        },
        // 确认会议弹窗
        confirmMeeting(id) {
            this.id = id
            getPlanMeetingPartyMemberInfo(id).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    if (result.data.length == 0) {
                        this.$message.info('请先设置参会人员')
                        return
                    }
                    this.planMeetingPartyMemberInfo = result.data
                    this.type = '1'
                    this.openShow = true
                }
            })

        },
        startThisMeeting() {
            let userInformation = JSON.parse(window.localStorage.getItem("userInformation"))
            let data = {
                id: this.id + '',
                updateBy: userInformation.userId
            }
            startMeeting(data).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.$message.success('保存成功')
                    this.openShow = false
                    this.getDataById()
                } else {
                    this.$message.error(result.msg)
                }
            })
        },
        reset(formName) {
            this.$refs[formName].resetFields()
            this.dateRange = []
            this.whereMap.deptId = this.deptId
            this.pageNum = 1
            this.pageSize = 10
        },
        handDetail(type, id) {
            this.dialogFormVisible = true
            this.$router.push({
                path: 'updatePerson',
                query: {
                    id: id,
                    type: 1
                }
            })
        },
        handleEdit(type, id) {
            this.dialogFormVisible = true
            this.$router.push({
                path: 'updatePerson',
                query: {
                    id: id,
                    type: 0
                }
            })
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
        initTreeData() {
            this.dataListLoading = true
            //调用接口查询组织结构
            this.getDataById()
        },

        // 获取分页信息
        getDataById() {
            this.dataListLoading = true
            let data = {
                tzOrganizationLife: this.whereMap,
                pageVo: {
                    pageNumber: this.pageNum,
                    pageSize: this.pageSize
                }
            }
            data.tzOrganizationLife.deptId = this.deptId

            queryTzOrganizationLifeList({data: data}).then((res) => {
                this.tableDataNow = res.data.data.records
                this.total = res.data.data.total
                this.dataListLoading = false
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        tableRowClassName({row, rowIndex}) {
            row.row_index = rowIndex
        },
        // 分页
        sizeChange(data) {
            let num = data * 9 - 9
            this.tableDataNow = this.tableData.slice(num, num + 9)
        },
        getDict(type) {
            getDictByType2(type).then((res) => {
                let data = res.data
                if (type === 'meetingType') {
                    this.meetingTypeList = data
                } else if (type === 'meetingSHYK') {
                    this.meetingSHYK = data
                }
            })
        },
        getDict2(type) {
            getDictByCode(type).then((res) => {
                let data = res.data.data
                if (type === 'meetingStatus') {
                    this.meetingStatusList = data
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
                    ids = this.partyMemberIds
                }
                this.deleteOk(ids)
            }).catch(() => {

            });
        },
        deleteOk(ids) {
            if (ids === undefined || ids === null || ids.length === 0) {
                this.$message.error('没有选择的数据')
                return
            }
            deleteTzOrganizationLife(ids).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        //duration: 1500,
                    })
                    this.getDataById()
                }
            })
        },
        editMeetingRecord(id) {
            this.id = id + ''
            this.editRecordShow = true
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
    font-size: 16px !important;
    font-weight: bold !important;
    margin-bottom: 20px !important;
}
.el-button + .el-button {
    margin-right: 10px;
    margin-left: 0;
}

.search-div {
    padding: 0 10px 10px 0;
    box-sizing: border-box;
    margin-right: 10x;
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


.img {
    margin-left: 24px;
    display: inline-block;
    cursor: pointer;
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

.row_right_img_p {
    margin-top: 2px;
    line-height: 15px;
    margin-bottom: 2px
}


.buttons {
    margin: 3px;
    padding: 5px 8px;
    color: #a68f7f;
    border-color: #a68f7f;
}


.tree {
    margin-left: 20px;
    margin-top: 20px;
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
.demo-drawer__footer {
    position: absolute;
    bottom: 10px;
    right: 10px;
}

</style>
