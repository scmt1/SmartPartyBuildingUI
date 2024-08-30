<template>
    <el-dialog :visible.sync="show" :title="title" width="800px" style="min-width: 800px" @close="close" append-to-body top="10vh" class="addVidel">
        <div class="modal-content">
            <div class="body" style="overflow-y: auto;height: 700px;">
                <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" v-if="show" label-width="100px">
                    <div class="row">
                        <div class="col-sm-6">
                            <el-form-item filterable label="选择类型:"  prop="columnId" >
                                <el-select filterable v-model="form.columnId" placeholder="请选择" class="input-row" @change="changeColumnType">
                                    <el-option-group v-for="group in columnList" :key="group.label" :label="group.label">
                                        <el-option  v-for="item in group.options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.useStatus == 1?false:true"></el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="标题:"  prop="title">
                                <el-input :disabled="disabled" v-model="form.title" placeholder="请输入标题(不超过100字符)" maxlength="100" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item v-if="clumnType == '1'" label="主讲人:"  prop="keynoteSpeaker">
                                <el-input :disabled="disabled" v-model="form.keynoteSpeaker" placeholder="请输入主讲人" maxlength="50" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="摘要:"  prop="summary">
                                <el-input v-model="form.summary" placeholder="请输入摘要(不超过100字符)" maxlength="100" class="input-row"></el-input>
                            </el-form-item>
