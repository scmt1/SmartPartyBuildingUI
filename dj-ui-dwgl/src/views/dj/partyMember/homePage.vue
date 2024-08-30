<template>
    <div>
        <tree-and-content :loading="loading">
            <template v-slot:tree>
                <organization-tree ref="organization_tree" @selectByTree="selectByTree" @getDeptId="getDeptId"
                                   :loading="dataListLoading"></organization-tree>
            </template>

            <template v-slot:content>
                <div style="display: flex; flex-direction: column;">
                    <div class="title">
                        <div>{{ deptInfo.name }}</div>
                        <div style="align-items: center; flex: 1; ">
                            <!--<el-button size="mini" type="primary" @click="goPath()" style="float: right; margin-top: 6px;">详情</el-button>-->
                            <el-button @click="goPath()" size="small"
                                       style="float: right;padding-bottom: 10px; background: rgba(228, 53, 43, 1);color:#ffffff;border-color: rgb(228, 53, 43);">
                                详情
                            </el-button>
                        </div>
                    </div>

                    <div style="margin-top: 10px;">
                        <!-- <div style="padding: 0 10px; height: 25px; line-height: 25px;font-size: 15px">基本数据：</div> -->
                        <div style="width: 100%; overflow: auto; height: calc(100% - 25px);">
                            <el-row :gutter="20"
                                    style="width: 100%; margin: 0; min-width: 700px; height: 100%; display: flex">
                                <el-col :span="4" class="top-col">
                                    <img class="bg-img" :src="dyzsPng">
                                    <div class="total-box one-total-box">
                                        <div>
                                            <div class="total-title">
                                                党员总数
                                            </div>
                                            <div class="total-num">
                                                {{ partyMemberValue }}人
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="4" class="top-col">
                                    <img class="bg-img" :src="ybdyPng">
                                    <div class="total-box  four-total-box">
                                        <div>
                                            <div class="total-title">
                                                预备党员
                                            </div>
                                            <div class="total-num">
                                                {{ yuBeiPartyMemberValue }} 人
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="4" class="top-col">
                                    <img class="bg-img" :src="xbPng">
                                    <div class="two-total-box">
                                        <div class="total-title">
                                            性别
                                        </div>
                                        <div class="total-sex-box">
                                            <div class="total-sex">
                                                <div class="total-value">{{ manTotal }}人</div>
                                                <div class="total-label">男</div>
                                            </div>
                                            <div class="line"></div>
                                            <div class="total-sex">
                                                <div class="total-value">{{ womanTotal }}人</div>
                                                <div class="total-label">女</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="4" class="top-col">
                                    <img class="bg-img" :src="lddyPng">
                                    <div class="two-total-box">
                                        <div class="total-title">
                                            流动党员
                                        </div>
                                        <div class="total-sex-box">
                                            <div class="total-sex">
                                                <div class="total-value">{{ floatingTotal }}人</div>
                                                <div class="total-label">流动党员</div>
                                            </div>
                                            <div class="line"></div>
                                            <div class="total-sex">
                                                <div class="total-value">{{ notFloatingTotal }}人</div>
                                                <div class="total-label">非流动党员</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>

                                <el-col :span="4" class="top-col">
                                    <img class="bg-img" :src="sfpkPng">
                                    <div class="two-total-box">
                                        <div class="total-title">
                                            党务工作者
                                        </div>
                                        <div class="total-sex-box">
                                            <div class="total-sex">
                                                <div class="total-value">{{ isPartyWorkerValue }}人</div>
                                                <div class="total-label">是</div>
                                            </div>
                                            <div class="line"></div>
                                            <div class="total-sex">
                                                <div class="total-value">{{ notPartyWorkerValue }}人</div>
                                                <div class="total-label">否</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="4" class="top-col">
                                    <img class="bg-img" :src="sfslPng">
                                    <div class="two-total-box">
                                        <div class="total-title">
                                            是否失联
                                        </div>
                                        <div class="total-sex-box">
                                            <div class="total-sex">
                                                <div class="total-value">{{ isLostValue }}人</div>
                                                <div class="total-label">是</div>
                                            </div>
                                            <div class="line"></div>
                                            <div class="total-sex">
                                                <div class="total-value">{{ notLostValue }}人</div>
                                                <div class="total-label">否</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>

                    <div class="bottom-box">
                        <el-row :gutter="20" style="width: 100%; margin: 0;">
                            <el-col :span="17">
                                <el-row :gutter="20" style="width: 100%; margin: 0;">
                                    <el-col :span="11" class="orizition-info">
                                        <div class="content-box"
                                             style="width: 100%; display: flex; flex-direction: column;">
                                            <!-- <div class="content-title">
                                                <div class="icon"></div>
                                                组织简介
                                            </div> -->
                                            <el-image style="width: 100%;" fit="contain" class="img"
                                                      v-if="deptIntroduceInfo.deptInfo?.deptPhoto && deptIntroduceInfo.deptInfo?.deptPhoto.length > 0"
                                                      :src="base + deptIntroduceInfo.deptInfo?.deptPhoto"></el-image>
                                            <img style="width: 100%;" class="img" v-else :style="deptIntroduceInfo.deptIntroduction ? 'height: 225px;' : ''"
                                                      src="../../../assets/zz-icon.jpg"/>
                                            <div class="text">
                                                {{ deptIntroduceInfo.deptIntroduction }}
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="13" class="echarts-box-col-one">
                                        <div class="echarts-box">
                                            <div ref="chart6" class="one-echarts-box"></div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" style="width: 100%; margin: 20px 0 0 0;">
                                    <el-col :span="24" class="echarts-box-col">
                                        <div class="echarts-box">
                                            <div ref="chart" class="two-echarts-box"></div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="7">
                                <div class="echarts-box">
                                    <div ref="chart4" class="three-echarts-box"></div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </template>
        </tree-and-content>
    </div>
