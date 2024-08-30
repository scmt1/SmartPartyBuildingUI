<template>
  <el-container style="height: 100%">
    <!--      顶部按钮-->
    <el-header style="height: 40px;background-color: #fff">
      <el-row>
        <!--<el-button plain size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>-->
        <el-button class="topBtn" size="small" icon="el-icon-arrow-left" @click="handReturn">返回</el-button>
      </el-row>
    </el-header>
    <!--      主体-->
    <el-container style="height: 100%; border: 1px solid #eee;">

      <!--标题-->
      <el-header>
        <div style="font-size: 20px;text-align: center;;margin:10px 0px">{{topicName}}</div>
        <row style="display: flex;justify-content: center;">
          <div style="font-size: 20px;text-align: center">总分：{{totalRecords}}分</div>
          <div style="font-size: 20px;text-align: center;margin-left: 20px" v-if="isSubmit">成绩：{{records}}分</div>
        </row>
      </el-header>

      <!--      主体表格-->
      <el-main>
        <!--选择题-->
        <div v-if="selectList!=null&&selectList.length>0">
          <p style="font-size: 20px;">选择题</p>
          <div v-for="(item,index) in selectList" v-if="selectList.length>0">
            <p style="font-size: 18px; font-weight: bold; word-wrap: break-word;word-break: normal;">&nbsp&nbsp&nbsp{{index +
              1}}.&nbsp{{item.question}}（{{item.itemRecord}}分）<span v-if="isSubmit"
                                                                    :style="selectTmp[index].trueOrFalse!=0 ? 'color:blue;font-size: 20px; font-weight: bold;' : 'font-size: 18px; font-weight: bold;color:red' ">{{selectTmp[index].trueOrFalse!=0 ? '√' : '×'}}</span>
            </p>
            <el-radio-group v-model="selectTmp[index].achieveAnswer" style="margin-left: 20px" @input="changeType">
              <el-radio label="A">A.&nbsp&nbsp&nbsp{{item.itemA}}</el-radio>
              <el-radio label="B">B.&nbsp&nbsp&nbsp{{item.itemB}}</el-radio>
              <el-radio label="C">C.&nbsp&nbsp&nbsp{{item.itemC}}</el-radio>
              <el-radio label="D">D.&nbsp&nbsp&nbsp{{item.itemD}}</el-radio>
            </el-radio-group>
            <div v-if="isSubmit" style="font-weight: bold;font-size:15px;margin-top: 5px;margin-bottom: 10px">&nbsp&nbsp&nbsp正确答案：{{item.answer}}
            </div>
          </div>
        </div>
        <!--判断题-->
        <div style="margin-top: 20px" v-if="trueOrFalseList!=null&&trueOrFalseList.length>0">
          <p style="font-size: 20px;">判断题
          </p>
          <div v-for="(item,index) in trueOrFalseList" v-if="trueOrFalseList.length>0">
            <p style="font-size: 18px; font-weight: bold; word-wrap: break-word;word-break: normal;">&nbsp&nbsp&nbsp{{index +
              1}}.&nbsp{{item.question}}（{{item.itemRecord}}分）<span v-if="isSubmit"
                                                                    :style="trueOrFalseTmp[index].trueOrFalse!=0 ? 'color:blue;font-size: 20px; font-weight: bold;' : 'font-size: 18px; font-weight: bold;color:red' ">{{trueOrFalseTmp[index].trueOrFalse!=0 ? '√' : '×'}}</span>
            </p>
            <el-radio-group v-model="trueOrFalseTmp[index].achieveAnswer" style="margin-left: 20px" @input="">
              <el-radio label="对">对</el-radio>
              <el-radio label="错">错</el-radio>
            </el-radio-group>
            <div v-if="isSubmit" style="font-weight: bold;font-size:15px;margin-top: 5px;margin-bottom: 10px">&nbsp&nbsp&nbsp正确答案：{{item.answer}}
            </div>
          </div>
        </div>
        <!--填空题-->
        <div style="margin-top: 20px" v-if="fillInList!=null&&fillInList.length>0">
          <p style="font-size: 20px;">填空题</p>
          <div v-for="(item,index) in fillInList" v-if="fillInList.length>0">
            <p style="font-size: 18px; font-weight: bold; word-wrap: break-word;word-break: normal;">&nbsp&nbsp&nbsp{{index +
              1}}.&nbsp{{item.question}}（{{item.itemRecord}}分）</p>
            <el-input v-model="fillInTmp[index].achieveAnswer" placeholder="请填写答案" type="textarea" style="width: 95%;margin: 15px 15px"></el-input>
          </div>
        </div>
        <!--主观题-->
        <div style="margin-top: 20px" v-if="SubjectiveList!=null&&SubjectiveList.length>0">
          <p style="font-size: 20px;">主观题</p>
          <div v-for="(item,index) in SubjectiveList" v-if="SubjectiveList.length>0">
            <p style="font-size: 18px; font-weight: bold; word-wrap: break-word;word-break: normal;">&nbsp&nbsp&nbsp{{index +
              1}}.&nbsp{{item.question}}（{{item.itemRecord}}分）</p>
            <el-input v-model="SubjectiveTmp[index].achieveAnswer" placeholder="请填写答案" type="textarea"
                      style="width: 95%;margin: 15px 15px"></el-input>
          </div>
        </div>
      </el-main>
      <el-footer style="text-align: center">
        <el-button @click="submit"v-if="!isSubmit" >提交答案</el-button>
      </el-footer>
    </el-container>
  </el-container>

