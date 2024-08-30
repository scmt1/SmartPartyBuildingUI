<template>
  <!--<div>-->
  <Modal v-model="show" :mask-closable="false" :closable="false" width="600px">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">{{title}}</h4>
      </div>
      <div class="body">
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" v-if="show"
        >
          <div class="row">
            <div class="col-sm-6">
              <!--        <el-form-item label="会议类型:" :label-width="formLabelWidth" class="input-row" prop="meetingType" v-if="title=='发起会议'">
                        <el-radio-group v-model="form.meetingType">
                          <el-radio label="1">三会一课(固定党日)</el-radio>
                          <el-radio label="2">组织生活会（民主评议党员）</el-radio>
                        </el-radio-group>
                      </el-form-item>-->
              <el-form-item label="题目主题:" :label-width="formLabelWidth" class="input-row" prop="topicName">
                <el-input v-model="form.topicName" placeholder="请输入题目主题" size="mini" class="input-row"></el-input>
              </el-form-item>
              <el-form-item label="专题学分:" :label-width="formLabelWidth" class="input-row" prop="records">
                <el-input v-model="form.records" placeholder="请输入专题学分" size="mini" class="input-row" type="number"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="footer">
      <el-button size="small" @click="close">关闭</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
    </div>
    <Modal v-model="modal1" width="460" :closable="false" class-name="vertical-center-modal">
      <div style="height: 50px;text-align:center;font-weight: bold;font-size: 30px">
        <p>请选择正确的时间！</p>
      </div>
      <template #footer>
        <Button type="primary" size="large" @click="enter" style="background-color: #8CD4F5;margin-right:170px">确定</Button>
      </template>
    </Modal>
  </Modal>

  <!--</div>-->
</template>

<script>
  import Vue from 'vue'
  import util from '@/libs/util'
  import {VueCropper} from 'vue-cropper'
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

  export default {
    name: 'meetingCompoent',
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
      topicId: {
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
        startTime: '',
        copyMonth: '',
        fileList: [],
        upHeaders: {
          'User-Type': 'Gov_User',
          'Authorization': Vue.cookie.get('Authorization_party_vp')
        },
        data: {deptId: '', deptName: ''},
        fileTypeArr: ['xls', 'xlsx', 'xlsm'],//文件类型
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
        sexList: [{'name': '男', 'value': '1'}, {'name': '女', 'value': '2'}],
        formLabelWidth: '110px',
        dialogFormVisible: true,
        form: {
          topicName: '',
          records: '',
          deptId: '',
          deptName: ''
        },
        rules: {
          topicName: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          records: [
            {required: true, message: '这是必填字段', trigger: 'change'},
            {
              type: 'number',
              message: '请输入正整数',
              trigger: 'blur',
              transform (value) {
                if (value !== null && value !== '') {
                  if (String(value).trim() === '' || Number(value) <= 0) {
                    return false
                  } else if (String(value).indexOf('.') !== -1 || String(value).indexOf('-') !== -1) {
                    return false
                  } else {
                    return Number(value)
                  }
                } else {
                  return null
                }
              }
            }
          ]
        }
      }
    },
    methods: {
      enter () {
        this.modal1 = false
      },
      change (e, type) {
        if (type === 'start') {
          // let date1 = e.replace(/\-/g, '/')
          // this.startTime = Date.parse(date1)
          this.startTime = e
        }
        if (type === 'end') {
          this.endTime = e
        }
        if (this.startTime !== null && this.startTime !== '' && this.startTime !== undefined && this.endTime !== null && this.endTime !== '' && this.endTime !== undefined) {
          if (this.startTime > this.endTime) {
            this.modal1 = true
          }
        }
      },
      submitForm () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return
          }
          this.form.deptId = this.data.deptId
          this.form.deptName = this.data.deptName
          let data = this.form
          data = JSON.stringify(data)
          this.$http({
            url: this.$http.adornUrl('/multi/tzTopic/addTzTopic'),
            method: 'POST',
            data: data
          }).then((res) => {
            this.visible = false
            if (res.data) {
              this.close()
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
        })
      },
      getDateById (id) {
        this.$http({
          url: this.$http.adornUrl('/multi/tzTopic/getTzTopic?id=' + id),
          method: 'get'
        }).then((res) => {
          this.form = res.data
          this.form.isFirstSecretary = this.form.isFirstSecretary ? this.form.isFirstSecretary : ''
          this.form.isPoverty = this.form.isPoverty ? this.form.isPoverty : ''
          if (this.form.attachFiles) {
            this.idCardImgList[0] = this.form.attachFiles[0]
            this.tmp.push(this.base + this.form.attachFiles[0].filePath)
          }
        })
      },
      close () {
        this.$refs['form'].resetFields()
        /*  this.$nextTick(() => {
            this.$refs['form'].clearValidate()
          })*/
        this.reset()
        this.show = false
        this.$emit('input', false)
        this.$emit('close')
      },

      reset () {
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
      }
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
          if (this.modalTitle === '编辑') {
            this.id = this.topicId
            this.getDateById(this.id)
          }
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
