<template>
    <div class="cont" v-loading="loading">
        <div style="display: flex">
            <div style="display: inline-block;margin-right: auto;">
                <div style="font-size:28px;font-weight: bold;">{{ form.name }}</div>
                <div class="line"></div>
            </div>
            <div style="margin-left: auto">
                <el-button size="small" style="float: right;padding-bottom: 10px; background: rgba(228, 53, 43, 1);color:#ffffff;border-color: rgba(228, 53, 43, 1);"
                           @click="toOrganization()">更多
                </el-button>
            </div>
        </div>

        <div style="display: flex;margin-top: 10px; margin-left: 10px;">
            <div class="left" style="min-height: 350px;">
                <div style="display: flex;align-items:center">
                    <div class="icon"></div>
                    <div style="font-size:20px;font-weight: bold;">党组织简介</div>
                </div>
                <div style="margin-top: 10px;position: relative;">
                    <img :src="deptPic?deptPic:partyCount"
                         style="width: 100%;height: 280px;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
                </div>
                <el-tooltip ref="tooltip" placement="top" style=" display: inline-block;margin-top: 10px"
                            v-if="content!=null&&content!=''">
                    <div slot="content" style=" word-break: break-all;max-width: 400px">{{ content }}</div>
                    <div class="ellipsis" ref="ellipsis" style=" display: inline-block;">{{ content }}</div>
                </el-tooltip>
                <div v-else
                     style="font-size: 20px;text-align:center;display: flex;align-items: center;justify-content: center;height: 60px;">
                    <div>暂无介绍</div>
                </div>
            </div>
            <div class="right">
                <div style="display: flex;flex-direction:column;width:35%">
                    <div class="right-cotainer">
                        <div style="margin: auto;">
                            <div style="font-size:20px;text-align: center;margin:auto">实开次数（总）</div>
                            <div
                                style="font-size:40px;text-align: center;color: #d84d45;margin-top: 10px;font-weight: 600;">
                                {{ actuallyTotal }}
                            </div>
                        </div>


                    </div>
                    <div class="right-cotainer">
                        <div style="margin: auto;">
                            <div style="font-size:20px;text-align: center;margin:auto">应开次数（总）</div>
                            <div style="font-size:40px;text-align: center;margin-top: 10px;font-weight: 600;">
                                <!--{{shouldTotal}}-->1
                            </div>
                        </div>
                    </div>
                </div>
                <div style="width: 65%;display: flex;justify-content: center;align-items: center;">
                    <div class="right-cotainer2">
                        <div style="display:flex; padding: 10px 0 10px 10px; height: 50%">
                            <div
                                style="height: 100%; display:flex;align-items:center;justify-content:center;width: 50%; border-radius: 10px;background: rgb(255,255,255);box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);margin: 0px 10px;">
                                <div style="padding: 10px; word-break: break-word;">
                                    <div
                                        style="display: flex;align-items:center;text-align: center;justify-content: center;">
                                        <diV class="icon"></diV>
                                        <div style="font-size:20px;;">支部大会</div>
                                    </div>
                                    <div
                                        style="display: flex;align-items:center;justify-content: center;margin-top:15px">
                                        <div style="font-size:12px;text-align: center;">本月实开</div>
                                        <div style="font-size:16px;text-align: center;;color: #d84d45">
                                            {{ actuallyZhibu }}
                                        </div>
                                        <div>次</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style="height: 100%;display:flex;flex;align-items:center;justify-content:center; width: 50%; border-radius: 10px;background: rgb(255,255,255);box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);margin: 0px 10px;">
                                <div>
                                    <div
                                        style="display: flex;align-items:center;text-align: center;justify-content: center;">
                                        <diV class="icon"></diV>
                                        <div style="font-size:20px;;">支委会议</div>
                                    </div>
                                    <div
                                        style="display: flex;align-items:center;justify-content: center;margin-top:15px">
                                        <div style="font-size:12px;text-align: center;">本月实开</div>
                                        <div style="font-size:16px;text-align: center;;color: #d84d45">
                                            {{ actuallyZhiwei }}
                                        </div>
                                        <div>次</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; padding: 10px 0 10px 10px; height: 50%;">
                            <div
                                style="height: 100%; display:flex;flex;align-items:center;justify-content:center; width: 50%; border-radius: 10px;background: rgb(255,255,255);box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);margin: 0px 10px;">
                                <div>
                                    <div
                                        style="display: flex;align-items:center;text-align: center;justify-content: center;">
                                        <diV class="icon"></diV>
                                        <div style="font-size:20px;;">党小组会</div>
                                    </div>
                                    <div
                                        style="display: flex;align-items:center;justify-content: center;margin-top:15px">
                                        <div style="font-size:12px;text-align: center;">本月实开</div>
                                        <div style="font-size:16px;text-align: center;;color: #d84d45">
                                            {{ actuallyDangxiao }}
                                        </div>
                                        <div>次</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style="height: 100%;display:flex;align-items:center;justify-content:center; width: 50%; border-radius: 10px;background: rgb(255,255,255);box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);margin: 0px 10px;">
                                <div>
                                    <div
                                        style="display: flex;align-items:center;text-align: center;justify-content: center;">
                                        <diV class="icon"></diV>
                                        <div style="font-size:20px;;">党课</div>
                                    </div>
                                    <div
                                        style="display: flex;align-items:center;justify-content: center;margin-top:15px">
                                        <div style="font-size:12px;text-align: center;">本月实开</div>
                                        <div style="font-size:16px;text-align: center;;color: #d84d45">
                                            {{ actuallyDangke }}
                                        </div>
                                        <div>次</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
        <div style="display: flex;margin-top: 15px">
            <div
                style="width: 33.333%;height: 400px;border-radius: 10px;background: rgb(255,255,255);box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);margin:0 10px">
                <div ref="chart1" style="height:366px;"></div>
            </div>
            <div
                style="width: 33.333%;height: 400px;border-radius: 10px;background: rgb(255,255,255);box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);margin:0 10px">
                <div ref="chart2" style="height:366px;"></div>
            </div>
            <div
                style="width: 33.333%;height: 400px;border-radius: 10px;background: rgb(255,255,255);box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);margin:0 10px">
                <div ref="chart3" style="height:366px;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {treeDataTranslate} from '@/utils'
