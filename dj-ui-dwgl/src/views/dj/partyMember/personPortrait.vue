<template>
    <div style="background: white;" class="personPortrait">
        <div style="display: flex;justify-content: space-between;">
            <div style="display: flex;align-items: center;">
                <div style="height: 14px;width:14px;background-color: red;align-items:center;margin: auto 0"></div>
                <div class="type-title">党员画像</div>
            </div>
            <div>
                <el-button size="small" type="danger" plain @click="goDetails()">党员详情</el-button>
                <el-button size="small" type="danger" plain @click="goEdit()">党员编辑</el-button>
                <el-button size="small" class="topBtn" icon="el-icon-arrow-left" @click="backPath()">返回</el-button>
            </div>
        </div>
        <div class="box">
            <el-row>
                <el-col :span="7">
                    <div style="margin-bottom: 60px;">
                        <div class="type">
                            <div style="display: flex; ">
                                <div class="title-left"></div>
                                <div class="type-title"> 基本信息</div>
                            </div>
                            <div class="type-box-content">
                                <div style="width: 100%;">
                                    <div class="table-box">
                                        <div class="title2">党员姓名：</div>
                                        <div class="content">{{ form.realName }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">性别：</div>
                                        <div class="content">{{ findTitleByValue(form.sex, sexList) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">出生年月：</div>
                                        <div class="content">{{ dealWithTime(form.birthday) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">民族：</div>
                                        <div class="content">{{ findTitleByValue(form.national, nationList) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">身份证号：</div>
                                        <div class="content">{{ hideIdCardNumber(form.idcard) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">籍贯：</div>
                                        <div class="content">{{ form.areaName ? form.areaName : "暂无" }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">学历：</div>
                                        <div class="content">{{ findTitleByValue(form.education, educationList) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="type">
                            <div style="display: flex; ">
                                <div class="title-left"></div>
                                <div class="type-title"> 联系方式</div>
                            </div>
                            <div class="type-box-content">
                                <div style="width: 100%;">
                                    <div class="table-box">
                                        <div class="title2">座机号码：</div>
                                        <div class="content">{{ form.telephone && form.telephone.length > 0?form.telephone:'无' }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">党员手机号：</div>
                                        <div class="content">{{ hidePhoneNumber(form.phone) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">现住址：</div>
                                        <div class="content" style="width: 70%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                            <el-tooltip class="item" effect="dark" :content="form.address ? form.address : '暂无'" placement="top-start">
                                                <span>{{ form.address ? form.address : '暂无' }}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="type">
                        <div style="display: flex;">
                            <div style="height: 8px;width:8px;background-color: red;align-items:center;margin: auto 0"></div>
                            <div class="type-title">党内职务</div>
                        </div>
                        <div style="margin-top: 10px;font-size:15px;text-align: left;">
                            <div class="tag" :class="item?'tag'+(index%3+1):'tag-dis'" v-for="(item, index) in tagList" :key="index">{{ item.label }}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div id="portraitChart" ref="portraitChart" style="height: calc(100% - 120px);width: 100%;"></div>
                </el-col>
                <el-col :span="7">
                    <div style="margin-bottom: 60px;">
                        <div class="type">
                            <div style="display: flex; ">
                                <div class="title-left"></div>
                                <div class="type-title"> 党内信息</div>
                            </div>
                            <div class="type-box-content">
                                <div style="width: 100%;">
                                    <div class="table-box">
                                        <div class="title2">所属党支部：</div>
                                        <div class="content" style="width: 70%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                                            <el-tooltip class="item" effect="dark" :content="form.deptName" placement="top-start">
                                                <span>{{ form.deptName }}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">党内职务：</div>
                                        <div class="content">{{ findTitleByValue(form.position, positionList) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">入党时间：</div>
                                        <div class="content">{{ dealWithTime(form.partyTime) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">转正时间：</div>
                                        <div class="content">{{ form.transferTime ? dealWithTime(form.transferTime) : '' }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">党籍状态：</div>
                                        <div class="content">{{ findTitleByValue(form.partyState, partyStateList) }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">个人党龄：</div>
                                        <div class="content">{{ new Date().getFullYear() - new Date(form.partyTime).getFullYear() }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">工作单位：</div>
                                        <div class="content">{{ form.workUnit ? form.workUnit : '暂无' }}</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">工作岗位：</div>
                                        <div class="content">{{ findTitleByValue(form.workPosition, workPositionList) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="type">
                            <div style="display: flex; ">
                                <div class="title-left"></div>
                                <div class="type-title"> 组织生活</div>
                            </div>
                            <div class="type-box-content">
                                <div style="width: 100%;">
                                    <div class="table-box">
                                        <div class="title2">学习笔记：</div>
                                        <div class="content">{{ countDetail.studyCount }}篇</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">会议活动：</div>
                                        <div class="content">{{ countDetail.meetingCount }}次</div>
                                    </div>
                                    <div class="table-box">
                                        <div class="title2">党费：</div>
                                        <div class="content">{{ countDetail.actuallyPay }}元</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import {getPartyInfo, getPartyMemberCountDetail} from "@/api/jcxfPartyMember";
import {getTzStudyUserList} from "@/api/tzStudyUser";
import {getTzTwoBestOneFirstListByPartyMemberId} from "@/api/tzTwoBestOneFirst";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {getDictByType2} from "@/api/tDictData";

    export default {
        name: "personPortrait",
        data() {
            return {
                countDetail: {
                    studyCount: 0,
                    meetingCount: 0,
                    actuallyPay: '0.00'
                },
                studyList: [],
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
        methods: {
            // 编辑
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
            //详情
            goDetails(){
                this.$router.push({
                    path: '/dwgl/personDetails',
                    query: {
                        id: this.id,
                        type: 1,
                        deptId: this.$route.query.deptId
                    }
                })
            },
            //返回
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
                        this.getChart(this.form)
                        this.form.isFirstSecretary = this.form.isFirstSecretary ? this.form.isFirstSecretary : ''
                        this.form.isPoverty = this.form.isPoverty ? this.form.isPoverty : ''
                        if (this.form.attachFiles) {
                            this.idCardImgList[0] = this.form.attachFiles[0]
                            this.tmp.push(this.base + this.form.attachFiles[0].filePath)
                        }


                        // if (this.form.isPartyWorker == '1') {
                        //     this.form.partyWorkerTips = this.form.partyWorkerTips.split(',')
                        //     for (let i = 0; i < this.positionList.length; i++) {
                        //         const itemValue = this.positionList[i].itemValue;
                        //         if (this.form.partyWorkerTips.includes(itemValue)) {
                        //             this.positionList[i].isSelect = true;
                        //             this.tagList.push(this.positionList[i])
                        //         }
                        //     }
                        // }
                        this.tagList = this.positionList.filter(item => item.itemValue == this.form.position)
                        this.$forceUpdate();
                    })
                })
            },
            getChart(form){
                this.myChart = echarts.init(this.$refs.portraitChart);
                var partyTime = new Date().getFullYear() - new Date(form.partyTime).getFullYear() + '年党龄'
                var education = this.findTitleByValue(form.education, this.educationList).split(" ")[1]
                var studyCount = this.countDetail.studyCount + '篇笔记'
                var actuallyPay = this.countDetail.actuallyPay + '元党费'
                var meetingCount = this.countDetail.meetingCount + '次活动'
                var national = this.findTitleByValue(form.national, this.nationList).split(" ")[1]
                var getname = [national,education,partyTime,studyCount,actuallyPay,meetingCount];
                var current = form.realName
                var family = getname.map((item,index)=>{
                    return{
                        name:getname[index],
                    }
                })
                // var imagePattern = new echarts.graphic.Image({ // 图片实例
                //         style: {
                //             image: '../../../assets/partyMember/man.png', // 图片的 URL
                //             repeat: 'repeat' // 图片的平铺方式
                //         }
                //     }
                // );

                let iconPath = form.sex == 1 ? 'https://minio-test.lzjczl.com/sk-paas/2024/05/11/9e6b781e3c92480ca70b51150c385c02.png' : 'https://minio-test.lzjczl.com/sk-paas/2024/05/11/5942037606a5483e898053ed5e3f33bc.png';

                var data = [{
                    type:'党员关系',
                    value:family
                }]
                // 圆形颜色
                var colorList = {
                    '党员关系':new echarts.graphic.LinearGradient(0,0,0,1,[{
                        offset:0,
                        color:'#cc3123'
                    },{
                        offset:1,
                        color:'#f18b82'
                    }]),
                    '中心':new echarts.graphic.LinearGradient(0,0,0,1,[{
                        offset:0,
                        color:'#FF6061'
                    },{
                        offset:1,
                        color:'#FF7E7C'
                    }])
                }
                // 背景颜色
                var shadowList = {
                    '党员关系':'#cc3123'
                }
                // 线条颜色
                var lineList = {
                    '党员关系':'#DCEAF2'
                }
                var links = []
                var linkNum = 1;
                var seriesData = data.map((item,index)=>{
                    return item.value.map((it,id)=>{
                        links.push({
                            source:0,
                            target:linkNum++,
                            lineStyle:{
                                color:lineList[item.type]
                            }
                        })
                        return {
                            ...it,
                            itemStyle:{
                                normal:{
                                    color:colorList[item.type],
                                    shadowColor:shadowList[item.type],
                                    shadowBlur:10
                                }
                            },
                            category:item.type
                        }
                    })
                })
                let option = {
                    title: {
                        text: ''
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 12
                            }
                        }
                    },
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            symbolSize: 80,
                            center: ['50%', '50%'],
                            draggable:true,
                            focusNodeAdjacency: true,
                            roam: false,
                            itemStyle: {
                                normal: {
                                    color: colorList['中心'],
                                    shadowColor:'rgba(255, 100, 100, 0.5)',
                                    shadowBlur:10
                                },
                                emphasis: {
                                    // 高亮状态
                                }
                            },
                            categories: [
                                {
                                    name: '党员关系',
                                    itemStyle: {
                                        normal: {
                                            color: colorList['党员关系']
                                        }
                                    }
                                }
                            ],
                            label: {
                                normal: {
                                    color:'#ffffff',
                                    show: true,
                                    textStyle: {
                                        fontSize: 12
                                    }
                                }
                            },
                            force: {
                                repulsion: 1000,
                                gravity: 0.1,
                                edgeLength: [100, 200]
                            },
                            edgeSymbolSize: [4, 50],

                            lineStyle: {
                                normal: {
                                    width: 5,
                                    curveness: 0.1, // 线的弯曲度 0-1之间 越大则歪曲度更大
                                    color: '#B5D7C9'
                                }
                            },
                            data:[{name:'', symbol: "image://" + iconPath, symbolSize: [100, 100]},...seriesData.flat(2)],
                            links:links
                        }
                    ]
                };
                this.myChart.setOption(option);
            },
            //字典
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
    .personPortrait{
        padding: 14px 40px 0 40px;
        .type-title {
            color: #333;
            font-weight: bold;
            font-size: 17px;
            line-height: 25px;
            margin-left: 10px;
        }
        .box{
            .title-left{
                height: 8px;
                width:8px;
                background-color: red;
                align-items:center;
                margin: auto 0;
                border-radius: 50%;
            }
            .type {
                margin-top: 30px;
                width: 100%;
                .table-box{
                    display: flex;
                    .title2{
                        width: 130px;
                        text-align: end;
                        color: #858585;
                    }
                }
                .type-title {
                    color: rgba(204, 49, 35, 1);;
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 25px;
                    margin-left: 10px;
                }
                .type-box-content {
                    line-height: 45px;
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
                .tag{
                    text-align: center;
                }
                .tag1 {
                    margin-right: 10px;
                    background: red;
                    color: white;
                    border-radius: 3px;
                    padding: 3px 10px;
                    margin-bottom: 5px;
                    display: inline-block;
                }

                .tag2 {
                    margin-right: 10px;
                    background: rgb(60, 173, 239);
                    color: white;
                    border-radius: 3px;
                    padding: 3px 10px;
                    margin-bottom: 5px;
                    display: inline-block;
                }

                .tag3 {
                    margin-right: 10px;
                    background: rgb(245, 175, 83);
                    color: white;
                    border-radius: 3px;
                    padding: 3px 10px;
                    margin-bottom: 5px;
                    display: inline-block;
                }
            }
        }
    }
</style>