<!--                            <el-form-item label="关键字:"  prop="keyword">
                                <el-input v-model="form.keyword" placeholder="请输入关键字(不超过100字符)" maxlength="100" class="input-row"></el-input>
                            </el-form-item>-->
                            <el-form-item label="来源:"  prop="source">
                                <el-input v-model="form.source" placeholder="请输入来源(不超过50字符)" maxlength="50" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item v-if="clumnType == 1" label="上传视频:" >
                                <Upload
                                    name="file"
                                    accept=".mp4,.MP4"
                                    :format="fileTypeArrVideo"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    :data="data"
                                    action="#"
                                    :show-upload-list="false"
                                    :headers="upHeaders"
                                    :before-upload="handleUploadVideo"
                                    ref="upload">
                                    <div>
                                        <el-input :value="form.videoUrl" placeholder="需要上传的视频" autocomplete="off" style="width:224px;" :disabled="true"></el-input>
                                        <el-button size="small" style="width: 100px;height: 30px">上传视频</el-button>
                                    </div>
                                </Upload>
                                <div v-if="showProgress">
                                    <Progress :percent="progressPercent" :status="progressStatus"></Progress>
                                </div>
                            </el-form-item>
                            <el-form-item v-else label="上传文件:" >
                                <Upload
                                        name="file"
                                        accept=".doc,.pdf,.docx,.ppt"
                                        :format="fileTypeArrFile"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadError"
                                        :data="data"
                                        action='#'
                                        :show-upload-list="false"
                                        :headers="upHeaders"
                                        :before-upload="handleUploadFile"
                                        ref="upload3">
                                    <div>
                                        <el-input :value="form.fileName" placeholder="需要上传的文件" autocomplete="off" :disabled="true" class="input-row"></el-input>
                                        <el-button size="small" style="width: 100px;height: 30px">上传文件</el-button>
                                    </div>
                                </Upload>
                            </el-form-item>
                            <el-form-item label="简介:"  prop="introduce">
                                <el-input v-model="form.introduce" placeholder="请输入简介（不超过500字符）" rows="5" show-word-limit class="input-row" type="textarea" maxlength="500"></el-input>
                            </el-form-item>
                            <el-form-item label="置顶轮播:"  prop="top">
                                <el-switch v-model="form.top" inactive-text="否" active-text="是" :active-value="1" :inactive-value="0" style="margin-top: 12px;"></el-switch>
                            </el-form-item>
                            <el-form-item v-if="form.top == 1" label="置顶顺序:"  prop="topSort">
                                <el-input-number v-model="form.topSort" :min="1" :step="1" placeholder="请输入顺序" class="input-row"></el-input-number>
                            </el-form-item>
                            <el-form-item label="首页展示:"  prop="top">
                                <el-switch v-model="form.showHome" inactive-text="否" active-text="是" :active-value="1" :inactive-value="0" style="margin-top: 12px;"></el-switch>
                            </el-form-item>
                            <el-form-item v-if="form.showHome == 1" label="首页展示顺序:"  prop="topSort">
                                <el-input-number v-model="form.showHomeSort" :min="1" :step="1" placeholder="请输入顺序" class="input-row"></el-input-number>
                            </el-form-item>
                            <el-form-item label="可见类型："  prop="viewType" @change="viewTypeChange">
                                <el-select v-model="form.viewType" placeholder="请选择" class="input-row">
                                    <el-option  v-for="item in viewTypeOption" :key="item.id" :label="item.label" :value="item.itemValue"></el-option>
                                </el-select>
                            </el-form-item>

                            <template v-if="form.viewType == '1'">
                                <el-form-item label="开始时间：" prop="startTime">
                                    <el-date-picker
                                        class="input-row"
                                        v-model="form.startTime"
                                        type="datetime"
                                        placeholder="选择开始时间">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间：" class="input-row" prop="endTime">
                                    <el-date-picker
                                        class="input-row"
                                        v-model="form.endTime"
                                        type="datetime"
                                        placeholder="选择结束时间">
                                    </el-date-picker>
                                </el-form-item>
                            </template>
                        </div>

                        <div class="col-sm-6">
                            <el-form-item label="封面图:" prop="endTime">
                                <div style=" padding: 0 20px;margin-left: 0px">
                                    <div >
                                        <div >
                                            <img :src="defaultImg" v-if="form.imageUrl == null || form.imageUrl == undefined || form.imageUrl.length==0" style="height: 108px; width: 180px;">
                                            <img v-else :src="form.imageUrl" style="height: 108px; width: 180px;">
                                        </div>
                                        <Upload
                                            accept=".jpg,.png,.jpeg"
                                            ref="upload2"
                                            :show-upload-list="false"
                                            :format="['jpg','jpeg','png']"
                                            :max-size="1024 * 10"
                                            :before-upload="(e) =>handleUploadImage(e)"
                                            on-change="autographChange"
                                            :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                            action="#"
                                            style="width:80px;display:inline-block;margin-left: 50px">
                                            <Button :disabled="disabled" type="info" size="default" ghost>选择图片</Button>
                                        </Upload>
                                    </div>
                                </div>
                            </el-form-item>
                            <div v-if="form.videoUrl">
                                <videoPlayer style="max-height: 400px;" :id="new Date().getTime().toString().substring(8)" :url="form.videoUrl" v-if="form.videoUrl!=null && clumnType == 1"></videoPlayer>
                            </div>
                        </div>
                    </div>
                    <div>
                        <el-form-item v-if="isShow" label="内容:" prop="content">
                            <tiny-mce
                                    v-if="!disabled"
                                    v-model="form.content"
                                    ref="content"
                                    style="width: 98%"
                            ></tiny-mce>
                            <div class="preview" v-else >
                                <span v-html="form.content"></span>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm()" v-if="!disabled">保存</el-button>
        </div>

        <cropper ref="cropper" :auto-crop-width="750" :auto-crop-height="480" :fixed="false"
                 @cropperResult="cropperResult"></cropper>

    </el-dialog>
</template>

