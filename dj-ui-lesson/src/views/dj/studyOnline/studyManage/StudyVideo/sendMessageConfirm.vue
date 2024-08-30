<template>
    <el-dialog :visible.sync="show" title="短信通知" width="800px" style="min-width: 800px" @close="cancel" append-to-body
               top="10vh">
        <div>
            <div class="title">1、课程基本信息：</div>
            <div class="box">
                <div>课程标题：{{ studyVideoInfo.title }}</div>
                <div>可见类型：{{ getDirectLabelByValue(studyVideoInfo.viewType, viewTypeOption) }}</div>
                <div v-if="studyVideoInfo.viewType == '1'">
                    开始时间：{{ studyVideoInfo.startTime }}
                    <br>结束时间：{{ studyVideoInfo.endTime }}
                </div>
            </div>

            <div class="title">2、短信通知：</div>
            <div class="box">
                <div>创建时间：{{ studyVideoViewInfo.createTime }}</div>
                <div>
                    修改时间：{{ studyVideoViewInfo.updateTime != null && studyVideoViewInfo.updateTime != '' ? studyVideoViewInfo.updateTime : '无' }}
                </div>
                <div>
                    上次发送短信：{{ studyVideoViewInfo.messageTime != null && studyVideoViewInfo.messageTime != '' ? studyVideoViewInfo.messageTime : '无' }}
                </div>
                <div>可见范围：{{ getDirectLabelByValue(studyVideoViewInfo.type, viewScopeTypeOption) }}</div>
                <div style="display: flex;"
                     v-if="studyVideoViewInfo.type == '1' || studyVideoViewInfo.type == '2' || studyVideoViewInfo.type == '3' || studyVideoViewInfo.type == '4'">
                    <div>部门：</div>
                    <div style="flex: 1;">
                        <div v-for="(item, index) in studyViewScopeInfo.deptList" :key="index">
                            {{ index + 1 + '、' }}{{ item.name }}
                        </div>
                    </div>
                </div>

                <div style="display: flex;" v-if="studyVideoViewInfo.type == '3' || studyVideoViewInfo.type == '4'">
                    <div>职务：</div>
                    <div style="flex: 1;">
                        <el-tag style="margin-right: 10px; margin-bottom: 5px;"
                                v-for="(item, index) in studyVideoViewInfo.positionIds" :key="index">
                            {{ getDirectLabelByValue(item, positionOption) }}
                        </el-tag>
                    </div>
                </div>

                <div v-if="studyVideoViewInfo.type == '1' || studyVideoViewInfo.type == '2'">
                    当前范围内人数：{{ studyViewScopeInfo.partyNum }}人
                </div>

                <template
                        v-if="studyVideoViewInfo.type == '3' || studyVideoViewInfo.type == '4' || studyVideoViewInfo.type == '5'">
                    <div>
                        <div>
                            <el-table
                                    :data="studyViewScopeInfo.partyMemberList.records?studyViewScopeInfo.partyMemberList.records:[]"
                                    height="350" border style="width: 100%">
                                <el-table-column prop="realName" label="姓名" width="100"></el-table-column>
                                <el-table-column prop="phone" label="电话" width="130"></el-table-column>
                                <el-table-column prop="phone" label="职务" width="120">
                                    <template slot-scope="scope">
                                        {{ getDirectLabelByValue(scope.row.position, positionOption) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="deptName" label="部门"></el-table-column>
                            </el-table>
                        </div>
                        <div style="text-align: center; margin-top: 10px;">
                            <el-pagination background layout="prev, pager, next"
                                           @size-change="sizeChange"
                                           :total="studyViewScopeInfo.partyMemberList.total?studyViewScopeInfo.partyMemberList.total:0">
                            </el-pagination>
                        </div>
                    </div>

                    <div>
                        当前范围内人数：{{
                            studyViewScopeInfo.partyMemberList.total ? studyViewScopeInfo.partyMemberList.total : 0
                        }}
                    </div>
                </template>

            </div>
        </div>
        <div style="text-align: center;">
            <el-button type="primary" :disabled="sendStudyMessageFlag" :loading="sendLoading" class="button"
                       @click="sendMessage()">发送通知短信
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {getTzStudyVideo, sendStudyMessage} from "@/api/tzStudyVideo";
import {getTzStudyViewByStudyId, getViewScopeInfoByStudyId} from "@/api/tzStudyView";

export default {
    name: "sendMessageConfirm",
    props: {
        id: {
            type: String
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        show() {
            this.modalShow = this.show
            if (this.show) {
                this.rest()
                this.getDict('viewType')
                this.getDict('viewScopeType')
                this.getDict2('position')
                this.getTzStudyVideoById()
                this.getTzStudyViewInfo()
                this.getViewScopeInfo()
            }
        }
    },
    data() {
        return {
            modalShow: false,
            studyVideoInfo: {},
            studyVideoViewInfo: {},
            studyViewScopeInfo: {
                partyMemberList: {}
            },
            viewTypeOption: [],
            viewScopeTypeOption: [],
            positionOption: [],
            pageSize: 10,
            pageNum: 1,
            sendStudyMessageFlag: false,
            sendLoading: false
        }
    },
    methods: {
        rest() {
            this.studyVideoInfo = {}
            this.studyVideoViewInfo = {}
            this.studyViewScopeInfo = {
                partyMemberList: {}
            }
            this.viewTypeOption = []
            this.viewScopeTypeOption = []
            this.sendLoading = false
            this.sendStudyMessageFlag = false
        },
        cancel() {
            // this.modalShow = false
            this.$emit('cancel')
        },
        getDict(type) {
            getDictByType2(type).then(res => {
                let data = res.data
                if (type == 'viewType') {
                    this.viewTypeOption = data
                } else if (type == 'viewScopeType') {
                    this.viewScopeTypeOption = data
                }
            })
        },
        getDict2(type) {
            getDictByCode(type).then(res => {
                let data = res.data.data
                if (type == 'position') {
                    this.positionOption = data
                }
            })
        },
        getTzStudyVideoById() {
            getTzStudyVideo(this.id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.studyVideoInfo = data.data.studyVideo
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        getTzStudyViewInfo() {
            getTzStudyViewByStudyId(this.id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    let positionIds = data.data.positionIds.split(',')
                    let va = []
                    for (let i = 0; i < positionIds.length; i++) {
                        if (positionIds[i] != null && positionIds[i] != '') {
                            va.push(positionIds[i])
                        }
                    }
                    data.data.positionIds = va
                    this.studyVideoViewInfo = data.data
                }
            })
        },
        sizeChange(val) {
            this.pageNum = val
            this.getViewScopeInfo()
        },
        getViewScopeInfo() {
            let data = {
                studyId: this.id,
                pageVo: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNum
                }
            }
            getViewScopeInfoByStudyId(data).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.studyViewScopeInfo = data.data
                }
                this.$forceUpdate()
            })
        },
        getDirectLabelByValue(value, direct) {
            for (let i = 0; i < direct.length; i++) {
                if (value == direct[i].itemValue) {
                    return direct[i].label
                }
            }
        },
        sendMessage() {
            if (!this.studyViewScopeInfo.partyNum || this.studyViewScopeInfo.partyNum == 0) {
                this.$message.info('无可发送短信的党员')
                return
            }

            this.sendLoading = true
            sendStudyMessage(this.id).then(res => {
                this.sendLoading = false

                const data = res.data
                if (data.code == '00000') {
                    this.sendStudyMessageFlag = true
                    this.$message.success('发送成功')
                    this.getTzStudyViewInfo()
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.title {
    font-size: 18px;
    font-weight: 700;
}

.box {
    padding: 5px 15px;
    font-size: 14px;
    line-height: 25px;
}

/*.button {
    background: red;
    color: white;
    font-size: 16px;
    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}*/
</style>
