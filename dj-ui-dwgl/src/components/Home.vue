<template>
    <div class="container1">
        <div class="con-top" v-if="onloading" style="margin: 0 15px">
<!--            <el-button size="small" @click="encrypt">加密</el-button>-->
<!--            <el-button size="small" @click="updatePass">密码</el-button>-->
            <div class="con-top-row">
                <div class="con-top-row-item item1" @click="goPartyInfo">
                    <div class="con-top-row-content">
                        <div class="con-top-row-content-label" style="margin: auto 0 auto 1.3rem;">
                            <div class="con-top-row-label">党员数量</div>
                            <div class="con-top-row-content-bottom">
                                <div class="con-top-row-content-text">{{ topInfo.partyTotal }}</div>
                                <div class="con-top-row-content-unit">(人)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="con-top-row-item item2" @click="goDeptInfo">
                    <div class="con-top-row-content">
                        <div class="con-top-row-content-label" style="margin: auto 0 auto 1.3rem;">
                            <div class="con-top-row-label">党组织数量</div>
                            <div class="con-top-row-content-bottom">
                                <div class="con-top-row-content-text">{{ topInfo.deptTotal }}</div>
                                <div class="con-top-row-content-unit">(个)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="con-top-row-item item3" @click="goOrganizationLife">
                    <div class="con-top-row-content">
                        <div class="con-top-row-content-label" style="margin: auto 0 auto 1.3rem;">
                            <div class="con-top-row-label">三会一课开展次数(本月)</div>
                            <div class="con-top-row-content-bottom">
                                <div class="con-top-row-content-text">{{ topInfo.meetingMonth }}</div>
                                <div class="con-top-row-content-unit">(次)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="con-top-row-item item4" @click="goOrganizationLife">
                    <div class="con-top-row-content">
                        <div class="con-top-row-content-label" style="margin: auto 0 auto 1.3rem;">
                            <div class="con-top-row-label">组织生活开展次数(本年)</div>
                            <div class="con-top-row-content-bottom">
                                <div class="con-top-row-content-text">{{ topInfo.meetingYear }}</div>
                                <div class="con-top-row-content-unit">(次)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="con-top-row-item item5" @click="goPayFee">
                    <div class="con-top-row-content">
                        <div class="con-top-row-content-label" style="margin: auto 0 auto 1.3rem;">
                            <div class="con-top-row-label">党费缴纳(本月)</div>
                            <div class="con-top-row-content-bottom">
                                <div class="con-top-row-content-text">{{ topInfo.payFeeTotal }}</div>
                                <div class="con-top-row-content-unit">(元)</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="con-second" style="width: 100%; padding:0 15px;margin-top: 15px">
            <div class="con-second-right">
                <div class="con-second-left-box" style="width: 45%;">
                    <div style="color: #333;font-size: 17px;font-weight: bold;
                    border-bottom: 3px solid red;width: 120px;margin-bottom: 10px;">基层党组织数据</div>
                    <div class="con-second-right-row">
                        <div class="con-second-right-con">
                            <div class="con-second-right-con-font" style="background-color: #E33424;">已换届组织数{{ deptTermInfoStatistics.term.all }}个</div>
                            <div class="con-second-right-con-row" style="margin: 15px 15px 0">
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="yhjdwsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">已换届党委</div>
                                        <div class="con-child-font con-child-red-font">{{
                                                deptTermInfoStatistics.term.dw
                                            }}个
                                        </div>
                                    </div>
                                </div>
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="yhjdzzsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">已换届党总支</div>
                                        <div class="con-child-font con-child-red-font">
                                            {{ deptTermInfoStatistics.term.dzzb }}个
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="con-second-right-con-row" style="margin: 0.27rem 15px 0">
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="yhjdzbsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">已换届党支部</div>
                                        <div class="con-child-font con-child-red-font">
                                            {{ deptTermInfoStatistics.term.dzb }}个
                                        </div>
                                    </div>
                                </div>
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="yhjlhdzbsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">已换届联合党支部</div>
                                        <div class="con-child-font con-child-red-font">
                                            {{ deptTermInfoStatistics.term.lhdzb }}个
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="con-second-right-con">
                            <!-- <img :src="font2" style="margin-top: 53px"> -->
                            <div class="con-second-right-con-font" style="background-color: #FE8B4E;">未换届组织数{{ deptTermInfoStatistics.notTerm.all }}个</div>
                            <div class="con-second-right-con-row" style="margin: 15px 15px 0">
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="whjdwsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">未换届党委</div>
                                        <div class="con-child-font con-child-yellow-font">
                                            {{ deptTermInfoStatistics.notTerm.dw }}个
                                        </div>
                                    </div>
                                </div>
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="whjdzzsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">未换届党总支</div>
                                        <div class="con-child-font con-child-yellow-font">
                                            {{ deptTermInfoStatistics.notTerm.dzzb }}个
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="con-second-right-con-row" style="margin: 0.27rem 15px 0;">
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="whjdzbsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">未换届党支部</div>
                                        <div class="con-child-font con-child-yellow-font">
                                            {{ deptTermInfoStatistics.notTerm.dzb }}个
                                        </div>
                                    </div>
                                </div>
                                <div class="con-child">
                                    <div>
                                        <div>
                                            <img :src="whjlhdzbsPng" alt="">
                                        </div>
                                        <div class="con-child-font add-margin">未换届联合党支部</div>
                                        <div class="con-child-font con-child-yellow-font">
                                            {{ deptTermInfoStatistics.notTerm.lhdzb }}个
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="con-second-right-row" style="margin-left: 30px;width: 55%;">
                    <div style="width: 50%;">
                        <div style="color: #333;font-size: 17px;font-weight: bold;
                            border-bottom: 3px solid red;width: 120px;margin-bottom: 10px;">基层党组织数据</div>
                        <el-card style="height: 3.2rem;">
                            <div ref="chart5" style="height:3.2rem;"></div>
                        </el-card>
                    </div>
                    <div style="width: 50%;margin-left: 30px;">
                        <div style="color: #333;font-size: 17px;font-weight: bold;
                            border-bottom: 3px solid red;width: 70px;margin-bottom: 10px;">党龄分布</div>
                        <el-card style="height: 3.2rem;">
                            <div ref="chart4" style="height:3.5rem"></div>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
