<template>
    <el-dialog :title="title" :visible.sync="show" width="600px" top="10vh">
        <div class="modal-content">
            <div class="body">
                <el-form ref="form" :model="form" :rules="rules" :disabled="disabled">
                    <div class="row">
                        <div class="col-sm-6">
                            <el-form-item label="标题:" :label-width="formLabelWidth" label-width="100px"
                                          class="input-row" prop="title">
                                <el-input v-model="form.title" placeholder="请输入标题" size="mini"
                                          class="input-row"></el-input>
                            </el-form-item>
                            <!--                            <el-form-item label="学时:" :label-width="formLabelWidth" label-width="100px" class="input-row" prop="hours">
                                                            <el-input v-model="form.hours" placeholder="请输入学时" size="mini" class="input-row"
                                                                      type="number"></el-input>
                                                        </el-form-item>-->
                            <el-form-item label="描述:" :label-width="formLabelWidth" label-width="100px">
                                <el-input v-model="form.description" placeholder="请输入详情(不超过1000字)" size="mini"
                                          class="input-row" :maxlength="1000" style="margin-top: 4px"
                                          type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item label="上传的文件:" :label-width="formLabelWidth">
                                <Upload
                                        size="small"
                                        name="file"
                                        accept=".doc,.pdf,.PDF,.docx,.ppt,.txt"
                                        :format="fileTypeArr"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadError"
                                        :data="data"
                                        :action="api"
                                        :show-upload-list="false"
                                        :headers="upHeaders"
                                        :before-upload="handleUpload"
                                        ref="upload">
                                    <div>
                                        <el-input :value="input" placeholder="需要上传的文件" size="mini" autocomplete="off"
                                                  style="width:240px;" :disabled="true"></el-input>
                                        <el-button size="mini" style="width: 100px;height: 30px"
                                                   v-if="fileList.length<1">上传文件
                                        </el-button>
                                        <!--                                        <a v-if="fileList.length == 1" :href="fileList[0].filePath" target="_blank">查看</a>-->
                                    </div>
                                </Upload>
                            </el-form-item>
                            <el-form-item label="封面图:" :label-width="formLabelWidth">
                                <el-upload
                                        class="avatar-uploader"
                                        :action="imageApi"
                                        :show-file-list="false"
                                        :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                        :before-upload="beforeImageUpload">
                                    <img v-if="form.imagePath && form.imagePath.length >0" :src="form.imagePath"
                                         class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Vue from 'vue'
import util from '@/libs/util'
import {VueCropper} from 'vue-cropper'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {uploadImages, uploadTinymceEditor} from '@/api/attachFile'
import {saveStudyFile, getStudyFile} from '@/api/tzStudyFile'
import {mapGetters} from "vuex";