import util from "@/libs/util";
import {getTzSysDept, getDeptIntroduceById} from "@/api/jcxfSysDept.js";
import partyCount from "@/assets/defaultImg.png"
import {queryMeetingClass, queryMeetingClassType, queryMeetingClassTypeByThisMonth, getMeetingCountNearlyThreeMonths} from "@/api/jcxfOrganizationLife";

export default {
    name: 'DataViewLeaf',
    components: {},
    data() {
        return {
            dangkes: [],
            dangxiaozus: [],
            zhibudahuis: [],
            zhiweihuis: [],
            dangke: 0,
            dangxiaozu: 0,
            zhibudahui: 0,
            zhiweihui: 0,
            whereMap: {},
            deptId: '',
            loading: false,
            base: util.jcxfUrl,
            deptPic: '',
            deptWords: '',
            form: {},
            content: '',
            partyCount: partyCount,
            arr1: [],
            arr2: [],
            shouldZhibu: 0,
            shouldZhiwei: 0,
            shouldDangxiao: 0,
            shouldDangke: 0,
            actuallyZhibu: 0,
            actuallyZhiwei: 0,
            actuallyDangxiao: 0,
            actuallyDangke: 0,
            shouldTotal: 0,
            actuallyTotal: 0
        }
    },
    methods: {
        queryMeetingClassTypeByThisMonth() {
            let data = {
                deptId: this.deptId.toString()
            }
            queryMeetingClassTypeByThisMonth(data).then(res => {
                if (res.data.code = '00000' && res.data.data != null) {
                    /*if(res.data.data.should!=null){
                        let tmp = res.data.data.should
                        this.shouldZhibu = tmp.zhibudahui
                        this.shouldZhiwei = tmp.zhiweihui
                        this.shouldDangxiao = tmp.dangxiaozu
                        this.shouldDangke = tmp.dangke
                        if(res.data.data.actually!=null){
                            let tmp2 = res.data.data.actually
                            this.actuallyZhibu = tmp2.zhibudahui
                            this.actuallyZhiwei =tmp2.zhiweihui
                            this.actuallyDangxiao = tmp2.dangxiaozu
                            this.actuallyDangke = tmp2.dangke
                        }else{
                            this.actuallyZhibu = 0
                            this.actuallyZhiwei = 0
                            this.actuallyDangxiao = 0
                            this.actuallyDangke = 0
                        }
                    }else{
                        this.resetDate()
                    }*/
                    if (res.data.data.actually != null) {
                        let tmp2 = res.data.data.actually
                        this.actuallyZhibu = tmp2.zhibudahui
                        this.actuallyZhiwei = tmp2.zhiweihui
                        this.actuallyDangxiao = tmp2.dangxiaozu
                        this.actuallyDangke = tmp2.dangke
                    } else {
                        this.actuallyZhibu = 0
                        this.actuallyZhiwei = 0
                        this.actuallyDangxiao = 0
                        this.actuallyDangke = 0
                    }
                } else {
                    this.resetDate()
                }
                this.shouldTotal = this.shouldZhiwei + this.shouldZhibu + this.shouldDangxiao + this.shouldDangke
                this.actuallyTotal = this.actuallyZhibu + this.actuallyZhiwei + this.actuallyDangxiao + this.actuallyDangke
            })
        },
        resetDate() {
            this.shouldZhibu = 0
            this.shouldZhiwei = 0
            this.shouldDangxiao = 0
            this.shouldDangke = 0
            this.actuallyZhibu = 0
            this.actuallyZhiwei = 0
            this.actuallyDangxiao = 0
            this.actuallyDangke = 0
        },
        queryMeetingClassType() {
            let data = {
                deptId: this.deptId.toString()
            }
            queryMeetingClassType(data).then(res => {
                if (res.data.code = '00000') {
                    let tmpList = res.data.data
                    this.dangkes = []
                    this.dangxiaozus = []
                    this.zhibudahuis = []
                    this.zhiweihuis = []

                    this.dangke = 0
                    this.dangxiaozu = 0
                    this.zhibudahui = 0
                    this.zhiweihui = 0
                    if (tmpList != null && tmpList.length > 0) {
                        tmpList.forEach(i => {
                            if (i != null) {
                                this.dangke += i.dangke
                                this.dangxiaozu += i.dangxiaozu
                                this.zhibudahui += i.zhibudahui
                                this.zhiweihui += i.zhiweihui

                                this.dangkes.push(i.dangke)
                                this.dangxiaozus.push(i.dangxiaozu)
                                this.zhibudahuis.push(i.zhibudahui)
                                this.zhiweihuis.push(i.zhiweihui)
                            } else {
                                this.dangkes.push(0)
                                this.dangxiaozus.push(0)
                                this.zhibudahuis.push(0)
                                this.zhiweihuis.push(0)
                            }


                        })
                        this.dangkes.reverse()
                        this.dangxiaozus.reverse()
                        this.zhibudahuis.reverse()
                        this.zhiweihuis.reverse()
                    } else {
                        this.dangke = 0
                        this.dangxiaozu = 0
                        this.zhibudahui = 0
                        this.zhiweihui = 0
                    }
                }
                this.$nextTick(() => {
                    this.initEcharts2()
                    this.initEcharts3()
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
        queryMeetingClass() {
            this.arr1 = []
            this.arr2 = [0, 0, 0]

            // 获取近一年的年月数组
            const now = new Date()
            const currentYear = now.getFullYear()
            const currentMonth = now.getMonth() + 1
            const yearMonthArr = []
            for (let i = 0; i < 3; i++) {
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
            this.arr1 = yearMonthArr.reverse()

            getMeetingCountNearlyThreeMonths(this.deptId + '').then((res) => {
                let data = res.data
                if (data.code == '00000') {
                    for (let i = 0; i < this.arr1.length; i++) {
                        for (let j = 0; j < data.data.length; j++) {
                            if (this.arr1[i] == data.data[j].time) {
                                this.arr2[i] = data.data[j].num
                                break
                            }
                        }
                    }
                }
                this.$nextTick(() => {
                    this.initEcharts1()
                })
            }).catch(e => {

            })
        },
        toOrganization() {
            this.$router.push({path: '/dwgl/organization/organization', query: {deptId: this.deptId}})
        },
        init(deptId) {
            this.deptId = deptId
            this.loading = true
            this.getBaseInfo()
            this.getCover()
            this.queryMeetingClass()
            this.queryMeetingClassType()
            this.queryMeetingClassTypeByThisMonth()
            this.loading = false
        },
        getBaseInfo() {
            getTzSysDept(this.deptId).then(res => {
                if (res.data.code == '00000') {
                    this.form = res.data.data
                } else {
                    this.$message.error("查询失败")
                }
            })
        },
        getCover() {
            getDeptIntroduceById(this.deptId).then(res => {
                const data = res.data.data
                this.content = data.deptIntroduction
                this.deptPic = data.deptInfo.deptPhoto
            });
        },
        initEcharts3() {
            const chart = this.$refs.chart3
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    title: {
                        text: '支部会议类型分析',
                        textStyle: {
                            fontSize: 20, // 标题字体大小
                            color: '#000000' // 标题颜色
                        },
                        x: 10,
                        y: 20
                    },
                    color: [
                        '#ec1e2f',
                        '#ff5c18',
                        '#FFA61C',
                        '#308fc0'
                    ],
                    legend: {
                        show: true,
                        right: '20%',
                        top: '20%',
                        itemWidth: 16,
                        itemHeight: 11
                    },
                    /*legend: {
                        show: true,
                    },*/
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        x: '7%',
                        y: '35%',
                        x2: '3%',
                        y2: '15%'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: 'rgba(151, 151, 151, 1)'
                                }
                            },
                            axisLabel: {
                                show: true,
                                // margin: 20,
                                textStyle: {
                                    color: '#000'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            // boundaryGap: true,
                            data: this.arr1
                        }
                    ],

                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: 'rgba(151, 151, 151, 1)'
                                }
                            },
                            axisLabel: {
                                show: true,
                                // margin: 20,
                                textStyle: {
                                    color: '#000'
                                }
                            },
                            axisTick: {
                                show: true,
                                color: 'rgba(151, 151, 151, 1)'
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: 'rgba(226, 232, 236, 1)',
                                    type: 'dashed'
                                }
                            },
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    color: ['#fff', 'rgba(245, 246, 250, 1)']
                                }
                            }
                        }
                    ],
                    series: [

                        {
                            name: '支部大会',
                            type: 'bar',
                            smooth: false,
                            barWidth: 8,
                            // showSymbol: false,/
                            symbolSize: 8,
                            center: ['50%', '60%'],
                            zlevel: 3,
                            lineStyle: {
                                normal: {
                                    color: '#157DFF'
                                }
                            },
                            data: this.zhibudahuis
                        },
                        {
                            name: '支委会议',
                            barWidth: 8,
                            type: 'bar',
                            smooth: false,
                            // showSymbol: false,
                            symbolSize: 8,
                            zlevel: 3,
                            lineStyle: {
                                normal: {
                                    color: '#5FD77E'
                                }
                            },
                            data: this.zhiweihuis
                        },
                        {
                            name: '党小组会',
                            barWidth: 8,
                            type: 'bar',
                            smooth: false,
                            symbolSize: 8,
                            zlevel: 3,
                            lineStyle: {
                                normal: {
                                    color: '#F7B500'
                                }
                            },
                            data: this.dangxiaozus
                        },
                        {
                            name: '党课',
                            barWidth: 8,
                            type: 'bar',
                            smooth: false,
                            symbolSize: 8,
                            zlevel: 3,
                            lineStyle: {
                                normal: {
                                    color: '#F7B500'
                                }
                            },
                            data: this.dangkes
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
                const option = {
                    title: {
                        text: '会议类型分析(近三月)',
                        textStyle: {
                            fontSize: 20, // 标题字体大小
                            color: '#000000' // 标题颜色
                        },
                        x: 10,
                        y: 20
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        data: ['支部大会', '支委会议', '党小组会', '党课'],
                        // orient: 'vertical',
                        textStyle: {  // 图列内容样式
                            color: '#000',  // 字体颜色
                        },
                        x: 20,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
                        y: 60//延Y轴居中
                    },
                    color: ['#fd383a', '#fea142', '#3097da', '#546ef0'],
                    series: [
                        {
                            name: '会议类型分析',
                            type: 'pie',
                            radius: ['20%', '50%'],
                            center: ['50%', '60%'],
                            avoidLabelOverlap: false,
                            label: {
                                //echarts饼图内部显示百分比设置
                                show: true,
                                position: 'outside', //outside 外部显示  inside 内部显示
                                formatter: `{d}%`,
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
                                {value: this.zhibudahui, name: '支部大会'},
                                {value: this.zhiweihui, name: '支委会议'},
                                {value: this.dangxiaozu, name: '党小组会'},
                                {value: this.dangke, name: '党课'},
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
        initEcharts1() {
            const chart = this.$refs.chart1
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    title: {
                        text: '三会一课情况(近三月)',
                        textStyle: {
                            fontSize: 20, // 标题字体大小
                            color: 'rgba(0,0,0,1)' // 标题颜色
                        },
                        x: 10,
                        y: 20
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.arr1
                    },
                    yAxis: {
                        type: 'value',

                    },
                    grid: {
                        left: 60,
                        top: 80,
                        right: 40,
                        bottom: 40
                    },
                    series: [
                        {
                            data: this.arr2,
                            type: 'line',
                            areaStyle: {
                                color: "#fd373a"
                            },
                            itemStyle: {
                                normal: {
                                    color: "#fe884c", //折线点的颜色
                                    lineStyle: {
                                        color: "#9dd8fe" //折线的颜色
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
    }
}
</script>
<style lang="scss" scoped>
.ellipsis {
    /*width: 200px;*/
    /*white-space: nowrap;*/
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    word-break: break-all;
    font-size: 14px;
    color: #666666;
    max-height: 200px;
    /*height: 100px;*/
}

.font-hid {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    font-size: 16px;
    color: #b4b4b2;
    height: 100px;
    position: relative;
}

.font-hid:hover {
    height: auto;
    /*overflow: visible;*/
}

.font-hid::after {
    content: "...";
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #fff;
    padding: 0 5px;
}

.font-hid:hover::after {
    opacity: 0;
    transition: opacity .5s ease-out;
}

.line {
    left: 50px;
    top: 393px;
    /*width: 100px;*/
    /*width: calc(100% - 50px);*/
    height: 4px;
    opacity: 1;
    background: rgba(224, 75, 69, 1);
}

.right-cotainer {
    border-radius: 10px;
    background: rgb(255, 241, 214);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    height: 200px;
    /*width: 350px;*/
    flex: 1; /* 将剩余空间均分 */
    margin: 10px; /* 可以添加间距 */
    display: flex;
    align-items: center;
}

.right-cotainer2 {
    border-radius: 10px;
    /*background: rgb(255, 241, 214);*/
    /*box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);*/
    /*height: 200px;*/
    /*width: 350px;*/
    align-items: center;
    width: 100%;
    height: 100%;
}

.left {
    width: 40%;
    opacity: 1;
    border-radius: 10px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.right {
    width: calc(60% - 10px);
    margin-left: 10px;
    display: flex;
}

.icon {
    width: 10px;
    height: 10px;
    background: red;
    margin-right: 5px;
}

</style>
