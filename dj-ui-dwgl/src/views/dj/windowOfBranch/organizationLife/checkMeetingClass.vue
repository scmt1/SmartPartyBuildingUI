<template>
  <Modal v-model="show" :mask-closable="false" :closable="false" width="70%">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">{{title}}</h4>
      </div>
      <div class="header" style="border-top:1px solid #909399">
        <el-date-picker
          :clearable="false"
          @change="changeDate"
          size="mini"
          v-model="data.year"
          type="year"
          placeholder="选择日期"
          format="yyyy"
          value-format="yyyy"
          style="margin-left:31px">
        </el-date-picker>
        <span style="margin-left:50px">考勤符号: &nbsp;&nbsp;√&nbsp;到会；#迟到；○病假；★公假；△事假、探亲、丧假、婚假、休假、产假；×无故缺席</span>
      </div>
      <div class="body">
        <el-form ref="form" :model="form" :disabled="disabled"
        >
          <el-table
            ref="multipleTable"
            :data="tableData"
            border
            :cell-style="{'text-align':'center','padding':'4px'}"
            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              fixed="left"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="realName"
              width="70"
              label="姓名/日期">
            </el-table-column>
            <el-table-column
              width="70"
              v-for="(item,index) in list"
              :key="index"
              :label="item.times.toString()">
              <template slot-scope="scope">
                <!--{{ isAbsent(scope.row.name,item.joins) ? '√' : ''}}-->
                {{ isAbsent(scope.row.id,item) }}
                <!--{{ isAbsent(scope.row.name,item.joins)}}-->
              </template>
            </el-table-column>
            <el-table-column>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="footer">
      <el-button size="small" @click="close">关 闭</el-button>
    </div>
  </Modal>
</template>

