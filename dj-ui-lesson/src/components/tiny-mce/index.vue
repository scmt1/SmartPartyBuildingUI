<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage color="#155bd4" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
const resourceCdn1 = 'https://npm.elemecdn.com/tinymce-all-in-one@4.9.3/tinymce.min.js'
const resourceCdn2 = 'https://npm.elemecdn.com/tinymce-all-in-one@4.9.3/tinymce.min.js'
const resourceCdn3 = 'https://fastly.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false
    }
  },
  computed: {
    language () {
      return localStorage.getItem('lang') || 'zh_CN'
    },
    containerWidth () {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    // value (val) {
    //     this.setContent(val)
    // },
    language () {
      this.destroyTinymce()
      this.$nextTick(() => this.initTinymce())
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    if (window.tinymce) {
      this.initTinymce()
    } else {
      this.init()
    }
  },
  deactivated () {
    this.destroyTinymce()
  },
  destroyed () {
    this.destroyTinymce()
  },
  methods: {
    setContent (val) {
      this.$nextTick(() => {
        window.tinymce.get(this.tinymceId).setContent(val || '')
      })
    },
    init () {
      // dynamic load tinymce from cdn
      load(resourceCdn1, (err) => {
        if (!err) {
          this.initTinymce()
          return
        }
        load(resourceCdn2, (err2) => {
          if (!err2) {
            this.initTinymce()
            return
          }
          load(resourceCdn3, (err3) => {
            if (!err3) {
              this.initTinymce()
              return
            }
            this.$message.error(err.message)
          })
        })
      })
    },
    initTinymce () {
      const _this = this
      window.tinymce.init({
        language: this.language,
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        content_style: 'body {  -webkit-user-modify: read-write;overflow-wrap: break-word;-webkit-line-break: after-white-space;}',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup (editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        convert_urls: false
      })
    },
    destroyTinymce () {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    getContent () {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK (arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v}" >`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
  width: 95%;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 2000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
