<template>
  <Modal v-model="show" :mask-closable="false" :closable="false" width="600px">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">{{title}}</h4>
      </div>
      <div class="body">
        <el-form ref="form" :model="form" :disabled="disabled"
        >
          <div class="row">
            <div class="col-sm-6">
              <el-form-item label="需要上传的文件:" label-width="120px">
                <div style="display: flex">
                  <el-input :value="input" placeholder="需要上传的文件" autocomplete="off" style="width:240px;" :disabled="true"></el-input>
                  <Upload
                    v-if="fileList.length<1"
                    size="small"
                    name="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12"
                    :format="fileTypeArr"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :data="data"
                    :show-upload-list="false"
                    :action="api"
                    :headers="upHeaders"
                    :before-upload="handleUpload"
                    ref="upload">
                    <div style="display: flex;height: 40px">
                      <el-button size="mini" style="width: 100px">上传文件</el-button>
                    </div>
                  </Upload>
                  <el-button :disabled="true" size="mini" style="width: 100px" v-else>上传文件</el-button>
                </div>
              </el-form-item>
              <div v-if="infoShow">
                <div style="display: flex">
                  <div style="font-weight: bold;">导入信息：</div>
                  {{zong}}
                </div>
                <div style="margin-top:0px">
                  <div v-for="(item,index) in errorList" style="margin-top:0px">
                    {{item}}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="footer">
      <el-button size="small" @click="close">关 闭</el-button>
      <!--<el-button size="small" type="primary" @click="submitForm('form')">保 存</el-button>-->
    </div>
  </Modal>
</template>

<script>
  import Vue from 'vue'
  import util from '@/libs/util'
  import {VueCropper} from 'vue-cropper'
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  import {
    RegionSelects,
  } from 'v-region'
  import {uploadFile} from '../../../utils/httpRequest'

  export default {
    name: 'partyImport',
    components: {
      RegionSelects,
      ElImageViewer,
      VueCropper,
      // ImagePreview
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      parentId: {
        type: String,
        default: ''
      },
      partyId: {
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
      },
      topicId: {
        type: String
      }
    },
    data () {
      return {
        input: '请选择需要上传的文件',
        infoShow: false,
        errorList: [],
        zong: '',
        copyMonth: '',
        fileList: [],
        upHeaders: {
          'User-Type': 'Gov_User',
          'Authorization': Vue.cookie.get('Authorization_vs')
        },
        base_Url: 'http://192.168.6.28:8088',
        api: this.getApi(),
        data: {deptId: '', deptName: '', topicId: ''},
        fileTypeArr: ['xls', 'xlsx', 'xlsm'],//文件类型
        id: '',
        // deptId: '',
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
        sexList: [{'name': '男', 'value': '1'}, {'name': '女', 'value': '2'}],
        formLabelWidth: '100px',
        dialogFormVisible: true,
        form: {
          payMonth: '',
          partyTim: '',
          education: '',
          birthday: '',
          realName: '',
          idcard: '',
          mode: '1'
        }
      }
    },
    methods: {
      getDate () {
        var now = new Date()
        var year = now.getFullYear() //得到年份
        var month = now.getMonth() //得到月份
        var date = now.getDate() //得到日期
        var hour = ' 00:00:00' //默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
        month = month + 1
        month = month.toString().padStart(2, '0')
        var defaultDate = `${year}-${month}`//
        return defaultDate
      },
      handleUpload (file) {
        file.oneTime = new Date()
        return true
      },
      uploadSuccess (response, file, fileList) {
        this.infoShow = true
        this.zong = response.data.zong
        this.errorList = response.data.errorList
        if (response.success) {
          this.input = file.name
          this.fileList.push(file)
          this.$message({
            message: this.$i18n.t('保存成功'),
            type: 'success',
            //duration: 1000
          })
          // this.close()
        } else {
          this.$message.error(response.msg)
        }
      },
      uploadError (err, file, fileList) {
        this.$message.error('上传失败' + err)
      },
      closeAllModal () {//关闭
        this.closeModal(false)
        // this.$emit('handSearch');//上传完毕后再重新渲染表格
      },
      getApi () {
        return util.upload + '/multi/tzTopicDetail/topicImport'
      },
      getDeptName (deptId) {
        this.$http({
          url: this.$http.adornUrl('/scmt/tzSysDept/getTzSysDept?id=' + deptId),
          method: 'get',
        }).then((res) => {
          this.form.deptName = res.data.name
        })
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
        this.infoShow = false
        this.zong = ''
        this.errorList = []
        this.fileList = []
        this.tableData = []
        this.input = ''
        this.disabled = false
        this.title = ''
        this.form = {
          mode: '1'
        }
      },
      init () {
        this.getdict('nation')
        this.getdict('education')
        this.getdict('position')
        this.getdict('developState')
        this.getdict('partyState')
        this.getdict('workPosition')
      },
      closeModal (val) {
        this.$emit('close')
        this.$emit('input', false)
      },
      getdict (type) {
        let tmp = []
        this.$http({
          url: this.$http.adornUrl('/tDictData/getByType?type=' + type),
          method: 'get',
        }).then((res) => {
          if (type === 'nation') {
            this.nationList = res.data
          } else if (type === 'education') {
            this.educationList = res.data
          } else if (type === 'position') {
            this.positionList = res.data
            this.positionList.forEach(i => {
              i.value = parseInt(i.value)
            })
          } else if (type === 'developState') {
            this.developStateList = res.data
          } else if (type === 'partyState') {
            this.partyStateList = res.data
            this.partyStateList.forEach(i => {
              i.value = parseInt(i.value)
            })
          } else if (type === 'workPosition') {
            this.workPositionList = res.data
          } else if (type === 7) {
            this.organizationTypeList = res.data
            this.organizationTypeList.forEach(i => {
              i.value = parseInt(i.value)
            })
          }
        })
        return tmp
      },
      getDataById (id) {
        this.$http({
          url: this.$http.adornUrl('/platform/partyMember/getDevelopParty?id=' + id),
          method: 'get'
        }).then((res) => {
          this.form = res.data
        })
      },
      formartDate (date, fmt) {
        if (date == undefined || date == null || date.toString().trim().length <= 0) {
          return ''
        }
        if (typeof date === 'string') {
          date = new Date(date)
        }
        date = date == undefined ? new Date() : date
        date = typeof date == 'number' ? new Date(date) : date
        fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
        var obj = {
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
        var week = ['天', '一', '二', '三', '四', '五', '六']
        for (var i in obj) {
          fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
            var val = obj[i] + ''
            if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
            for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
            return m.length == 1 ? val : val.substring(val.length - m.length)
          })
        }
        return fmt
      },
    },
    watch: {
      value (val) {
        if (val) {
          this.show = val
          this.title = this.modalTitle
          this.data.topicId = this.topicId
        }
      },
      show (val) {
        if (val) {
          this.init()
          this.backData = {}
        } else {
          this.closeModal(val)
        }
      },
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
