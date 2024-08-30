<!--<template>-->

<!--  <el-container v-loading="loading">-->
<!--    <el-aside style="background-color: #fff">-->
<!--      <organization-tree @selectByTree="selectByTree" :isLoading=false></organization-tree>-->
<!--    </el-aside>-->

<!--    <el-container style="background-color:#F5F5F5;height: 1000px">-->
<!--      <el-main>-->
<!--        <el-button size="small" @click="back">返回</el-button>-->

<!--        <el-button plain size="small" @click="meetingClassEvent(1)"-->
<!--                   :style="whereMap.meetingType === '1' ? 'background: #337ab7;color:white;margin-left:450px' : 'margin-left:450px' ">-->
<!--          三会一课-->
<!--        </el-button>-->
<!--        <el-button plain size="small" @click="meetingClassEvent(2)" :style="whereMap.meetingType === '2' ? 'background: #337ab7;color:white' : '' ">-->
<!--          组织生活会(民主评议党员)-->
<!--        </el-button>-->


<!--        <div style="display: flex;margin-top: 20px">-->
<!--          <div style="width:50%;height:400px;background-color: #fff ">-->
<!--            <div ref="chart" style="height:366px"></div>-->
<!--          </div>-->
<!--          <div style="width:50%;height:400px;background-color: #fff;margin-left: 20px ">-->
<!--            <div ref="chart2" style="height:366px"></div>-->
<!--          </div>-->

<!--        </div>-->
<!--        <div style="display:flex;margin-top: 10px">-->
<!--          <div style="width:50%;height:420px;background-color: #fff; ">-->
<!--            <div style="font-size:18px;font-weight: bold;margin-left:15px;margin-top: 20px">已开展率排行榜</div>-->
<!--            <div ref="chart5" style="height:400px"></div>-->
<!--          </div>-->
<!--          <div style="width:50%;height:420px;background-color: #fff;margin-left: 20px ">-->
<!--            <div style="font-size:18px;font-weight: bold;margin-left:15px;margin-top: 20px">党员参加率排行榜</div>-->
<!--            <div ref="chart6" style="height:400px"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-main>-->
<!--    </el-container>-->
<!--  </el-container>-->
<!--</template>-->

<!--<script>-->

<!--  import organizationTree from '@/views/dj/components/organizationTree'-->
<!--  import {getInfo} from "@/api/tzOrganizationLife";-->

