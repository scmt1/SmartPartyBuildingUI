<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click="clickUpload()">
        上传图片
    </el-button>
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox v-if="elxImgboxVisible" ref="elxImgbox" @refreshPic="refreshPic"></elx-imgbox>
  </div>
</template>

<script>
import ElxImgbox from '@/components/elx-imgbox'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    tinymceUploadType: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      elxImgboxVisible: false,
      maxNum: 15, // 可选择的最大图片数量
      imgUrls: [],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    ElxImgbox
  },
  methods: {
    /**
     * 打开图片选择窗
     */
    clickUpload () {
      this.imgUrls = ''
      this.elxImgboxVisible = true
      this.$nextTick(() => {
        this.$refs.elxImgbox.init()
      })
    },
    /**
     * 接收回调的图片数据
     */
    refreshPic (imagePath) {
      let imageArray = imagePath.split(',')
      var data = []
      imageArray.forEach(img => {
        data.push(img)
      })
      this.imgUrls = ''
      this.dialogVisible = false
      this.$emit('successCBK', data)
    }
    // handleSubmit() {
    //   let imageArray = this.imgUrls.split(',')
    //   var data = []
    //   imageArray.forEach(img => {
    //     data.push(this.resourcesUrl + img)
    //   })
    //   this.imgUrls = ''
    //   this.dialogVisible = false
    //   this.$emit('successCBK', data)
    // }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
