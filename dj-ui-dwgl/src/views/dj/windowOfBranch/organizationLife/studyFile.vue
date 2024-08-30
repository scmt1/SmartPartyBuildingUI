<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="860px" @on-visible-change="visibleChange">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">学习资料</h4>
            </div>
            <div style="margin:auto;width: 75%;display: flex;">
                <Upload
                    accept=".doc, .docx, .ppt, .pdf"
                    size="small"
                    name="file"
                    :show-upload-list="false"
                    :format="fileTypeArr"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    action="#"
                    :headers="upHeaders"
                    :before-upload="handleUpload"
                    ref="upload">
                    <div style="display: flex; margin-right: 10px;">
                        <el-button icon="el-icon-upload">上传文件</el-button>
                    </div>
                </Upload>
                <span style="margin: auto;font-weight: bold">
                    支持文件格式:doc、docx、ppt、pdf;文件数量不超过10个；单个文件大小不能超过50M。
                </span>
            </div>
            <div class="body">
                <el-table
                    :data="fileList"
                    border
                    :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column
                        prop="fileName"
                        label="文件名"
                        width="240">
                        <template slot-scope="scope">
                            {{ scope.row.attachmentName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fileSize"
                        label="大小">
                        <template slot-scope="scope">
                            {{ calculate(scope.row.fileSize) }}M
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="uploadTime"
                        width="240"
                        label="上传时间">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                    width="160">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="downFile(scope.row)">下载</el-button>
                            <el-button size="mini" @click="deleteFile(scope.row.id.toString())">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
        </div>
    </Modal>
</template>

<script>
import Vue from 'vue'
import util from '@/libs/util'
import {VueCropper} from 'vue-cropper'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import fileDownload from 'js-file-download'
import {deleteFileById, saveStudyFile, findStudyFile} from "@/api/jcxfOrganizationLife";
import {upload} from "@/api/jcxfUpload";
import {uploadFile} from "@/api/minionFile";
import {getFileDateForDown} from "@/api/attachFile";
import {fileByteToBlob} from "@/utils/fileUtils";

export default {
    name: 'studyFile',
    components: {
        ElImageViewer,
        VueCropper,
        // ImagePreview
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
            fileList: [],
            attachFile: {},
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_vs')
            },
            fileTypeArr: ['doc', 'docx', 'ppt', 'pdf'],
            show: false,
            base: util.jcxfUrl
        }
    },
    methods: {
        visibleChange(event) {
            if (!event) {
                this.close()
            }
        },
        // 删除附件
        deleteFile(id) {
            deleteFileById(id).then((res) => {
                if (res.data.code = '00000') {
                    this.$message.success("删除成功")
                    this.queryFile()
                } else {
                    this.$message.error("删除失败")
                }
            })
        },
        downFile(row) {
            window.open(row.attachmentRelativePath);
            // getFileDateForDown(row.attachmentRelativePath).then(res => {
            //     const data = res.data
            //     if (data.code === '00000') {
            //         let result = res.data.data
            //         let blob = fileByteToBlob(result)
            //         let fileName = row.attachmentName
            //         fileDownload(blob, fileName)  //this.fileName 文件名
            //     }
            // })
        },
        //文件大小计算
        calculate(size) {
            let tmp = size / 1024 / 1024
            tmp = tmp.toFixed(2)
            return tmp
        },
        handleUpload(file) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'doc' && name !== 'docx' && name !== 'ppt' && name !== 'pdf') {
                this.$message.error('请选择  doc、docx、ppt、pdf文件类型')
                return false
            }
            if (file.size > 52428800) {
                this.$message.error('文件不能大于50M')
                return false
            }

            file.oneTime = new Date()
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        let fileName = res.data.originalName.split(".");
                        let data = {
                            meetingId: this.meetingId,
                            attachmentName: fileName[0],
                            attachmentRelativePath: res.data.url,
                            attachmentSuffix:fileName[1],
                            attachmentType:1,
                            fileSize: file.size
                        }
                        this.saveFile(data)
                    }
                })
            }
            return false
        },
        uploadSuccess(response, file, fileList) {

        },
        saveFile(data) {
            saveStudyFile({data: data}).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('上传成功')
                    this.queryFile()
                }
            })
        },
        queryFile() {
            findStudyFile(this.meetingId).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.fileList = data.data
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
        reset() {
            this.fileList = []
        }
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.queryFile()
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
        margin-top: 20px;

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
    /deep/.el-table__empty-block{
        height: 0 !important;
    }
    /deep/.el-table__header{
        font-size: 14px !important;
    }
    /deep/.el-table__body{
        font-size: 14px !important;
    }
}
</style>
