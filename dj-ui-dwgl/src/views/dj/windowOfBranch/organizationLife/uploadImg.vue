<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="53%" @on-visible-change="visibleChange">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">会议照片</h4>
            </div>
            <div class="body">
                <div style="margin-left:19px;margin-bottom: 8px">说明：会议照片不少于2张、不超过8张。</div>
                <el-button @click="addImg" style="margin-left:20px;margin-bottom: 5px;color:#a68f7f">添加会议图片</el-button>
                <div v-loading="uploadImgLoading">
                    <div style="display:inline-block; padding: 0 10px;" v-for="(item,index) in list" :key="index">
                        <div style="">
                            <img :src="defaultImg" v-if="item.attachmentRelativePath===''||item.attachmentRelativePath===undefined||item.attachmentRelativePath===null"
                                 style="height: 108px; width: 180px;">
                            <img :src="item.attachmentRelativePath" v-else
                                 style="height: 108px; width: 180px;">
                        </div>
                        <div style="display: flex; margin-top: 5px;">
                            <Upload
                                accept=".jpg,.png,.jpeg"
                                ref="upload2"
                                :show-upload-list="false"
                                :on-success="uploadSuccess"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="uploadError"
                                :before-upload="(e) =>handleUpload(e,index)"
                                on-change="autographChange"
                                :headers="{Authorization: $cookie.get('Authorization_vp')}"
                                action="#"
                                style="width:80px; display:inline-block; margin-left: 7px;">
                                <Button type="info" ghost>上传图片</Button>
                            </Upload>
                            <Button type="error" @click="deleteFile(index)" ghost
                                    style="margin-left: 6px; width:80px;display:inline-block;">删除图片
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">会议记录照片</h4>
            </div>
            <div class="body">
                <div style="margin-left:19px;margin-bottom: 8px">说明：会议记录照片不超过8张。</div>
                <el-button @click="addImg2" style="margin-left:20px;margin-bottom: 5px;color:#a68f7f">添加会议记录图片</el-button>
                <div style="">
                    <div style="display:inline-block; padding: 0 10px;" v-for="(item,index) in list2" :key="index" v-loading="uploadImgLoading">
                        <div style="">
                            <img :src="defaultImg" v-if="item.attachmentRelativePath===''||item.attachmentRelativePath===undefined||item.attachmentRelativePath===null"
                                 style="height: 108px; width: 180px;">
                            <img :src="item.attachmentRelativePath" v-else
                                 style="height: 108px; width: 180px;">
                        </div>
                        <div style="display: flex; margin-top: 5px;">
                            <Upload
                                accept=".jpg,.png,.jpeg"
                                ref="upload2"
                                :show-upload-list="false"
                                :on-success="uploadSuccess2"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="uploadError"
                                :before-upload="(e) =>handleUpload2(e,index)"
                                on-change="autographChange"
                                :headers="{Authorization: $cookie.get('Authorization_vp')}"
                                action="#"
                                style="width:80px; display:inline-block; margin-left: 7px;">
                                <Button type="info" ghost>上传图片</Button>
                            </Upload>
                            <Button type="error" @click="deleteFile2(index)" ghost
                                    style="margin-left: 6px; width:80px;display:inline-block;">删除图片
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" @click="submitForm">保存</el-button>
        </div>
    </Modal>
</template>

<script>
import Vue from 'vue'
import util from '@/libs/util'
import {VueCropper} from 'vue-cropper'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {findImgById, saveImg} from "@/api/jcxfOrganizationLife";
import {uploadImages} from "@/api/jcxfPartyMember";
import defaultImg from "@/assets/defaultImg.png"
import {uploadFile} from "@/api/minionFile";

export default {
    name: 'uploadImg',
    components: {
        ElImageViewer,
        VueCropper
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        meetingId: {
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
    data() {
        return {
            defaultImg: defaultImg,
            list: [],
            list2: [],
            show: false,
            base: util.jcxfUrl,
            uploadImgLoading: false
        }
    },
    methods: {
        visibleChange(event) {
            if (!event) {
                this.close()
            }
        },
        submitForm() {
            if (this.list == null || this.list.length < 2) {
                this.$message.info('上传图片需大于2张')
                return false
            }
            for (let i; i < this.list.length; i++) {
                const path = this.list[i].attachmentRelativePath
                if (!path || path === '' || path == null) {
                    this.$message.info('会议图片不能为空')
                    return false
                }
            }

            let data = this.list.concat(this.list2)
            saveImg(data).then((res) => {
                if (res.data.code == '00000') {
                    this.$message.success("保存成功")
                    this.close()
                } else {
                    this.$message.error("保存失败")
                }
            }).catch((e) => {
                this.$message.error("保存失败")
            })
        },
        // 添加会议图片
        addImg() {
            if (this.list.length > 7) {
                this.$message.warning("图片不能超过8张")
                return false
            }
            this.list.push({
                id: '',
                meetingId: this.meetingId,
                attachmentRelativePath: '',
                type: '1'
            })
        },
        // 添加会议记录图片
        addImg2() {
            if (this.list2.length > 7) {
                this.$message.warning("图片不能超过8张")
                return false
            }
            this.list2.push({
                id: '',
                meetingId: this.meetingId,
                attachmentRelativePath: '',
                type: '4'
            })
        },
        // 删除图片
        deleteFile(index) {
            this.list.splice(index, 1)
        },
        deleteFile2(index) {
            this.list2.splice(index, 1)
        },
        handleUpload(file, index) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'png' && name !== 'jpg' && name !== 'jpeg') {
                this.$message.info('请选择png、jpg、jpeg图片类型')
                return false
            }
            if (file.size > 5242880) {
                this.$message.info('文件不能大于5M')
                return false
            }

            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                this.uploadImgLoading = true
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.list[index].attachmentRelativePath = res.data.url
                    }
                    this.uploadImgLoading = false
                })
            }
            return false
        },
        //会议记录照片上传
        handleUpload2(file, index) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'png' && name !== 'jpg' && name !== 'jpeg') {
                this.$message.info('请选择png、jpg、jpeg图片类型')
                return false
            }
            if (file.size > 5242880) {
                this.$message.info('文件不能大于5M')
                return false
            }

            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.list2[index].attachmentRelativePath = res.data.url
                    }
                })
            }

            return false
        },
        uploadSuccess(response, file, fileList) {
        },
        uploadSuccess2(response, file, fileList) {
        },
        queryImg() {
            findImgById(this.meetingId).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    this.list = data.data.list1
                    this.list2 = data.data.list2
                }
            })
        },
        uploadError(err, file, fileList) {
            this.$message.error('上传失败' + err)
        },
        close() {
            this.reset()
            this.show = false
            this.$emit('close')
        },
        reset() {
            this.list = []
            this.list2 = []
        },
        closeModal() {
            this.$emit('close')
        },
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.queryImg()
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

                ::v-deep {
                    .du-select .el-select__tags {
                        // height: 40px;
                        white-space: nowrap;
                        overflow: hidden;
                        flex-wrap: nowrap;
                    }

                    .du-select .el-select__tags-text {
                        display: inline-block;
                        max-width: 135px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .du-select .el-tag__close.el-icon-close {
                        top: -6px;
                        right: -4px;
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
