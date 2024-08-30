<template>
  <Modal v-model="show" :mask-closable="false" :closable="false" width="1200px">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">{{title}}</h4>
      </div>
      <div class="body">
        <!-- <el-form ref="form" :model="form" :rules="rules"
                  style="display: flex;flex-wrap: wrap;justify-content: space-between;margin-left: 40px;margin-right: 40px">-->
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" v-if="show"
        >
          <div class="row">
            <div class="col-sm-6">
              <el-form-item label="标题:" :label-width="formLabelWidth" class="input-row" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题" size="mini" class="input-row"></el-input>
              </el-form-item>
              <el-form-item label="类型:" :label-width="formLabelWidth" class="input-row" prop="type">
                <el-select v-model="form.type" placeholder="请选择" clearable size="small" class="input-row" @change="change">
                  <el-option label="文本新闻" value='1'></el-option>
                  <el-option label="视频新闻" value='2'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="type=='1'" label="内容:" :label-width="formLabelWidth" class="input-row" prop="content">
                <editor v-model="show"   :content="form.content"    itemkey="editor1"
                        custom="menuDateButton"
                        @message="message"></editor>
              </el-form-item>
              <el-form-item v-else-if="type=='2'" label="上传视频:" :label-width="formLabelWidth" >
                <Upload
                        size="small"
                        name="file"
                        accept=".mp4,.MP4"
                        multiple
                        :format="fileTypeArr"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        action=''
                        :show-upload-list="true"

                        :before-upload="handleUpload"
                        ref="upload">
                  <div>
                    <el-input :value="input" placeholder="需要上传的文件" size="mini" autocomplete="off" style="width:720px;" :disabled="true"></el-input>
                    <el-button size="mini" style="width: 100px;height: 30px">上传文件</el-button>
                  </div>
                </Upload>
                <!--<Progress v-if="upload.fileProgressShow" :percent="upload.fileProgress"/>-->
              </el-form-item>
              <el-form-item v-if="type=='2'" label="视频介绍:" :label-width="formLabelWidth" class="input-row" prop="videoIntro">
                <el-input v-model="form.videoIntro" placeholder="请输入标题" type="textarea" :rows="10" size="mini" class="input-row"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>

      </div>
    </div>
    <videoPlayer :id="new Date().getTime().toString().substring(8)"  :url="videoUrl" v-if="videoUrl!=null" style="margin-top:80px"></videoPlayer>
    <div slot="footer" class="footer">
      <el-button size="small" @click="close">关闭</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
    </div>
  </Modal>
</template>

<script>
    import { getSessionStorageInfo, getLocalStorageInfo } from './../../../utils/localStorageInfo';
  import util from '@/libs/util'
  import videoPlayer from '@/views/dj/components/videoPlayer'
  import vue from 'vue'
  import { mpUploadVideo, addNews,getDataById } from "../../../api/orgWorkservice";
  import { getTzSysDept } from "../../../api/jcxfSysDept";
  // import editor from '@/views/modules/dj/components/TEditor'
  import editor from './newsEdit'
  export default {
    name: 'add',
    components: {
      editor,
      videoPlayer
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      newsId: {
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
        input:'',
        api: this.getApi(),
        videoUrl: null,
        data:{serviceName: 'AttachFileService',methodName: 'mpUploadVideo'},
        upHeaders: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: getSessionStorageInfo('token'),
        },
        fileTypeArr: ['MP4', 'mp4'],//文件类型
        type:1,
        base_Url: 'http://192.168.6.51:8088',
        id: '',
        show: this.value,
        disabled: false,
        base: util.nginxUrl,
        title: '',
        formLabelWidth: '100px',
        form: {
        },
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '请选择新闻类型', trigger: 'change'}
          ],
          content: [
            {required: true, message: '内容不能为空', trigger: 'change'}
          ],
          videoIntro: [
            {required: true, message: '内容不能为空', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      getDataById(){
        getDataById({id:this.id}).then(res=>{
          if(res.code=='000000'){

            this.form=res.data.data
            this.type=this.form.type
          }
        })
      },
      handleUpload (file) {
        file.oneTime = new Date()
        let tmp = file.name.split('.')
        let name = tmp[tmp.length - 1]
        if (name !== 'mp4' && name !== 'Mp4') {
          this.$message.error('请选择mp4文件类型')
          return false
        }
        this.videoUrl = null
        /*  if (file.size > 52428800) {
            this.$message.error('文件不能大于50M')
            return false
          }*/
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
          const videoData = event.target.result;
      /*    var data = JSON.stringify({
            imgUrl: reader.result
          })*/
           mpUploadVideo( {data:new Blob([event.target.result], {type: 'video/mp4'})} ).then(res => {

          })
        }
        file.oneTime = new Date()
        return false
      },
      uploadError (err, file, fileList) {
        this.$message.error('上传失败' + err)
      },
      uploadSuccess (response, file, fileList) {
        this.input = file.name
        if (response.success) {
          /*this.attachFile = {
            'fileName': '',
            'filePath': '',
            'fileSize': '',
            'type': '',
            'fileType': '',
            'foreignKey': ''
          }*/
          this.videoUrl = file.response.data
        /*  this.attachFile.fileName = file.name
          this.attachFile.filePath = file.response.data
          this.attachFile.fileSize = file.size
          this.attachFile.fileType = file.type
          this.attachFile.type = 3*/
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.msg)
        }
      },
      change(e){
        this.type=e
      },
      submitForm () {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return
          }
          /*this.form.deptId = this.data.deptId
          this.form.deptName = this.data.deptName*/
          let data = {}
          data.organizationWork=this.form
          // data=this.form
          // data = JSON.stringify(data)
            addNews({data:data}).then(res=>{
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
            })
        })
      },
      message(content) {

      },

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
      getApi () {
        return util.upload
      },
      getDeptName (deptId) {
        getTzSysDept(deptId).then(res =>{
          this.form.deptName = res.data.name
        })
      },
      close () {
        this.reset()
        this.show = false
        this.$emit('input', false)
        this.$emit('close')
      },

      reset () {
        this.tableData = []
        this.input = ''
        this.disabled = false
        this.title = ''
        this.type='1'
        this.form = {

        }
      },

      closeModal (val) {
        this.$emit('close')
        this.$emit('input', false)
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
          if (this.title === '新增') {
        /*    this.data.deptId = this.deptId
            this.data.deptName = this.deptName
            this.data.payMonth = this.getDate()*/
          // this.getDeptName()
            this.getDeptName()
          } else {
            this.id = this.newsId
            this.getDataById()
          }
          if (this.title === '详情') {
            this.disabled = true
          }
        }
      },
      show (val) {
        if (val) {
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
