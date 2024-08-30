<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="750">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">阵地介绍编辑</h4>
            </div>
            <div class="body">
                <el-form ref="form" :model="formPosition">
                    <el-form-item label="修建日期:" :label-width="formLabelWidth" class="input-row" prop="endTime">
                        <el-date-picker
                            :clearable="false"
                            v-model="formPosition.createDate"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:500px"
                            class="input-row">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="面积:" :label-width="formLabelWidth" class="input-row" prop="addr"
                                  style="margin-top: -15px">
                        <el-input v-model="formPosition.area" placeholder="请输入面积" style="width:500px"
                                  type="number"></el-input>
                        平方米
                    </el-form-item>
                    <el-form-item label="党建示范阵地:" :label-width="formLabelWidth" class="input-row" prop="addr"
                                  style="margin-top: -15px">
                        <el-radio-group v-model="formPosition.demonstrate" size="medium" style="margin-top: 12px;">
                            <el-radio :label=0>否</el-radio>
                            <el-radio :label=1>是</el-radio>
                        </el-radio-group>
                    </el-form-item>

                </el-form>
                <div style="margin-left:29px;margin-bottom: 8px;font-size:16px">阵地图片</div>
                <el-button @click="addImg" size="small" style="margin-left:20px;margin-bottom: 5px;color:#a68f7f">添加阵地图片
                </el-button>
                <div style=" padding: 0 20px;">
                    <el-row :gutter="10" style="width: 100%;">
                        <el-col :span="8" v-for="(item,index) in formPositionPhoto" :key="index"
                                style="margin-top: 10px;">
                            <div>
                                <img :src="defaultImg" v-if="item.photo===''||item.photo===undefined||item.photo===null"
                                     style="width: 100%; aspect-ratio: 5 / 3; object-fit: contain;">
                                <el-image
                                    v-else
                                    fit="contain"
                                    style="width: 100%; aspect-ratio: 5 / 3;"
                                    :src="base + item.photo"
                                    :preview-src-list="[base + item.photo]">
                                </el-image>
<!--                                <img :src=" base + item.photo" v-else style="width: 100%; aspect-ratio: 5 / 3; object-fit: contain;">-->
                            </div>
                            <div>
                                <Upload
                                    accept=".jpg,.png,.jpeg"
                                    ref="upload2"
                                    :show-upload-list="false"
                                    :on-success="uploadSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :on-format-error="uploadError"
                                    :before-upload="(e) =>handleUpload(e,index)"
                                    on-change="autographChange"
                                    :headers="{Authorization: $cookie.get('Authorization_vs')}"
                                    action="#"
                                    style="width:80px; display:inline-block; margin-left: 10px">
                                    <Button type="info" style="margin-top: 5px;" ghost>上传图片</Button>
                                </Upload>
                                <Button type="error" style="margin-top: 5px; margin-left: 10px;"
                                        @click="deleteFile(index)" ghost>删除图片
                                </Button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div>
                    <div style="margin-left:20px;margin-top: 15px;font-size:12px">阵地介绍：</div>
                </div>
                <div style="margin-left: 15px;margin-top:15px">
                    <el-input type="textarea" rows="5" maxlength="1000" show-word-limit
                              style="width: 100%; font-size: 13px;" placeholder="请输入支部介绍（1000字以内）"
                              v-model="formPosition.positionIntroduction">
                    </el-input>
                    <div style="margin-top: 5px;font-size:12px">
                        说明：附照片、说明。要求阵地照片不少于3张、不超过8张，含正面全景、广场、会议室、办公室、图书室等。
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button type="primary" size="small" @click="submitForm">保存</el-button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util'
import {VueCropper} from 'vue-cropper'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {addActiveInfo, getActiveDept} from "@/api/jcxfSysDept";
import defaultImg from "@/assets/defaultImg.png"
import {getJcxfDeptPositionByDeptId, addOrUpdateJcxfDeptPosition} from "@/api/jcxfDeptPosition";
import {upload} from "@/api/jcxfUpload";

export default {
    name: 'uploadImg',
    components: {
        ElImageViewer,
        VueCropper,
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        deptName: {
            type: String
        },
        deptId: {
            type: String
        },
        activeId: {
            type: String
        }
    },
    data() {
        return {
            defaultImg: defaultImg,
            show: false,
            base: util.jcxfUrl,
            formLabelWidth: '100px',
            formPosition: {
                id: '',
                createDate: '',
                area: '',
                deptId: '',
                positionIntroduction: ''
            },
            formPositionPhoto: []
        }
    },
    methods: {
        submitForm() {
            if (this.formPositionPhoto == null || this.formPositionPhoto.length < 3) {
                this.$message({
                    message: '上传图片需大于3张',
                    type: 'error',
                    //duration: 1000
                })
                return false
            }

            let form = {
                jcxfDeptPosition: this.formPosition,
                jcxfDeptPositionPhoto: this.formPositionPhoto
            }
            addOrUpdateJcxfDeptPosition({data: form}).then(res => {
                const data = res.data
                if (data.code = '00000') {
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        //duration: 1000
                    })
                    this.refresh()
                } else {
                    this.$message({
                        message: '保存失败',
                        type: 'error',
                        //duration: 1000
                    })
                }
            })
        },
        // 添加会议图片
        addImg() {
            if (this.formPositionPhoto.length > 7) {
                this.$message({
                    message: '图片不能超过8张',
                    type: 'error',
                    //duration: 1000
                })
                return false
            }
            if (this.formPositionPhoto.length < 3) {
                for (let i = this.formPositionPhoto.length; i < 3; i++) {
                    this.formPositionPhoto.push({
                        photo: '',
                        title: '',
                        deptId: this.deptId
                    })
                }
            } else {
                this.formPositionPhoto.push({
                    photo: '',
                    title: '',
                    deptId: this.deptId
                })
            }
        },
        // 删除图片
        deleteFile(index) {
            this.formPositionPhoto.splice(index, 1)
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
            upload(file).then(res => {
                if (res.code == 200) {
                    this.formPositionPhoto[index].photo = res.data.result.fileRealPath
                }
            })
            return false
        },
        uploadSuccess(response, file, fileList) {

        },
        getInfo() {
            getJcxfDeptPositionByDeptId(this.formPosition.deptId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    if (data.data.position != null) {
                        this.formPosition = data.data.position
                    }
                    if (data.data.photoList != null) {
                        this.formPositionPhoto = data.data.photoList
                    }
                }
            })
        },
        uploadError(err, file, fileList) {
            this.$message.error('上传失败' + err)
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
            this.formPosition = {
                id: '',
                createDate: '',
                area: '',
                deptId: '',
                positionIntroduction: ''
            }
            this.formPositionPhoto = []
        }
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                if (this.deptId != null) {
                    this.formPosition.deptId = this.deptId
                    this.getInfo()
                }
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
