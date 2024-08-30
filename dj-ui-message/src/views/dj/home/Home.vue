<template>
    <div class="container1">
        <!--<div class="con-title">
            <div>
                <img style="height: 49px;width: 50px" :src="conTitle">
            </div>
            <div class="con-title-text">党务看板</div>
        </div>-->
        <!-- <div>
            <div class="title">首页概览</div>
        </div> -->
        <div class="con-top" style="padding: 15px;">
            <div class="con-top-row">
                <div class="con-top-row-item">
                    <div class="con-top-row-content" :style="`background-image: url(${homePng})`">
                        <div class="con-top-row-content-bottom">
                            <div class="con-top-row-content-text">发送号码总数：</div>
                            <div class="con-top-row-content-text2">{{ phoneCount ? phoneCount : 0 }}个</div>
                        </div>
                    </div>
                </div>
                <div class="con-top-row-item">
                    <div class="con-top-row-content" :style="`background-image: url(${messagePng})`">
                        <div class="con-top-row-content-bottom">
                            <div class="con-top-row-content-text">发送短信总数：</div>
                            <div class="con-top-row-content-text2">{{ messageCount ? messageCount : 0 }}条</div>
                        </div>
                    </div>
                </div>
                <div class="con-top-row-item">
                    <div class="con-top-row-content" :style="`background-image: url(${yellowPng})`">
                        <div class="con-top-row-content-bottom">
                            <div class="con-top-row-content-text">发送成功总数：</div>
                            <div class="con-top-row-content-text2">{{ successCount ? successCount : 0 }}条</div>
                        </div>
                    </div>
                </div>
                <div class="con-top-row-item">
                    <div class="con-top-row-content" :style="`background-image: url(${gouPng})`">
                        <div class="con-top-row-content-bottom">
                            <div class="con-top-row-content-text">发送成功率：</div>
                            <div class="con-top-row-content-text2">{{ successRate ? successRate : 0 }}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-box">
            <div class="box-shadow" style="flex: 1 calc(50% - 10px); width: calc(50% - 10px); height: 364px;">
                <div
                    style="display:flex;font-size: 16px;text-align: left;padding-left: 15px;margin-top: 15px; align-items: flex-end;">
                    <div><span class="bar"></span>今日数据</div>
                    <!--                    <div style="color: #D8001B; font-size: 14px;">（更新于：2023-06-27 14.25.21）</div>-->
                </div>
                <div
                    style="display:flex;flex-direction: row;justify-content: space-between;text-align: center;margin-top: 60px;">
                    <div
                        style="width: calc(25% - 10px);word-break: break-all;display: flex;justify-content: center;align-items: center;">
                        <div class="echarts-small">
                            <div ref="chart1" style="width: 100px; height:100px;"></div>
                            <div
                                style="font-size: 32px;font-family: Microsoft YaHei, Microsoft YaHei-Normal;font-weight: 500;">
                                {{ phoneCountToday }}
                            </div>
                            <div style="font-size: 14px;font-weight: 500;">发送号码数</div>
                        </div>
                    </div>
                    <div
                        style="width: calc(25% - 10px);word-break: break-all;display: flex;justify-content: center;align-items: center;">
                        <div class="echarts-small">
                            <div ref="chart2" style="width: 100px; height:100px;"></div>
                            <div
                                style="font-size: 32px;font-family: Microsoft YaHei, Microsoft YaHei-Normal;font-weight: 500;">
                                {{ messageCountToday }}
                            </div>
                            <div style="font-size: 14px;font-weight: 500;">发送短信条数</div>
                        </div>
                    </div>
                    <div
                        style="width: calc(25% - 10px);word-break: break-all;display: flex;justify-content: center;align-items: center;">
                        <div class="echarts-small">
                            <div ref="chart3" style="width: 100px; height:100px;"></div>
                            <div
                                style="font-size: 32px;font-family: Microsoft YaHei, Microsoft YaHei-Normal;font-weight: 500;">
                                {{ successCountToday }}
                            </div>
                            <div style="font-size: 14px;font-weight: 500;">发送成功条数</div>
                        </div>
                    </div>
                    <div
                        style="width: calc(25% - 10px);word-break: break-all;display: flex;justify-content: center;align-items: center;">
                        <div class="echarts-small">
                            <div ref="chart4" style="width: 100px; height:100px;"></div>
                            <div
                                style="font-size: 32px;font-family: Microsoft YaHei, Microsoft YaHei-Normal;font-weight: 500;">
                                {{ successRateToday }}%
                            </div>
                            <div style="font-size: 14px;font-weight: 500;">发送成功率</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="box-shadow"
                 style="flex: 1 calc(50% - 10px); width: calc(50% - 10px);font-size: 16px;text-align: left;margin-left: 20px;height: 364px;">
                <div style="padding-left: 15px;margin-top: 15px;"><span class="bar"></span>近10天情况发送</div>
                <div ref="chart5" style="width: 100%; height:313px;"></div>
            </div>
        </div>


        <div style="padding: 0 15px; display: flex; flex-direction: column;">
            <div class="con-third box-shadow" style="margin-top: 20px; ">
                <div style="padding-left: 15px;margin-top: 14px;text-align: left;"><span class="bar"></span>成功发送率</div>
                <div ref="chart7" style="width: 100%;height:240px;"></div>
            </div>
            <div style="text-align: left;margin-top: 14px;">
                *趋势图根据实际发送短信条数，计算成功率数据，不包含未发送的短信(如黑名单、错误号码)，因运营商数据返回延迟，数据更新有一定误差
            </div>
        </div>

    </div>

