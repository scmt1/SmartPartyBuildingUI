<template>
  <!--<div>-->
  <Modal v-model="show" :mask-closable="false" :closable="false" width="800px">
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
              <el-form-item label="题型选择:" :label-width="formLabelWidth" class="input-row" prop="questionType">
                <el-radio-group v-model="form.questionType" @input="changeType">
                  <el-radio label="1">选择题</el-radio>
                  <el-radio label="2">判断题</el-radio>
                  <el-radio label="3">填空题</el-radio>
                  <el-radio label="4">主观题</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="单题分值(默认2分):" :label-width="formLabelWidth" class="input-row" prop="itemRecord">
                <el-input v-model="form.itemRecord" placeholder="请输入分值" type="number" size="mini" class="input-row"></el-input>
              </el-form-item>
              <el-form-item label="题目:" :label-width="formLabelWidth" prop="question" class="input-row">
                <el-input v-model="form.question" placeholder="请输入题目" type="textarea" :rows="1" class="input-row"></el-input>
              </el-form-item>
              <div v-if="form.questionType==='1'">
                <el-radio-group v-model="form.answer" id="radio">
                  <el-form-item :label-width="selectLabelWidth" style="margin-top:0px" prop="itemA">
                    <el-radio label="A">A&nbsp&nbsp&nbsp
                      <el-input v-model="form.itemA" placeholder="请输入A选项" size="mini" style="width: 300px"></el-input>
                    </el-radio>
                  </el-form-item>
                  <el-form-item :label-width="selectLabelWidth" style="margin-top:-15px" prop="itemB">
                    <el-radio label="B">B&nbsp&nbsp&nbsp
                      <el-input v-model="form.itemB" placeholder="请输入B选项" size="mini" style="width: 300px"></el-input>
                    </el-radio>
                  </el-form-item>
                  <el-form-item :label-width="selectLabelWidth" style="margin-top:-15px" prop="itemC">
                    <el-radio label="C">C&nbsp&nbsp&nbsp
                      <el-input v-model="form.itemC" placeholder="请输入C选项" size="mini" style="width: 300px"></el-input>
                    </el-radio>
                  </el-form-item>
                  <el-form-item :label-width="selectLabelWidth" style="margin-top:-15px" prop="itemD">
                    <el-radio label="D">D&nbsp&nbsp&nbsp
                      <el-input v-model="form.itemD" placeholder="请输入D选项" size="mini" style="width: 300px"></el-input>
                    </el-radio>
                  </el-form-item>
                </el-radio-group>
              </div>
              <!--<el-form-item label-width="100px" style="margin-top:-20px;height: 20px"  v-if="form.questionType==='2'">-->
              <el-radio-group v-model="form.answer" size="medium" v-if="form.questionType==='2'" style="margin-left: 101px;margin-top: -32px">
                <el-radio label="对" style="font-weight: bolder;font-size: 50px;">对</el-radio>
                <el-radio label="错" style="font-weight: bolder;font-size: 50px;">错</el-radio>
              </el-radio-group>
              <!--</el-form-item>-->
              <!--   <el-form-item label=":" :label-width="formLabelWidth" prop="question" class="input-row" v-if="form.questionType==='2'">
                   <el-radio-group v-model="form.answer"  size="medium">
                     <el-radio label="对" style="font-weight: bolder;font-size: 50px;">对</el-radio>
                     <el-radio label="错" style="font-weight: bolder;font-size: 50px;">错</el-radio>
                   </el-radio-group>
                 </el-form-item>-->
              <el-form-item label="答案:" :label-width="formLabelWidth" class="input-row" prop="answer">
                <el-input v-model="form.answer" placeholder="请输入答案" size="mini" class="input-row"
                          :disabled="form.questionType=='1'||form.questionType=='2'"></el-input>
              </el-form-item>
              <el-form-item label="解析:" :label-width="formLabelWidth" class="input-row" prop="analysis">
                <el-input v-model="form.analysis" placeholder="请输入解析" type="textarea" size="mini" class="input-row"></el-input>
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
      topicDetailId: {
        type: String,
        default: ''
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
        formLabelWidth: '150px',
        selectLabelWidth: '90px',
        dialogFormVisible: true,
        form: {
          itemRecord: 2,
          itemA: '',
          itemB: '',
          itemC: '',
          itemD: '',
          questionType: '1',
          topicName: '',
          records: '',
          deptId: '',
          deptName: ''
        },
        rules: {
          questionType: [
            {required: true, message: '请选择题型', trigger: 'change'}
          ],
          question: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          itemA: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          itemB: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          itemC: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          itemD: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          answer: [
            {required: true, message: '这是必填字段', trigger: 'change'}
          ],
          itemRecord: [
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
      changeType (e) {
        this.form.itemA = ''
        this.form.itemB = ''
        this.form.itemC = ''
        this.form.itemD = ''
        // this.form.answer = ''
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
          this.form.topicId = this.topicId
          let data = this.form
          data = JSON.stringify(data)
          this.$http({
            url: this.$http.adornUrl('/multi/tzTopicDetail/addTzTopicDetail'),
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
          url: this.$http.adornUrl('/multi/tzTopicDetail/getTzTopicDetail?id=' + id),
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
          questionType: '1',
          itemRecord: 2
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
          // this.id = this.topicId
          this.title = this.modalTitle
          if (this.modalTitle === '编辑') {
            this.id = this.topicDetailId
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
  #radio {
    ::v-deep .el-radio {
      display: block;
      margin: 10px 0;
      padding: 0px 11px;
      /*width: 200px;*/
    }

    ::v-deep.el-form-item__error {
      color: #F56C6C;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 80%;
      left: 56px;
    }
  }

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


          .label {
            ::v-deep.el-form-item__label {
              line-height: 18px;
            }
          }

          ::v-deep.el-form-item__error {
            color: #F56C6C;
            font-size: 12px;
            line-height: 1;
            padding-top: 4px;
            position: absolute;
            top: 90%;
            left: 0px;
          }

          .el-form-item {
            line-height: 20px;

            .input-row {
              width: 90%;
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
