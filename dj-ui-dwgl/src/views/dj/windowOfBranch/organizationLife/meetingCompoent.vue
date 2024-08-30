<template>
    <el-dialog :title="title" :visible.sync="show" width="900px" :close-on-click-modal="false" @close="close(false)">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" :disabled="disabled" v-if="show">
            <el-form-item v-if="title=='发起会议'" label="会议类型:" :label-width="formLabelWidth" class="input-row" prop="meetingType">
                <el-radio-group :disabled="editDisabled" v-model="form.meetingType"
                                @input="selectValue" style="margin-top: 10px;width: 250px;">
                    <el-radio v-for="(item, index) in meetingType" :key="index"
                              :label="Number(item.itemValue)">
                        {{ item.label }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-else label="会议类型:" :label-width="formLabelWidth" class="input-row"
                          prop="meetingType">
                {{ convertFiled(form.meetingType, meetingType) }}
            </el-form-item>
            <el-form-item label="三会一课类型:" :label-width="formLabelWidth" class="input-row"
                          prop="classType"
                          v-if="selectShow">
                <el-select :disabled="editDisabled" style="width: 250px;" v-model="form.classType" placeholder="请选择三会一课类型"
                           class="input-row">
                    <el-option v-for="(item, index) in meetingSHYK" :key="index" :label="item.label"
                               :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="会议名称:" :label-width="formLabelWidth" class="input-row"
                          prop="meetingTopic">
                <el-input v-model="form.meetingTopic" style="width: 250px;" placeholder="请输入会议名称"
                          class="input-row"></el-input>
            </el-form-item>
            <el-form-item label="会议地址:" :label-width="formLabelWidth" class="input-row"
                          prop="meetingAddress">
                <el-input v-model="form.meetingAddress" style="width: 250px;" placeholder="请输入会议地址"
                          class="input-row"></el-input>
            </el-form-item>

            <el-form-item label="会议开始时间:" :label-width="formLabelWidth" prop="startTime">
                <el-date-picker
                        style="width: 250px;"
                        @change="(e) => change(e, 'start')"
                        default-value
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="请选择开始时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="input-row">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="会议结束时间:" :label-width="formLabelWidth" prop="endTime">
                <el-date-picker
                        style="width: 250px;"
                        @change="(e) => change(e, 'end')"
                        default-value
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="请选择结束时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="input-row">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="会议介绍:" :label-width="formLabelWidth" class="input-row"
                          prop="intro">
                <el-input v-model="form.intro" style="width: 250px;" placeholder="请输入会议介绍(最多1000字)" type="textarea"
                          rows="5"
                          maxlength="1000"
                          show-word-limit
                          class="input-row"></el-input>
            </el-form-item>
            <el-form-item label="议程:" :label-width="formLabelWidth" class="input-row"
                          prop="meetingContent">
                <el-input v-model="form.meetingContent" style="width: 250px;" placeholder="请输入议程(最多1000字)"
                          rows="5"
                          type="textarea"
                          maxlength="1000"
                          show-word-limit
                          class="input-row"></el-input>
            </el-form-item>
            <el-form-item label="封面图:" :label-width="formLabelWidth" prop="imgUrl">
                <div style="text-align: left;" v-loading="uploadImgLoading">
                    <img :src="defaultImg" v-if="form.imgUrl==null || form.imgUrl==undefined||form.imgUrl.length == 0" style="display: inline-block; cursor: pointer;width: 160px;">
                    <img :src="form.imgUrl" v-else style="display: inline-block; cursor: pointer;width: 160px;">
                </div>
                <Upload
                        v-loading="uploadImgLoading"
                        :disabled="editDisabled"
                        accept=".jpg,.png,.jpeg"
                        ref="upload2"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png']"
                        :max-size="5048"
                        :before-upload="handleUpload"
                        on-change="autographChange"
                        :headers="{Authorization: $cookie.get('Authorization_vs')}"
                        action="#"
                        style="margin-top: 10px;text-align: left;align-items: center;justify-content: center;">
                    <Button type="info" ghost>选择图片</Button>
                </Upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button v-if="!editDisabled" size="small" type="primary" @click="submitForm('form')">保存</el-button>
        </div>

        <cropper ref="cropper" :auto-crop-width="580" :auto-crop-height="340" :fixed="false"
                 @cropperResult="uploadCropperImg"></cropper>
    </el-dialog>

</template>

<script>
import Vue from 'vue'
import util from '@/libs/util'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {addTzOrganizationLife, getTzOrganizationLife, updateTzOrganizationLife} from "@/api/jcxfOrganizationLife";
import {getDictByType2} from "@/api/tDictData";
import defaultImg from "@/assets/defaultImg.png"
import {uploadFile} from "@/api/minionFile";
import cropper from "@/views/dj/components/cropper.vue";

export default {
    name: 'meetingCompoent',
    components: {
        ElImageViewer,
        cropper
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
        },
        editDisabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            test: '',
            selectShow: false,
            defaultImg: defaultImg,
            startTime: '',
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_party_vp')
            },
            data: {deptId: '', deptName: ''},
            id: '',
            show: false,
            disabled: false,
            base: util.jcxfUrl,
            title: '',
            formLabelWidth: '110px',
            form: {
                createBy: '',
                meetingTopic: '',
                startTime: '',
                endTime: '',
                meetingAddress: '',
                meetingContent: '',
                meetingType: '',
                deptId: '',
                intro: '',
                imgUrl: '',
                classType: ''
            },
            rules: {
                meetingType: [
                    {required: true, message: '请选择会议类型', trigger: 'change'}
                ],
                meetingTopic: [
                    {required: true, message: '请输入会议名称', trigger: 'change'}
                ],
                intro: [
                    {required: true, message: '请输入会议介绍', trigger: 'change'}
                ],
                startTime: [
                    {required: true, message: '请选择开始时间', trigger: 'change'}
                ],
                endTime: [
                    {required: true, message: '请选择结束时间', trigger: 'change'}
                ],
                meetingAddress: [
                    {required: true, message: '请输入会议地址', trigger: 'change'}
                ],
                meetingContent: [
                    {required: true, message: '请输入议程', trigger: 'change'}
                ],
                classType: [
                    {required: true, message: '请选择三会一课类型', trigger: 'change'}
                ],
                imgUrl: [
                    {required: true, message: '请选择封面图', trigger: 'change'}
                ]
            },
            meetingType: [],
            meetingSHYK: [],
            uploadImgLoading: false
        }
    },
    mounted() {
        this.getDict('meetingType')
        this.getDict('meetingSHYK')
    },
    methods: {
        convertFiled(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (value == dic[i].itemValue) {
                    return dic[i].label
                }
            }
            return ''
        },
        getDict(type) {
            getDictByType2(type).then(res => {
                let data = res.data
                if (type === 'meetingType') {
                    this.meetingType = data
                } else if (type === 'meetingSHYK') {
                    this.meetingSHYK = data
                }
            })
        },
        selectValue(e) {
            if (e == 1) {
                this.selectShow = true
            } else {
                this.selectShow = false
            }
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
            this.$refs.cropper.init(file)
            return false
        },
        uploadCropperImg(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                this.uploadImgLoading = true
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.imgUrl = res.data.url
                        this.uploadImgLoading = false
                    }
                })
            }
        },
        change(e, type) {
            if (type === 'start') {
                this.startTime = e
            }
            if (type === 'end') {
                this.endTime = e
            }
            if (this.startTime !== null && this.startTime !== '' && this.startTime !== undefined && this.endTime !== null && this.endTime !== '' && this.endTime !== undefined) {
                if (this.startTime > this.endTime) {
                    this.$message.info('请选择正确的时间')
                    this.modal1 = true
                }
            }
        },
        submitForm() {
            // if (this.form.imgUrl == null || this.form.imgUrl == '') {
            //     this.$message.error('请上传图片')
            //     return false
            // }
            this.$nextTick(()=>{
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    if (this.form.meetingType != 1) {
                        this.form.classType = null
                    }
                    this.form.deptId = this.data.deptId
                    let data = this.form

                    let userInformation = JSON.parse(window.localStorage.getItem("userInformation"))

                    if (data.id && data.id.toString().length > 0) {
                        data.updateBy = userInformation.userId + ''
                        updateTzOrganizationLife({data: data}).then(res => {
                            if (res.data.code == '00000') {
                                this.refresh()
                                this.$message.success('保存成功')
                            } else {
                                this.$message.error('保存失败')
                            }
                        }).catch((e) => {
                        })
                    } else {
                        data.createBy = userInformation.userId + ''
                        //data.editType = '1' //1、管理员 2、党员信息
                        addTzOrganizationLife(data).then((res) => {
                            if (res.data.code == '00000') {
                                this.refresh()
                                this.$message.success('保存成功')
                            } else {
                                this.$message.error('保存失败')
                            }
                        })
                    }
                })
            })
        },
        getDateById() {
            getTzOrganizationLife(this.data.deptId, this.id).then((res) => {
                const result = res.data
                if (result.code == '00000') {
                    this.form = result.data.main

                    if (this.form.meetingType == 1) {
                        this.selectShow = true
                    } else {
                        this.selectShow = false
                    }
                }
            })
        },
        close() {
            this.$refs['form'].resetFields()
            this.reset()
            this.$emit('close')
        },
        refresh() {
            this.$refs['form'].resetFields()
            this.reset()
            this.$emit('refresh')
        },
        reset() {
            this.form = {}
            this.disabled = false
            this.title = ''
            this.id = ''
        }
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.data.deptId = this.deptId
                this.data.deptName = this.deptName

                this.title = this.modalTitle
                if (this.title === '编辑') {
                    this.id = this.meetingId
                    this.getDateById()
                } else if (this.title === '发起会议') {
                    this.form.meetingType = 1
                    this.selectShow = true
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-content {
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
            display: flex;

            .col-sm-6 {
                width: 100%;

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
                        width: 100%;
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