<!--        <div class="con-third">-->

        <div style="display: flex;">
            <div class="con-second-right-box con-third-right" style="padding: 15px 0 0 15px;width: 45.5%;">
                <div style="color: #333;font-size: 17px;font-weight: bold;
                    border-bottom: 3px solid red;width: 150px;margin-bottom: 10px;">党费缴纳率(近一年)</div>
                <div class="con-third-right-con" style="border-radius: 10px;">
                    <el-card>
                        <div ref="chart6" style="height:3rem"></div>
                    </el-card>
                </div>
            </div>
            <div class="con-third-right" style="margin: 0 15px 0 30px;padding-top: 15px;width: 53%;">
                <div style="color: #333;font-size: 17px;font-weight: bold;
                    border-bottom: 3px solid red;width: 200px;margin-bottom: 10px;">三会一课开展数据(近一年)</div>
                <div class="con-third-right-con">
                    <el-card>
                        <div ref="chart7" style="height:3rem"></div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {
    getPartyMemberCount,
    getDeptCount,
    getMeetingCountThisYear,
    getMeetingCountThisMonth,
    getPayFeeMoneyByMonth,
    getGenderCount,
    getFloatingPartyMemberCount,
    getAgeDistribution,
    getPartyStandingDistribution,
    getTermInfo,
    getPayFeeNearlyYearCount, getMeetingNearlyYearCount
} from "@/api/homePage"
import conTitle from "@/assets/home/conTitle.png"
import partyCount from "@/assets/home/partyCount.png"
import orgCount from "@/assets/home/orgCount.png"
import font from "@/assets/home/font.png"
import font2 from "@/assets/home/font2.png"
import peoplePng from "@/assets/home/people.png"
import hqPng from "@/assets/home/hongqi.png"
import layerPng from "@/assets/home/layer.png"
import treePng from "@/assets/home/tree.png"
import moneyPng from "@/assets/home/money.png"
import yhjdwsPng from "@/assets/home/yhjdws.png"
import yhjdzbsPng from "@/assets/home/yhjdzbs.png"
import yhjdzzsPng from "@/assets/home/yhjdzzs.png"
import yhjlhdzbsPng from "@/assets/home/yhjlhdzbs.png"
import whjdwsPng from "@/assets/home/whjdws.png"
import whjdzbsPng from "@/assets/home/whjdzbs.png"
import whjdzzsPng from "@/assets/home/whjdzzs.png"
import whjlhdzbsPng from "@/assets/home/whjlhdzbs.png"
import {mapGetters} from "vuex";
import {getPartyMemberNoEncrypt,updatePartyMemberPassWord} from "@/api/jcxfPartyMember";