export default {
    name: 'addPayFee',
    components: {
        ElImageViewer,
        VueCropper
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        deptId: {
            type: String
        },
        studyFileId: {
            type: String
        },
    },
    data() {
        return {
            input: '请选择需要上传的文件',
            fileList: [],
            attachFile: {
                'fileName': '',
                'filePath': '',
                'fileSize': '',
                'type': '',
                'fileType': '',
                'foreignKey': ''
            },
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_vs')
            },
            api: this.getApi(),
            imageApi: this.getImageApi(),
            data: {deptId: ''},
            fileTypeArr: ['doc', 'docx', 'ppt', 'pdf', 'txt'],//文件类型
            id: '',
            show: this.value,
            disabled: false,
            base: util.nginxUrl,
            type: '',
            title: '',
            formLabelWidth: '100px',
            form: {
                name: '',
                hours: '',
                title: '',
                imagePath: ''
            },
            rules: {
                title: [
                    {required: true, message: '请输入标题', trigger: 'blur'},
                ],
                hours: [
                    {required: true, message: '这是必填字段', trigger: 'change'},
                    {
                        type: 'number',
                        message: '请输入正整数',
                        trigger: 'blur',
                        transform(value) {
                            if (value !== null && value !== '') {
                                if (String(value).trim() === '' || Number(value) <= 0) {
                                    return false
                                } else if (String(value).indexOf('.') !== -1 || String(value).indexOf('-') !== -1) {
                                    return false
                                } else {
                                    return Number(value)
                                }
                            } else {
                                return null
                            }
                        }
                    }
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
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
                uploadImages({imgUrl: reader.result}).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        this.form.imagePath = data.data
                        this.$message.success('上传成功')
                    } else {
                        this.$message.error('上传失败')
                    }
                })
            }
        },
        handleUpload(file) {
            file.oneTime = new Date()
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'doc' && name !== 'docx' && name !== 'ppt' && name !== 'pdf' && name !== 'txt') {
                this.$message.error('请选择  doc、docx、ppt、pdf、txt文件类型')
                return false
            }
            if (file.size > 52428800) {
                this.$message.error('文件不能大于50M')
                return false
            }
            this.attachFile.fileType = file.type
            file.oneTime = new Date()

            let reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onload = () => {
                let data = {
                    file: reader.result,
                    name: file.name
                }
                uploadTinymceEditor({data: data}).then(res => {
                    const data = res.data
                    if (data.code = '00000') {
                        this.input = data.data.fileName

                        this.fileList = []
                        this.attachFile.fileName = data.data.fileName
                        this.attachFile.filePath = data.data.filePath
                        this.attachFile.fileSize = data.data.fileSize
                        this.attachFile.type = 3
                        this.fileList.push(this.attachFile)
                        this.$message.success('上传成功')
                    } else {
                        // this.$message.error(response.msg)
                        this.$message.error('上传失败')
                    }
                })
            }
            return false
        },
        submitForm() {
            let that = this
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return false
                }
                if (that.fileList == null || that.fileList.length == 0) {
                    that.$message.error('请先上传文件')
                    return false
                }
                if (!that.form.imagePath || that.form.imagePath.length == 0) {
                    that.$message.error('请先上传封面图片')
                    return false
                }
                this.saveFile()
            })
        },
        uploadSuccess(response, file, fileList) {
            this.input = file.name
            if (response.success) {
                this.fileList = []
                this.attachFile.fileName = file.name
                this.attachFile.filePath = file.response.data
                this.attachFile.fileSize = file.size
                this.attachFile.type = 3
                this.fileList.push(this.attachFile)
                this.$message.success('上传成功')
            } else {
                this.$message.error(response.msg)
            }
        },
        saveFile() {

            let data = {
                attachFile: this.attachFile,
                tzStudyFile: this.form,
                deptId: this.deptInfo.id + ''
            }

            saveStudyFile({data: data}).then(res => {
                const data = res.data
                if (data.code = '00000') {
                    this.$message.success('保存成功')
                    this.close()
                } else {
                    this.$message.error('上传失败')
                }
            })
        },
        uploadError(err, file, fileList) {
            this.$message.error('上传失败' + err)
        },
        getApi() {
            return util.upload + '/admin/file/upload/tinymceEditor'
        },
        getImageApi() {
            return util.upload + '/admin/file/uploadImages'
        },
        close() {
            this.$refs['form'].resetFields()
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
            this.reset()
            this.show = false
            this.$emit('close')
        },
        reset() {
            this.fileList = []
            this.tableData = []
            this.input = ''
            this.disabled = false
            this.title = ''
            this.form = {
                name: '',
                hours: '',
                title: '',
                imagePath: ''
            }
        },
        getDataById(id) {
            getStudyFile(id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.form = data.data.tzStudyFile
                    if (data.data.attachList && data.data.attachList.length > 0) {
                        this.attachFile = data.data.attachList[0]
                        this.fileList.push(this.attachFile)
                    }
                    this.input = this.form.name
                }
            })
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.title = this.modalTitle
                if (this.title === '新增') {
                    this.attachFile = {
                        'fileName': '',
                        'filePath': '',
                        'fileSize': '',
                        'type': '',
                        'fileType': '',
                        'foreignKey': ''
                    }
                    this.data.deptId = this.deptId
                } else {
                    this.id = this.studyFileId
                    this.getDataById(this.studyFileId)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader ::v-deep .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

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
