<!--<template>-->
<!--  <el-container style="height: 100%">-->
<!--    <el-dialog title="搜索"-->
<!--               center-->
<!--               :visible.sync="display"-->
<!--               :width="'32%'"-->
<!--    >-->
<!--      <el-form ref="form" style="margin-left: -25px;margin-bottom: -30px">-->
<!--        <el-form-item label="条件" :label-width="formLabelWidth" prop="name">-->
<!--          <div style="display: flex">-->
<!--            <el-input value="会议名称" placeholder="请输入姓名" autocomplete="off" size="small" style="width:200px;" :disabled="true"></el-input>-->
<!--            <el-input v-model="whereMap.meetingName" placeholder="会议名称" size="small" style="width: 220px;margin-left: 15px"></el-input>-->
<!--          </div>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="条件" :label-width="formLabelWidth" prop="idCard" style="margin-top:-15px">-->
<!--          <div style="display: flex">-->
<!--            <el-input value="会议类型" size="small" style="width:200px;" :disabled="true"></el-input>-->
<!--            <el-select v-model="whereMap.meetingType" placeholder="请选择" clearable size="small" style="width: 220px;margin-left: 15px">-->
<!--              <el-option label="三会一课(固定党日)" value=1></el-option>-->
<!--              <el-option label="组织生活会" value=2></el-option>-->
<!--            </el-select>-->
<!--          </div>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="条件" :label-width="formLabelWidth" prop="receiveStatus" style="margin-top:-15px">-->
<!--          <div style="display: flex">-->
<!--            <el-input value="选择日期" placeholder="" size="small" style="width:200px;" :disabled="true"></el-input>-->
<!--            <el-date-picker-->
<!--              style="margin-left: 15px;width:220px;"-->
<!--              default-value-->
<!--              size="small"-->
<!--              v-model="whereMap.startDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              format="yyyy-MM-dd"-->
<!--              value-format="yyyy-MM-dd"-->
<!--            >-->
<!--            </el-date-picker>-->
<!--            &lt;!&ndash; <el-date-picker-->
<!--               size="small"-->
<!--               @change="change"-->
<!--               placeholder="选择日期"-->
<!--               style="margin-left: 15px;width:220px;"-->
<!--               v-model="daterange"-->
<!--               type="daterange"-->
<!--               format="yyyy-MM-dd"-->
<!--               value-format="yyyy-MM-dd"-->
<!--               range-separator=""-->
<!--               start-placeholder="开始日期"-->
<!--               end-placeholder="结束日期">-->
<!--             </el-date-picker>&ndash;&gt;-->
<!--          </div>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="cancel()">关 闭</el-button>-->
<!--        <el-button @click="reset()">重 置</el-button>-->
<!--        <el-button type="primary" @click="ok">搜 索</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--    &lt;!&ndash;      顶部按钮&ndash;&gt;-->
<!--    <el-header style="height: 40px;background-color: #fff">-->
<!--      <el-row>-->
<!--        <el-button size="small"  icon="el-icon-search" style="background: #b20000;color:#ffffff" @click="search">搜索</el-button>-->
<!--        <el-button plain size="small" icon="el-icon-refresh" style="background: #b20000;color:#ffffff" @click="refresh">刷新</el-button>-->
<!--        <el-button plain size="small" icon="el-icon-back"style="background: #b20000;color:#ffffff" @click="handReturn">返回</el-button>-->
<!--        <el-button plain size="small" icon="el-icon-check"style="background: #b20000;color:#ffffff" @click="selectDown">勾选下载</el-button>-->
<!--      </el-row>-->
<!--    </el-header>-->
<!--    &lt;!&ndash;      主体&ndash;&gt;-->
<!--    <el-container style="height: 825px; border: 1px solid #eee;">-->

