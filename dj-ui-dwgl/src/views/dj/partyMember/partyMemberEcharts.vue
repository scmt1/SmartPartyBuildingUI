<template>
  <el-container style="background-color:#F5F5F5;height: 1000px" v-loading="loading">
    <!--  <el-header style="height: 40px;margin-top:20px">
        <el-button size="small" @click="search">返回</el-button>
        <div style="font-size: 12px;background-color: #fff;">
          <div style="height: 60px;width: 100%;margin-top: 10px;border-radius: 5px;background-color: #d9edf7;">
            <div style="padding-top:20px">
              <span class="amount">党员总数：{{total}}</span>
            </div>
          </div>
        </div>
      </el-header>-->

    <el-main>
      <el-button size="small" icon="el-icon-arrow-left" class="topBtn" @click="back">返回</el-button>
      <div style="font-size: 12px;background-color: #fff;">
        <div style="height: 60px;width: 100%;margin-top: 10px;border-radius: 5px;background-color: #d9edf7;">
          <div style="padding-top:20px">
            <span class="amount">党员总数：{{total}}</span>
          </div>
        </div>
      </div>

      <div style="display: flex;margin-top: 20px">
        <div style="width:25%;height:400px;background-color: #fff ">
          <div ref="chart" style="height:366px"></div>
        </div>
        <div style="width:25%;height:400px;background-color: #fff;margin-left: 20px ">
          <div ref="chart2" style="height:366px"></div>
        </div>
        <div style="width:25%;height:400px;background-color: #fff;margin-left: 20px ">
          <div ref="chart3" style="height:366px"></div>
        </div>
        <div style="width:25%;height:400px;background-color: #fff;margin-left: 20px ">
          <div ref="chart4" style="height:366px"></div>
        </div>
      </div>
      <div style="display:flex;margin-top: 10px">
        <div style="width:50%;height:420px;background-color: #fff; ">
          <div style="font-size:18px;font-weight: bold;margin-left:15px;margin-top: 20px">党龄</div>
          <div ref="chart5" style="height:400px"></div>
        </div>
        <div style="width:50%;height:420px;background-color: #fff;margin-left: 20px ">
          <div style="font-size:18px;font-weight: bold;margin-left:15px;margin-top: 20px">年龄段</div>
          <div ref="chart6" style="height:400px"></div>
        </div>
      </div>
      <div style="display:flex;margin-top: 10px">
        <div style="width:50%;height:530px;background-color: #fff; ">
          <div style="font-size:18px;font-weight: bold;margin-left:15px;margin-top: 20px">文化程度</div>
          <div ref="chart7" style="height:500px"></div>
        </div>
        <div style="width:50%;height:530px;background-color: #fff;margin-left: 20px ">
          <div style="font-size:18px;font-weight: bold;margin-left:15px;margin-top: 20px">职务</div>
          <div ref="chart8" style="height:500px"></div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getInfo } from "@/api/jcxfPartyMember";

  export default {
    name: 'partyMemberEcharts',
    data () {
      return {
        partyAges: [],
        ages: [],
        educationList: [],
        position: [],
        loading: false,
        total: 0,
        precent: '40%',
        deptId: '1',
        man: 100,
        woMan: 0,
        unKnownSex: 0,
        lost: 0,
        unLost: 0,
        poverty: 0,
        unPoverty: 0,
        flux: 0,
        unFlux: 0
      }
    },
    created () {
      this.loading = true
      this.deptId = this.$route.query.deptId.toString()
      this.getSex(this.deptId)
    },
    mounted () {

    },
    methods: {
      back () {
        this.$router.push({path: 'index'})
      },
      getSex (deptId) {
       getInfo(deptId).then((res) => {
          if (res.success) {
            this.total = res.data.total
            this.man = res.data.man
            this.woMan = res.data.woMan
            this.unKnownSex = res.data.unKnownSex
            this.lost = res.data.lost
            this.unLost = res.data.unLost
            this.poverty = res.data.poverty
            this.unPoverty = res.data.unPoverty
            this.flux = res.data.flux
            this.unFlux = res.data.unFlux

            this.partyAges = res.data.partyAges
            this.ages = res.data.ages
            this.educationList = res.data.education
            this.position = res.data.position

            this.initEcharts1()
            this.initEcharts2()
            this.initEcharts3()
            this.initEcharts4()
            this.initEcharts5()
            this.initEcharts6()
            this.initEcharts7()
            this.initEcharts8()
            this.loading = false
          } else {
            this.$message({
              message: this.$i18n.t('性别统计失败'),
              type: 'error',
              //duration: 1000
            })
          }
        })
      },
      initEcharts1 () {
        const chart = this.$refs.chart
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {
            title: {
              text: '性别',
              x: 10,
              y: 20
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              data: ['男', '女', '未知'],
              orient: 'vertical',
              textStyle: {  // 图列内容样式
                color: '#000',  // 字体颜色
              },
              x: 10,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
              y: 60//延Y轴居中
            },
            color: ['#5470c6', '#fc8251', '#91cd77'],
            series: [
              {
                type: 'pie',
                data: [
                  {
                    value: this.man,
                    name: '男'
                  },
                  {
                    value: this.woMan,
                    name: '女'
                  },
                  {
                    value: this.unKnownSex,
                    name: '未知'
                  }
                ],
                label: {
                  //echarts饼图内部显示百分比设置
                  show: true,
                  position: 'outside', //outside 外部显示  inside 内部显示
                  formatter: `{d}%`,
                  color: '#000000', //颜色
                  fontSize: 15 //字体大小
                },
                center: ['50%', '70%'],
                radius: this.precent
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
      initEcharts2 () {
        const chart = this.$refs.chart2
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {
            title: {
              text: '失联党员',
              x: 10,
              y: 20
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              data: ['失联党员', '非失联党员'],
              orient: 'vertical',
              textStyle: {  // 图列内容样式
                color: '#000',  // 字体颜色
              },
              x: 10,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
              y: 60//延Y轴居中
            },
            color: ['#c62536', '#46af55'],
            series: [
              {
                type: 'pie',
                data: [
                  {
                    value: this.lost,
                    name: '失联党员'
                  },
                  {
                    value: this.unLost,
                    name: '非失联党员'
                  }
                ],
                label: {
                  //echarts饼图内部显示百分比设置
                  show: true,
                  position: 'outside', //outside 外部显示  inside 内部显示
                  formatter: `{d}%`,
                  color: '#000000', //颜色
                  fontSize: 15 //字体大小
                },
                center: ['50%', '70%'],
                radius: this.precent
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
      initEcharts3 () {
        const chart = this.$refs.chart3
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {
            title: {
              text: '贫困户',
              x: 10,
              y: 20
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              data: ['贫困户', '非贫困户'],
              orient: 'vertical',
              textStyle: {  // 图列内容样式
                color: '#000',  // 字体颜色
              },
              x: 10,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
              y: 60//延Y轴居中
            },
            color: ['#5470c6', '#fcc842'],
            series: [
              {
                type: 'pie',
                data: [
                  {
                    value: this.poverty,
                    name: '贫困户'
                  },
                  {
                    value: this.unPoverty,
                    name: '非贫困户'
                  }
                ],
                label: {
                  //echarts饼图内部显示百分比设置
                  show: true,
                  position: 'outside', //outside 外部显示  inside 内部显示
                  formatter: `{d}%`,
                  color: '#000000', //颜色
                  fontSize: 15 //字体大小
                },
                center: ['50%', '70%'],
                radius: this.precent
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
      initEcharts4 () {
        const chart = this.$refs.chart4
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {
            title: {
              text: '流动党员',
              x: 10,
              y: 20
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              data: ['流动党员', '非流动党员'],
              orient: 'vertical',
              textStyle: {  // 图列内容样式
                color: '#000',  // 字体颜色
              },
              x: 10,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了
              y: 60//延Y轴居中
            },
            color: ['#3d5696', '#fc577e'],
            series: [
              {
                type: 'pie',
                data: [
                  {
                    value: this.flux,
                    name: '流动党员'
                  },
                  {
                    value: this.unFlux,
                    name: '非流动党员'
                  }
                ],
                label: {
                  //echarts饼图内部显示百分比设置
                  show: true,
                  position: 'outside', //outside 外部显示  inside 内部显示
                  formatter: `{d}%`,
                  color: '#000000', //颜色
                  fontSize: 15 //字体大小
                },
                center: ['50%', '70%'],
                radius: this.precent
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
      initEcharts5 () {
        const chart = this.$refs.chart5
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {
            tooltip: {
              trigger: 'item'
            },
            xAxis: {
              data: ['10年及以下', '11-20年', '21-30年', '31-40年', '41-50年', '50年以上']
            },
            yAxis: {},
            series: [
              {
                type: 'bar',
                data: this.partyAges,
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
        this.$on('hook:destroyed', () => {
          window.removeEventListener('resize', function () {
            myChart.resize()
          })
        })
      },
      initEcharts6 () {
        const chart = this.$refs.chart6
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {
            /* title: {
               text: '党龄',
               x: 10,
               y: 20
             },*/
            tooltip: {
              trigger: 'item'
            },
            xAxis: {
              data: ['35岁及以下', '36-40岁', '41-45岁', '46-50岁', '51-54岁', '55岁及以上']
            },
            yAxis: {},
            series: [
              {
                type: 'bar',
                data: this.ages,
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
        this.$on('hook:destroyed', () => {
          window.removeEventListener('resize', function () {
            myChart.resize()
          })
        })
      },
      initEcharts7 () {
        const chart = this.$refs.chart7
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {

            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '10%',
              bottom: '8%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: ['博士研究生', '硕士研究生', '研究生班', '1A 中央党校研究生', '1B 省（区、市）委党校研究生', '21 大学', '22 大专', '23 大学普通班', '24 第二学士学位班', '2A 中央党校大学', '2B 省（区、市）委党校大学', '2C 中央党校大专',
                '2D 省（区、市）委党校大专', '41 中等专科(中专)', '44 职业高中（中技）', '47 技工学校', '6 普通高中', '7 初中', '8 小学', '9 其他']
            },
            series: [
              {
                type: 'bar',
                barWidth: 10, // 内柱条的宽度
                // ------------------数据及其样式----------------------------
                // 内柱条的数据
                data: this.educationList,
                align: 'center'
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
      initEcharts8 () {
        const chart = this.$refs.chart8
        if (chart) {
          const myChart = this.$echarts.init(chart)
          const option = {

            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '10%',
              bottom: '8%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: ['其他委员', '无', '宣传委员', '纪检委员', '组织委员', '副书记', '书记']
            },
            series: [
              {
                type: 'bar',
                barWidth: 30, // 内柱条的宽度
                // ------------------数据及其样式----------------------------
                // 内柱条的数据
                data: this.position,
                align: 'center'
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

    },
  }
</script>

<style scoped>

</style>
