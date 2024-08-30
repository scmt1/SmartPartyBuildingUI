<template>
    <div style="height: 100%; width: 100%;">
        <editor v-model="myValue" :init="init()"></editor>
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/lists' //高级列表
import 'tinymce/plugins/autosave' //自动存稿
import 'tinymce/plugins/help' //帮助
import 'tinymce/plugins/hr' //水平分割线
import 'tinymce/plugins/image' //插入图片
import "tinymce/plugins/imagetools" //图片编辑工具

import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/themes/silver/theme'

import 'tinymce/plugins/link' //超链接
import 'tinymce/plugins/paste' //粘贴插件
import 'tinymce/plugins/preview' //预览
import 'tinymce/plugins/searchreplace' //查找替换
import 'tinymce/plugins/wordcount' //字数统计

import 'tinymce/plugins/contextmenu' //右键菜单插件
import 'tinymce/plugins/colorpicker'//选择颜色插件
import 'tinymce/plugins/textcolor' //文本颜色插件
import "tinymce/icons/default" // 图标 -解决测试环境找不icon问题
import './wordlimit/plugin'
import zhHans from '../../../public/tinymce/langs/zh-Hans.js'
import {uploadImages} from "@/api/attachFile";
import util from "@/libs/util";

export default {
    name:'tinymce',
    components: {
        Editor
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        maxCount: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 200
        }
    },
    data() {
        return {
            myValue: this.value,
            base: util.nginxUrl
        }
    },
    mounted () {
        tinymce.init({})
    },
    methods: {
        init () {
            const _this = this
            return {
                selector: "#tinymce", //tinymce的id
                    language_url: zhHans,   // 语言包位置，因为放在public下所以可以省略public
                    language: "zh-Hans", //语言类型
                    skin_url: "/skins/ui/oxide",
                    height: _this.height, //编辑器高度
                    branding: false,
                    plugins: "wordcount wordlimit lists autosave help hr image imagetools link paste preview searchreplace contextmenu colorpicker textcolor " +
                    "",
                    toolbar: "undo redo | cut copy paste pastetext | forecolor backcolor bold italic underline link | " +
                    "alignleft aligncenter alignright alignjustify outdent indent | " +
                    "styleselect formatselect fontselect fontsizeselect |" +
                    "bullist numlist | hr preview searchreplace image" +
                    "",
                    fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                    font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
                    toolbar_sticky: true,
                    wordlimit: {
                        max: _this.maxCount, // 最多可以输入多少字
                        spaces: !1, // 是否含空格
                        isInput: !1, // 是否在超出后还可以输入
                        // 自定义的提示方法, 默认用编辑器自带
                        toast: function(message) {
                        alert(message)
                    }
                },
                images_upload_url: '#',
                images_upload_handler: async (blobInfo, success, failure) => {
                    let reader = new FileReader()
                    reader.readAsDataURL(blobInfo.blob())
                    reader.onload = () => {
                        uploadImages({imgUrl: reader.result}).then(res => {
                            const result = res.data
                            if (result.code == '00000') {
                                success(_this.base + result.data)
                            } else {
                                failure('上传失败')
                            }
                        })
                    }
                },
                init_instance_callback(editor) {
                    editor.on('wordlimit', function(e) {
                        // e.maxCount   // 配置的最大输入字数
                        // e.wordCount  // 已输入的字数
                        // e.preCount    // 粘贴进来的内容字数，可以用来单独提示粘贴内容时超出的计算
                        // e.isPaste       // 是否是粘贴输入

                        _this.myValue = _this.myValue.toString().substring(0, e.maxCount)
                        _this.$message.info('最多只能输入'+ e.maxCount +'个字')
                    })
                }
            }
        }
    },
    watch: {
        myValue() {
            this.$emit('returnValue', this.myValue)
        }
    },
}
</script>
<style scoped>
::v-deep .tox-statusbar__resize-handle {
    display: none;
}
</style>
