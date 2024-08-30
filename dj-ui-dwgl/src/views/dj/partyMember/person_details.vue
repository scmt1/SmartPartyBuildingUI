<template>
    <div class="personDetails">
        <div style="text-align: right; padding: 14px 20px 0 20px;">
            <el-button size="small" class="topBtn" icon="el-icon-arrow-left" @click="backPath()">返回</el-button>
        </div>
        <div class="box">
            <div class="box-content" style="width: 50%; min-width:728px;">
                <div style="display: flex; flex-direction: row;margin-left:20px;margin-top: 20px">
                    <div style="height: 100px; width: 100px;border-radius: 50%; overflow: hidden">
                        <el-image fit="cover" :src="form.avatar ? form.avatar:defaultHeader" style="width: 100%;"></el-image>
                    </div>
                    <div style="padding-left: 30px; flex: 1; line-height: 22px;margin-top:10px">
                        <div style="display: flex; align-items: center;">
                            <div style="font-size: 22px;font-weight: 700;"><b>{{ form.realName }}</b></div>
                        </div>

                        <div style="margin-top:11px;font-size: 18px;">
                            {{ findTitleByValue(form.sex, sexList) }}
                            <span style="margin-left: 10px;">{{ findTitleByValue(form.personType, personTypeList) }}</span>
                        </div>
                        <div style="font-size: 18px;font-weight:400;margin-top: 10px;color: rgba(51, 51, 51, 1);">
                            {{ form.deptName }}
                        </div>
                    </div>
                    <div>
                        <img :src="images.edit" style="float: right;cursor: pointer;height: 25px;width:25px " @click="goEdit">
                    </div>
                </div>
                <div style="display: flex; flex-direction: row; margin-top: 40px;margin-left: 20px; line-height: 30px;font-size:18px;font-weight: 400">
                    <div style="width: 45%;">
                        <div class="table-box">
                            <div class="title">入党时间：</div>
                            <div class="content">{{ dealWithTime(form.partyTime) }}</div>
                        </div>
                        <div class="table-box">
                            <div class="title">党龄：</div>
                            <div class="content">{{ new Date().getFullYear() - new Date(form.partyTime).getFullYear() }}</div>
                        </div>
                        <div class="table-box">
                            <div class="title">党籍状态：</div>
                            <div class="content">{{ findTitleByValue(form.partyState, partyStateList) }}</div>
                        </div>
                        <div class="table-box">
                            <div class="title">外出流向：</div>
                            <div class="content">{{ form.flowPlace && form.flowPlace.length > 0?form.flowPlace:'无' }}</div>
                        </div>
                    </div>
                    <div style="width: 55%; padding-left: 5px;">
                        <div class="table-box">
                            <div class="title" style="width: 160px;">转为正式党员时间：</div>
                            <div class="content">{{ form.transferTime ? dealWithTime(form.transferTime) : '' }}</div>
                        </div>
                        <div class="table-box">
                            <div class="title" style="width: 160px;">党内职务：</div>
                            <div class="content">{{ findTitleByValue(form.position, positionList) }}</div>
                        </div>
                        <div class="table-box">
                            <div class="title" style="width: 160px;">工作岗位：</div>
                            <div class="content">{{ findTitleByValue(form.workPosition, workPositionList) }}</div>
                        </div>
                    </div>
                </div>

                <div v-if="twoBestOneFirstList.length > 0" style="font-size: 18px; margin-left: 20px; margin-top: 20px;">表扬/表彰：
                    <div v-for="(item, index) in twoBestOneFirstList" :key="index" style="padding: 5px 10px;">
                        {{ item.updateTime }}<span style="margin-left: 10px">{{ findTitleByValue(item.commendType, twoBestOneFirstCommendList) }}</span><br>
                        {{ findTitleByValue(item.tableType, twoBestOneFirstTableList) }}
                    </div>
                </div>

                <div class="type">
                    <div style="display: flex; ">
                        <div style="height: 8px;width:8px;background-color: red;align-items:center;margin: auto 0"></div>
                        <div class="type-title"> 基本信息</div>
                    </div>
                    <div class="type-box-content">
                        <div style="width: 49%;">
                            <div class="table-box">
                                <div class="title2">身份证号：</div>
                                <div class="content">{{ hideIdCardNumber(form.idcard) }}</div>
                            </div>
                            <div class="table-box">
                                <div class="title2">出生日期：</div>
                                <div class="content">{{ dealWithTime(form.birthday) }}</div>
                            </div>
                            <div class="table-box">
                                <div class="title2">电话：</div>
                                <div class="content">{{ hidePhoneNumber(form.phone) }}</div>
                            </div>
                        </div>
                        <div style="margin-left: 2%; width: 49%;">
                            <div class="table-box">
                                <div class="title2">民族：</div>
                                <div class="content">{{ findTitleByValue(form.national, nationList) }}</div>
                            </div>
                            <div class="table-box">
                                <div class="title2">学历：</div>
                                <div class="content">{{ findTitleByValue(form.education, educationList) }}</div>
                            </div>
                            <div class="table-box">
                                <div class="title2">座机号码：</div>
                                <div class="content">{{ form.telephone && form.telephone.length > 0?form.telephone:'无' }}</div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="type">
                    <div style="display: flex;">
                        <div style="height: 8px;width:8px;background-color: red;align-items:center;margin: auto 0"></div>
                        <div class="type-title">党内职务</div>
                    </div>
                    <div style="margin-top: 10px;font-size:13px ">
                        <div :class="item?'tag'+(index%3+1):'tag-dis'" v-for="(item, index) in tagList" :key="index">{{ item.label }}</div>
                    </div>
                </div>

            </div>
            <div style="max-width: calc(100% - 500px); width: 100%; padding-left: 10px; overflow: auto; display: flex; flex-direction: column">
                <div class="box-content"
                     style=" padding: 0 72px 0 72px;overflow: auto; display: flex; flex-direction: row; justify-content: space-between; height: 95px; ">
