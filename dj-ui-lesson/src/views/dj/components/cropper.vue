<template>
    <el-dialog :visible.sync="modal" :width="(autoCropWidth + 180) + 'px'" title="图片剪裁" append-to-body>
        <div :style="'height: '+ (autoCropHeight + 120) +'px;width: auto;text-align: center;'">
            <VueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
            ></VueCropper>
        </div>
        <div slot="footer">
            <Button type="primary" @click="finish">确认</Button>
        </div>
    </el-dialog>
</template>

<script>
import {VueCropper} from 'vue-cropper'
export default {
    name: "cropper",
    components: {
        VueCropper
    },
    props: {
        autoCropWidth: {
            type: Number,
            default: 600
        },
        autoCropHeight: {
            type: Number,
            default: 420
        },
        fixed: {
            type: Boolean,
            default: false
        },
        fixedBox: {
            type: Boolean,
            default: false
        },
        /*fixedNumber: {
            type: Array,
            default: () => [1, 0.7]
        }*/
    },
    data() {
        return {
            modal: false,
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 1, // 裁剪生成图片的质量
                outputType: 'png', // 裁剪生成图片的格式
                canScale: true, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: this.autoCropWidth, // 默认生成截图框宽度
                autoCropHeight: this.autoCropHeight, // 默认生成截图框高度
                canMove: true,
                fixedBox: false, // 固定截图框大小 不允许改变
                fixed: this.fixed, // 是否开启截图框宽高固定比例
                fixedNumber: [], // 截图框的宽高比例
                full: false, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: true, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
            fileName: ''
        }
    },
    methods: {
        init(file) {
            this.fileName = file.name

            this.option.autoCropWidth = this.autoCropWidth
            this.option.autoCropHeight = this.autoCropHeight
            this.option.fixed = this.fixed

            this.option.fixedNumber = [1, this.autoCropHeight / this.autoCropWidth]

            let data = window.URL.createObjectURL(new Blob([file]))
            this.option.img = data
            this.modal = true
        },
        finish() {
            let _this = this
            this.modal = false
            this.$refs.cropper.getCropBlob((res) => {
                if (res) {
                    _this.$emit('cropperResult', { data: res, name: this.fileName})
                } else {
                    _this.$message.error('图片错误！')
                }
            })
        },
    }
}
</script>

<style scoped>

</style>