export default {
    name: "Home",
    props: {
        msg: String,
    },
    data() {
        return {
            dataListLoading: true,
            topInfo: {
                partyTotal: 0,
                deptTotal: 0,
                meetingMonth: 0,
                meetingYear: 0,
                payFeeTotal: 0
            },
            partyMemberStatistics: {
                manTotal: 0,
                womanTotal: 0,
                floatingTotal: 0,
                notFloatingTotal: 0,
                ageDistribution: [0, 0, 0, 0, 0, 0],
                partyStandingDistribution: [0, 0, 0, 0, 0, 0]
            },
            deptTermInfoStatistics: {
                term: {
                    all: 0,
                    dw: 0,
                    dzzb: 0,
                    dzb: 0,
                    lhdzb: 0
                },
                notTerm: {
                    all: 0,
                    dw: 0,
                    dzzb: 0,
                    dzb: 0,
                    lhdzb: 0
                }
            },
            payFeeNearlyYear: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            deptInfoStatistics: {
                all: 0,
                dw: 0,
                dzzb: 0,
                dzb: 0,
                lhdzb: 0
            },
            meetingNearlyYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            deptId: '',
            font: font,
            font2: font2,
            conTitle: conTitle,
            partyCount: partyCount,
            orgCount: orgCount,
            showArr: [false, false, false, false, false, false, false, false, false, false, false, false],
            peoplePng,
            hqPng,
            layerPng,
            treePng,
            moneyPng,
            yhjdwsPng,
            yhjdzbsPng,
            yhjdzzsPng,
            yhjlhdzbsPng,
            whjdwsPng,
            whjdzbsPng,
            whjdzzsPng,
            whjlhdzbsPng,
            onloading: true,
        };
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    mounted() {
        this.deptId = this.deptInfo.id

        // 获取近一年的年月数组
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() + 1
        const yearMonthArr = []
        for (let i = 0; i < 12; i++) {
            let test = currentMonth - i + 1
            let tmpMonth = currentMonth - i
            let month = tmpMonth <= 0 ? tmpMonth + 12 : tmpMonth
            let year = currentYear - Math.floor((month - 1) / 12)
            if (month > test) {
                year = year - 1
            }

            if (month < 10) {
                month = "0" + month
            }

            yearMonthArr.push(year.toString() + '-' + month.toString())
        }
        this.yearMonthArr = yearMonthArr.reverse()

        this.partyMemberCount(0)
        this.deptCount(1)
        this.meetingCountThisMonth(2)
        this.meetingCountThisYear(3)
        this.payFeeMoneyByMonth(4)
        this.genderCount(5)
        this.floatingPartyMemberCount(6)
        this.ageDistribution(7)
        this.partyStandingDistribution(8)
        this.termInfo(9)
        this.payFeeNearlyYearCount(10)
        this.meetingNearlyYearCount(11)
    },
    methods: {
        updatePass(){
            updatePartyMemberPassWord().then(res =>{

            })
        },
        encrypt(){
            getPartyMemberNoEncrypt().then(res =>{

            })
        },
        goPartyInfo() {
            this.$router.push({path: '/dwgl/dwgl'})
        },
        goDeptInfo() {
            this.$router.push({path: '/dwgl/dept/organization'})
        },
        goOrganizationLife() {
            this.$router.push({path: '/dwgl/organizationLife'})
        },
        goPayFee() {
            this.$router.push({path: '/dwgl/dwgl/payFeePerson'})
        },
        setShowArr(index) {
            this.showArr[index] = true
            if (this.showArr.indexOf(false) < 0) {
                this.$forceUpdate()
            }
        },
        partyMemberCount(index) {
            getPartyMemberCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.topInfo.partyTotal = data.data
                }
                this.setShowArr(index)
            })
        },
        deptCount(index) {
            getDeptCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.topInfo.deptTotal = data.data
                }
                this.setShowArr(index)
            })
        },
        meetingCountThisMonth(index) {
            getMeetingCountThisMonth(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.topInfo.meetingMonth = data.data
                }
                this.setShowArr(index)
            })
        },
        meetingCountThisYear(index) {
            getMeetingCountThisYear(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.topInfo.meetingYear = data.data
                }
                this.setShowArr(index)
            })
        },
        payFeeMoneyByMonth(index) {
            getPayFeeMoneyByMonth(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.topInfo.payFeeTotal = data.data
                }
                this.setShowArr(index)
            })
        },
        genderCount(index) {
            getGenderCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.partyMemberStatistics.manTotal = data.data.man
                    this.partyMemberStatistics.womanTotal = data.data.woman
                }
                this.initEcharts1()
                this.setShowArr(index)
            })
        },
        floatingPartyMemberCount(index) {
            getFloatingPartyMemberCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.partyMemberStatistics.floatingTotal = data.data.floating
                    this.partyMemberStatistics.notFloatingTotal = data.data.notFloating
                }
                this.initEcharts3()
                this.setShowArr(index)
            })
        },
        ageDistribution(index) {
            getAgeDistribution(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000' && data.data != null) {
                    let value = []
                    value.push(data.data.a)
                    value.push(data.data.b)
                    value.push(data.data.c)
                    value.push(data.data.d)
                    value.push(data.data.e)
                    value.push(data.data.f)
                    this.partyMemberStatistics.ageDistribution = value
                }
                this.initEcharts2()
                this.setShowArr(index)
            })
        },
        partyStandingDistribution(index) {
            getPartyStandingDistribution(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000' && data.data != null) {
                    let value = []
                    value.push(data.data.a)
                    value.push(data.data.b)
                    value.push(data.data.c)
                    value.push(data.data.d)
                    value.push(data.data.e)
                    value.push(data.data.f)
                    this.partyMemberStatistics.partyStandingDistribution = value
                }
                this.initEcharts4()
                this.setShowArr(index)
            })
        },
        termInfo(index) {
            getTermInfo(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000' && data.data != null) {
                    if (data.data.term != null) {
                        const term = data.data.term
                        this.deptTermInfoStatistics.term.all = term.dw + term.dzzb + term.dzb + term.lhdzb
                        this.deptTermInfoStatistics.term.dw = term.dw
                        this.deptTermInfoStatistics.term.dzzb = term.dzzb
                        this.deptTermInfoStatistics.term.dzb = term.dzb
                        this.deptTermInfoStatistics.term.lhdzb = term.lhdzb

                        this.deptInfoStatistics.all += this.deptTermInfoStatistics.term.all
                        this.deptInfoStatistics.dw += term.dw
                        this.deptInfoStatistics.dzzb += term.dzzb
                        this.deptInfoStatistics.dzb += term.dzb
                        this.deptInfoStatistics.lhdzb += term.lhdzb
                    }

                    if (data.data.notTerm != null) {
                        const notTerm = data.data.notTerm
                        this.deptTermInfoStatistics.notTerm.all = notTerm.dw + notTerm.dzzb + notTerm.dzb + notTerm.lhdzb
                        this.deptTermInfoStatistics.notTerm.dw = notTerm.dw
                        this.deptTermInfoStatistics.notTerm.dzzb = notTerm.dzzb
                        this.deptTermInfoStatistics.notTerm.dzb = notTerm.dzb
                        this.deptTermInfoStatistics.notTerm.lhdzb = notTerm.lhdzb

                        this.deptInfoStatistics.all += this.deptTermInfoStatistics.notTerm.all
                        this.deptInfoStatistics.dw += notTerm.dw
                        this.deptInfoStatistics.dzzb += notTerm.dzzb
                        this.deptInfoStatistics.dzb += notTerm.dzb
                        this.deptInfoStatistics.lhdzb += notTerm.lhdzb
                    }
                }
                this.initEcharts5()
                this.setShowArr(index)
            })
        },
        payFeeNearlyYearCount(index) {
            getPayFeeNearlyYearCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000' && data.data != null) {
                    const result = data.data
                    for (let i = 0; i < this.yearMonthArr.length; i++) {
                        for (let j = 0; j < result.length; j++) {
                            if (this.yearMonthArr[i] == result[j].time) {
                                this.payFeeNearlyYear[i].percentage = (result[j].payNum / result[j].allNum * 100).toFixed(2)
                                this.payFeeNearlyYear[i].payNum = result[j].payNum
                                this.payFeeNearlyYear[i].allNum = result[j].allNum
                            } else {
                                this.payFeeNearlyYear[i].percentage = 0
                                this.payFeeNearlyYear[i].payNum = 0
                                this.payFeeNearlyYear[i].allNum = 0
                            }
                        }
                    }
                }
                this.initEcharts6()
                this.setShowArr(index)
            })
        },
        meetingNearlyYearCount(index) {
            getMeetingNearlyYearCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000' && data.data != null) {
                    const result = data.data
                    for (let i = 0; i < this.yearMonthArr.length; i++) {
                        for (let j = 0; j < result.length; j++) {
                            if (this.yearMonthArr[i] == result[j].time) {
                                this.meetingNearlyYear[i] = result[j].num
                                break
                            }
                        }
                    }
                }
                this.initEcharts7()
                this.setShowArr(index)
            })
        },
        initEcharts1() {
            const myData = [
                {value: this.partyMemberStatistics.manTotal, name: '男'},
                {value: this.partyMemberStatistics.womanTotal, name: '女'},
            ];
            const chart = this.$refs.chart
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: '性别分布',
                        x: 10,
                        y: 20
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        icon: "circle",
                        // data: ['男', '女'],
                        formatter: function (name) {
                            let total = 0
                            let value
                            for (let i = 0; i < myData.length; i++) {
                                total += myData[i].value
                                if (myData[i].name == name) {
                                    // 获取对应值
                                    value = myData[i].value
                                }
                            }
                            // let percent = Math.round((tarValue / total) * 100) + '%' // 获取百分百（根据需要在下面添加）
                            let arr = [name + ':' + value + '人']
                            return arr.join('  ')
                        },
                        orient: 'vertical',
                        textStyle: {  // 图列内容样式
                            color: '#000',  // 字体颜色
                        },
                        // x: 20,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
                        // y: 60, //延Y轴居中
                        bottom: 30,
                    },
                    color: ['#3097DA', '#EE311B'],
                    series: [
                        {
                            name: '性别',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            center: ['55%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                //echarts饼图内部显示百分比设置
                                show: true,
                                textBorderColor: '#5470c6',
                                textBorderWidth: 2,
                                position: 'inside', //outside 外部显示  inside 内部显示
                                formatter: `{d}%`,
                                color: '#ffffff', //颜色
                                fontSize: 15 //字体大小
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: this.partyMemberStatistics.manTotal, name: '男'},
                                {value: this.partyMemberStatistics.womanTotal, name: '女'},
                            ]
                        }
                    ]
                }
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener('resize', function () {
                    myChart.resize()
                })
            })
        },
        initEcharts2() {
            const chart = this.$refs.chart2
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: '年龄分布',
                        x: 10,
                        y: 20
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['35岁及以下', '36-40岁', '41-45岁', '46-50岁', '51-54岁', '55岁及以上'],
                        interval: 0,
                        axisLabel: {
                            show: true,
                            rotate: 45,
                        }
                    },
                    yAxis: {},
                    grid: {
                        containLabel: true,
                        left: '10%', // 添加 left 属性
                        right: '10%', // 添加 right 属性
                        top: '25%' // 添加 right 属性
                    },
                    series: [
                        {
                            type: 'bar',
                            data: this.partyMemberStatistics.ageDistribution,
                            grid: {
                                y: 101,
                                x2: 10,
                                height: '100%'
                            },
                            barWidth: '40%',
                            itemStyle: {
                                // color: 'rgba(254, 135, 75, 1)'
                                color: this.$echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: 'rgba(65, 123, 226, 1)'},
                                            {offset: 1, color: 'rgba(65, 123, 226, 0)'}
                                        ]
                                )
                            }
                        }
                    ]
                }
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener('resize', function () {
                    myChart.resize()
                })
            })
        },
        initEcharts3() {
            const chart = this.$refs.chart3
            const myData = [
                {value: this.partyMemberStatistics.floatingTotal, name: '流动党员'},
                {value: this.partyMemberStatistics.notFloatingTotal, name: '非流动党员'},
            ];
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: '是否流动党员',
                        x: 10,
                        y: 20
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        icon: "circle",
                        // data: ['流动党员', '非流动党员'],
                        formatter: function (name) {
                            var total = 0
                            var value
                            for (var i = 0; i < myData.length; i++) {
                                total += myData[i].value
                                if (myData[i].name == name) {
                                    // 获取对应值
                                    value = myData[i].value
                                }
                            }
                            // let percent = Math.round((tarValue / total) * 100) + '%' // 获取百分百（根据需要在下面添加）
                            var arr = [name + ':' + value + '人']
                            return arr.join('  ')
                        },
                        orient: 'vertical',
                        textStyle: {  // 图列内容样式
                            color: '#000',  // 字体颜色
                        },
                        // x: 20,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
                        // y: 60//延Y轴居中
                        bottom: 30,
                    },
                    color: ['#FE874B', '#F8AD16'],
                    series: [
                        {
                            name: '是否流动党员',
                            type: 'pie',
                            avoidLabelOverlap: false,
                            radius: '60%',
                            center: ['55%', '50%'],
                            label: {
                                //echarts饼图内部显示百分比设置
                                show: true,
                                textBorderColor: '#c67840',
                                textBorderWidth: 2,
                                position: 'inside', //outside 外部显示  inside 内部显示
                                formatter: `{d}%`,
                                color: '#ffffff', //颜色
                                fontSize: 15 //字体大小
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: this.partyMemberStatistics.floatingTotal, name: '流动党员'},
                                {value: this.partyMemberStatistics.notFloatingTotal, name: '非流动党员'},
                            ]
                        }
                    ]
                }
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener('resize', function () {
                    myChart.resize()
                })
            })
        },
        initEcharts4() {
            const chart = this.$refs.chart4
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    // title: {
                    //     text: '党龄分布',
                    //     x: 10,
                    //     y: 20
                    // },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['10年及以下', '11-20年', '21-30年', '31-40年', '41-50年', '51年及以上'],
                        interval: 0,
                        axisLabel: {
                            show: true,
                            rotate: 45,
                        }
                    },
                    grid: {
                        containLabel: true,
                        left: '3%', // 添加 left 属性
                        right: '2%', // 添加 right 属性
                        top: '5%' // 添加 right 属性
                    },
                    yAxis: {},
                    series: [
                        {
                            type: 'bar',
                            data: this.partyMemberStatistics.partyStandingDistribution,
                            grid: {
                                y: 101,
                                x2: 10,
                                height: '100%'
                            },
                            barWidth: '40%',
                            itemStyle: {
                                // color: 'rgba(254, 135, 75, 1)'
                                color: this.$echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: 'rgba(254, 135, 75, 1)'},
                                            {offset: 1, color: 'rgba(254, 135, 75, 0)'}
                                        ]
                                )
                            }
                        }
                    ]
                }
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener('resize', function () {
                    myChart.resize()
                })
            })
        },
        initEcharts5() {
            const chart = this.$refs.chart5
            const myData = [
                {value: this.deptInfoStatistics.dzb, name: '党支部'},
                {value: this.deptInfoStatistics.dw, name: '党委'},
                {value: this.deptInfoStatistics.dzzb, name: '党总支'},
                {value: this.deptInfoStatistics.lhdzb, name: '联合党支部'}
            ];
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: '基层党组织数：' + this.deptInfoStatistics.all + '个',
                        textStyle: {
                            fontSize: 20, // 标题字体大小
                            color: '#e04b45' // 标题颜色
                        },
                        x: 0,
                        y: 0
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} :  {c}个"
                    },
                    legend: {
                        icon: "circle",
                        data: ['党支部', '党委', '党总支', '联合党支部'],
                        formatter: function (name) {
                            var total = 0
                            var value
                            for (var i = 0; i < myData.length; i++) {
                                total += myData[i].value
                                if (myData[i].name == name) {
                                    // 获取对应值
                                    value = myData[i].value
                                }
                            }
                            // let percent = Math.round((tarValue / total) * 100) + '%' // 获取百分百（根据需要在下面添加）
                            if (value != undefined) {
                                var arr = [name + '\n' + value + '个']
                                return arr.join('  ')
                            } else {
                                return null
                            }
                        },
                        orient: 'vertical',
                        textStyle: {  // 图列内容样式
                            color: '#333',  // 字体颜色
                            fontSize:'0.14rem',
                            fontWeight: 'bold',
                            lineHeight:18
                        },
                        top:'center',
                        x: 0,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
                        // y: 30//延Y轴居中
                    },
                    color: ['#fd383a', '#fea142', '#3097da', '#546ef0'],
                    series: [
                        {
                            name: '党支部',
                            type: 'pie',
                            radius: ['65%', '75%'],
                            center: ['65%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                //echarts饼图内部显示百分比设置
                                show: false,
                                position: 'inside', //outside 外部显示  inside 内部显示
                                // formatter: `{d}%`,
                                formatter: function (params) {
                                    if (params.name === '基层党组织数') {
                                        return ""
                                    } else {
                                        return params.data.value
                                    }
                                },
                                color: '#000000', //颜色
                                fontSize: 15 //字体大小
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.deptInfoStatistics.dzb, name: '党支部', itemStyle: {
                                        normal: {borderRadius: '50%'}
                                    }
                                },
                                {
                                    value: this.deptInfoStatistics.all, name: '基层党组织数', itemStyle: {
                                        normal: {color: '#F1F1F1'}
                                    }
                                },
                            ]
                        },
                        {
                            name: '党委',
                            type: 'pie',
                            radius: ['45%', '55%'],
                            center: ['65%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                //echarts饼图内部显示百分比设置
                                show: false,
                                position: 'inside', //outside 外部显示  inside 内部显示
                                // formatter: `{d}%`,
                                formatter: function (params) {
                                    if (params.name === '基层党组织数') {
                                        return ""
                                    } else {
                                        return params.data.value
                                    }
                                },
                                color: '#000000', //颜色
                                fontSize: 15 //字体大小
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.deptInfoStatistics.dw, name: '党委', itemStyle: {
                                        normal: {borderRadius: '50%'}
                                    }
                                },
                                {
                                    value: this.deptInfoStatistics.all, name: '基层党组织数', itemStyle: {
                                        normal: {color: '#F1F1F1'}
                                    }
                                },
                            ]
                        },
                        {
                            name: '党总支',
                            type: 'pie',
                            radius: ['25%', '35%'],
                            center: ['65%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                //echarts饼图内部显示百分比设置
                                show: false,
                                position: 'inside', //outside 外部显示  inside 内部显示
                                // formatter: `{d}%`,
                                formatter: function (params) {
                                    if (params.name === '基层党组织数') {
                                        return ""
                                    } else {
                                        return params.data.value
                                    }
                                },
                                color: '#000000', //颜色
                                fontSize: 15 //字体大小
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.deptInfoStatistics.dzzb, name: '党总支', itemStyle: {
                                        normal: {borderRadius: '50%'}
                                    }
                                },
                                {
                                    value: this.deptInfoStatistics.all, name: '基层党组织数', itemStyle: {
                                        normal: {color: '#F1F1F1'}
                                    }
                                },
                            ]
                        },
                        {
                            name: '联合党支部',
                            type: 'pie',
                            radius: ['5%', '15%'],
                            center: ['65%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                //echarts饼图内部显示百分比设置
                                show: false,
                                position: 'inside', //outside 外部显示  inside 内部显示
                                // formatter: `{d}%`,
                                formatter: function (params) {
                                    if (params.name === '基层党组织数') {
                                        return ""
                                    } else {
                                        return params.data.value
                                    }
                                },
                                color: '#000000', //颜色
                                fontSize: 15 //字体大小
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    formatter: function (params) {
                                        if (params.name === '基层党组织数') {
                                            return ""
                                        } else {
                                            return params.data.value || 0
                                        }
                                    },
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.deptInfoStatistics.lhdzb, name: '联合党支部', itemStyle: {
                                        normal: {borderRadius: '50%'}
                                    }
                                },
                                {
                                    value: this.deptInfoStatistics.all, name: '基层党组织数', itemStyle: {
                                        normal: {color: '#F1F1F1'}
                                    }
                                },
                            ]
                        }
                    ]
                }
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener('resize', function () {
                    myChart.resize()
                })
            })
        },
        initEcharts6() {
            const chart = this.$refs.chart6
            if (chart) {
                let _this = this;
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    // title: {
                    //     text: '党费缴纳率(近一年)'
                    // },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params, index) {
                            let value = params[0].name + "<br/>" + "应缴人数：" + _this.payFeeNearlyYear[params[0].dataIndex].allNum + "<br/>";
                            value += "实缴人数：" + _this.payFeeNearlyYear[params[0].dataIndex].payNum + "<br/>";
                            value += "缴纳率：" + params[0].value + '%'
                            return value;
                        },
                    },
                    xAxis: {
                        type: 'category',
                        data: this.yearMonthArr,
                        axisLabel: {
                            show: true,
                            rotate: 45,
                        }
                    },
                    yAxis: {
                        type: 'value',
                        min: 0,
                        max: 100,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %'//纵坐标百分比
                        }
                    },
                    grid: {
                        left: '6%',
                        top: '10%',
                        right: '2%',
                        bottom: '16%',
                    },
                    series: [
                        {
                            data: this.payFeeNearlyYear.map(item => item.percentage),
                            type: 'line',
                            center: ['50%', '20%'],
                            grid: {
                                y: 101,
                                x2: 10,
                                height: '80%'
                            },
                            symbol: 'circle', //折线点设置为实心点
                            symbolSize: 6, //折线点的大小
                            itemStyle: {
                                normal: {
                                    color: "#fe884c", //折线点的颜色
                                    lineStyle: {
                                        color: "#fe884c" //折线的颜色
                                    }
                                }
                            },
                        },
                    ]
                };
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener('resize', function () {
                    myChart.resize()
                })
            })
        },
        initEcharts7() {
            const chart = this.$refs.chart7
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    // title: {
                    //     text: '三会一课开展数据(近一年)'
                    // },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.yearMonthArr,
                        axisLabel: {
                            show: true,
                            rotate: 45,
                        }
                    },
                    yAxis: {
                        type: 'value',

                    },
                    grid: {
                        left: '6%',
                        top: '10%',
                        right: '3%',
                        bottom: '16%',
                    },
                    series: [
                        {
                            data: this.meetingNearlyYear,
                            type: 'line',
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: 'rgba(239, 55, 58, 0.4)' // 渐变起始颜色
                                    }, {
                                        offset: 1, color: 'rgba(238, 57, 58, 0)' // 渐变结束颜色
                                    }]
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: "#fe884c", //折线点的颜色
                                    lineStyle: {
                                        color: "#D9675D" //折线的颜色
                                    }
                                }
                            },
                        },

                    ]
                };
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener('resize', function () {
                    myChart.resize()
                })
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
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
    },
};
</script>

