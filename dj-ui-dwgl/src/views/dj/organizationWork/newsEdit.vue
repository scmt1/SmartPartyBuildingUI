<template>
  <!--<div>xxxx</div>-->
  <!-- App -->
  <div id="app">
    <div id="logo">
      <!--<img alt="Vue+Tinymce" src="https://raw.githubusercontent.com/lpreterite/vue-tinymce/HEAD/docs/assets/vu-tinymce-logo.png">-->
    </div>
    <vue-tinymce
      :key="tinymceFlag"
      v-model="Editortext"
      :setting="setting"
      :setup="setting.setup"/>
  </div>
</template>
<!-- 全局引入TinyMCE -->
<!--<script src="//unpkg.com/tinymce@5.1.5/tinymce.min.js"></script>-->
<script>
  import util from '@/libs/util'
  import axios from 'axios'
  import Vue from 'vue'


  export default {
    props: {
      content: {
        //父组件传进来的默认值
        type: String,
        default: '',
      },
      itemkey: {
        //多个富文本用于区分
        type: String,
        default: '',
      },
      custom: {
        //添加自定义菜单按钮
        type: String,
        default: '',
      },
    },
    activated () {
      this.tinymceFlag++ //组件缓存的时候用于再次加载，不然有些时候再次加载会出现只显示一个textarea的问题
    },
    data () {
      let _this = this
      return {
        tinymceFlag: 1,
        Editortext: this.content,
        setting: {
          menubar: false, //上面的菜单隐藏
          selector: `#Editor${_this.itemkey}`, //多个富文本的时候加上itemkey用于区分
          toolbar: `insertfile undo redo
          | bold italic underline strikethrough
          | fontsizeselect
          | alignleft aligncenter alignright alignjustify
          | image |  outdent indent | numlist bullist | lineheight | customheading
          `,
          fontsize_formats: '10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px',
          plugins: 'table charmap  preview image  ',
          language: 'zh_CN', //本地化设置
          statusbar: false, //隐藏最底部的状态栏
          height: 500, //默认高度
          image_advtab: true,
          setup: function (editor) {
            editor.on('input blur undo redo execCommand', (e) => {
              //多个触发事件获取最新值
              var msg = _this.Editortext.toString() //获取带html的值
              if (_this.itemkey != undefined && _this.itemkey != '') {
                //多个富文本时返回值给父组件
                _this.$emit('message', {
                  key: _this.itemkey,
                  msg: msg,
                })
              } else {
                //单个富文本返回值给父组件
                _this.$emit('message', msg)
              }
            })
            //添加自定义的菜单按钮
            if (_this.custom.indexOf('menuDateButton') != -1) {
              editor.ui.registry.addMenuButton('menuDateButton', {
                //添加菜单按钮
                text: '公式模板',
                fetch: function (callback) {
                  var items = []
                  let formula = [
                    {name: '公式1', code: '1'},
                    {name: '公式2', code: '2'},
                    {name: '公式3', code: '3'},
                  ]
                  formula.map((resitem) => {
                    items.push({
                      type: 'menuitem',
                      text: resitem.name,
                      onAction: function (_) {
                        editor.insertContent(resitem.name)
                        editor.input()
                      },
                    })
                  })
                  callback(items)
                },
              })
            }
          },
          // 图片异步上传处理函数
          images_upload_handler: (blobInfo, success, failure) => {
            //本地base64图片
            /*    var reader = new FileReader();
                reader.onload = function (e) {
                  //reader.result就是转换成的base64
                  success(reader.result);
                };
                reader.readAsDataURL(blobInfo.blob());*/
            this.handleImgUpload(blobInfo, success, failure)
            //把图片上传到服务器
            // var formData = new FormData();
            // formData.append('images',blobInfo.blob(), blobInfo.filename());
            // // _this.$api.uploadScenicFace这个是我调用后台图片上传接口的函数
            // _this.$api.uploadScenicFace(formData, _this.token, function(data) {
            //     // 图片上传成功以后调用success,图片就可以在富文本编辑器中显示了
            //     success(data.url);
            // });
          },
        },
      }
    },
    mounted () {
      // tinymce.init({})
    },
    methods: {
      setup (editor) {
      },
      async upload (data) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/admin/file/uploadImages'),
            method: 'POST',
            data: {data},
          }).then((res) => {
            var data = {
              fileName: '',
              fileSize: '',
              fileUrl: '',
              fileType: '',
              type: '',
              filePath: '',
              foreignKey: this.id,
              tableType: 'tz_party_meeting'
            }
            debugger
          }).catch(i => {

          })
        })

      },
      handleImgUpload (blobInfo, success, failure) {
//继承编辑器方法 blobInfo, success, failure
        let formdata = new FormData()
        formdata.set('upload_file', blobInfo.blob())
        axios.post(util.upload + '/admin/file/uploadImages', formdata).then(res => {
// 上传成功 回调传给编辑器
            success("util.nginxUrl + res.data.data")
          }
        ).catch(res => {
          //失败通知
          failure('error')
        })
      },
      uploadFile (obj) {
        // this.loading = true
        let fd = new FormData()
        fd.append('file', obj.file)
        upload(fd).then(result => {
          // this.loading = false
          tinymce.execCommand('mceInsertContent', false, `<a class="a-file" href="'http://127.0.0.1:8087/admin/file/uploadImages'">${obj.file.name}</a>`)
        })
      }
    },
    watch: {
      content: {
        immediate: true,
        deep: true,
        handler (newValue, oldValue) {
          // 这里是从列表页编辑时做的内容注入，没有需要可以不写
          if (this.content == undefined) {
            this.Editortext = ''
          } else {
            this.Editortext = this.content
          }
        },
      },
    },
  }

</script>

<style scoped>
  .tinymce-box {
    margin: 20px;
  }
</style>