<!--  export default {-->
<!--    name: 'meetingEcharts',-->
<!--    components: {-->
<!--      organizationTree-->
<!--    },-->
<!--    data () {-->
<!--      return {-->
<!--        whereMap: {-->
<!--          meetingType: '1',-->
<!--          deptId: ''-->
<!--        },-->
<!--        partyAges: [],-->
<!--        ages: [],-->
<!--        educationList: [],-->
<!--        position: [],-->
<!--        loading: false,-->
<!--        total: 0,-->
<!--        precent: '60%',-->
<!--        deptId: '1',-->
<!--        weiKaizhan: 100,-->
<!--        weikaizhan: 0,-->
<!--        joins: 0,-->
<!--        unJoins: 0,-->
<!--        poverty: 0,-->
<!--        unPoverty: 0,-->
<!--        flux: 0,-->
<!--        unFlux: 0,-->
<!--        deptNames: [],-->
<!--        sortNum: [],-->
<!--        deptNames2: [],-->
<!--        sortNum2: []-->
<!--      }-->
<!--    },-->
<!--    created () {-->
<!--      this.deptId = this.$route.query.deptId.toString()-->
<!--      this.getData(this.deptId)-->
<!--    },-->
<!--    mounted () {-->

<!--    },-->
<!--    methods: {-->
<!--      meetingClassEvent (type) {-->
<!--        this.meetingClass = []-->
<!--        if (type === 1) {-->
<!--          this.whereMap.meetingType = '1'-->
<!--          this.getData(this.deptId)-->
<!--        } else if (type === 2) {-->
<!--          this.whereMap.meetingType = '2'-->
<!--          this.getData(this.deptId)-->
<!--        }-->
<!--      },-->
<!--      selectByTree (data) {-->
<!--        this.deptId = data.whereMap.deptId-->
<!--        this.getData(this.deptId)-->
<!--      },-->
<!--      back () {-->
<!--        this.$router.push({path: 'organizationLife'})-->
<!--      },-->
<!--      getData (deptId) {-->
<!--        const timeOne = new Date()-->
<!--        const year = timeOne.getFullYear()-->
<!--        this.loading = true-->
<!--        let data = {}-->
<!--        data = this.whereMap-->
<!--        data.deptId = deptId-->
<!--        data.year = ''-->
<!--        getInfo(data).then((res) => {-->
<!--          if (res.success) {-->
<!--            this.total = res.data.total-->
<!--            this.weiKaizhan = res.data.weiKaizhan-->
<!--            this.kaizhan = res.data.kaizhan-->
<!--            this.unJoins = res.data.unJoins-->
<!--            this.joins = res.data.joins-->
<!--            this.deptNames = []-->
<!--            this.sortNum = []-->
<!--            res.data.integerList.forEach(i => {-->
<!--              this.deptNames.push(i.deptName)-->
<!--              this.sortNum.push({'value': i.count, 'cishu': i.cishu})-->
<!--            })-->
<!--            this.deptNames2 = []-->
<!--            this.sortNum2 = []-->
<!--            res.data.integerList2.forEach(i => {-->
<!--              this.deptNames2.push(i.deptName)-->
<!--              this.sortNum2.push({'value': i.count, 'cishu': i.cishu})-->
<!--            })-->

<!--            this.initEcharts1()-->
<!--            this.initEcharts2()-->
<!--            this.initEcharts5()-->
<!--            this.initEcharts6()-->
<!--            this.loading = false-->
<!--          } else {-->
<!--            this.$message({-->
<!--              message: this.$i18n.t('数据异常'),-->
<!--              type: 'error',-->
<!--              duration: 1000-->
<!--            })-->
<!--          }-->
<!--        }).finally(i => {-->
<!--          this.loading = false-->
<!--        })-->
<!--      },-->
<!--      initEcharts1 () {-->
<!--        const chart = this.$refs.chart-->
<!--        if (chart) {-->
<!--          const myChart = this.$echarts.init(chart)-->
<!--          const option = {-->
<!--            title: {-->
<!--              text: '开展率',-->
<!--              x: 10,-->
<!--              y: 20-->
<!--            },-->
<!--            tooltip: {-->
<!--              trigger: 'item'-->
<!--            },-->
<!--            legend: {-->
<!--              data: ['开展', '未开展'],-->
<!--              orient: 'vertical',-->
<!--              textStyle: {  // 图列内容样式-->
<!--                color: '#000',  // 字体颜色-->
<!--              },-->
<!--              x: 10,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了-->
<!--              y: 60//延Y轴居中-->
<!--            },-->
<!--            color: ['#5470c6', '#fc8251'],-->
<!--            series: [-->
<!--              {-->
<!--                type: 'pie',-->
<!--                data: [-->
<!--                  {-->
<!--                    value: this.kaizhan,-->
<!--                    name: '开展'-->
<!--                  },-->
<!--                  {-->
<!--                    value: this.weiKaizhan,-->
<!--                    name: '未开展'-->
<!--                  }-->
<!--                ],-->
<!--                label: {-->
<!--                  //echarts饼图内部显示百分比设置-->
<!--                  show: true,-->
<!--                  position: 'outside', //outside 外部显示  inside 内部显示-->
<!--                  formatter: `{d}%`,-->
<!--                  color: '#000000', //颜色-->
<!--                  fontSize: 15 //字体大小-->
<!--                },-->
<!--                center: ['50%', '60%'],-->
<!--                radius: this.precent-->
<!--              }-->
<!--            ]-->
<!--          }-->
<!--          myChart.setOption(option)-->
<!--          window.addEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        }-->
<!--        this.$on('hook:destroyed', () => {-->
<!--          window.removeEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        })-->
<!--      },-->
<!--      initEcharts2 () {-->
<!--        const chart = this.$refs.chart2-->
<!--        if (chart) {-->
<!--          const myChart = this.$echarts.init(chart)-->
<!--          const option = {-->
<!--            title: {-->
<!--              text: '党员参会率',-->
<!--              x: 10,-->
<!--              y: 20-->
<!--            },-->
<!--            tooltip: {-->
<!--              trigger: 'item'-->
<!--            },-->
<!--            legend: {-->
<!--              data: ['参加党员数', '未参加党员数'],-->
<!--              orient: 'vertical',-->
<!--              textStyle: {  // 图列内容样式-->
<!--                color: '#000',  // 字体颜色-->
<!--              },-->
<!--              x: 10,//图例位置，设置right发现图例和文字位置反了，设置一个数值就好了-->
<!--              y: 60//延Y轴居中-->
<!--            },-->
<!--            color: ['#c62536', '#46af55'],-->
<!--            series: [-->
<!--              {-->
<!--                type: 'pie',-->
<!--                data: [-->
<!--                  {-->
<!--                    value: this.joins,-->
<!--                    name: '参加党员数'-->
<!--                  },-->
<!--                  {-->
<!--                    value: this.unJoins,-->
<!--                    name: '未参加党员数'-->
<!--                  }-->
<!--                ],-->
<!--                label: {-->
<!--                  //echarts饼图内部显示百分比设置-->
<!--                  show: true,-->
<!--                  position: 'outside', //outside 外部显示  inside 内部显示-->
<!--                  formatter: `{d}%`,-->
<!--                  color: '#000000', //颜色-->
<!--                  fontSize: 15 //字体大小-->
<!--                },-->
<!--                center: ['50%', '60%'],-->
<!--                radius: this.precent-->
<!--              }-->
<!--            ]-->
<!--          }-->
<!--          myChart.setOption(option)-->
<!--          window.addEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        }-->
<!--        this.$on('hook:destroyed', () => {-->
<!--          window.removeEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        })-->
<!--      },-->
<!--      initEcharts5 () {-->
<!--        const chart = this.$refs.chart5-->
<!--        if (chart) {-->
<!--          const myChart = this.$echarts.init(chart)-->
<!--          const option = {-->
<!--            tooltip: {-->
<!--              trigger: 'axis',-->
<!--              formatter: function (params) {-->
<!--                // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可-->
<!--                let firstParams = params[0].name-->
<!--                let data = params[0].value * 100-->
<!--                return firstParams + ':' + '<br>' + params[0].data.cishu + "次" + '<br>' + data + '%'-->
<!--              },-->
<!--              axisPointer: {-->
<!--                type: 'shadow'-->
<!--              }-->
<!--            },-->
<!--            xAxis: {-->
<!--              data: this.deptNames-->
<!--            },-->
<!--            yAxis: {},-->
<!--            series: [-->
<!--              {-->
<!--                type: 'bar',-->
<!--                data: this.sortNum,-->
<!--                grid: {-->
<!--                  y: 101,-->
<!--                  x2: 10,-->
<!--                  height: '100%'-->
<!--                },-->
<!--                barWidth: '50%'-->
<!--              }-->
<!--            ]-->
<!--          }-->
<!--          myChart.setOption(option)-->
<!--          window.addEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        }-->
<!--        this.$on('hook:destroyed', () => {-->
<!--          window.removeEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        })-->
<!--      },-->
<!--      initEcharts6 () {-->
<!--        const chart = this.$refs.chart6-->
<!--        if (chart) {-->
<!--          const myChart = this.$echarts.init(chart)-->
<!--          const option = {-->
<!--            /* title: {-->
<!--               text: '党龄',-->
<!--               x: 10,-->
<!--               y: 20-->
<!--             },*/-->
<!--            tooltip: {-->
<!--              trigger: 'axis',-->
<!--              formatter: function (params) {-->
<!--                // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即可-->
<!--                let firstParams = params[0].name-->
<!--                let data = params[0].value * 100-->
<!--                return firstParams + ':' + '<br>' + params[0].data.cishu + "人" + '<br>' + data + '%'-->
<!--              },-->
<!--              axisPointer: {-->
<!--                type: 'shadow'-->
<!--              }-->
<!--            },-->
<!--            xAxis: {-->
<!--              data: this.deptNames2-->
<!--            },-->
<!--            yAxis: {},-->
<!--            series: [-->
<!--              {-->
<!--                type: 'bar',-->
<!--                data: this.sortNum2,-->
<!--                grid: {-->
<!--                  y: 101,-->
<!--                  x2: 10,-->
<!--                  height: '100%'-->
<!--                },-->
<!--                barWidth: '40%'-->
<!--              }-->
<!--            ]-->
<!--          }-->
<!--          myChart.setOption(option)-->
<!--          window.addEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        }-->
<!--        this.$on('hook:destroyed', () => {-->
<!--          window.removeEventListener('resize', function () {-->
<!--            myChart.resize()-->
<!--          })-->
<!--        })-->
<!--      },-->

<!--    },-->
<!--  }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
