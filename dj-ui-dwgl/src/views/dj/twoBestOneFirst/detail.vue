<template>
    <el-dialog title="查看" :visible.sync="dialogVisible" top="50px" append-to-body width="870px" @close="close(false)">
        <el-tabs type="border-card" v-model="activeTab">
            <el-tab-pane label="基本信息" name="one">
                <div style="display: flex;" class="title">
                    <b>{{ findTitleByValue(form.tableType, twoBestOneFirstTableTypeList) }}</b>
                </div>
                <template v-if="form.tableType == '1' || form.tableType == '2'">
                    <div style="margin-top: 10px; display: flex;" class="info" v-if="Object.keys(selectPartyMemberInfo).length > 0">
                        <div style="margin-right: 15px;">
                            <el-image fit="cover" :src="form.avatar" class="avatar"></el-image>
                        </div>
                        <div style="flex: 1;">
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="8"><span class="txt_left">姓名：</span>{{ selectPartyMemberInfo.realName }}</el-col>
                                <el-col :span="6"><span class="txt_left">性别： </span>{{ findTitleByValue(selectPartyMemberInfo.sex, sexList) }}</el-col>
                                <el-col :span="10"><span class="txt_left">民族：</span>{{ findTitleByValue(selectPartyMemberInfo.national, nationList) }}</el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="8"><span class="txt_left">出生年月：</span>{{ formartDate(selectPartyMemberInfo.birthday, 'yyyy-MM-dd') }}</el-col>
                                <el-col :span="6"><span class="txt_left">籍贯：</span>{{ selectPartyMemberInfo.nativePlace }}</el-col>
                                <el-col :span="10"><span class="txt_left">参加工作时间：</span>{{ formartDate(selectPartyMemberInfo.joinWork, 'yyyy-MM-dd') }}</el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="8"><span class="txt_left">入党时间：</span>{{ formartDate(selectPartyMemberInfo.partyTime, 'yyyy-MM-dd') }}</el-col>
                                <el-col :span="6"><span class="txt_left">学历：</span>{{ findTitleByValue(selectPartyMemberInfo.education, educationList) }}</el-col>
                                <el-col :span="10"><span class="txt_left">职称：</span>{{ selectPartyMemberInfo.professional }}</el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="24">
                                    <div style="display: flex;">
                                        <div style="max-width: 360px; padding-right: 20px;display: flex;">
                                            <div style="width: 150px;" class="txt_left">工作单位及职位：</div>
                                            <div class="content" style="width: 70%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                                <el-tooltip class="item" effect="dark" :content="deptInfo.name" placement="top-start">
                                                    <span>{{ deptInfo.name }}</span>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                        <div><span class="txt_left">职务：</span>{{ findTitleByValue(selectPartyMemberInfo.position, positionList) }}</div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="14">
                                    <div style="display: flex;">
                                        <div class="txt_left">单位地址：</div>
                                        <div class="content" style="width: 70%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                            <el-tooltip class="item" effect="dark" :content="deptInfo.address" placement="top-start">
                                                <span>{{ deptInfo.address }}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="10"><span class="txt_left">单位电话：</span>{{ deptInfo.phone }}</el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="14"><span class="txt_left">身份证号：</span>{{ hideIdCardNumber(selectPartyMemberInfo.idcard) }}</el-col>
                                <el-col :span="10"><span class="txt_left">本人电话：</span>{{ hidePhoneNumber(selectPartyMemberInfo.phone) }}</el-col>
                            </el-row>
                        </div>
                    </div>
                </template>

                <template v-else-if="form.tableType == '3'">
                    <div class="info" style="margin-top: 5px;">
                        <el-row class="info-item">
                            <el-col :span="24">党组织名称： {{ deptInfo.name }}</el-col>
                        </el-row>
                        <el-row :gutter="24" class="info-item">
                            <el-col :span="24">所在地区：{{ deptInfo.areaName }}</el-col>
                        </el-row>
                        <el-row :gutter="24" class="info-item">
                            <el-col :span="24">党员人数：{{ deptInfo.partyMemberTotal }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">党组织负责人：{{ selectPartyMemberInfo.realName }} - {{ selectPartyMemberInfo.phone }}</el-col>
                        </el-row>
                    </div>

                    <div>
                        <b class="title">基本情况：</b>
                        <div style="display: flex; margin-top: 5px; padding: 0 15px">
                            <span v-html="cutout(form.baseCondition)"></span>
                        </div>
                    </div>
                </template>
                <div style="margin-top: 10px;">
                    <div><b class="title">审核状态：</b> {{ findTitleByValue(form.status, twoBestOneFirstStatusList) }}</div>
                </div>

                <div style="margin-top: 10px;">
                    <div>
                        <b class="title">表扬表彰类型：</b>
                        {{ findTitleByValue(form.commendType, commendTypeList) }}
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="个人情况" name="two" v-if="form.tableType == '1' || form.tableType == '2'">
                <div>
                    <b class="title">个人简历：</b>
                    <div style=" margin-top: 5px; display: flex; flex-direction: column; padding: 0 15px">
                        <div style="margin-bottom: 5px; display: flex;" v-for="(item, index) in resumeList" :key="index">
                            <div>
                                {{ formartDate(item.startTime, 'yyyy-MM-dd') }}
                            </div>
                            <div>~</div>
                            <div>
                                {{ formartDate(item.endTime, 'yyyy-MM-dd') }}
                            </div>
                            <div style="margin: 0 15px; flex: 1">{{ item.value }}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <b class="title">曾受表彰情况：</b>
                    <div style="display: flex; margin-top: 5px;">
                        <div style="display: flex; flex-direction: column; padding: 0 15px">
                            <div style="margin-bottom: 5px; display: flex;" v-for="(item, index) in commendConditionList" :key="index">
                                <div style="width: 150px;">
                                    {{ formartDate(item.time, 'yyyy-MM-dd') }}
                                </div>
                                <div style="margin-left: 15px; width: 150px;">
                                    {{ item.name }}
                                </div>
                                <div style="margin: 0 15px; flex: 1" v-if="form.tableType == '1' || form.tableType == '2'">
                                    授予单位：{{ item.dept }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <div><b class="title">主要事迹：</b></div>
                    <div style="margin-top: 5px; padding: 0 15px;">
                        <span v-html="cutout(form.mainDeed)"></span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="审核记录" name="three">
                <div><b class="title">审核记录：</b></div>
                <div style="margin-top: 10px; padding: 0 15px;">
                    <div>最近一次修改上传：{{ form.updateTime }}</div>
                    <div v-if="auditList.length == 0" style="text-align: center;">暂无记录</div>
                    <div v-if="auditList.length > 0" style="margin-top: 10px; margin-bottom: 5px;height: 500px;overflow-y: auto;">
<!--                        <div style="display: flex; margin-bottom: 10px; padding-left: 30px;">-->
<!--                            <div style="width: 320px;text-align: center">单位</div>-->
<!--                            <div style="width: 100px;text-align: center">状态</div>-->
<!--                            <div style="flex: 1;text-align: center">留言</div>-->
<!--                        </div>-->
                        <el-timeline :reverse="true">
                            <el-timeline-item
                                v-for="(item, index) in auditList"
                                :key="index"
                                :timestamp="item.createTime">
                                <div>
                                    {{ item.tzSysDept.name }}
                                </div>
                                <div>状态：
                                    <template v-if="item.auditStatus == '1' && item.auditDeptId == form.createDeptId">
                                        提交
                                    </template>
                                    <template v-else>
                                        {{ findTitleByValue(item.auditStatus, twoBestOneFirstStatusList) }}
                                    </template>
                                </div>
                                <div>审核意见：
                                    {{ item.auditMessage ? item.auditMessage : '暂无' }}
                                </div>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: end;">
            <div v-if="roleFlag">
                <template v-if="form.createDeptId == loginDeptInfo.id && form.status == '1'">
                    <el-button size="small" class="button-green" @click="pass()">提交申请</el-button>
                    <el-button size="small" class="button-red" @click="cancel()">取消申请</el-button>
                </template>
                <template v-if="isAuditTime && form.status != '1'">
                    <el-button size="small" class="button-green" @click="pass()">通过</el-button>
                    <el-button size="small" class="button-red" @click="turnDown()">驳回</el-button>
                </template>
            </div>
            <el-button size="small" type="primary" @click="close(false)" style="margin-left: 10px;">关闭</el-button>
        </span>
        <audit :show="auditShow" :id="id" :status="auditStatus" :lastAudit="lastAudit" @close="auditShow = false" @refresh="refresh"></audit>
    </el-dialog>
</template>

<script>
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {getTzTwoBestOneFirstById} from "@/api/tzTwoBestOneFirst";
import {addAudit, getAuditListByTbofId} from "@/api/tzTwoBestOneFirstAudit";
import {getIsAuditTime} from "@/api/tzTwoBestOneFirstTime";
import audit from "./audit.vue";
import util from "@/libs/util";
import {getTzSysDept} from "@/api/jcxfSysDept";
import store from "@/store";
import {mapGetters} from "vuex";

export default {
    name: "detail",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        id: {
            default: null
        }
    },
    watch: {
        value() {
            this.dialogVisible = this.value
            if (this.value && this.id != null) {
                this.activeTab = "one";
                this.form.id = this.id
                this.getTzTwoBestOneFirst()
                this.getDict('twoBestOneFirstTable')
                this.getDict('twoBestOneFirstStatus')
                this.getDict('twoBestOneFirstCommend')
                this.getDict2('nation')
                this.getDict2('education')
                this.getDict2('position')
                this.getAuditList()

                getIsAuditTime({deptId: this.loginDeptInfo.id +''}).then(res => {
                    let data = res.data
                    if (data.code == '00000') {
                        this.isAuditTime = data.data
                        this.setLastAudit()
                    }
                })
            }
        },
        loginDeptInfo: {
            handler(nval, oval) {
                this.setLastAudit()
            },
            deep: true,
            immediate: true
        }
    },
    components: {
        audit
    },
    data() {
        return {
            activeTab:"one",
            formDeptParentId: null,
            base: util.minionUrl,
            auditShow: false,
            auditStatus: '',
            dialogVisible: false,
            twoBestOneFirstTableTypeList: [],
            selectPartyMemberInfo: {},
            deptInfo: {},
            nationList: [],
            educationList: [],
            positionList: [],
            sexList: [{'label': '男', 'itemValue': 1}, {'label': '女', 'itemValue': 2}],
            resumeList: [],
            commendConditionList: [],
            form: {
                id: '',
                createDeptId: '',
                partyMemberId: '',
                tableType: '',
                baseCondition: '',
                resume: '',
                commendCondition: '',
                mainDeed: ''
            },
            auditList: [],
            isAuditTime: false,
            lastAudit: false,
            twoBestOneFirstStatusList: [],
            roleFlag: false,
            commendTypeList: []
        }
    },
    computed: {
        ...mapGetters({
            loginDeptInfo: 'deptInfo',
        })
    },
    methods: {
        setLastAudit() {
            const deptInfo = store.getters.deptInfo
            let buttonRole = []
            if(deptInfo.buttonRole) {
                buttonRole = deptInfo.buttonRole.split(',')
                if (buttonRole.indexOf('auditTBOF') > -1 && this.form.status == '4') {
                    // 机关工委审核，需要选择表扬类型
                    this.lastAudit = true
                } else {
                    this.lastAudit = false
                }
            } else {
                this.lastAudit = false
            }
        },
        cutout(cellValue) {
            if (cellValue) {
                const val = cellValue.replace(/\n/g, '</br>').replace(/ /g, ' &nbsp')
                return val
            }
            return cellValue
        },
        pass() {
            // 待提交状态，直接通过无需填写审核意见
            if (this.form.status == '1') {
                let data = {
                    tzTwoBestOneFirstAudit: {
                        tbofId: this.form.id,
                        auditStatus: '1',
                        auditDeptId: this.loginDeptInfo.id
                    }
                }
                addAudit({data: data}).then(res => {
                    let data = res.data
                    if (data.code == '00000') {
                        this.$message.success('提交成功')
                        this.refresh()
                    } else {
                        this.$message.error(data.msg)
                    }
                })

            } else {
                this.auditStatus = '1'
                this.auditShow = true
            }

        },
        cancel() {
            // 待提交状态，直接通过无需填写审核意见
            if (this.form.status == '1') {
                let data = {
                    tzTwoBestOneFirstAudit: {
                        tbofId: this.form.id,
                        auditStatus: '2',
                        auditDeptId: this.loginDeptInfo.id
                    }
                }
                addAudit({data: data}).then(res => {
                    let data = res.data
                    if (data.code == '00000') {
                        this.$message.success('取消成功')
                        this.refresh()
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }
        },
        turnDown() {
            this.auditStatus = '2'
            this.auditShow = true
        },
        refresh() {
            this.auditShow = false
            this.getTzTwoBestOneFirst()
            this.getAuditList()
            this.$emit('refresh')
        },
        getAuditList() {
            getAuditListByTbofId(this.id).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.auditList = data.data
                }
            })
        },
        rest() {
            this.form.id = ''
            this.form.createDeptId = ''
            this.form.partyMemberId = ''
            this.form.tableType = ''
            this.form.baseCondition = ''
            this.form.resume = ''
            this.form.commendCondition = ''
            this.form.mainDeed = ''
        },
        async getDict(type) {
            await getDictByType2(type).then((res) => {
                let data = res.data
                if (type === 'twoBestOneFirstTable') {
                    this.twoBestOneFirstTableTypeList = data
                } else if (type === 'twoBestOneFirstStatus') {
                    this.twoBestOneFirstStatusList = data
                } else if (type === 'twoBestOneFirstCommend') {
                    this.commendTypeList = data
                }
            })
        },
        getDict2(type) {
            getDictByCode(type).then((res) => {
                let data = res.data.data
                if (type === 'nation') {
                    this.nationList = data
                } else if (type === 'education') {
                    this.educationList = data
                } else if (type === 'position') {
                    this.positionList = data
                }
            })
        },
        findTitleByValue(value, dic, type) {
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
        getTzTwoBestOneFirst() {
            getTzTwoBestOneFirstById(this.form.id).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.form = data.data

                    if (this.form.tableType == '1' || this.form.tableType == '2') {
                        this.resumeList = JSON.parse(this.form.resume)
                    }
                    this.selectPartyMemberInfo = JSON.parse(this.form.partyMemberInfo)
                    this.deptInfo = JSON.parse(this.form.deptInfo)
                    this.commendConditionList = JSON.parse(this.form.commendCondition)

                    getTzSysDept(this.form.createDeptId).then(res2 => {
                        let data2 = res2.data
                        if (data2.code == '00000') {
                            this.formDeptParentId = data2.data.parentId
                        }

                        const crateDeptId = this.form.createDeptId
                        const role = 'auditTBOF'
                        const status = this.form.status
                        const parentId = this.formDeptParentId
                        let buttonRole = []

                        if(this.loginDeptInfo.buttonRole) {
                            buttonRole = this.loginDeptInfo.buttonRole.split(',')
                        }

                        // 根据状态判断是否出现审核
                        if (this.loginDeptInfo.id == crateDeptId && status == '1') {
                            this.roleFlag = true
                        } else if (parentId == this.loginDeptInfo.id && status == '2' ) {
                            this.roleFlag = true
                        } else if (buttonRole.indexOf(role) > -1 && status == '4') {
                            this.roleFlag = true
                        } else {
                            this.roleFlag = false
                        }
                    })
                }
            })
        },
        close(val) {
            this.rest()
            this.$emit('close', val)
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

<style scoped lang="scss">
::v-deep .el-dialog__header {
    //text-align: center;
}
::v-deep .el-dialog__body{
    font-size: 16px !important;
    color: #222;
}
.el-timeline{
    font-size: 16px;
}

.info {
    //background: rgb(238, 241, 246);
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}
.info-item {
    margin-bottom: 10px;
    .txt_left{
        color: #858585;
    }
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

.avatar {
    width: 175px;
    height: 180px;
    display: block;
    object-fit: cover;
}
::-webkit-scrollbar {
    opacity: 0;
    width: 4px;
    height: 4px;
}
.title{
    font-size: 16px;
    color: #606266;
}
</style>