<!--      <el-container style="display:flex">-->
<!--        &lt;!&ndash;      主体表格&ndash;&gt;-->
<!--        <el-main>-->
<!--          <el-table-->
<!--            :row-class-name="tableRowClassName" @row-click="onRowClick"-->
<!--            v-loading="dataListLoading"-->
<!--            ref="multipleTable"-->
<!--            :data="tableDataNow"-->
<!--            border-->
<!--            :cell-style="{'text-align':'center','font-size':'10px'}"-->
<!--            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"-->
<!--            tooltip-effect="dark"-->
<!--            style="width: 100%"-->
<!--            @selection-change="handleSelectionChange">-->
<!--            <el-table-column-->
<!--              fixed="left"-->
<!--              type="selection"-->
<!--              width="40">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="deptName"-->
<!--              width=""-->
<!--              label="发起部门">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="meetingName"-->
<!--              width="240"-->
<!--              label="会议名称">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="meetingType"-->
<!--              width="180"-->
<!--              label="会议类型">-->
<!--              <template slot-scope="scope">-->
<!--                {{ scope.row.meetingType == '1' ? '三会一课(固定党日)' : '组织生活会（民主评议党员）'}}-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="fileName"-->
<!--              width=""-->
<!--              label="文件名称"-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="size"-->
<!--              width="150"-->
<!--              label="文件大小">-->
<!--              <template slot-scope="scope">-->
<!--                {{calculate(scope.row.size)}}M-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="uploadTime"-->
<!--              width=""-->
<!--              label="上传时间">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作" fixed="right" width="330">-->
<!--              <template slot-scope="scope">-->
<!--                <el-button-->
<!--                  size="mini"-->
<!--                  @click.native.prevent="deleteFile(scope.row.fileId)">删除-->
<!--                </el-button>-->
<!--                <el-button-->
<!--                  size="mini"-->
<!--                  @click.native.prevent="downFile(scope.row)">下载-->
<!--                </el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--          <el-pagination-->
<!--            v-if="tableDataNow!=null&&tableDataNow.length"-->
<!--            @size-change="handleSizeChange"-->
<!--            @current-change="handleCurrentChange"-->
<!--            :current-page="pageNum"-->
<!--            :page-sizes="[10, 20, 50, 100]"-->
<!--            :page-size="pageSize"-->
<!--            layout="total, sizes, prev, pager, next, jumper"-->
<!--            :total="total">-->
<!--          </el-pagination>-->
<!--        </el-main>-->
<!--      </el-container>-->
<!--    </el-container>-->
<!--  </el-container>-->

<!--</template>-->
<!--<script>-->
<!--  import {formartDate} from '@/utils/tool.js'-->
<!--  import fileDownload from 'js-file-download'-->
<!--  import {deleteFileById} from "@/api/tzOrganizationLife";-->
<!--  import {deleteTzOrganizationLife} from "@/api/tzOrganizationLife";-->
<!--  import {querytaizhang} from "@/api/tzOrganizationLife";-->

<!--  import axios from 'axios'-->
<!--  import util from "@/libs/util";-->

