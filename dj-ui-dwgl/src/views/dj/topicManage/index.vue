<template>
  <el-container style="height: 100%">
    <el-dialog title="搜索"
               center
               :visible.sync="display"
               :width="'32%'"
    >
      <el-form ref="form" style="margin-left: -25px;margin-bottom: -30px">
        <el-form-item label="条件" :label-width="formLabelWidth" prop="name">
          <div style="display: flex">
            <el-input value="主题名称" placeholder="请输入姓名" autocomplete="off" size="small" style="width:200px;" :disabled="true"></el-input>
            <el-input v-model="whereMap.topicName" placeholder="会议名称" size="small" style="width: 220px;margin-left: 15px"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="条件" :label-width="formLabelWidth" prop="name" style="margin-top:-15px">
          <div style="display: flex">
            <el-input value="专题学分" placeholder="请输入姓名" autocomplete="off" size="small" style="width:200px;" :disabled="true"></el-input>
            <el-input v-model="whereMap.records" placeholder="会议名称" size="small" style="width: 220px;margin-left: 15px" type="number"></el-input>
          </div>
        </el-form-item>
        <!-- <el-form-item label="条件" :label-width="formLabelWidth" prop="idCard" style="margin-top:-15px">
           <div style="display: flex">
             <el-input value="专题状态" size="small" style="width:200px;" :disabled="true"></el-input>
             <el-select v-model="whereMap.status" placeholder="请选择" clearable size="small" style="width: 220px;margin-left: 15px">
               <el-option label="已新建专题" value=0></el-option>
               <el-option label="已添加题目答案等" value=1></el-option>
               <el-option label="已发布" value=2></el-option>
             </el-select>
           </div>
         </el-form-item>-->
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
            <!-- <el-date-picker
               size="small"
               @change="change"
               placeholder="选择日期"
               style="margin-left: 15px;width:220px;"
               v-model="daterange"
               type="daterange"
               format="yyyy-MM-dd"
               value-format="yyyy-MM-dd"
               range-separator=""
               start-placeholder="开始日期"
               end-placeholder="结束日期">
             </el-date-picker>-->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">关 闭</el-button>
        <el-button @click="reset()">重 置</el-button>
        <el-button type="primary" @click="ok">搜 索</el-button>
      </div>
    </el-dialog>
    <!--      顶部按钮-->
    <el-header style="height: 40px;background-color: #fff">
      <el-row>
        <el-button size="small" @click="search" style="background: #b20000;color:#ffffff">搜索</el-button>
        <el-button plain size="small" icon="el-icon-refresh" @click="refresh" style="background: #b20000;color:#ffffff">刷新</el-button>
        <el-button plain size="small" icon="el-icon-add" @click="addTopic" style="background: #b20000;color:#ffffff" v-if="isAdmin">新建</el-button>
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
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              fixed="left"
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              prop="topicName"
              width=""
              label="主题名称">
            </el-table-column>
            <el-table-column
              prop="records"
              width="180"
              label="学分">
            </el-table-column>
            <el-table-column
              prop="status"
              width=""
              label="专题状态">
              <template slot-scope="scope">
                {{convert(scope.row.status)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width=""
              label="创建时间"
            >
            </el-table-column>
            <el-table-column
              prop="updateTime"
              width="150"
              label="最后一次修改时间">
            </el-table-column>
            <el-table-column
              prop="postTime"
              width=""
              label="发布时间">
            </el-table-column>
            <el-table-column
              prop="createBy"
              width=""
              label="创建人">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="360">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-if="isAdmin&&scope.row.status!=2"
                  @click.native.prevent="handleDelete(scope.row.id)">删除
                </el-button>
                <el-button
                  size="mini"
                  v-if="isAdmin&&scope.row.status!=2"
                  @click.native.prevent="edit(scope.row)">编辑
                </el-button>
                <el-button
                  size="mini"
                  v-if="isAdmin&&scope.row.status!=2"
                  @click.native.prevent="editContent(scope.row)">添加专题内容
                </el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.status==1"
                  @click.native.prevent="postIt(scope.row)">发布专题
                </el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.status==2"
                  @click.native.prevent="testDisplay(scope.row)">试题展示
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
    <add-topic :value="addShow" :topicId="topicId.toString()" :modal-title="title" @close="close"></add-topic>
    <topic-import v-model="exportShow" :modal-title="'专题导入'"></topic-import>
  </el-container>

</template>
<script>
  import {formartDate} from '@/utils/tool.js'
  import fileDownload from 'js-file-download'
  import addTopic from './addTopic'
  import axios from 'axios'
  import topicImport from './topicImport'

  export default {
    name: '',
    components: {
      addTopic,
      topicImport
    },
    data () {
      return {
        exportShow:false,
        isAdmin: false,//是否是超级管理员
        topicId: '',
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
          deptId: '',
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
      // this.deptId = this.$route.query.deptId.toString()
      // this.deptName = this.$route.query.deptName
      this.initTreeData()
      // this.getDataById()
    },
    methods: {
      convert (status) {
        if (status === null || status === undefined || status === '') {
          return ''
        }
        if (status == 0) {
          return '已新建专题'
        } else if (status == 1) {
          return '已添加专题内容'
        } else if (status == 2) {
          return '已发布'
        }
      },
      close () {
        this.addShow = false
        this.getDataById()
      },
      addTopic () {
        this.addShow = true
        this.title = '新增'
      },
      edit (row) {
        this.addShow = true
        this.topicId = row.id
        this.title = '编辑'
      },
      editContent (row) {
        this.$router.push({path: 'topicDetail', query: {topicId: row.id, topicName: row.topicName}})
      },
      testDisplay (row) {
        this.$router.push({path: 'testDisplay', query: {topicId: row.id, topicName: row.topicName, isAdmin: true}})
      },
      postIt (row) {
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopicDetail/checkIsAdd?topicId=' + row.id),
          method: 'get',
        }).then((res) => {
          if (res.data) {
              this.$confirm('发布后不可修改，确认发布吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  showClose:false,
                  type: 'warning'
              }).then(() => {
                  this.confirmIt(row)
              }).catch(() => {
                  this.$message.info('取消发布！')
              });
          } else {
            this.$message.info('请先添加题目后再发布')
          }
        })

      },
      confirmIt (row) {
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopic/postIt?id=' + row.id),
          method: 'get',
        }).then((res) => {
          if (res.success) {
            this.$message.success('发布成功')
            this.getDataById()
          } else {
            this.$message.success('发布失败')
          }
        })
      },
      // 删除附件
      deleteFile (fileId) {
        this.$http({
          url: this.$http.adornUrl('/platform/tzOrganizationLife/deleteTzTopic?id=' + fileId),
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
      selectDown () {
        if (this.filePaths == undefined || this.filePaths == null || this.filePaths.length == 0) {
          this.$message.error('没有选择的数据')
          return
        }
        for (let i = 0; i < this.filePaths.length; i++) {
          axios.get(this.filePaths[i].filePath, {
            responseType: 'blob' //返回的数据类型
          }).then(res => {
            fileDownload(res.data, this.filePaths[i].fileName)  //this.fileName 文件名
          })
        }
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

      initTreeData () {
        this.dataListLoading = true
        //调用接口查询组织结构
        // this.getDataList(0)
        this.getDataById(0)
      },

      // 获取分页信息
      getDataById (type) {
        this.dataListLoading = true
        let data = {}
        data = this.whereMap
        data.pageSize = this.pageSize
        // data.deptId = this.deptId
        data.pageNumber = this.pageNum
        // data = JSON.stringify(data)
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopic/queryTzTopicList'),
          method: 'GET',
          params: this.$http.adornParams(data)
        }).then((res) => {
          if (res.data.isAdmin) {
            this.isAdmin = true
          }
          this.tableDataNow = res.data.result.records
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
      handleSelectionChange (val, a, b) {
        var tmp = []
        var pathTmp = []
        val.forEach(i => {
          tmp.push(i.id)
          pathTmp.push({'filePath': i.filePath, 'fileName': i.fileName})
        })
        this.filePaths = pathTmp
        this.partyMemberIds = tmp
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
                  // ids = this.partyMemberIds
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
          url: this.$http.adornUrl('/multi/tzTopic/deleteTzTopic'),
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
