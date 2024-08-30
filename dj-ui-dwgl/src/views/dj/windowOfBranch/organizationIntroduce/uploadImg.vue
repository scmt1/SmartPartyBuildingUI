<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="53%">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">支部介绍编辑</h4>
            </div>
            <div class="body">
                <el-form ref="form" :model="form">
                    <el-form-item label="阵地图片:" :label-width="formLabelWidth" class="input-row" prop="endTime">
                        <div style=" padding: 0 20px;margin-left: 0px">
                            <div style="">
                                <img :src="defaultImg" v-if="form.deptPhoto ==''|| !form.deptPhoto || form.deptPhoto===null" style="height: 108px; width: 180px;">

<!--                                <img :src="base + form.deptPhoto" v-else style="height: 250px;">-->
                                <el-image
                                    v-else
                                    fit="contain"
                                    style="height: 150px;"
                                    :src="base + form.deptPhoto"
                                    :preview-src-list="[base + form.deptPhoto]">
                                </el-image>
                            </div>
                            <Upload
                                accept=".jpg,.png,.jpeg"
                                ref="upload2"
                                :show-upload-list="false"
                                :format="['jpg','jpeg','png']"
                                :max-size="10240"
                                :before-upload="handleUpload"
                                :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                action="#"
                                style="width:80px;display:inline-block;margin-left: 50px">
                                <Button type="info" size="default" ghost>选择图片</Button>
                            </Upload>
                        </div>
                    </el-form-item>
                </el-form>
                <div>
                    <div style="margin-left:20px;margin-top: 15px;font-size:12px">支部介绍：</div>
                </div>
                <div style="margin-left: 15px;margin-top:15px">
                     <el-input type="textarea" rows="7" style="width: 100%;" show-word-limit maxlength="1000" placeholder="请输入支部介绍（1000字以内）" v-model="form.deptIntroduction">
                    </el-input>
                </div>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button :loading="saveLoading" size="small" @click="submitForm" type="primary">保存</el-button>
        </div>

        <cropper ref="cropper" :auto-crop-width="750" :auto-crop-height="380" :fixed="false" @cropperResult="uploadCropperImg"></cropper>
    </Modal>
</template>

<script>
import util from '@/libs/util'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {addTzSysDept, getTzSysDept} from "@/api/jcxfSysDept";
import defaultImg from "@/assets/defaultImg.png"
import {upload} from "@/api/jcxfUpload"
import Cropper from "@/views/dj/components/cropper.vue";


export default {
    name: 'uploadImg',
    components: {
        Cropper,
        ElImageViewer,
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
            show: false,
            base: util.jcxfUrl,
            formLabelWidth: '100px',
            form: {
                id: '',
                deptPhoto: ''
            },
            saveLoading: false
        }
    },
    methods: {
        submitForm() {
            this.saveLoading = true
            addTzSysDept({ data: this.form }).then(res =>{
                this.saveLoading = false
                const data = res.data
                if (data) {
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        //duration: 1000
                    })
                    this.refresh()
                } else {
                    this.$message({
                        message: data.msg,
                        type: 'error',
                        //duration: 1000
                    })
                }
            }).catch((e) => {
                this.saveLoading = false
                this.$message({
                    message: e,
                    type: 'error',
                    //duration: 1000
                })
            })
        },
        handleUpload(file, index) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'png' && name !== 'jpg' && name !== 'jpeg') {
                this.$message({
                    message: '请选择png、jpg、jpeg图片类型',
                    type: 'error',
                    //duration: 1000
                })
                return false
            }
            if (file.size > 5242880) {
                this.$message({
                    message: '文件不能大于5M',
                    type: 'error',
                    //duration: 1000
                })
                return false
            }

            this.$refs.cropper.init(file)
            /*upload(file).then(res => {
                if (res.code == 200) {
                    this.form.deptPhoto = res.data.result.fileRealPath
                }
            })*/
            return false
        },
        uploadCropperImg(file) {
            upload(file).then(res => {
                if (res.code == 200) {
                    this.form.deptPhoto = res.data.result.fileRealPath
                }
            })
        },
        queryImg() {
            getTzSysDept(this.form.id).then(res =>{
                this.form = res.data.data
            })
        },
        close() {
            this.reset()
            this.$emit('close')
        },
        refresh() {
            this.reset()
            this.$emit('refresh')
        },
        reset() {
            this.form = {}
        }
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.form.id = this.deptId
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

    .label {
        ::v-deep.el-form-item__label {
            line-height: 18px;
        }
    }

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