</template>

<script>
import conTitle from "@/assets/home/conTitle.png"
import index1 from "@/assets/message/index1.png"
import index2 from "@/assets/message/index2.png"
import index3 from "@/assets/message/index3.png"
import index4 from "@/assets/message/index4.png"
import font from "@/assets/home/font.png"
import font2 from "@/assets/home/font2.png"
import homePng from "@/assets/home/home.png";
import messagePng from "@/assets/home/message.png";
import yellowPng from "@/assets/home/yellow.png";
import gouPng from "@/assets/home/gou.png";
import {
    baseInfo, baseInfoByToday, recentlySendCount, recentlySuccessRate
} from "@/api/tzMessage";
import { mapGetters } from 'vuex'

export default {
    name: "Home",
    data() {
        return {
            messageCount: 0,
            phoneCount: 0,
            successCount: 0,
            successRate: 0,
            messageCountToday: 0,
            phoneCountToday: 0,
            successCountToday: 0,
            successRateToday: 0,
            failRateToday: 0,
            deptId: '',
            font: font,
            font2: font2,
            conTitle: conTitle,
            index1: index1,
            index2: index2,
            index3: index3,
            index4: index4,
            homePng,
            messagePng,
            yellowPng,
            gouPng,
        };
    },
    created() {
        document.title = "首页概览";
    },
    mounted() {
        this.baseInfo()
        this.baseInfoByToday()
        this.getRecentlySendCount()
        this.getRecentlySuccessRate()
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        baseInfo() {
            baseInfo({deptId: this.deptInfo.id + ''}).then(res => {
                if (res.data.code == '00000') {
                    this.phoneCount = res.data.data.phoneCount
                    this.messageCount = res.data.data.messageCount
                    this.successCount = res.data.data.successCount
                    let t = res.data.data.successRate.toString()
                    this.successRate = t.slice(0, 5)
                }
            })
        },
        baseInfoByToday() {
            baseInfoByToday({deptId: this.deptInfo.id +''}).then(res => {
                if (res.data.code == '00000') {
                    this.phoneCountToday = res.data.data.phoneCount
                    this.messageCountToday = res.data.data.messageCount
                    this.successCountToday = res.data.data.successCount
                    if (this.messageCountToday == 0) {
                        this.failRateToday = 0
                    } else {
                        // this.failRateToday = (this.messageCountToday - this.successCountToday) / this.messageCountToday
                        this.failRateToday = 100 - this.successRate
                    }

                    let t = res.data.data.successRate.toString()
                    this.successRateToday = t.slice(0, 5)
                }
                this.initEcharts1()
                this.initEcharts2()
                this.initEcharts3()
                this.initEcharts4()
            })
        },
        getRecentlySendCount() {
            recentlySendCount().then(res => {
                const result = res.data
                let xAxis = [], data = [0,0,0,0,0,0,0,0,0,0]
                if (result.code == '00000') {
                    const resultData = result.data.data
                    let startTime = result.data.startTime
                    xAxis = this.getAllTime(startTime, 10)

                    for (let i = 0; i < resultData.length; i++) {
                        for (let n = 0; n < xAxis.length; n++) {
                            if (xAxis[n] == resultData[i].time) {
                                data[n] = resultData[i].num
                                break
                            }
                        }
                    }
                }
                this.initEcharts5(xAxis, data)
            })
        },
        getRecentlySuccessRate() {
            recentlySuccessRate({deptId: this.deptInfo.id +''}).then(res => {
                const result = res.data
                let xAxis = [], chartData = [0,0,0,0,0,0,0,0,0,0]
                if (result.code == '00000') {
                    const resultData = result.data.result
                    let startTime = result.data.startTime
                    xAxis = this.getAllTime(startTime, 10)

                    for (let i = 0; i < resultData.length; i++) {
                        for (let n = 0; n < xAxis.length; n++) {
                            if (xAxis[n] == resultData[i].time) {
                                const rate = (resultData[i].success / (resultData[i].success + resultData[i].fail)).toFixed(5) * 100
                                chartData[n] = rate
                                break
                            }
                        }
                    }

                    /*let data = result.data
                    for (let i = 0; i < data.length; i++) {
                        xAxis.push(data[i].time)
                        const rate = (data[i].success / (data[i].success + data[i].fail)).toFixed(2) * 100
                        chartData.push(rate)
                    }*/
                }
                this.initEcharts7(xAxis, chartData)
            })
        },
        getAllTime(startTime, days) {
            let timeList = []
            timeList.push(this.formatDate(startTime))

            let time = new Date(this.formatDate(startTime))
            let oneDayTime = 24 * 3600 * 1000
            for (let i = 1; i < days; i++) {
                let ti = time.getTime() + oneDayTime * i
                timeList.push(this.formatDate(ti))
            }
            return timeList
        },
        formatDate(date) {
            let myDate = new Date(date)
            let year = myDate.getFullYear()
            let month = myDate.getMonth() + 1
            let day = myDate.getDate()
            if (month < 10) {
                month = "0" + month
            }
            if (day < 10) {
                day = "0" + day
            }
            return year + "-" + month + "-" + day
        },
        initEcharts1() {
            const chart = this.$refs.chart1
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        show: false,
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    fontSize: 40,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.phoneCountToday, name: '发送号码数', itemStyle: {
                                        normal: { // 渐变色操作
                                            color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {offset: 0, color: 'rgba(70, 130, 254, 1)'},  // 起始颜色
                                                {offset: 1, color: 'rgba(82, 171, 255, 1)'}])  // 结束颜色
                                        }
                                    },
                                }
                            ]
                        }
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
        initEcharts2() {
            const chart = this.$refs.chart2
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        show: false,
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    fontSize: 40,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.messageCountToday, name: '发送短信条数', itemStyle: {
                                        normal: { // 渐变色操作
                                            color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {offset: 0, color: 'rgba(70, 130, 254, 1)'},  // 起始颜色
                                                {offset: 1, color: 'rgba(82, 171, 255, 1)'}])  // 结束颜色
                                        }
                                    },
                                }
                            ]
                        }
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
        initEcharts3() {
            const chart = this.$refs.chart3
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        show: false,
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    fontSize: 40,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.messageCountToday - this.successCountToday,
                                    name: '发送失败条数',
                                    itemStyle: {
                                        normal: { // 渐变色操作
                                            color: '#F2F3F8'
                                        }
                                    },
                                },
                                {
                                    value: this.successCountToday, name: '发送成功条数', itemStyle: {
                                        normal: { // 渐变色操作
                                            color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {offset: 0, color: 'rgba(255, 133, 26, 1)'},  // 起始颜色
                                                {offset: 1, color: 'rgba(255, 172, 112, 1)'}])  // 结束颜色
                                        }
                                    },
                                },
                            ]
                        }
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
        initEcharts4() {
            const chart = this.$refs.chart4
            var that = this
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            /*if (that.failRateToday + that.successRateToday > 0) {
                                let percent = (params.value / (that.failRateToday + that.successRateToday) * 100).toFixed(2);
                                return params.name + ': ' + percent + '%';
                            } else {*/
                                return params.name + ': ' + params.value + '%';
                            //}

                        }
                    },
                    legend: {
                        show: false,
                        top: '5%',
                        left: 'center'
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    fontSize: 40,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {
                                    value: this.failRateToday, name: '发送失败率', itemStyle: {
                                        normal: { // 渐变色操作
                                            color: '#F2F3F8'
                                        }
                                    },
                                },
                                {
                                    value: this.successRateToday, name: '发送成功率', itemStyle: {
                                        normal: { // 渐变色操作
                                            color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {offset: 0, color: 'rgba(255, 133, 26, 1)'},  // 起始颜色
                                                {offset: 1, color: 'rgba(255, 172, 112, 1)'}])  // 结束颜色
                                        }
                                    },
                                },
                            ]
                        }
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
        initEcharts5(xAxis, data) {
            const chart = this.$refs.chart5
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                // const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: '',
                        x: 10,
                        y: 20
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxis,
                        interval: 0,
                    },
                    grid: {
                        left: 60,
                        top: 80,
                        right: 40,
                        bottom: 40
                    },
                    yAxis: {},
                    legend: {
                        data: ['发送量']
                    },
                    series: [
                        {
                            name: '发送量', // 添加系列的名称
                            type: 'bar',
                            data: data,
                            grid: {
                                y: 101,
                                x2: 10,
                                height: '100%'
                            },
                            barWidth: '40%',
                            itemStyle: {
                                color: 'rgba(0, 140, 255, 1)'
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
        initEcharts7(xAxis, data) {
            const chart = this.$refs.chart7
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        show: false,
                        data: ['成功发送率（单位%）']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis
                    },
                    yAxis: {
                        type: 'value',

                    },
                    grid: {
                        left: 60,
                        top: 20,
                        right: 40,
                        bottom: 40
                    },
                    series: [
                        {
                            name: '成功发送率（单位%）', // 添加系列的名称
                            data: data,
                            type: 'line',
                            areaStyle: {
                                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {offset: 0, color: 'rgba(235, 198, 195, 1)'},  // 起始颜色
                                    {offset: 1, color: 'rgba(227, 52, 36, 0)'}])  // 结束颜色
                            },
                            itemStyle: {
                                normal: {
                                    color: "rgba(228, 53, 43, 1)", //折线点的颜色
                                    lineStyle: {
                                        color: "rgba(228, 53, 43, 1)" //折线的颜色
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
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

.lines {
    width: 0px;
    height: 128px;
    border: 1px solid #d7d7d7;
}

.title {
    margin-top: 10px;
    margin-left: 15px;
    font-size: 24px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: LEFT;
    color: #e24240;
}

.line {
    left: 50px;
    top: 393px;
    width: 144px;
    height: 4px;
    opacity: 1;
    background: rgba(224, 75, 69, 1);
}

.container1 {
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
                width: calc(25% - 10px);
                height: 150px;
                word-break: break-all;

                .con-top-row-content {
                    display: flex;
                    /*flex-direction: column;*/
                    /*padding: 15px;*/
                    width: 100%;
                    height: 100%;
                    // width: 332px;
                    //height: 138px;
                    opacity: 1;
                    border-radius: 10px;
                    /*background: linear-gradient(90deg, rgba(232, 42, 42, 1) 0%, rgba(224, 74, 74, 1) 100%);*/
                    flex-grow: 1;
                    flex-shrink: 0;
                    flex-basis: 0;
                    margin-right: 10px;
                    background-size: 100% auto;
                    background-position: center;
                    background-repeat: no-repeat;

                    .con-top-row-content-label {
                        text-align: left;
                        /*padding-top: 24px;
                        padding-left: 20px;*/

                        .con-top-row-label {
                            font-size: 24px;
                            font-weight: 700;
                            letter-spacing: 0px;
                            line-height: 31.68px;
                            color: rgba(255, 255, 255, 1);
                        }
                    }

                    .con-top-row-content-bottom {
                        // display: flex;
                        flex: 1;
                        // margin-top: 11px;
                        // align-items: flex-end;

                        .con-top-row-content-text {
                            margin: 30px 0 5px 30px;
                            font-size: 18px;
                            font-weight: 700;
                            letter-spacing: 0px;
                            line-height: 34.32px;
                            color: rgba(255, 255, 255, 1);
                            text-align: left;
                        }

                        .con-top-row-content-text2 {
                            font-size: 36px;
                            font-weight: 700;
                            letter-spacing: 0px;
                            margin: 0px 0 10px 30px;
                            color: rgba(255, 255, 255, 1);
                            text-align: left;
                        }
                    }
                }
            }
        }
    }


    .con-third {
        // display: flex;

        .con-third-left {
            width: 50%;

            .con-third-left-title {
                display: inline-block;
                border-bottom: 4px solid rgba(224, 75, 69, 1);
                font-size: 24px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 31.68px;
                color: rgba(51, 51, 51, 1);
                text-align: left;
            }

            .con-third-left-con {
                margin-top: 20px;
                /*width: 45%;*/
                height: 358px;
                opacity: 1;
                border-radius: 10px;
                background: rgba(255, 255, 255, 1);
                /*box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);*/
            }
        }

        .con-third-right {
            width: 50%;
            margin-left: 20px;

            .con-third-right-title {
                display: inline-block;
                border-bottom: 4px solid rgba(224, 75, 69, 1);
                font-size: 24px;
                font-weight: 400;
                letter-spacing: 0px;
                line-height: 31.68px;
                color: rgba(51, 51, 51, 1);
                text-align: left;
            }

            .con-third-right-con {
                margin-top: 20px;
                height: 358px;
                opacity: 1;
                border-radius: 10px;
                background: rgba(255, 255, 255, 1);
                /*box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);*/
            }
        }
    }
}

.bar {
    display: inline-block;
    margin-right: 5px;
    width: 2px;
    height: 12px;
    border-radius: 2px;
    background: rgba(224, 75, 73, 1);
}

.flex-box {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box-shadow {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>


