<template>
  <el-container style="height: 100%">
 <!--   <el-dialog title="搜索"
               center
               :visible.sync="display"
               :width="'32%'"
    >
      <el-form ref="form" style="margin-left: -25px;margin-bottom: -30px">
        <el-form-item label="条件" :label-width="formLabelWidth" prop="name">
          <div style="display: flex">
            <el-input value="会议名称" placeholder="请输入姓名" autocomplete="off" size="small" style="width:200px;" :disabled="true"></el-input>
            <el-input v-model="whereMap.meetingName" placeholder="会议名称" size="small" style="width: 220px;margin-left: 15px"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="条件" :label-width="formLabelWidth" prop="idCard" style="margin-top:-15px">
          <div style="display: flex">
            <el-input value="会议类型" size="small" style="width:200px;" :disabled="true"></el-input>
            <el-select v-model="whereMap.meetingType" placeholder="请选择" clearable size="small" style="width: 220px;margin-left: 15px">
              <el-option label="三会一课(固定党日)" value=1></el-option>
              <el-option label="组织生活会" value=2></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="条件" :label-width="formLabelWidth" prop="receiveStatus" style="margin-top:-15px">
          <div style="display: flex">
            <el-input value="选择日期" placeholder="" size="small" style="width:200px;" :disabled="true"></el-input>
            <el-date-picker
              style="margin-left: 15px;width:220px;"
              default-value
              size="small"
              v-model="whereMap.startDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">关 闭</el-button>
        <el-button @click="reset()">重 置</el-button>
        <el-button type="primary" @click="ok">搜 索</el-button>
      </div>
    </el-dialog>-->
    <!--      顶部按钮-->
    <el-header style="height: 40px;background-color: #fff">
      <el-row>
        <!--<el-button size="small" @click="search">搜索</el-button>-->
        <el-button plain size="small" icon="el-icon-refresh" @click="refresh" style="background: #b20000;color:#ffffff">刷新</el-button>
        <el-button plain size="small" icon="el-icon-arrow-left" @click="handReturn" class="topBtn">返回</el-button>
        <el-button plain size="small" icon="el-icon-add" @click="addTopic" style="background: #b20000;color:#ffffff">新建</el-button>
        <el-button plain size="small" icon="el-icon-add" @click="testDisplay" style="background: #b20000;color:#ffffff">试题展示</el-button>
        <el-button plain size="small" icon="el-icon-add" @click="downFormwork" style="background: #b20000;color:#ffffff" >模板下载
        </el-button>
        <el-button plain size="small" icon="el-icon-add" @click="exportTpoic" style="background: #b20000;color:#ffffff" >导入题目
        </el-button>
      </el-row>
    </el-header>
    <!--      主体-->
    <el-container style="height: 825px; border: 1px solid #eee;">
      <el-container style="display:flex">
        <!--      主体表格-->
        <el-main>
          <el-table
            :row-class-name="tableRowClassName" @row-click="onRowClick"
            v-loading="dataListLoading"
            ref="multipleTable"
            :data="tableDataNow"
            border
            :cell-style="{'text-align':'center'}"
            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              fixed="left"
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              prop="question"
              width=""
              label="问题">
            </el-table-column>
            <el-table-column
              prop="answer"
              width="180"
              label="答案">
            </el-table-column>
            <el-table-column
              prop="analysis"
              width=""
              label="解析">
            </el-table-column>
            <el-table-column
              prop="questionType"
              width=""
              label="题目类型"
            >
              <template slot-scope="scope">
                {{convert(scope.row.questionType)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="150"
              label="创建时间">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="330">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click.native.prevent="handleDelete(scope.row.id)">删除
                </el-button>
                <el-button
                  size="mini"
                  @click.native.prevent="edit(scope.row)">编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="tableDataNow!=null&&tableDataNow.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
    <add-topic-detail :value="addShow" :topicId="topicId" :topicDetailId="topicDetailId" :modal-title="title" @close="close"></add-topic-detail>
    <topic-import v-model="exportShow" :modal-title="'专题导入'" :topicId="topicId"></topic-import>
  </el-container>

</template>
<script>
  import {formartDate} from '@/utils/tool.js'
  import fileDownload from 'js-file-download'
  import addTopicDetail from './addTopicDetail'
  import axios from 'axios'
  import topicImport from './topicImport'

  export default {
    name: '',
    components: {
      addTopicDetail,
      topicImport
    },
    data () {
      return {
        exportShow:false,
        topicName: '',
        topicId: '',
        topicDetailId: '',
        addShow: false,
        filePaths: [],
        daterange: [],
        id: '',
        title: '',
        deptId: '',
        deptName: '',
        partyMemberIds: '',
        display: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        whereMap: {
          startDate: '',
          endDate: ''
        },
        dataListLoading: false,
        tableDataNow: [],  // 显示的数据
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
      // this.deptName = this.$route.query.deptName
      this.initTreeData()
      // this.getDataById()
    },
    methods: {
      exportTpoic () {
        this.exportShow = true
      },
      // 专项答题导入模板
      downFormwork () {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 18
                }
              }),
              h('div', '数据导出中...')
            ])
          }
        })

        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicDetail/downFormwork'),
          method: 'get',
          responseType: 'blob', // 解决文件下载乱码问题
        }).then(({data}) => {
          let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
          const fileName = this.$i18n.t('专项答题导入模板')
          const elink = document.createElement('a')
          if ('download' in elink) {
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
          this.$message({
            message: this.$i18n.t('shop.exportSuccess'),
            type: 'success',
            //duration: 1500,
            onClose: () => {
              this.isSubmit = false
              this.exportShopVisible = false
            }
          })
        }).catch(function (error) {
        }).finally(() => {
          this.$Spin.hide()
        })
      },
      convert (questionType) {
        if (questionType === null || questionType === undefined || questionType === '') {
          return ''
        }
        if (questionType == 1) {
          return '选择题'
        } else if (questionType == 2) {
          return '判断题'
        } else if (questionType == 3) {
          return '填空题'
        } else if (questionType == 4) {
          return '主观题'
        }
      },
      close () {
        this.addShow = false
        this.getDataById()
      },
      testDisplay () {
        this.$router.push({path: 'testDisplay', query: {topicId: this.topicId, topicName: this.topicName}})
      },
      addTopic () {
        this.addShow = true
        this.title = '新增'
      },
      edit (row) {
        this.addShow = true
        this.topicDetailId = row.id.toString()
        this.title = '编辑'
      },
      // 删除附件
      deleteFile (fileId) {
        this.$http({
          url: this.$http.adornUrl('/platform/tzOrganizationLife/deleteFileById?id=' + fileId),
          method: 'get',
        }).then((res) => {
          if (res.data) {
            this.$message({
              message: this.$i18n.t('删除成功'),
              type: 'success',
              //duration: 1000
            })
          } else {
            this.$message({
              message: this.$i18n.t('删除失败'),
              type: 'error',
              //duration: 1000
            })
          }
        }).finally(i => {
          this.getDataById()
        })
      },
      cancel () {
        this.display = false
        this.reset()
      },
      ok () {
        this.getDataById()
        this.reset()
        this.display = false
      },
      search () {
        this.reset()
        this.display = true
      },
      reset () {
        this.daterange = []
        this.whereMap = {}
        // this.whereMap.deptId = '1'
        this.pageNum = 1
        this.pageSize = 10
      },

      // 返回
      handReturn (type, id) {
        this.$router.push({path: 'index'})
      },
      initTreeData () {
        this.dataListLoading = true
        this.getDataById(0)
      },

      // 获取分页信息
      getDataById (type) {
        this.dataListLoading = true
        let data = {}
        data = this.whereMap
        data.pageSize = this.pageSize
        data.topicId = this.topicId
        data.pageNumber = this.pageNum
        // data = JSON.stringify(data)
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicDetail/queryTzTopicDetailList'),
          method: 'GET',
          params: this.$http.adornParams(data)
        }).then((res) => {
          this.tableDataNow = res.data.records
          this.total = res.data.total
          this.dataListLoading = false
        }).catch(e => {
          this.dataListLoading = false
        })
      },
      tableRowClassName ({row, rowIndex}) {
        row.row_index = rowIndex
      },
      onRowClick (row) {
        this.deleteItmes.push(row.row_index)
      },
      // 分页
      sizeChange (data) {
        let num = data * 9 - 9
        this.tableDataNow = this.tableData.slice(num, num + 9)
      },

      handleSizeChange (val) {
        this.pageSize = val
        this.getDataById()
      },
      handleCurrentChange (val) {
        this.pageNum = val
        this.getDataById()
      },
      handleDelete (row) {
          this.$confirm('您确认要删除所点击选的数据?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              showClose:false,
              type: 'warning'
          }).then(() => {
              var ids = []
              if (row != null || row != undefined) {
                  ids.push(row)
              } else {
                  this.$message.info('id为空，请联系管理员！')
                  return
              }
              this.deleteOk(ids)
          }).catch(() => {

          });
      },
      deleteOk (ids) {
        if (ids === undefined || ids === null || ids.length === 0) {
            this.$message.error('没有选择的数据')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicDetail/deleteTzTopicDetail'),
          method: 'get',
          params: this.$http.adornParams({
            ids: ids
          })
          // data: ids,
        }).then(data => {
          if (data.data) {
            this.$message({
              message: '删除成功',
              type: 'success',
              //duration: 1500,
              /* onClose: () => {
                 this.getDataList(this.page)
               }*/
            })
            this.getDataById()
          }
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
