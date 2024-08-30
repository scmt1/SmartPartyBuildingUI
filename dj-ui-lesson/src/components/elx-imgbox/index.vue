<template>
    <el-dialog :visible.sync="visible" title="图片上传" :close-on-click-modal="false" width="400px" append-to-body @close="close">
        <el-upload
                class="avatar-uploader"
                :action="'#'"
                :show-file-list="false"
                :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                :before-upload="beforeImageUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submit()">确定</el-button>
        </div>
    </el-dialog>
</template>

<script type="text/babel">
import {uploadFile} from "@/api/minionFile";

export default {
    name: 'ElxImgbox',
    props: {
        maxSize: {
            default: 1,
            type: Number
        },
        imgSizeLimit: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            imageUrl: '',
            visible: false
        }
    },

    methods: {
        /**
         * 初始化
         */
        init() {
            this.visible = true
        },
        close() {
            this.visible = false
        },
        submit() {
            this.visible = false
            this.$emit('refreshPic', this.imageUrl)
        },
        beforeImageUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt5M = file.size / 1024 / 1024 < 5

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }
            if (!isLt5M) {
                this.$message.error('上传头像图片大小不能超过 5MB!')
            }
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    this.imageUrl = res.data.url
                })
            }
            return false
        },
    },
}
</script>

<style lang="scss" scoped>
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
    background-color: #f1f1f1;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
