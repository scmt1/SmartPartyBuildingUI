<template>
    <el-dialog :visible.sync="show" title="新增团员培训活动" top="20px" width="900px" :close-on-click-modal="false" :close-on-press-escape="false" @opened="init" @close="close">
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" v-if="show">
            <div class="body">
                <el-form-item label="活动名称：" :label-width="formLabelWidth" prop="name" class="input-row">
                    <el-input v-model="form.name" size="small" placeholder="" autocomplete="off" maxlength="80" class="input-row"></el-input>
                </el-form-item>
                <el-form-item label="活动描述：" :label-width="formLabelWidth" prop="description" class="input-row">
                    <el-input   rows="7" v-model="form.description" size="small" type="textarea" autocomplete="off" maxlength="80"  class="input-row"></el-input>
                </el-form-item>
                <el-form-item label="活动图片：" :label-width="formLabelWidth" prop="floatingOutType" class="input-row">
                    <div style="display: flex">
<!--                        <Upload
                                accept=".jpg,.png,.jpeg"
                                ref="upload"
                                :show-upload-list="false"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :before-upload="handleUpload"
                                on-change="autographChange"
                                :headers="{Authorization: $cookie.get('Authorization_vs')}"
                                action=""
                                style="text-align: left;align-items: center;justify-content: center;">
                            <div style="width: 100px;height:100px;">
                                <img v-if="form.imgUrl" :src=" base + form.imgUrl" style="display: inline-block; cursor: pointer;width:100px;height:100px;">
                                <img v-else :src="defaultImg" style="display: inline-block; cursor: pointer;width:100px;height:100px;">
                            </div>
                        </Upload>-->
                        <el-upload
                            accept=".jpg,.png,.jpeg"
                            action="#"
                            ref="upload"
                            list-type="picture-card"
                            :file-list="uploadImageList"
                            :before-upload="handleUpload"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :class="{ hide: hideUploadBtn }"
                            :limit="uploadImgLimit">
                            <i slot="default" class="el-icon-plus" style="line-height: 148px;"></i>
                            <div slot="file" slot-scope="{file}">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                      <i class="el-icon-delete"></i>
                                    </span>
                                </span>
                            </div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" append-to-body>
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                </el-form-item>
                <el-form-item label="相关附件：" :label-width="formLabelWidth"  class="input-row">
                    <Upload
                            multiple
                            type="drag"
                            size="small"
                            name="file"
                            accept=".doc, .docx, .ppt, .pdf"
                            :format="fileTypeArr"
                            :on-error="uploadError"
                            :headers="upHeaders"
                            :before-upload="handleUpload2"
                            action=""
                    >
                        <div style="padding: 20px 0">
                            <i class="el-icon-upload"></i>
                            <p>点击或将文件拖拽到这里上传</p>
                        </div>
                    </Upload>
                    <div v-if="fileList!=null&&fileList.length>0" style="text-align:left">
<!--                        <div style="margin-top:5px"  v-for="item in fileList">{{item.fileName}}</div>-->
                        <div style="margin-top: 5px; display: flex;" v-for="(item, index) in fileList" :key="index">
                            <div style="flex: 1;">
                                <i class="el-icon-tickets"></i>&nbsp;&nbsp;{{ item.name }}
                                <i style="margin-left: 10px; cursor: pointer;" @click="downFile(item)" class="el-icon-download"></i>
                            </div>
                            <div style="margin-left: 15px;"><i @click="delFile(item)" class="el-icon-error"></i></div>
                        </div>
                    </div>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关 闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')" v-if="!disabled">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import util from '@/libs/util'