<script>
import Vue from 'vue'
import util from '@/libs/util'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import videoPlayer from '@/views/dj/components/videoPlayer'
import defaultImg from "@/assets/defaultImg.png"
import {uploadTinymceEditor, uploadVideo} from "@/api/attachFile";
import {saveVideo, getTzStudyVideo} from "@/api/tzStudyVideo";
import {queryAll} from "@/api/tzVideoColumn";
import {getDictByType2} from "@/api/tDictData";
import cropper from "@/views/dj/components/cropper.vue";
import {mapGetters} from "vuex";
import {uploadFile} from "@/api/minionFile";
import TinyMce from '@/components/tiny-mce'
export default {
    name: 'addPayFee',
    components: {
        ElImageViewer,
        videoPlayer,
        TinyMce,
        cropper
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        //父组件传来的id
        id1: {
            type: String
        }
    },
    data() {
        return {
            inputFile:'',
            isShow:false,
            defaultImg: defaultImg,
            upload: {
                look: true, // 控制多文件上传，只触发一次ajax请求
                fileProgressShow: false, // 进度条
                fileProgress: 0 // 进度条进度
            },
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_vs')
            },
            data: {payMonth: '', deptId: '', deptName: ''},
            fileTypeArrVideo: ['MP4', 'mp4'],//文件类型
            fileTypeArrFile: ['doc', 'docx', 'ppt', 'pdf', 'txt'],//文件类型
            id: '',
            show: this.value,
            disabled: false,
            title: '',
            form: {
                columnId: '',
                columnName: '',
                title: '',
                keynoteSpeaker: '',
                summary: '',
                keyword: '',
                source: '',
                scores: 0,
                hours: 0,
                introduce: '',
                content: '',
                top: 0,
                topSort: 1,
                showHome: 0,
                showHomeSort: 1,
                viewType: '1',
                startTime: null,
                entTime: null,
                imageUrl: '',
                fileUrl: '',
                fileName: '',
                videoUrl: ''
            },
            columnList: [
                {
                    label: '图文课程',
                    options: []
                },
                {
                    label: '视频课程',
                    options: []
                }
            ],
            clumnType: '',
            rules: {},
            viewTypeOption: [],
            progressPercent: 0,
            progressStatus: 'active',
            showProgress: false
        }
    },
    mounted() {
        this.getDict('viewType')
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        visibleChange(event) {
            if (!event) {
                this.close()
            }
        },
        getDict(type) {
          getDictByType2(type).then(res => {
              let data = res.data
              if (type == 'viewType') {
                  this.viewTypeOption = data
              }
          })
        },
        viewTypeChange() {
            this.rules = this.getRules()
        },
        getRules() {
            let data = {}
            if (this.form.viewType == '1') {
                data = {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                    ],
                    columnId: [
                        {required: true, message: '选择类型不能为空', trigger: 'blur'},
                    ],
                    keynoteSpeaker: [
                        {required: true, message: '主讲人不能为空', trigger: 'blur'},
                    ],
                    introduce: [
                        {required: true, message: '请输入简介', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '请输入内容', trigger: 'blur'},
                    ],
                    viewType: [
                        {required: true, message: '请选择可见类型', trigger: 'blur'},
                    ],
                    startTime: [
                        {required: true, message: '请选择开始时间', trigger: 'blur'},
                    ],
                    endTime: [
                        {required: true, message: '请选择结束时间', trigger: 'blur'},
                    ]
                }
            } else if (this.form.viewType == '2') {
                data = {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                    ],
                    columnId: [
                        {required: true, message: '选择类型不能为空', trigger: 'blur'},
                    ],
                    keynoteSpeaker: [
                        {required: true, message: '主讲人不能为空', trigger: 'blur'},
                    ],
                    introduce: [
                        {required: true, message: '请输入简介', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '请输入内容', trigger: 'blur'},
                    ],
                    viewType: [
                        {required: true, message: '请选择可见类型', trigger: 'blur'},
                    ]
                }
            }
            return data
        },
        handleUploadFile(file) {
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
                        this.form.fileUrl = res.data.url
                        this.form.fileName = file.name
                    }
                })
            }
            return false
        },
        returnValue(e){
            this.form.content = e
        },
        changeColumnType(event) {
            for (let i = 0; i < this.columnList.length; i++) {
                const va = this.columnList[i]
                for (let j = 0; j < va.options.length; j++) {
                    const va2 = va.options[j]
                    if (event == va2.id) {
                        this.clumnType = i
                        break
                    }
                }
            }
        },
        handleUploadImage(file) {
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
            if (file.size > 5242880 * 2) {
                this.$message({
                    message: '文件不能大于10M',
                    type: 'error',
                    //duration: 1000
                })
                return false
            }

            this.$refs.cropper.init(file)
            return false
        },
        cropperResult(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.imageUrl = res.data.url
                    }
                })
            }
        },
        handleUploadVideo(file) {
            let tmp = file.name.split('.')
            let name = tmp[tmp.length - 1]
            if (name !== 'mp4' && name !== 'Mp4') {
                this.$message.error('请选择mp4文件类型')
                return false
            }
            file.oneTime = new Date()
            this.showProgress = true;
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.videoUrl = res.data.url
                        this.progressPercent = 100;
                        this.progressStatus = 'success';
                    }
                })
            }
            return false
        },
        submitForm() {
            if (this.clumnType == 1 && (this.form.videoUrl == null || this.form.videoUrl.length == 0)) {
                this.$message.error('请上传视频')
                return
            } else if (this.clumnType == 2 && (this.form.fileUrl == null || this.form.fileUrl.length == 0)) {
                this.$message.error('请上传文件')
                return
            }

            if (this.form.imageUrl == null || this.form.imageUrl.length == 0) {
                this.$message.error('请上传封面图片')
                return false
            }

            if (this.form.viewType == '1') {
                if (!new Date(this.form.startTime).getTime() < new Date(this.form.entTime).getTime()) {
                    this.$message.error('开始时间必须大于结束时间')
                    return
                }
            }

            for (let i = 0; i < this.columnList.length; i++) {
                const va = this.columnList[i]
                for (let j = 0; j < va.options.length; j++) {
                    const va2 = va.options[j]
                    if (va2.id == this.form.columnId) {
                        this.form.columnName = va2.name
                        break
                    }
                }
            }

            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.saveFile()
            })
        },
        uploadSuccess(response, file, fileList) {

        },
        saveFile() {
            let data = {
                tzStudyVideo: this.form,
                deptId: this.deptInfo.id + ''
            }
            saveVideo({data: data}).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('保存成功')
                    this.close()
                } else {
                    this.$message.error(data.msg)
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
            this.form = {
                columnId: '',
                columnName: '',
                title: '',
                keynoteSpeaker: '',
                summary: '',
                keyword: '',
                source: '',
                scores: 0,
                hours: 0,
                introduce: '',
                content: '',
                top: 0,
                topSort: 1,
                showHome: 0,
                showHomeSort: 1,
                viewType: '1',
                startTime: null,
                entTime: null,
                imageUrl: '',
                fileUrl: '',
                fileName: '',
                videoUrl: ''
            }
            this.disabled = false
            this.title = ''
            this.isShow = false
        },
        getDataList() {
            let data = {
                deptId: this.deptInfo.id+''
            }

            this.columnList[0].options = []
            this.columnList[1].options = []

            return new Promise((resolve, reject) =>{
                queryAll({ data: data }).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        for (let i = 0; i < data.data.length; i++) {
                            const item = data.data[i]
                            if (item.type == '1') {
                                this.columnList[0].options.push(item)
                            } else if (item.type == '2') {
                                this.columnList[1].options.push(item)
                            }
                        }
                        //新增时，默认选中第一个类型
                        /*if(!this.form.columnId||this.form.columnId==''){
                            this.form.columnId=this.columnList[0].options[0].id
                        }*/
                    }
                    resolve()
                })
            })
        },
        getDataById(id) {
            getTzStudyVideo(id).then(res =>{
                const data = res.data
                if (data.code == '00000') {
                    this.form = data.data.studyVideo
                    this.isShow = true
                    this.$forceUpdate()
                    if (data.data.video != null && data.data.video != undefined) {
                        if(data.data.video.type==2){
                            this.input = data.data.video.fileName
                            this.clumnType = 1
                        }else if(data.data.video.type==3){
                            this.inputFile = data.data.video.fileName
                            this.clumnType = 2
                        }
                    }

                    this.changeColumnType(this.form.columnId)
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        async init(val) {
            this.show = val
            this.title = this.modalTitle
            //this.$refs.form.resetFields()
            this.progressPercent = 0,
            this.progressStatus = 'active'
            this.showProgress = false
            this.form.videoUrl = ""

            await this.getDataList()
            if (this.title === '新增') {
                this.isShow = true

            } else {
                this.id = this.id1
                this.getDataById(this.id1)
            }
            if(this.title === '详情'){
                this.disabled = true
            }
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.init(val)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.addVidel {
    .preview {
        ::v-deep img {
            width: 100% !important;
        }
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

        .body::-webkit-scrollbar {
            width: 0;
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

                        .input-row {
                            width: 100%;
                        }

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

        /deep/ .el-icon-minus {
            line-height: 38px;
        }

        /deep/ .el-icon-plus {
            line-height: 38px;
        }
    }
}
</style>