<style lang="scss" scoped>
.line {
    left: 50px;
    top: 393px;
    width: 144px;
    height: 4px;
    opacity: 1;
    background: rgba(224, 75, 69, 1);
}

.container1 {
    height: calc(100vh - 65px);
    min-width: 1350px;
    overflow: auto;
    padding: 15px;
    margin: 0 auto;
    background-color: white;
    border-radius: 5px;

    .con-title {
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;

        .con-title-text {
            margin-left: 10px;
            font-size: 40px;
            font-weight: 700;
            letter-spacing: 0px;
            line-height: 52.79px;
            color: rgba(232, 42, 42, 1);
        }
    }

    .con-top {
        .con-top-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .con-top-row-item {
                width: calc(20% - 15px);
                word-break: break-all;
                cursor: pointer;
                height: 1.5rem;

                .con-top-row-bar {
                    width: 100%;
                    height: 10px;
                    background: rgba(224, 43, 27, 1);
                    border-radius: 10px 10px 0px 0px;
                }

                .con-top-row-two-bar {
                    background: rgba(0, 191, 139, 1);
                }

                .con-top-row-three-bar {
                    background: rgba(49, 126, 242, 1);
                }

                .con-top-row-four-bar {
                    background: rgba(250, 179, 1, 1);
                }

                .con-top-row-five-bar {
                    background: rgba(127, 93, 242, 1);
                }

                .con-top-row-content {
                    display: flex;
                    flex-direction: column;
                    padding: 15px;
                    width: 100%;
                    height: 100%;
                    // width: 332px;
                    //height: 138px;
                    // opacity: 1;
                    border-radius: 10px;
                    // background: linear-gradient(90deg, rgba(232, 42, 42, 1) 0%, rgba(224, 74, 74, 1) 100%);
                    flex-grow: 1;
                    flex-shrink: 0;
                    flex-basis: 0;
                    margin-right: 10px;

                    .con-top-row-content-label {
                        text-align: left;
                        /*padding-top: 24px;
                        padding-left: 20px;*/

                        .con-top-row-label {
                            font-size: 0.16rem;
                            font-weight: bold;
                            letter-spacing: 0px;
                            line-height: 0.16rem;
                            color: #000;
                            padding-bottom: 10px;
                        }
                    }

                    .con-top-row-content-bottom {
                        margin-top: 5px;
                        display: flex;
                        flex: 1;
                        align-items: baseline;

                        .con-top-row-content-text {
                            font-size: 0.3rem;
                            font-weight: bold;
                            letter-spacing: 0px;
                            line-height: 0.26rem;
                            color: #000;
                        }

                        .con-top-row-content-unit {
                            font-size: 0.15rem;
                            color: #000;
                            margin-left: 5px;
                            line-height: 0.15rem;
                            letter-spacing: 0px;
                        }

                        img {
                            width: 0.4rem;
                            height: 0.4rem;
                        }
                    }
                }
            }
            .item1{
                background-image: url("../assets/home/dysl.png");
                background-size: cover;
            }
            .item2{
                background-image: url("../assets/home/shyksl.png");
                background-size: cover;
            }
            .item3{
                background-image: url("../assets/home/dzzsl.png");
                background-size: cover;
            }
            .item4{
                background-image: url("../assets/home/zzshsl.png");
                background-size: cover;
            }
            .item5{
                background-image: url("../assets/home/dfjn.png");
                background-size: cover;
            }
        }
    }

    .con-second {

        .con-second-left-title {
            display: inline-block;
            border-bottom: 4px solid rgba(224, 75, 69, 1);
            font-size: 0.23rem;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 0.23rem;
            color: rgba(51, 51, 51, 1);
        }

        .con-second-left {
            width: 100%;
            // flex: 1;
            min-width: 600px;
            text-align: left;

            .con-second-left-box {
                display: flex;
            }

            .con-second-left-row {
                margin-top: 20px;
                display: flex;
                width: 40%;

                .con-second-left-row-left {
                    /*overflow-x: auto;*/
                    /*overflow-y: hidden;*/
                    /*min-width: 300px;*/
                    width: 45%;
                    height: 404px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                }

                .con-second-left-row-right {
                    margin-left: 20px;
                    /*min-width: 300px;*/
                    width: calc(55% - 20px);
                    height: 404px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                }
            }

            .con-second-right-row {
                margin-left: 20px;
                width: calc(60% - 20px);
            }
        }

        .con-second-right {
            margin-top: 0.2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .con-second-left-box {
                width: 50%;

                .con-second-left-box-title {
                    text-align: left;
                    margin-bottom: 20px;
                }
            }

            .con-second-right-box {
                padding-left: 20px;
                width: calc(50% - 20px);

                .con-second-right-box-title {
                    text-align: left;
                    margin-bottom: 20px;
                }

                .con-third-right-con {
                    width: 100%;
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                }

                .con-third-right-title {
                    display: inline-block;
                    border-bottom: 4px solid rgba(224, 75, 69, 1);
                    font-size: 0.23rem;
                    font-weight: 400;
                    letter-spacing: 0px;
                    line-height: 0.23rem;
                    color: rgba(51, 51, 51, 1);
                    text-align: left;
                }
            }

            .con-second-right-row {
                display: flex;
                width: 100%;
                opacity: 1;
                border-radius: 10px;
                background: rgba(255, 255, 255, 1);

                .con-second-right-con {
                    width: calc(50% - 15px);
                    height: 3.2rem;
                    opacity: 1;
                    border-radius: 5px;
                    background: #fff;
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);

                    &:first-child {
                        margin-right: 30px;
                    }

                    .con-second-right-con-font {
                        font-size: 0.18rem;
                        font-weight: 700;
                        letter-spacing: 0px;
                        line-height: 0.18rem;
                        vertical-align: top;
                        text-align: center;
                        width: 70%;
                        margin: auto;
                        padding: 10px;
                        border-bottom-left-radius: 20px;
                        border-bottom-right-radius: 20px;
                        color: #fff;
                    }

                    .con-second-right-con-row {
                        display: flex;

                        .con-child {
                            //width: 290px;
                            width: 3rem;
                            opacity: 1;
                            border-radius: 4px;
                            text-align: center;

                            img {
                                width: 0.5rem;
                                height: 0.5rem;
                            }

                            .con-child-font {
                                padding: 0 10px;
                                font-size: 0.17rem;
                                font-weight: 700;
                                letter-spacing: 0px;
                                line-height: 0.17rem;
                                color: #000;
                                // text-align: left;
                                vertical-align: top;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                                word-break: break-all;
                            }

                            .add-margin {
                                margin: 10px 0;
                            }

                            .con-child-red-font {
                                color: rgba(227, 52, 36, 1);
                            }
                            .con-child-yellow-font {
                                color: #FE8B4E;
                            }
                        }
                    }
                }
            }
        }
    }

    .con-third {
        display: flex;

        .con-third-right {
            width: calc(70% - 20px);
            padding: 0 15px;

            .con-third-right-title-box {
                text-align: left;
            }

            .con-third-right-title {
                display: inline-block;
                border-bottom: 4px solid rgba(224, 75, 69, 1);
                font-size: 0.23rem;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 0.23rem;
                color: rgba(51, 51, 51, 1);
                text-align: left;
            }

            .con-third-right-con {
                margin-top: 20px;
                height: 3.5rem;
                opacity: 1;
                border-radius: 10px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
            }
        }
    }
}
</style>