</template>

<script>
import TreeAndContent from "@/components/TreeAndContent.vue";
import OrganizationTree from "@/views/dj/components/organizationTree.vue";
import {getDeptIntroduceById, getTzSysDept} from "@/api/jcxfSysDept";
import defaultImg from "@/assets/defaultImg.png"
import gender from "@/assets/partyMember/gender.png"
import porvety from "@/assets/partyMember/porvety.png"
import lostImg from "@/assets/partyMember/lostImg.png"
import util from "@/libs/util";
import dyzsPng from "@/assets/partyMember/dyzs.png";
import lddyPng from "@/assets/partyMember/lddy.png";
import sfpkPng from "@/assets/partyMember/sfpk.png";
import sfslPng from "@/assets/partyMember/sfsl.png";
import xbPng from "@/assets/partyMember/xb.png";
import ybdyPng from "@/assets/partyMember/ybdy.png";
import {
    getPartyMemberCount,
    getPartyMemberYuBeiCount,
    getGenderCount,
    getFloatingPartyMemberCount,
    getPartyWorkerCount,
    getPartyLostCount,
    getPositionDistribution,
    getAgeDistribution,
    getPartyStandingDistribution} from "@/api/homePage";
import {getDictByCode} from "@/api/jcxfSysDictionary";