<!--  export default {-->
<!--    name: 'startMeeting',-->
<!--    data () {-->
<!--      return {-->
<!--        base: util.nginxUrl,-->
<!--        filePaths: [],-->
<!--        daterange: [],-->
<!--        id: '',-->
<!--        title: '',-->
<!--        deptId: '',-->
<!--        deptName: '',-->
<!--        partyMemberIds: '',-->
<!--        display: false,-->
<!--        pageNum: 1,-->
<!--        pageSize: 10,-->
<!--        total: 0,-->
<!--        whereMap: {-->
<!--          meetingStatus: '',-->
<!--          deptId: '',-->
<!--          dept_id_child: '',-->
<!--          parentIdChild: '',-->
<!--          emptyShell: '',-->
<!--          undoFlag: '',-->
<!--          organizationType: '',-->
<!--          partyOrgType: '',-->
<!--          partyType: '',-->
<!--          name: '',-->
<!--          startDate: '',-->
<!--          endDate: ''-->
<!--        },-->
<!--        dataListLoading: false,-->
<!--        tableDataNow: [],  // 显示的数据-->
<!--        formLabelWidth: '100px',-->
<!--        // 加载状态-->
<!--        loading: false,-->
<!--        // 输入状态-->
<!--        input: '',-->
<!--        //删除项-->
<!--        deleteItmes: [],-->
<!--      }-->
<!--    },-->
<!--    created () {-->
<!--      this.deptId = this.$route.query.deptId.toString()-->
<!--      this.deptName = this.$route.query.deptName-->
<!--      this.initTreeData()-->
<!--      // this.getDataById()-->
<!--    },-->
<!--    methods: {-->
<!--      downFile(row){-->
<!--        axios.get(this.base+row.filePath, {-->
<!--          responseType: 'blob' //返回的数据类型-->
<!--        }).then(res => {-->
<!--          fileDownload(res.data, row.fileName)  //this.fileName 文件名-->
<!--        })-->
<!--      },-->
<!--      // 删除附件-->
<!--      deleteFile (fileId) {-->
<!--        deleteFileById(fileId.toString()).then((res) => {-->
<!--          if (res.data.code='00000') {-->
<!--            this.$message.success('删除成功')-->
<!--          } else {-->
<!--            this.$message.error('删除失败')-->
<!--          }-->
<!--        }).finally(i => {-->
<!--          this.getDataById()-->
<!--        })-->
<!--      },-->
<!--      selectDown () {-->
<!--        if (this.filePaths == undefined || this.filePaths == null || this.filePaths.length == 0) {-->
<!--          this.$message.error('没有选择的数据')-->
<!--          return-->
<!--        }-->
<!--        for (let i = 0; i < this.filePaths.length; i++) {-->
<!--          axios.get(this.base + this.filePaths[i].filePath, {-->
<!--            responseType: 'blob' //返回的数据类型-->
<!--          }).then(res => {-->
<!--            fileDownload(res.data, this.filePaths[i].fileName)  //this.fileName 文件名-->
<!--          })-->
<!--        }-->
<!--        /* this.filePaths.forEach(i=>{-->
<!--           axios.get(i.filePath, {-->
<!--             responseType: 'blob' //返回的数据类型-->
<!--           }).then(res => {-->
<!--             fileDownload(res.data, "row.fileName")  //this.fileName 文件名-->
<!--           })-->
<!--         })*/-->

<!--      },-->
<!--      change (e) {-->
<!--        if (e !== null && e !== '' && e != undefined) {-->
<!--          this.whereMap.startDate = e[0]-->
<!--          this.whereMap.endDate = e[1]-->
<!--        }-->
<!--      },-->
<!--      cancel () {-->
<!--        this.display = false-->
<!--        this.reset()-->
<!--      },-->
<!--      ok () {-->
<!--        this.getDataById()-->
<!--        this.reset()-->
<!--        this.display = false-->
<!--      },-->
<!--      search () {-->
<!--        this.reset()-->
<!--        this.display = true-->
<!--      },-->
<!--      reset () {-->
<!--        this.daterange = []-->
<!--        this.whereMap = {}-->
<!--        this.whereMap.deptId = this.$route.query.deptId.toString()-->
<!--        this.pageNum = 1-->
<!--        this.pageSize = 10-->
<!--      },-->

<!--      // 返回-->
<!--      handReturn (type, id) {-->
<!--        this.$router.push({path: 'startMeeting', query: {deptId: this.deptId, deptName: this.deptName}})-->
<!--      },-->
<!--      //文件大小计算-->
<!--      calculate (size) {-->
<!--        let tmp = size / 1024 / 1024-->
<!--        tmp = tmp.toFixed(2)-->
<!--        return tmp-->
<!--      },-->
<!--      initTreeData () {-->
<!--        this.dataListLoading = true-->
<!--        //调用接口查询组织结构-->
<!--        this.whereMap.deptId=this.$route.query.deptId.toString()-->
<!--        this.whereMap.parentIdChild = '1'-->
<!--        this.whereMap.dept_id_child = '1'-->
<!--        // this.getDataList(0)-->
<!--        this.getDataById(0)-->
<!--      },-->

<!--      // 获取分页信息-->
<!--      getDataById (type) {-->
<!--        this.dataListLoading = true-->
<!--        let data = {-->
<!--          tzOrganizationLife:this.whereMap,-->
<!--          pageVo:{pageSize:this.pageSize,pageNumber:this.pageNum},-->
<!--        }-->
<!--       /* data = this.whereMap-->
<!--        data.pageSize = this.pageSize-->
<!--        data.deptId = this.deptId-->
<!--        data.pageNumber = this.pageNum*/-->
<!--        // data = JSON.stringify(data)-->
<!--        querytaizhang(data).then((res) => {-->
<!--          if(res.data.code='00000'){-->
<!--            this.tableDataNow = res.data.data.taizhangDtos-->
<!--            this.total = res.data.data.total-->
<!--          }-->
<!--          this.dataListLoading = false-->
<!--        }).catch(e => {-->
<!--          this.dataListLoading = false-->
<!--        })-->
<!--      },-->
<!--      tableRowClassName ({row, rowIndex}) {-->
<!--        row.row_index = rowIndex-->
<!--      },-->
<!--      onRowClick (row) {-->
<!--        this.deleteItmes.push(row.row_index)-->
<!--      },-->
<!--      // 分页-->
<!--      sizeChange (data) {-->
<!--        let num = data * 9 - 9-->
<!--        this.tableDataNow = this.tableData.slice(num, num + 9)-->
<!--      },-->
<!--      handleSelectionChange (val, a, b) {-->
<!--        var tmp = []-->
<!--        var pathTmp = []-->
<!--        val.forEach(i => {-->
<!--          tmp.push(i.id)-->
<!--          pathTmp.push({'filePath': i.filePath, 'fileName': i.fileName})-->
<!--        })-->
<!--        this.filePaths = pathTmp-->
<!--        this.partyMemberIds = tmp-->
<!--      },-->
<!--      handleSizeChange (val) {-->
<!--        this.pageSize = val-->
<!--        this.getDataById()-->
<!--      },-->
<!--      handleCurrentChange (val) {-->
<!--        this.pageNum = val-->
<!--        this.getDataById()-->
<!--      },-->
<!--      handleDelete (row) {-->
<!--        this.$Modal.confirm({-->
<!--          title: '确认删除',-->
<!--          content: '您确认要删除所点击选的数据?',-->
<!--          loading: true,-->
<!--          onOk: () => {-->
<!--            var ids = []-->
<!--            if (row != null || row != undefined) {-->
<!--              ids.push(row)-->
<!--            } else {-->
<!--              ids = this.partyMemberIds-->
<!--            }-->
<!--            this.deleteOk(ids)-->
<!--          },-->
<!--          onCancel: () => {-->
<!--            //this.$message.info('取消了当前的操作行为！')-->
<!--          },-->
<!--        })-->
<!--      },-->
<!--      deleteOk (ids) {-->
<!--        if (ids === undefined || ids === null || ids.length === 0) {-->
<!--          this.$message.error('没有选择的数据')-->
<!--          return-->
<!--        }-->
<!--        deleteTzOrganizationLife(ids).then(data => {-->
<!--          this.$Modal.remove()-->
<!--          if (data.data) {-->
<!--            this.$message({-->
<!--              message: '删除成功',-->
<!--              type: 'success',-->
<!--              duration: 1500,-->
<!--              /* onClose: () => {-->
<!--                 this.getDataList(this.page)-->
<!--               }*/-->
<!--            })-->
<!--            this.getDataById()-->
<!--          }-->
<!--        })-->
<!--      },-->
<!--      refresh (evt) {-->
<!--        this.tableDataNow = []-->
<!--        let target = evt.target-->
<!--        if (target.nodeName == 'SPAN') {-->
<!--          target = evt.target.parentNode-->
<!--        }-->
<!--        target.blur()-->
<!--        this.whereMap = {}-->
<!--        this.whereMap.deptId = this.deptId-->
<!--        this.pageNum = 1-->
<!--        this.pageSize = 10-->
<!--        this.getDataById()-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--  @import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");-->


<!--  .buttons {-->
<!--    padding: 5px 8px;-->
<!--    color: #a68f7f;-->
<!--    border-color: #a68f7f;-->
<!--  }-->


<!--  .tree {-->
<!--    margin-left: 20px;-->
<!--    margin-top: 20px;-->
<!--  }-->


<!--</style>-->