import defaultImg from "@/assets/upload.png"
import {getDictByType, getDictByType2} from "@/api/tDictData";
import {uploadImages} from "@/api/jcxfPartyMember";
import {getFileDateForDown, uploadTinymceEditor} from '@/api/attachFile'
import {addTeamActive,getTeamActiveById} from '@/api/tzTeamActive'
import _ from "lodash";
import Vue from 'vue'
import {fileByteToBlob} from "@/utils/fileUtils";
import fileDownload from "js-file-download";
import {uploadFile} from "@/api/minionFile";
export default {
    name: 'updateActive',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modeTitle: {
            type: String
        },
        teamId:{
            type: Number
        },
        id:{
            type: Number
        }

    },
    data() {
        return {
            disabled: false,
            form: {
                name: '',
                description:'',
                imgUrl:'',
                teamId:'',
                imageUrl: [],
                fileUrl: []
            },
            formLabelWidth: '120px',
            show: this.value,
            rules: {
                name: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                description: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ]

            },
            options: [],
            defaultImg:defaultImg,
            base: util.minionUrl,
            fileTypeArr: ['doc', 'docx', 'ppt', 'pdf'],
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_vs')
            },
            fileList: [],
            attachFile: {
                'fileName': '',
                'filePath': '',
                'fileSize': '',
                'type': '',
                'fileType': ''
            },
            dialogImageUrl: '',
            dialogVisible: false,
            hideUploadBtn: false,
            uploadImgLimit: 3,
            uploadImageList: [],
            imageFileList: []
        }
    },
    methods: {
        handleRemove(file, fileList) {
            let index = this.uploadImageList.indexOf(file)
            this.uploadImageList.splice(index, 1)
            this.imageFileList.splice(index, 1)

            this.hideUploadBtn = this.uploadImageList.length >= this.uploadImgLimit;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        downFile(item) {
            const el = document.createElement('a');
            el.style.display = 'none';
            el.setAttribute('target', '_blank');
            el.href = item.url;
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
        },
        delFile(data) {
            this.fileList.splice(this.fileList.indexOf(data), 1)
        },
        getTeamActiveById(id){
            getTeamActiveById(id).then(res=>{
                if(res.data.code=='00000'){
                    this.form  = res.data.data
                    this.uploadImageList = []
                    this.fileList = []

                    let imageFileList = JSON.parse(this.form.imageUrl)
                    if (imageFileList != null) {
                        for (let i = 0; i < imageFileList.length; i++) {
                            const val = {
                                name: '',
                                url: imageFileList[i]
                            }
                            this.uploadImageList.push(val)
                        }
                        this.imageFileList = imageFileList
                    }

                    if(this.form.fileUrl && this.form.fileUrl.length!=0){
                        this.fileList = JSON.parse(this.form.fileUrl)
                    }

                    this.hideUploadBtn = this.uploadImageList.length >= this.uploadImgLimit;
                }
            })
        },
        uploadError (err, file, fileList) {
            this.$message.error('上传失败' + err)
        },
        handleUpload2 (file) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'doc' && name !== 'docx' && name !== 'ppt' && name !== 'pdf' ) {
                this.$message.error('请选择  doc、docx、ppt、pdf文件类型')
                return false
            }
            if (file.size > 52428800) {
                this.$message.error('文件不能大于50M')
                return false
            }

            /*let attachFile = {
                'fileName': '',
                'filePath': '',
                'fileSize': '',
                'type': '',
                'fileType': ''
            }
            attachFile.fileType = file.type
            file.oneTime = new Date()*/

            let reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onload = () => {
                /*let data = {
                    file:reader.result,
                    name: file.name
                }
                uploadTinymceEditor({ data: data }).then(res => {
                    const data = res.data
                    if (data.code = '00000') {
                        // this.fileList = []
                        attachFile.fileName = data.data.fileName
                        attachFile.filePath = data.data.filePath
                        attachFile.fileSize = data.data.fileSize
                        attachFile.type = 3
                        attachFile.tableType = 'tz_team_active'
                        this.fileList.push(attachFile)
                        // this.saveFile()
                    } else {
                        this.$message.error('上传失败')
                    }
                })*/
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        const data = {
                            name: file.name,
                            url: res.data.url
                        }
                        this.fileList.push(data)
                    }
                })
            }
            return false
        },
        handleUpload(file) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'png' && name !== 'jpg' && name !== 'jpeg') {
                this.$message({
                    message: '请选择png、jpg、jpeg图片类型',
                    type: 'error',
                    duration: 2000
                })
                return false
            }
            if (file.size > 5242880) {
                this.$message({
                    message: '文件不能大于5M',
                    type: 'error',
                    duration: 2000
                })
                return false
            }

            /*let attachFile = {
                'fileName': '',
                'filePath': '',
                'fileSize': '',
                'type': '',
                'fileType': ''
            }
            attachFile.fileType = file.type
            file.oneTime = new Date()*/

            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                /*let val = {
                    file: reader.result,
                    name: file.name
                }
                uploadTinymceEditor({data: val}).then(res => {
                    const data = res.data
                    if (data.code = '00000') {
                        let val = {
                            name: '',
                            url: this.base + data.data.filePath
                        }
                        this.uploadImageList.push(val)
                        console.log(this.uploadImageList)

                        attachFile.fileName = data.data.fileName
                        attachFile.filePath = data.data.filePath
                        attachFile.fileSize = data.data.fileSize
                        attachFile.type = 1 // 文件 1:图片 2:视频 3:文件
                        attachFile.tableType = 'tz_team_active'
                        this.imageFileList.push(attachFile)
                        this.hideUploadBtn = this.uploadImageList.length >= this.uploadImgLimit;
                    } else {
                        this.$message.error('上传失败')
                    }
                })*/
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        let val = {
                            name: '',
                            url: res.data.url
                        }
                        this.uploadImageList.push(val)
                        this.imageFileList.push(res.data.url)

                        this.hideUploadBtn = this.uploadImageList.length >= this.uploadImgLimit;
                    }
                })
            }
            return
        },
        reset() {
            this.input = ''
            this.fileList = []
            this.form = {
                name: '',
                description:'',
                imgUrl:'',
                teamId:'',
                imageUrl: [],
                fileUrl: []
            }

            this.uploadImageList = []
            this.imageFileList = []
        },
        close() {
            this.show = false
            this.$emit('close')
            this.reset()
        },
        submitForm() {
            let that = this
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                if(!this.fileList|| this.fileList.length==0){
                    this.$message.info("请上传至少一个附件")
                    return false
                }
                if(!this.imageFileList|| this.imageFileList==''){
                    this.$message.info("请上传图片")
                    return false
                }
                let active= this.form
                active.fileUrl = this.fileList
                active.imageUrl = this.imageFileList
                addTeamActive({active:active}).then(res =>{
                    if (res.data) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 1000
                        })
                        that.close()
                    } else {
                        this.$message({
                            message: '保存失败',
                            type: 'error',
                            duration: 1000
                        })
                    }

                }).catch((e) => {
                    that.isSubmit = false
                })
            })
        },
        init() {

        },

        closeModal() {
            this.$emit('close')
        },
        deptNameChange(val) {
            this.$refs.tree.filter(val)
        }
    },
    watch: {
        value(val) {

            if (val) {
                this.show = val
            }
        },
        show(val) {
            if (val) {
                this.form.teamId = this.teamId
                if(this.modeTitle=='编辑'){
                    this.getTeamActiveById(this.id)
                }
            } else {
                this.closeModal()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.hide {
    ::v-deep .el-upload--picture-card {
        display: none !important;
    }
}

//去掉过渡动画，不然删除操作的时候，布局会闪一下。
::v-deep .el-upload-list__item {
    transition: none !important;
}

::v-deep .el-upload-list--picture-card .el-upload-list__item-actions {
    transition: none !important;
    -webkit-transition: none !important;
}

.modal-header {
    padding: 5px 10px;
    text-align: center;

    .modal-title {
        font-size: 16px;
    }
}

.body {
    padding: 20px 30px 30px 50px;
    background: #f8fafb;
    width: auto;

    .input-row {
        margin-top:3px;
    }

    &:hover {
        .demo-upload-list-cover {
            display: block;
        }
    }


    .ivu-modal {
        width: 660px !important;
    }


    .label {
        ::v-deep.el-form-item__label {
            margin-top: 10px;
            line-height: 18px;
        }
    }


    .el-form-item {
        line-height: 20px;

        .input-row {
           /* margin-top: -12px;
            width: 80%;
            margin-right: 10px*/
            /*width: 370px;*/
        }

        padding-left: 10px !important;
        margin-right: -12px;
        margin-left: -15px;
        margin-bottom: 15px;
    }

}
</style>