</template>
<script>
  import {formartDate} from '@/utils/tool.js'
  import fileDownload from 'js-file-download'
  import axios from 'axios'

  export default {
    name: '',
    data () {
      return {
        isAdmin:false,
        topicUserId: '',
        submitList: [],
        isSubmit: false,
        topicName: '',
        records: 0,
        totalRecords: 0,
        selectTmp: [],
        fillInTmp: [],
        trueOrFalseTmp: [],
        SubjectiveTmp: [],
        topicId: '',
        topicDetailId: '',
        id: '',
        partyMemberIds: '',
        display: false,
        whereMap: {
          deptId: '',
          startDate: '',
          endDate: ''
        },
        dataListLoading: false,
        tableDataNow: [],  // 显示的数据
        tableDataNow2: [],  // 显示的数据
        selectList: [],  // 选择题数据
        fillInList: [],  // 填空题数据
        trueOrFalseList: [],  // 判断题数据
        SubjectiveList: [],  // 判断题数据
        formLabelWidth: '100px',
        // 加载状态
        loading: false,
        // 输入状态
        input: '',
        //删除项
        deleteItmes: [],
      }
    },
    created () {
      //主题id
      this.topicId = this.$route.query.topicId.toString()
      this.topicName = this.$route.query.topicName.toString()
      this.isAdmin = this.$route.query.isAdmin
      this.initTreeData()
    },
    methods: {
      submit () {
        var count = 0
        this.selectTmp.forEach(i => {
          if (i.achieveAnswer === null || i.achieveAnswer === undefined || i.achieveAnswer === '') {
            count = count + 1
          }
        })
        this.fillInTmp.forEach(i => {
          if (i.achieveAnswer === null || i.achieveAnswer === undefined || i.achieveAnswer === '') {
            count = count + 1
          }
        })
        this.trueOrFalseTmp.forEach(i => {
          if (i.achieveAnswer === null || i.achieveAnswer === undefined || i.achieveAnswer === '') {
            count = count + 1
          }
        })
        this.SubjectiveTmp.forEach(i => {
          if (i.achieveAnswer === null || i.achieveAnswer === undefined || i.achieveAnswer === '') {
            count = count + 1
          }
        })
        if (count > 0) {
            this.$confirm('您还有' + count + '道题未答，确认提交吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                var ids = []
                this.subok(ids)
            }).catch(() => {
                this.$message.info('取消提交！')
            });
        } else {
            this.$confirm('提交后不可修改，确认提交？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                type: 'warning'
            }).then(() => {
                var ids = []
                this.subok(ids)
            }).catch(() => {
                this.$message.info('取消提交！')
            });
        }
      },
      changeType (e) {
        // this.form.answer = ''
      },
      reset () {
        this.selectList = []
        this.fillInList = []
        this.trueOrFalseList = []
        this.SubjectiveList = []
        this.daterange = []
        this.whereMap = {}
        // this.whereMap.deptId = '1'
        this.pageNum = 1
        this.pageSize = 10
      },

      // 返回
      handReturn () {
        if(this.isAdmin){
          this.$router.push({path: 'index'})
        }else {
          this.$router.push({path: 'topicDetail', query: {topicId: this.topicId, topicName: this.topicName}})
        }

      },
      initTreeData () {
        this.dataListLoading = true
        this.checkDoIt()
      },
      // 校验是否已经答题过
      checkDoIt () {
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicUser/checkDoIt?topicId=' + this.topicId),
          method: 'GET',
          // params: this.$http.adornParams(data)
        }).then((res) => {
          if (res.data) {
            this.$message.info('您已答过该题，不可重复答题')
            this.getRecord()
            this.isSubmit = true
          }else {
            this.getDataById(0)
          }
        })
      },
      //获取答题信息
      getRecord(){
        this.totalRecords = 0
        this.dataListLoading = true
        let data = {}
        data = this.whereMap
        data.topicId = this.topicId
        // data = JSON.stringify(data)
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicUser/getInfo'),
          method: 'GET',
          params: this.$http.adornParams(data)
        }).then((res) => {
            if(res.success){
              this.topicUserId = res.data[0].id
              this.totalRecords = res.data[0].totalScore
              this.records = res.data[0].achieveScore
              this.getDoIt()
            }
        })
      },
      getDoIt(){
        let data = {topicId: this.topicId,topicUserId:this.topicUserId}
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicRecord/getDoIt'),
          method: 'GET',
          params: this.$http.adornParams(data)
        }).then((res) => {
          if(res.success) {
            var tmpRecords = 0
            this.selectList = []
            this.selectTmp = []
            this.fillInList = []
            this.fillInTmp = []
            this.trueOrFalseList = []
            this.trueOrFalseTmp = []
            this.SubjectiveList = []
            this.SubjectiveTmp = []
            this.tableDataNow = res.data.TzTopicDetail
            this.tableDataNow2 = res.data.TzTopicScore
            if (this.tableDataNow != null && this.tableDataNow != undefined && this.tableDataNow.length > 0) {
              this.tableDataNow.forEach(i => {
                if (i.questionType === '1') {
                  this.selectList.push(i)
                  // this.selectTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord, trueOrFalse: i.trueOrFalse})
                } else if (i.questionType === '3') {
                  this.fillInList.push(i)
                  // this.fillInTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord,trueOrFalse: i.trueOrFalse})
                } else if (i.questionType === '2') {
                  this.trueOrFalseList.push(i)
                  // this.trueOrFalseTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord, trueOrFalse: i.trueOrFalse})
                } else if (i.questionType === '4') {
                  this.SubjectiveList.push(i)
                  // this.SubjectiveTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord, trueOrFalse: i.trueOrFalse})
                }
                tmpRecords = tmpRecords + i.itemRecord
              })

            }

            if (this.tableDataNow2 != null && this.tableDataNow2 != undefined && this.tableDataNow2.length > 0) {
              this.tableDataNow2.forEach(i => {
                if (i.questionType === '1') {
                  // this.selectList.push(i)
                  this.selectTmp.push({topicDetailId: i.id, achieveAnswer: i.achieveAnswer, standard: i.standard, itemRecord: i.itemRecord, trueOrFalse: i.trueOrFalse})
                } else if (i.questionType === '3') {
                  // this.fillInList.push(i)
                  this.fillInTmp.push({topicDetailId: i.id, achieveAnswer: i.achieveAnswer, standard: i.standard, itemRecord: i.itemRecord,trueOrFalse: i.trueOrFalse})
                } else if (i.questionType === '2') {
                  // this.trueOrFalseList.push(i)
                  this.trueOrFalseTmp.push({topicDetailId: i.id, achieveAnswer: i.achieveAnswer, standard: i.standard, itemRecord: i.itemRecord, trueOrFalse: i.trueOrFalse})
                } else if (i.questionType === '4') {
                  // this.SubjectiveList.push(i)
                  this.SubjectiveTmp.push({topicDetailId: i.id, achieveAnswer: i.achieveAnswer, standard: i.standard, itemRecord: i.itemRecord, trueOrFalse: i.trueOrFalse})
                }
              })
              this.totalRecords = tmpRecords
            }
          }
        })
      },
      // 获取分页信息
      getDataById (type) {
        this.dataListLoading = true
        let data = {}
        data = this.whereMap
        data.topicId = this.topicId
        // data = JSON.stringify(data)
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicDetail/queryTzTopicDetailTestList'),
          method: 'GET',
          params: this.$http.adornParams(data)
        }).then((res) => {
          this.tableDataNow = res.data
          var tmpRecords = 0
          this.selectList = []
          this.selectTmp = []
          this.fillInList = []
          this.fillInTmp = []
          this.trueOrFalseList = []
          this.trueOrFalseTmp = []
          this.SubjectiveList = []
          this.SubjectiveTmp = []
          if (this.tableDataNow != null && this.tableDataNow != undefined && this.tableDataNow.length > 0) {
            this.tableDataNow.forEach(i => {
              if (i.questionType === '1') {
                this.selectList.push(i)
                this.selectTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord, trueOrFalse: null})
              } else if (i.questionType === '3') {
                this.fillInList.push(i)
                this.fillInTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord, trueOrFalse: null})
              } else if (i.questionType === '2') {
                this.trueOrFalseList.push(i)
                this.trueOrFalseTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord, trueOrFalse: null})
              } else if (i.questionType === '4') {
                this.SubjectiveList.push(i)
                this.SubjectiveTmp.push({topicDetailId: i.id, achieveAnswer: '', standard: i.answer, itemRecord: i.itemRecord, trueOrFalse: null})
              }
              tmpRecords = tmpRecords + i.itemRecord
            })
            this.totalRecords = tmpRecords
          }
          this.dataListLoading = false
        }).catch(e => {
          this.dataListLoading = false
        })
      },
      subok (ids) {
        this.submitList = []
        var records = 0
        if (this.selectTmp != null && this.selectTmp != undefined && this.selectTmp.length != 0) {
          this.selectTmp.forEach(i => {
            if (i.achieveAnswer === i.standard) {
              records = records + i.itemRecord
              i.trueOrFalse = 1
            } else {
              i.trueOrFalse = 0
            }
            i.questionType = '1'
            this.submitList.push(i)
          })
        }
        if (this.fillInTmp != null && this.fillInTmp != undefined && this.fillInTmp.length != 0) {
          this.fillInTmp.forEach(i => {
            if (i.achieveAnswer === i.standard) {
              records = records + i.itemRecord
              i.trueOrFalse = 1
            } else {
              i.trueOrFalse = 0
            }
            i.questionType = '3'
            this.submitList.push(i)
          })
        }
        if (this.trueOrFalseTmp != null && this.trueOrFalseTmp != undefined && this.trueOrFalseTmp.length != 0) {
          this.trueOrFalseTmp.forEach(i => {
            if (i.achieveAnswer === i.standard) {
              records = records + i.itemRecord
              i.trueOrFalse = 1
            } else {
              i.trueOrFalse = 0
            }
            i.questionType = '2'
            this.submitList.push(i)
          })
        }
        if (this.SubjectiveTmp != null && this.SubjectiveTmp != undefined && this.SubjectiveTmp.length != 0) {
          this.SubjectiveTmp.forEach(i => {
            if (i.achieveAnswer === i.standard) {
              records = records + i.itemRecord
              i.trueOrFalse = 1
            } else {
              i.trueOrFalse = 0
            }
            i.questionType = '4'
            this.submitList.push(i)
          })
        }
        this.records = records
        let data = {topicId: this.topicId, totalScore: this.totalRecords, achieveScore: this.records}
        data = JSON.stringify(data)
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicUser/addTzTopicUser'),
          method: 'POST',
          data: data
        }).then((res) => {
          if (res.success) {
            this.topicUserId = res.data.id
            this.submitScore()
          } else {
            this.$message({
              message: this.$i18n.t('保存失败'),
              type: 'error',
              //duration: 1000
            })
          }
        }).catch((e) => {
        })

        this.isSubmit = true
        this.loading = false
      },
      submitScore () {
        this.submitList.forEach(i=>{
          i.topicUserId = this.topicUserId
        })
        let data = this.submitList
        data = JSON.stringify(data)
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicRecord/addTzTopicScore'),
          method: 'POST',
          data: data
        }).then((res) => {
          this.visible = false
          if (res.data) {
            this.getRecord()
            this.$message({
              message: this.$i18n.t('保存成功'),
              type: 'success',
              //duration: 1000
            })
          } else {
            this.$message({
              message: this.$i18n.t('保存失败'),
              type: 'error',
              //duration: 1000
            })
          }
        }).catch((e) => {
        })
      },
      refresh (evt) {
        this.tableDataNow = []
        let target = evt.target
        if (target.nodeName == 'SPAN') {
          target = evt.target.parentNode
        }
        target.blur()
        this.whereMap = {}
        // this.whereMap.deptId = '1'
        this.pageNum = 1
        this.pageSize = 10
        this.getDataById()
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-radio {
    display: block;
    margin: 10px 0;
    padding: 0px 11px;
    /*width: 200px;*/
  }

  .buttons {
    padding: 5px 8px;
    color: #a68f7f;
    border-color: #a68f7f;
  }


  .tree {
    margin-left: 20px;
    margin-top: 20px;
  }


</style>