<!--                    <div class="total-view">
                        <div class="img-box">
                            <img :src="images.grade">
                        </div>
                        <div class="box-content-text">
                            <div style="font-size:16px">党员积分</div>
                            <div class="number">56分</div>
                        </div>
                    </div>-->

                    <div class="total-view">
                        <div class="img-box">
                            <img :src="images.study">
                        </div>
                        <div class="box-content-text">
                            <div style="font-size:16px">学习课程</div>
                            <div class="number">{{ countDetail.studyCount }}篇</div>
                        </div>
                    </div>

                    <div class="total-view">
                        <div class="img-box">
                            <img :src="images.live">
                        </div>
                        <div class="box-content-text">
                            <div style="font-size:16px">组织生活</div>
                            <div class="number">{{ countDetail.meetingCount }}次</div>
                        </div>
                    </div>
                    <div class="total-view">
                        <div class="img-box">
                            <img :src="images.cost">
                        </div>
                        <div class="box-content-text">
                            <div style="font-size:16px">党内缴费</div>
                            <div class="number">{{ countDetail.actuallyPay }}元</div>
                        </div>
                    </div>
                </div>
                <div class="box-content" style="margin-top: 20px;">
                    <div style="display: flex; margin-left:20px">
                        <div style="height: 8px;width:8px;background-color: red;align-items:center;margin: auto 0"></div>
                        <div class="type-title" style="font-size: 18px"> 党员生活纪实</div>
                    </div>
                    <div class="type2" style="display: flex; flex-direction: column;">
                        <div style="margin-top: 10px;">
                            <div @click="tagClick(1)" class="tag" :class="selected === 1 ? 'tag1' :'tag-dis'" style="margin-left: 20px">发展历程</div>
                            <div @click="tagClick(2)" class="tag" :class="selected === 2 ? 'tag1' :'tag-dis'" style="margin-left: 20px">三会一课</div>
                            <div @click="tagClick(3)" class="tag" :class="selected === 3 ? 'tag1' :'tag-dis'" style="margin-left: 20px">我的流动</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px; flex: 1 0 auto; height: 0; overflow: auto;padding: 0 20px;">
                    <el-timeline v-if="selected === 1">
                        <el-timeline-item v-if="developPartyList.length > 0" v-for="(item, index) in developPartyList" :timestamp="item.createDate"
                                          icon="el-icon-more" size="large" type="primary" placement="top" :key="index">
                            <div style="font-size: 18px;">
                                <span style="color: red;">【党员发展】</span>
                                <span style="color: #50a0f1;">{{form.realName}}</span> 于
                                <span v-if="item.personType === 1">{{item.submitDate}}</span>
                                <span v-if="item.personType === 2">{{item.activeDate}}</span>
                                <span v-if="item.personType === 3">{{item.developDate}}</span>
                                <span v-if="item.personType === 4">{{item.partyTime}}</span>
                                <span v-if="item.personType === 5">{{item.transferTime}}</span>
                                <span style="color: red;">
                                    {{ item.personType === 1 ? "递交入党申请书" : item.personType === 2 ? "列为入党积极分子" :
                                    item.personType === 3 ? "确定为发展对象" : item.personType === 4 ? "讨论吸收为预备党员" :
                                    item.personType === 5 ? "转为正式党员" : ""}}
                                </span>
                            </div>
                        </el-timeline-item>
                        <div v-if="developPartyList.length == 0">暂无记录</div>
                    </el-timeline>
                    <el-timeline v-if="selected === 2">
                        <el-timeline-item v-if="meetingList.length > 0" v-for="(item, index) in meetingList" :timestamp="item.createDate"
                                          icon="el-icon-more" size="large" type="primary" placement="top" :key="index">
                            <div>
                                <span style="color: red;">【三会一课】</span>
                                <span style="color: #50a0f1;">{{form.realName}}</span> 于
                                <span>{{item.startTime}}</span>
                                <span v-if="item.meetingAddress"> 在{{item.meetingAddress}}参与</span>
                                <span style="color: red;">
                                    {{ item.meetingType === 1 ? "党小组会" : item.meetingType === 2 ? "支部委员会" :
                                    item.meetingType === 3 ? "支部党员大会" : item.meetingType === 4 ? "党课" : ""}}
                                </span>
                            </div>
                        </el-timeline-item>
                        <div v-if="meetingList.length == 0">暂无记录</div>
                    </el-timeline>
                    <el-timeline v-if="selected === 3">
                        <el-timeline-item v-if="partyFloatingList.length > 0" v-for="(item, index) in partyFloatingList" :timestamp="item.createDate"
                                          icon="el-icon-more" size="large" type="primary" placement="top" :key="index">
                            <div>
                                <span style="color: red;">【我的流动】</span>
                                <span style="color: #50a0f1;">{{form.realName}}</span> 于
                                <span>{{item.floatingDate}}</span>
                                <span style="color: red;">
                                    {{ item.floatingType === 1 ? "流入" : item.floatingType === 2 ? "流出" : ""}}
                                </span>
                                <span v-if="item.deptName"> 到{{item.deptName}}</span>
                            </div>
                        </el-timeline-item>
                        <div v-if="partyFloatingList.length == 0">暂无记录</div>
                    </el-timeline>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {getPartyInfo, getPartyMemberCountDetail} from "@/api/jcxfPartyMember";
    import {getDictByType, getDictByType2} from "@/api/tDictData";
    import {getDictByCode} from "@/api/jcxfSysDictionary";
    import grade from "@/assets/grade.png"
    import study from "@/assets/study.png"
    import edit from "@/assets/edit.png"
    import live from "@/assets/live.png"
    import cost from "@/assets/cost.png"
    import defaultHeader from "@/assets/default-header.png"
    import util from "@/libs/util";
    import {getTzTwoBestOneFirstListByPartyMemberId} from "@/api/tzTwoBestOneFirst";
    import {getTzStudyUserList} from "@/api/tzStudyUser";
    import {getDevelopPartyListByPartyMemberId} from '@/api/jcxfDevelopParty'
    import {getMeetingByPartyMemberId} from '@/api/jcxfPartyMeeting'
    import {getPartyFloatingListByPartyMemberId} from "@/api/jcxfPartyFloatingMember"

    export default {
        name: "person_details",
        data() {
            return {
                images: {
                    grade: grade,
                    study: study,
                    live: live,
                    cost: cost,
                    edit: edit
                },
                defaultHeader: defaultHeader,
                base: util.jcxfUrl,
                tagList: [],
                form: {
                    realName: '',
                    sex: '',
                    deptName: '',
                    partyTime: null,
                    partyState: '',
                    flowPlace: '',
                    transferTime: null,
                    position: '',
                    workPosition: '',
                    areaName: '',
                    idcard: '',
                    birthday: null,
                    phone: '',
                    nationList: '',
                    educationList: '',
                    telephone: ''
                },
                idCardImgList: [],
                tmp: [],
                sexList: [{'label': '男', 'itemValue': 1}, {'label': '女', 'itemValue': 2}],
                personTypeList: [],
                nationList: [],
                educationList: [],
                positionList: [],
                partyStateList: [],
                workPositionList: [],
                partyWorkerList: [],
                twoBestOneFirstList: [],
                twoBestOneFirstCommendList: [],
                twoBestOneFirstTableList: [],
                countDetail: {
                    studyCount: 0,
                    meetingCount: 0,
                    actuallyPay: '0.00'
                },
                studyList: [],
                selected:1,
                developPartyList:[],
                meetingList:[],
                partyFloatingList:[]
            }
        },
        mounted() {
            this.id = this.$route.query.id ? this.$route.query.id : ''
            getPartyMemberCountDetail(this.id).then(res => {
                if (res.data.code == '00000') {
                    this.countDetail = res.data.data
                }
            })
            getTzStudyUserList(this.id+'').then(res => {
                if (res.data.code == '00000') {
                    this.studyList = res.data.data
                }
            })
            this.init()
        },
        created() {

        },
        methods: {
            //tag选择
            tagClick(num){
                this.selected = num
                if(num === 1){
                    this.getDevelopPartyList()
                }else if(num === 2){
                    this.getMeetingList()
                }else if(num === 3){
                    this.getPartyFloatingList()
                }
            },
            //获取党员发展历程
            getDevelopPartyList(){
                this.developPartyList = []
                getDevelopPartyListByPartyMemberId(this.id).then(res =>{
                    if(res.data){
                        this.developPartyList = res.data.data
                    }
                })
            },
            //获取三会一课列表
            getMeetingList(){
                this.meetingList = []
                getMeetingByPartyMemberId(this.id).then(res =>{
                    if(res.data){
                        this.meetingList = res.data.data
                    }
                })
            },
            //获取党员流入流出信息
            getPartyFloatingList(){
                this.partyFloatingList = []
                getPartyFloatingListByPartyMemberId(this.id).then(res =>{
                    if(res.data){
                        this.partyFloatingList = res.data.data
                    }
                })
            },
            goEdit() {
                this.$router.push({
                    path: '/dwgl/updatePerson',
                    query: {
                        id: this.id,
                        type: 0,
                        deptId: this.$route.query.deptId
                    }
                })
            },
            backPath() {
                if (this.$route.query.page) {
                    this.$router.go(-1);
                } else {
                    this.$router.push({
                        path: '/dwgl/dygl',
                        query: {
                            deptId: this.$route.query.deptId
                        }
                    })
                }

            },
            init() {
                let data = {
                    partyMemberId: this.id,
                    status: '6'
                }
                getTzTwoBestOneFirstListByPartyMemberId(data).then(res => {
                    let data = res.data
                    if (data.code == '00000') {
                        this.twoBestOneFirstList = data.data
                    }
                })

                this.getDevelopPartyList()

                Promise.all([
                    this.getDict('nation'),
                    this.getDict('education'),
                    this.getDict('position'),
                    this.getDict('personType'),
                    this.getDict('partyState'),
                    this.getDict('workPosition'),
                    this.getDict2('partyWorker'),
                    this.getDict2('twoBestOneFirstCommend'),
                    this.getDict2('twoBestOneFirstTable'),
                ]).then(() => {
                    getPartyInfo(this.id).then((res) => {
                        this.form = res.data.data
                        this.form.isFirstSecretary = this.form.isFirstSecretary ? this.form.isFirstSecretary : ''
                        this.form.isPoverty = this.form.isPoverty ? this.form.isPoverty : ''
                        if (this.form.attachFiles) {
                            this.idCardImgList[0] = this.form.attachFiles[0]
                            this.tmp.push(this.base + this.form.attachFiles[0].filePath)
                        }

                        // if (this.form.isPartyWorker == '1') {
                        //     this.form.partyWorkerTips = this.form.partyWorkerTips.split(',')
                        //     for (let i = 0; i < this.partyWorkerList.length; i++) {
                        //         const itemValue = this.partyWorkerList[i].itemValue;
                        //         if (this.form.partyWorkerTips.includes(itemValue)) {
                        //             this.partyWorkerList[i].isSelect = true;
                        //         }
                        //     }
                        // }
                        this.tagList = this.positionList.filter(item => item.itemValue == this.form.position)
                        this.$forceUpdate();
                    })
                })
            },
            getDict(type) {
                return new Promise((resolve, reject) => {
                    getDictByCode(type).then((res) => {
                        let data = res.data.data
                        if (type === 'nation') {
                            this.nationList = data
                        } else if (type === 'education') {
                            this.educationList = data
                        } else if (type === 'position') {
                            this.positionList = data
                        } else if (type === 'personType') {
                            this.personTypeList = data
                        } else if (type === 'partyState') {
                            this.partyStateList = data
                        } else if (type === 'workPosition') {
                            this.workPositionList = data
                        }
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                })

            },
            getDict2(type) {
                return new Promise((resolve, reject) => {
                    getDictByType2(type).then((res) => {
                        let data = res.data
                        if (type === 'partyWorker') {
                            this.partyWorkerList = data
                        } else if (type === 'twoBestOneFirstCommend') {
                            this.twoBestOneFirstCommendList = data
                        } else if (type === 'twoBestOneFirstTable') {
                            this.twoBestOneFirstTableList = data
                        }
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                })

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
                return ''
            },
            dealWithTime(time) {
                let newTime = new Date(time)
                let month = newTime.getMonth() + 1
                month = month < 10 ? '0' + month : month

                let date = newTime.getDate()
                date = date < 10 ? '0' + date : date

                return newTime.getFullYear() + '-' + month + '-' + date
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personDetails{
        //height: calc(100vh - 65px);
        //background-image: url("../../../assets/page-bg.png");
        //background-size: 100% 100%;
        background: white;
    }
    .type-title {
        color: rgba(204, 49, 35, 1);;
        font-weight: bold;
        font-size: 15px;
        line-height: 25px;
        margin-left: 10px;
    }

    .tag {
        margin-right: 10px;
        border-radius: 3px;
        padding: 6px 10px;
        margin-bottom: 5px;
        display: inline-block;
        cursor: pointer;
    }
    .tag1 {
        background: red;
        color: white;
    }
    .tag-dis {
        background: rgb(169, 169, 169);
        color: white;
    }

    .box {
        display: flex;
        flex-direction: row;
        background-color: white;
        padding: 15px 20px 20px 20px;
        text-align: left;

        .box-content {
            border: 1px solid rgb(246, 246, 246);
            border-radius: 5px;
            padding: 15px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);

            .type {
                margin-top: 30px;
                width: 100%;

                .type-title {
                    color: rgba(204, 49, 35, 1);;
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 25px;
                    margin-left: 10px;
                }

                .type-box-content {
                    line-height: 25px;
                    display: flex;
                    flex-direction: row;
                    border: 1px solid rgb(246, 246, 246);
                    border-radius: 5px;
                    padding: 15px;
                    font-size: 18px;
                    font-weight: 400;
                    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
                    margin-top: 10px;
                }

                .tag1 {
                    margin-right: 10px;
                    background: red;
                    color: white;
                    border-radius: 3px;
                    padding: 5px 10px;
                    margin-bottom: 5px;
                    display: inline-block;
                }

                .tag2 {
                    margin-right: 10px;
                    background: rgb(60, 173, 239);
                    color: white;
                    border-radius: 3px;
                    padding: 5px 10px;
                    margin-bottom: 5px;
                    display: inline-block;
                }

                .tag3 {
                    margin-right: 10px;
                    background: rgb(245, 175, 83);
                    color: white;
                    border-radius: 3px;
                    padding: 5px 10px;
                    margin-bottom: 5px;
                    display: inline-block;
                }

                .tag-dis {
                    margin-right: 10px;
                    background: rgb(169, 169, 169);
                    color: white;
                    border-radius: 3px;
                    padding: 7px 20px;
                    margin-bottom: 5px;
                    display: inline-block;
                }

            }

            .type2 {
                .type-title2 {
                    color: red;
                    font-weight: bold;
                    line-height: 25px;
                }
            }


            .table-box {
                display: flex;
                flex-direction: row;
                margin-top: 15px;

                .title {
                    white-space: nowrap;
                    color: #858585;
                    width: 100px;
                    text-align: end;
                }

                .title2 {
                    white-space: nowrap;
                    color: #858585;
                    width: 100px;
                    text-align: end;
                }

                .content {
                    word-break: break-all;
                }
            }

            .total-view {
                padding: 10px;
                /*color: red;*/
                display: flex;
                flex-direction: row;
                text-align: center;
                justify-content: space-between;

                .box-content-text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 73px;
                    margin-left: 18px;
                }

                .img-box {
                    display: flex;
                    align-items: center;

                    img {
                        height: 42px;
                        /*padding-right: 5px;*/
                    }
                }

                .number {
                    font-weight: bold;
                    font-size: 20px;
                    color: red;
                }
            }
        }
    }
    ::v-deep .el-timeline-item__timestamp{
        font-size: 18px !important;
    }
    ::v-deep .el-timeline-item__node--large {
        left: -4px;
        width: 18px;
        height: 18px;
    }
</style>