<script>
  import util from '@/libs/util.js'
  import {VueCropper} from 'vue-cropper'
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  import { checkMeeting } from "@/api/jcxfOrganizationLife";


  export default {
    name: 'checkMeetingClass',
    components: {
      ElImageViewer,
      VueCropper,
      // ImagePreview
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      meetingId: {
        type: String,
        default: ''
      },
      modalTitle: {
        type: String
      },
      deptName: {
        type: String
      },
      deptId: {
        type: String
      }
    },
    data () {
      return {
        list: [],
        joins: '',
        absent: '',
        sick: '',
        common: '',
        thing: '',
        later: '',
        flow: '',
        tableData: [],
        data: {deptId: '', deptName: '', year: ''},
        id: '',
        show: this.value,
        ids: [],
        tmp: [],
        image: '',
        visible: false,
        imgName: '',
        disabled: false,
        base: util.nginxUrl,
        type: '',
        title: '',
        modal1: false,
        developStateList: [{title: '1', value: '1'}],
        workPositionList: [],
        partyStateList: [],
        personTypeList: [],
        positionList: [],
        educationList: [],
        nationList: [],
        personList: [],
        formLabelWidth: '100px',
        dialogFormVisible: true,
        form: {
          meetingName: '',
          startTime: '',
          endTime: '',
          addr: '',
          meetingContent: '',
          meetingType: '',
          deptId: '',
          deptName: '',
          meetingId: '',
          joins: '',
          absent: '',
          sick: '',
          common: '',
          thing: '',
          later: '',
          flow: ''
        }
      }
    },
    methods: {
      changeDate (e) {
        this.getDateById(this.form.deptId)
      },
      // 是否缺勤
      isAbsent (name, item) {
        /*  if (item === null && item === '') {
            return false
          }*/
     /*   if (item.joins != undefined && item.joins != null) {
          if (item.joins.indexOf(name) > -1) {
            return '√'
          }
        } else if (item.absent != undefined && item.absent != null) {
          if (item.absent.indexOf(name) > -1) {
            return '×'
          }
        } else if (item.later != undefined && item.later != null) {
          if (item.later.indexOf(name) > -1) {
            return '#'
          }
        } else if (item.sick != undefined && item.sick != null) {
          if (item.sick.indexOf(name) > -1) {
            return '○'
          }
        } else if (item.common != undefined && item.common != null) {
          if (item.common.indexOf(name) > -1) {
            return '★'
          }
        } else if (item.thing != undefined && item.thing != null) {
          if (item.thing.indexOf(name) > -1) {
            return '△'
          }
        } else {
          return ''
        }*/

            if (item.joins.indexOf(name) > -1) {
              return '√'
            } else if (item.absent.indexOf(name) > -1) {
              return '×'
            } else if (item.later.indexOf(name) > -1) {
              return '#'
            } else if (item.sick.indexOf(name) > -1) {
              return '○'
            } else if (item.common.indexOf(name) > -1) {
              return '★'
            } else if (item.thing.indexOf(name) > -1) {
              return '△'
            } else {
              return '×'
            }
      },
      getDateById (id) {
        checkMeeting({deptId:id,year:this.data.year,meetingType:this.form.meetingType})
            .then((res) => {
          this.tableData = []
              let data = res.data.data
          if (res.data.code='00000') {
            let tmp = []
            tmp = data.nameList
            this.tableData = tmp
           /* tmp.forEach(i => {
              this.tableData.push({'name': i})
            })*/
            this.list = data.list
            this.list.forEach(i=>{
              if(i.joins ==undefined||i.joins==null){
                i.joins=''
              }
              if(i.absent ==undefined||i.absent==null){
                i.absent=''
              }
              if(i.later ==undefined||i.later==null){
                i.later=''
              }
              if(i.sick ==undefined||i.sick==null){
                i.sick=''
              }
              if(i.common ==undefined||i.common==null){
                i.common=''
              }
              if(i.thing ==undefined||i.thing==null){
                i.thing=''
              }
            })
          } else {
              this.$message.error('操作异常')
          }
        })
      },
      getDate () {
        var now = new Date()
        var year = now.getFullYear() //得到年份
        var month = now.getMonth() //得到月份
        var date = now.getDate() //得到日期
        var hour = ' 00:00:00' //默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
        month = month + 1
        month = month.toString().padStart(2, '0')
        // var defaultDate = `${year}-${month}`
        var defaultDate = `${year}`
        return defaultDate
      },
      close () {
        this.$refs['form'].resetFields()
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
        this.reset()
        this.show = false
        this.$emit('input', false)
        this.$emit('close')
      },
      reset () {
        this.joins = ''
        this.absent = ''
        this.sick = ''
        this.common = ''
        this.thing = ''
        this.later = ''
        this.flow = ''
        this.fileList = []
        this.tableData = []
        this.input = ''
        this.disabled = false
        this.title = ''
        this.form = {
          mode: '1'
        }
      },
      closeModal (val) {
        this.$emit('close')
        this.$emit('input', false)
      },
    },
    watch: {
      value (val) {
        if (val) {
          this.show = val
          this.data.deptId = this.deptId
          this.data.deptName = this.deptName
        }
      },
      show (val) {
        if (val) {
          this.title = this.modalTitle
          if (this.modalTitle === '三会一课考勤表') {
            this.form.meetingType = '1'
          } else if (this.modalTitle === '组织生活会(民族评议党员)考勤表') {
            this.form.meetingType = '2'
          }else {
            this.form.meetingType = '3'
          }
          this.id = this.meetingId
          this.form.meetingId = this.meetingId
          this.data.year = this.getDate()
          this.form.deptId = this.deptId
          this.getDateById(this.form.deptId)
        } else {
          // this.closeModal(val)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal-content {
    //margin-top: -28px;
    width: 100%;

    .modal-header {
      padding: 15px 10px;
      text-align: center;

      .modal-title {
        font-size: 26px;
      }
    }

    .body {
      padding: 20px 30px 30px 30px;
      background: #f8fafb;
      width: auto;

      .row {
        //margin-right: -15px;
        //margin-left: -15px;
        display: flex;

        .col-sm-6 {
          width: 100%;
          /*margin-left: 35px;*/

          &:hover {
            .demo-upload-list-cover {
              display: block;
            }
          }

          .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            /*height: 60px;*/
            line-height: 60px;
            background: rgba(0, 0, 0, .6);
            text-align: center;

            &:hover {
              display: block;
              background: rgba(0, 0, 0, .6);
            }
          }

          .ivu-modal {
            width: 660px !important;
          }

          .demo-upload-list {
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
            margin-right: 4px;
          }

          .demo-upload-list img {
            width: 100%;
            height: 100%;
          }

          .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, .6);
          }

          .demo-upload-list:hover .demo-upload-list-cover {
            display: block;
          }

          .demo-upload-list-cover i {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
            margin-top: 30px;
          }

          .label {
            ::v-deep.el-form-item__label {
              line-height: 18px;
            }
          }

          ::v-deep {
            .du-select .el-select__tags {
              // height: 40px;
              white-space: nowrap;
              overflow: hidden;
              flex-wrap: nowrap;
            }

            .du-select .el-select__tags-text {
              display: inline-block;
              max-width: 135px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .du-select .el-tag__close.el-icon-close {
              top: -6px;
              right: -4px;
            }
          }


          .el-form-item {
            line-height: 20px;

            .input-row {
              width: 80%;
              margin-right: 10px
            }

            padding-left: 10px !important;
            margin-right: -12px;
            margin-left: -15px;
            margin-bottom: 15px;
          }
        }
      }
    }

    .modal-footer {
      padding: 15px;
      text-align: right;
      border-top: 1px solid #e5e5e5;

      .btn-white {
        border-radius: 3px;
        letter-spacing: 1px;
        color: inherit;
        background: white;
        border: 1px solid #e7eaec;

        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
      }

      .btn-blue {
        border-radius: 3px;
        letter-spacing: 1px;

        color: #FFFFFF;
        margin-left: 5px;
        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        background-color: #3d86e7 !important;
        border-color: #3d86e7 !important;
      }
    }
  }
</style>