export default {
    name: "homePage",
    components: {
        TreeAndContent,
        OrganizationTree
    },
    data() {
        return {
            gender: gender,
            porvety: porvety,
            lostImg: lostImg,
            loading: true,
            base: util.jcxfUrl,
            deptId: null,
            defaultImg: defaultImg,
            dataListLoading: false,
            deptInfo: {},
            deptIntroduceInfo: {},
            partyAgesList: ['10年及以下', '11-20年', '21-30年', '31-40年', '41-50年', '50年以上'],
            flag: [false, false, false, false, false, false, false, false, false, false, false],
            dyzsPng,
            lddyPng,
            sfpkPng,
            sfslPng,
            xbPng,
            ybdyPng,
            partyMemberValue: 0,
            yuBeiPartyMemberValue: 0,
            manTotal: 0,
            womanTotal: 0,
            floatingTotal: 0,
            notFloatingTotal: 0,
            isPartyWorkerValue: 0,
            notPartyWorkerValue: 0,
            isLostValue: 0,
            notLostValue: 0,
            ageDistributionValue: [0, 0, 0, 0, 0, 0],
            partyStandingDistributionValue: [0, 0, 0, 0, 0, 0],
            positionDistributionValue: null
        }
    },
    methods: {
        goPath() {
            this.$router.push({
                path: '/dwgl/dygl',
                query: {
                    deptId: this.deptInfo.id
                }
            })
        },
        selectByTree(data) {
            this.deptId = data.whereMap.deptId
            this.loading = true
            this.flag = [false, false, false, false, false, false, false, false, false, false, false]

            this.initPage()
        },
        setFlag(index) {
            this.flag[index] = true
            if (this.flag.indexOf(false) < 0) {
                // 执行您自己的业务逻辑
                this.loading = false
            }
        },
        getDeptId(data) {
            this.deptId = data.deptId
            this.loading = true

            this.initPage()
        },
        initPage() {
            this.getTzSysDeptInfo(0)
            this.getDeptIntroduce(1)

            this.partyMemberCount(2)
            this.partyMemberYuBeiCount(3)
            this.genderCount(4)
            this.floatingPartyMemberCount(5)
            this.partyWorkerCount(6)
            this.partyLostCount(7)
            this.positionDistribution(8)

            this.ageDistribution(9)
            this.partyStandingDistribution(10)
        },
        getTzSysDeptInfo(index) {
            getTzSysDept(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.deptInfo = data.data
                    this.$set(this.flag, 0, false);
                }
                this.setFlag(index)
            })
        },
        getDeptIntroduce(index) {
            getDeptIntroduceById(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.deptIntroduceInfo = data.data
                    this.$set(this.flag, 1, false);
                }
                this.setFlag(index)
            })
        },
        partyMemberCount(index) {
            getPartyMemberCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.partyMemberValue = data.data
                }
                this.setFlag(index)
            })
        },
        partyMemberYuBeiCount(index) {
            getPartyMemberYuBeiCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.yuBeiPartyMemberValue = data.data
                }
                this.setFlag(index)
            })
        },
        genderCount(index) {
            getGenderCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.manTotal = data.data.man
                    this.womanTotal = data.data.woman
                }
                this.setFlag(index)
            })
        },
        floatingPartyMemberCount(index) {
            getFloatingPartyMemberCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.floatingTotal = data.data.floating
                    this.notFloatingTotal = data.data.notFloating
                }
                this.setFlag(index)
            })
        },
        partyWorkerCount(index) {
            getPartyWorkerCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.isPartyWorkerValue = data.data.isPartyWorker
                    this.notPartyWorkerValue = data.data.notPartyWorker
                }
                this.setFlag(index)
            })
        },
        partyLostCount(index) {
            getPartyLostCount(this.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.isLostValue = data.data.isLost
                    this.notLostValue = data.data.notLost
                }
                this.setFlag(index)
            })
        },
        positionDistribution(index) {
            getDictByCode('position').then(res => {
                if (res.data.code == '00000') {
                    let dicList = res.data.data
                    getPositionDistribution(this.deptId).then(res2 => {
                        const data = res2.data
                        let result = res2.data.data.position

                        let chartValue = []

                        if (data.code == '00000' && result != null) {

                            for (let i = 0; i < dicList.length; i++) {
                                let dic = dicList[i]
                                let num = 0

                                for (let j = 0; j < result.length; j++) {
                                    let map = result[j]
                                    if (map.position == dic.itemValue) {
                                        num = map.num
                                        if (dic.itemValue == '99') {
                                            num += res2.data.data.no
                                        }

                                        map.calculate = true
                                        break
                                    }
                                }
                                chartValue.push({
                                    name: dic.label,
                                    value: num
                                })
                            }
                        } else {
                            chartValue.push({
                                name: '无',
                                value: res2.data.data.no
                            })
                        }
                        this.positionDistributionValue = chartValue
                        this.$nextTick(() => {
                            this.initEcharts4()
                        })
                        this.setFlag(index)
                    })
                }
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
                    this.ageDistributionValue = value
                }
                this.$nextTick(() => {
                    this.initEcharts6()
                })
                this.setFlag(index)
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
                    this.partyStandingDistributionValue = value
                }
                this.$nextTick(() => {
                    this.initEcharts1()
                })
                this.setFlag(index)
            })
        },
        initEcharts1() {
            const chart = this.$refs.chart
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    title: {
                        text: '党龄统计',
                        x: 10,
                        y: 20
                    },
                    legend: {
                        icon: "rect",
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['10年及以下', '11-20年', '21-30年', '31-40年', '41-50年', '50年及以上']
                    },
                    yAxis: {
                        type: 'value',
                        name: '(单位: 人)'
                    },
                    grid: {
                        left: 60,
                        top: 100,
                        right: 20,
                        bottom: 30
                    },
                    series: [
                        {
                            data: this.partyStandingDistributionValue,
                            type: 'line',
                            center: ['50%', '20%'],
                            grid: {
                                y: 101,
                                x2: 10,
                                height: '80%'
                            },
                            // symbol: 'circle', //折线点设置为实心点
                            symbolSize: 6, //折线点的大小
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    color: "rgba(228, 53, 43, 1)", //折线点的颜色
                                    lineStyle: {
                                        color: "rgba(228, 53, 43, 1)" //折线的颜色
                                    },

                                }
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [  // 渐变颜色
                                        {
                                            offset: 0,
                                            color: 'rgba(235, 198, 195, 1) ',
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(227, 52, 36, 0)',
                                        },
                                    ],
                                    global: false,
                                },
                            },
                        },

                    ]
                };
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }


        },
        initEcharts4() {
            const chart = this.$refs.chart4
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    title: {
                        text: '职务分布',
                        x: 10,
                        y: 20
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        icon: "rect",
                        width: '40%',
                        left: 'center',
                        bottom: '10%'
                    },
                    series: [
                        {
                            name: '职务分布',
                            type: 'pie',
                            center: ['50%', '35%'],
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                // borderRadius: 10,
                                // borderColor: '#fff',
                                // borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    formatter: '{b}: {c} 人'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: this.positionDistributionValue
                        }
                    ]
                };
                myChart.setOption(option)
                myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: 0
                });
                myChart.on('mouseover', (v) => {
                    if (v.dataIndex != 0) {
                        // 高亮显示悬停的那块
                        myChart.dispatchAction({
                            type: 'hideTip',
                            seriesIndex: 0,
                            dataIndex: 0
                        });
                        // 当检测到鼠标悬停事件，取消所有选中高亮
                        myChart.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 0,
                            dataIndex: 0
                        });
                    }
                });
                myChart.on('mouseout', (v) => {
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: 0
                    });
                    myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: 0
                    });
                })
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
        },
        initEcharts6() {
            const chart = this.$refs.chart6
            if (chart) {
                const myChart = this.$echarts.init(chart, null, {renderer: 'svg'})
                const option = {
                    title: {
                        text: '年龄统计',
                        x: 10,
                        y: 10
                    },
                    legend: {
                        icon: "rect",
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        data: ['35岁及以下', '36-40岁', '41-45岁', '46-50岁', '51-54岁', '55岁及以上'],
                        axisLabel: {
                            formatter: function (value)  //X轴的内容
                            {
                                let ret = '' //拼接加\n返回的类目项
                                let max = 3  //每行显示的文字字数
                                let val = value.length  //X轴内容的文字字数
                                let rowN = Math.ceil(val / max)  //需要换的行数
                                if (rowN > 1)  //判断 如果字数大于2就换行
                                {
                                    for (let i = 0; i < rowN; i++) {
                                        let temp = ''  //每次截取的字符串
                                        let start = i * max  //开始截取的位置
                                        let end = start + max  //结束截取的位置
                                        temp = value.substring(start, end) + "\n"
                                        ret += temp  //最终的字符串
                                    }
                                    return ret
                                } else {
                                    return value
                                }
                            }
                        }
                    },
                    yAxis: {
                        name: '(单位: 人)'
                    },
                    color: ['rgba(0, 140, 255, 1)'],
                    grid: {
                        left: 60,
                        top: 80,
                        right: 20,
                        bottom: 50
                    },
                    series: [
                        {
                            type: 'bar',
                            data: this.ageDistributionValue,
                            grid: {
                                y: 101,
                                x2: 10,
                                height: '100%'
                            },
                            barWidth: '40%'
                        }
                    ]
                }
                myChart.setOption(option)
                window.addEventListener('resize', function () {
                    myChart.resize()
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.top-col {
    margin-top: 10px;
    position: relative;
}

.point {
    margin: auto 0;
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background: #ff0000;
    align-self: center;
    margin-right: 10px;
}

.title {
    border-bottom: 2px solid red;
    font-weight: bold;
    line-height: 40px;
    display: flex;
    flex-direction: row;
    font-size: 15px;
}

.bottom-box {
    margin-top: 20px;

    .orizition-info {
        padding-left: 0 !important;

    }
}

.content-box {
    border: 1px solid rgb(246, 246, 246);
    border-radius: 5px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
    height: 294px;

    .content-title {
        height: 25px;
        display: flex;
        flex-direction: row;
        line-height: 25px;
        align-items: center;

        .icon {
            width: 10px;
            height: 10px;
            background: red;
            margin-right: 5px;
        }

        .img {

            .el-image {
                width: 100%;
            }
        }
    }

    .text {
        max-height: 150px;
        overflow-y: auto;
        /*text-indent: 2em;*/
        font-size: 14px;
        color: #333;
        padding: 10px;
        text-align: justify;
    }
}

.bg-img-box {
    position: relative;
    padding: 0 10px;
}

.bg-img {
    object-fit: cover;
    object-position: right;
    position: absolute;
    border-radius: 10px;
    width: calc(100% - 16px);
    margin-left: 8px;
    height: 100%;
    z-index: 0;
    top: 0;
    left: 0;
}

.total-box {
    position: relative;
    text-align: left;
    padding: 10px;
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    height: 100%;
    z-index: 1;

    .total-title {
        color: #fff;
        font-size: 14px;
        font-weight: 700;
    }

    .total-sex {
        display: flex;
        align-items: center;

        .total-label {
            font-size: 13px;
        }

        .total-value {
            margin-left: 10px;
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            width: 60px;
        }

        .total-unit {
            font-size: 13px;
            margin-left: 10px;
        }
    }

    .total-num {
        color: #fff;
        margin-top: 5px;
        font-size: 24px;
        font-weight: 700;
    }

}

.two-total-box {
    position: relative;
    z-index: 1;
    padding: 10px;
    color: #fff;
    word-break: break-all;

    .total-sex-box {
        display: flex;
    }

    .total-title {
        font-size: 14px;
        margin-bottom: 8px;
        font-weight: 700;
    }

    .total-sex {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
    }

    .line {
        position: relative;
        top: 10px;
        margin: 0 10px;
        width: 1px;
        height: 30px;
        background-color: #fff;
    }
}

.one-echarts-box {
    height: 294px;
}

.two-echarts-box {
    height: 278px;
}

.three-echarts-box {
    height: 592px;
}

.echarts-box {
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
}

.echarts-box-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

.echarts-box-col-one {
    padding-right: 0 !important;
}
</style>
