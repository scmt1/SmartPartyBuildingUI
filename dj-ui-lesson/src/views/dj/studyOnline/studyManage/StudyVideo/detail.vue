<template>
    <Modal v-model="show"  :closable="false" width="800px">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{ form.title }}</h4>
                <el-row>
<!--                    <el-col :span="6">
                        <div>发布者：{{ form.createBy?form.createBy:'暂无' }}</div>
                    </el-col>-->
                    <el-col :span="12">
                        <div>点击数：{{ form.playCount == null ? 0 : form.palyCounty }}</div>
                    </el-col>
                    <el-col :span="12">
                        <div>发布时间：{{ form.postTime?form.postTime:'暂无' }}</div>
                    </el-col>
<!--                    <el-col :span="6">
                        <div>审核时间：{{ form.processTIme?form.processTIme:'暂无' }}</div>
                    </el-col>-->
                </el-row>
            </div>
            <div class="body">
                <div>栏目：{{ form.columnName }}</div>
                <div style="margin-top: 10px">摘要：{{ form.summary }}</div>
                <videoPlayer :id="new Date().getTime().toString().substring(8)" :url="base + videoUrl" v-if="videoUrl!=null"
                             style="margin-top:10px;width: 100%;border-style:solid;border-width: 0.5px;"></videoPlayer>
                <div style="margin-top: 10px">视频简介：</div>
                <el-input type="textarea" :disabled="true" v-model="form.introduce" :rows="4"></el-input>
                <div style="margin-top: 10px">关 键 字：{{ form.keyword }}</div>
<!--                <div>学分：{{ form.scores }}</div>
                <div>学时：{{ form.hours }}</div>-->
                <template v-if="form.top">
                    <div>置顶顺序：{{ form.topSort }}</div>
                </template>
                <template v-else>
                    <div>置顶轮播：否</div>
                </template>
                <template v-if="form.showHome">
                    <div>首页顺序：{{ form.showHomeSort }}</div>
                </template>
                <template v-else>
                    <div>首页展示：否</div>
                </template>
<!--                <div style="margin-top: 10px">审核状态：{{ convert(form.status) }}</div>-->
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util'
import {VueCropper} from 'vue-cropper'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import videoPlayer from '@/views/dj/components/videoPlayer'
import {getTzStudyVideo} from "@/api/tzStudyVideo";

export default {
    name: 'detail',
    components: {
        ElImageViewer,
        VueCropper,
        videoPlayer
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        columnName: {
            type: String
        },
        columnId: {
            type: String
        },
        //父组件传来的id
        id1: {
            type: String
        }
    },
    data() {
        return {
            base: util.nginxUrl,
            videoUrl: null,
            show: this.value,
            formLabelWidth: '100px',
            form: {
                name: '',
                hours: '',
                title: ''
            }
        }
    },
    methods: {
        convert(status) {
            if (status == 0) {
                return '未发布'
            } else if (status == 1) {
                return '待审核'
            } else if (status == 2) {
                return '已审核'
            }
        },
        close() {
            this.videoUrl = null
            this.show = false
            this.$emit('close')
        },
        getDataById(id) {
            getTzStudyVideo(id).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.form = data.data.studyVideo
                    if (data.data.video != null && data.data.video != undefined) {
                        this.videoUrl = data.data.video.filePath
                    }
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.getDataById(this.id1)
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
