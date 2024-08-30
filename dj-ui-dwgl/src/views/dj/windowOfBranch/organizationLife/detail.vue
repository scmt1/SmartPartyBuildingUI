<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="40%">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">会议参与情况</h4>
            </div>
            <div class="body">
                <table class="table" border="1"
                       align='center'
                       cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td width="100px"
                            style="line-height: 2;border-top: 1px solid #e7eaec;padding: 8px;vertical-align: middle;text-align:center">
                            单位地址
                        </td>
                        <td width="480px" style="line-height: 2;text-align:center;padding: 8px;" colspan="3">
                            {{ form.addr }}
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">会议名称</td>
                        <td width="480px" style="line-height: 2;padding: 8px;text-align:center" colspan="3">
                            {{ form.meetingName }}
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">党小组名称</td>
                        <td width="480px" style="line-height: 2;padding: 8px;text-align:center" colspan="3">
                            {{ form.deptName }}
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">主持人</td>
                        <td width="240px" style="line-height: 2;padding: 8px;text-align:center">
                            <template v-for="(item, index) in personMeetList" >
                                <template v-if="item.deptId == form.deptId">
                                    <template v-for="(member, index2) in meetPartyMemberList" >
                                        <template  v-if="member.id == item.host">
                                            {{ member.realName }}
                                        </template>
                                    </template>
                                </template>
                            </template>
<!--                            {{ form.host }}-->
                        </td>
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">记录人</td>
                        <td width="240px" style="line-height: 2;padding: 8px;text-align:center">
                            <template v-for="(item, index) in personMeetList" >
                                <template v-if="item.deptId == form.deptId">
                                    <template v-for="(member, index2) in meetPartyMemberList" >
                                        <template  v-if="member.id == item.record">
                                            {{ member.realName }}
                                        </template>
                                    </template>
                                </template>
                            </template>
<!--                            {{ form.record }}-->
                        </td>
                    </tr>
                    <tr style="height: 120px">
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">参加人员</td>
                        <td width="480px" style="line-height: 2;padding: 8px;text-align:left" colspan="3">
                            (本支部)<br>
                            <template v-for="(item, index) in personMeetList" >
                                <template v-if="item.deptId == form.deptId">
                                    <template v-for="(member, index2) in meetPartyMemberList" >
                                        <template  v-if="item.joins.split(',').indexOf(member.id+'') > -1">
                                            {{ member.realName }}
                                        </template>
                                    </template>
                                </template>
                            </template>
                            <br>
                            (其他支部)<br>
                            <template v-for="(item, index) in personMeetList" >
                                <template v-if="item.deptId != form.deptId">
                                    <template v-for="(member, index2) in meetPartyMemberList" >
                                        <template  v-if="item.joins.split(',').indexOf(member.id+'') > -1">
                                            {{ member.realName }}
                                        </template>
                                    </template>
                                </template>
                            </template>
<!--                            {{ form.joins }}-->
                        </td>
                    </tr>
                    <tr style="height: 120px">
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">缺席人员</td>
                        <td width="480px" style="line-height: 2;padding: 8px;text-align: left" colspan="3">
                            (本支部)<br>
                            <template v-for="(item, index) in personMeetList" >
                                <template v-if="item.deptId == form.deptId">
                                    <template v-for="(member, index2) in meetPartyMemberList" >
                                        <template  v-if="item.absent.split(',').indexOf(member.id+'') > -1">
                                            {{ member.realName }}
                                        </template>
                                    </template>
                                </template>
                            </template>
                            <br>
                            (其他支部)<br>
                            <template v-for="(item, index) in personMeetList" >
                                <template v-if="item.deptId != form.deptId">
                                    <template v-for="(member, index2) in meetPartyMemberList" >
                                        <template  v-if="item.absent.split(',').indexOf(member.id+'') > -1">
                                            {{ member.realName }}
                                        </template>
                                    </template>
                                </template>
                            </template>
<!--                            {{ form.absence }}-->
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">应到人数</td>
                        <td width="240px" style="line-height: 2;padding: 8px;text-align:center">{{ should }}</td>
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">实到人数</td>
                        <td width="240px" style="line-height: 2;padding: 8px;text-align:center">{{ actually }}</td>
                    </tr>
                    <tr style="height: 120px">
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">会议照片</td>
                        <td width="480px" style="line-height: 2;padding: 8px;text-align:center" colspan="3">
                            <div style="margin-left:-15px; height: 100%;overflow: hidden;">
                                <div v-for="(item,index) in imageList" :key="index" style="text-align: center; width: 50%; padding-left: 20px; float: left; overflow: hidden;margin-top: 10px;height:180px">
                                    <el-image
                                        style=" display: inline-block;cursor: pointer;width: auto;height: 100%!important;"
                                        :src="base + item"
                                        :preview-src-list="tmp">
                                    </el-image>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr style="height: 120px">
                        <td width="100px" style="line-height: 2;padding: 8px;text-align:center">
                            <p> 会议记录</p>
                            <div @click="editRecord()" v-if="disabled" style=";background-color: #9f826e; color: #FFFFFF;text-align: center; margin:auto;width:40px;height:22px;white-space: nowrap;
                   vertical-align: baseline;border-radius: .25em;">
                                <span>编辑</span>
                            </div>
                            <div style="display: flex">
                                <div @click="cancelRecord()" v-if="!disabled" style=";background-color: #9f826e; color: #FFFFFF;text-align: center; margin:auto;width:40px;height:22px;white-space: nowrap;
                   vertical-align: baseline;border-radius: .25em;">
                                    <span>取消</span>
                                </div>
                                <div @click="saveRecord()" v-if="!disabled" style=";background-color: #9f826e; color: #FFFFFF;text-align: center; margin:auto;width:40px;height:22px;white-space: nowrap;
                   vertical-align: baseline;border-radius: .25em;">
                                    <span>保存</span>
                                </div>
                            </div>
                        </td>
                        <td width="480px" style="line-height: 2;padding: 8px;text-align:center" colspan="3">
                            <p>会议记录内容</p>
                            <div>
                                <textarea :disabled="disabled" v-model="form.meetingContent"
                                          placeholder="请输入情况记录（不超过5000字符）" rows="10"
                                          maxlength="5000"
                                          style="width: 100%">
                                </textarea>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
        </div>
        <uploadImg v-model="uploadShow" :deptId="deptId" :meetingId="id" @close="close" :modalTitle="title"></uploadImg>
    </Modal>
</template>

<script>
import util from '@/libs/util'
import uploadImg from '@/views/dj/windowOfBranch/organizationLife/uploadImg'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {updateTzOrganizationLife} from "@/api/jcxfOrganizationLife";
import {getTzOrganizationLife} from "@/api/jcxfOrganizationLife";


export default {
    name: 'meetingCompoent',
    components: {
        uploadImg,
        ElImageViewer
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
            uploadShow: false,
            imageList: [],
            should: '',
            actually: 0,
            host: '',
            record: '',
            joins: '',
            absent: '',
            sick: '',
            common: '',
            thing: '',
            later: '',
            flow: '',
            id: '',
            show: this.value,
            ids: [],
            tmp: [],
            image: '',
            visible: false,
            imgName: '',
            disabled: true,
            base: util.nginxUrl,
            type: '',
            title: '',
            formLabelWidth: '100px',
            dialogFormVisible: true,
            form: {
                meetingName: '',
                startTime: '',
                endTime: '',
                addr: '',
                meetingContent: '',
                meetingType: '',
                deptId: '',
                deptName: '',
                meetingId: '',
                joins: '',
                absent: '',
                sick: '',
                common: '',
                thing: '',
                later: '',
                flow: '',
                record: '',
                host: ''
            },
            personMeetList: [],
            meetPartyMemberList: []
        }
    },
    methods: {
        imgView(v) {
            this.visible = true
        },
        closeImg() {
            this.visible = false
        },
        submitForm() {
            let data = {'id': this.id, 'meetingContent': this.form.meetingContent}
            data = JSON.stringify(data)
            updateTzOrganizationLife(data)
                .then((res) => {
                    this.visible = false
                    if (res.data) {
                        this.$message({
                            message: this.$i18n.t('保存成功'),
                            type: 'success',
                            //duration: 1000
                        })
                    } else {
                        this.$message({
                            message: this.$i18n.t('保存失败'),
                            type: 'error',
                            //duration: 1000
                        })
                    }
                })
        },
        uploadImg() {
            this.uploadShow = true
            this.close()
        },
        saveRecord() {
            this.disabled = true
            this.submitForm()
        },
        cancelRecord() {
            this.disabled = true
        },
        editRecord() {
            this.disabled = false
        },
        getDateById(id) {
            let data = {}
            data.id = id
            getTzOrganizationLife(this.form.deptId, this.form.meetingId).then((res) => {
                this.form = res.data.data.main
                this.should = res.data.data.main.nameList.length

                this.personMeetList = res.data.data.personMeetList
                this.meetPartyMemberList = res.data.data.meetPartyMemberList

                for (let i = 0; i < this.personMeetList.length; i++) {
                    const item = this.personMeetList[i]
                    if (item.deptId == this.form.deptId) {
                        for (let j = 0; j < this.meetPartyMemberList.length; j++) {
                            const member = this.meetPartyMemberList[j]
                            if(item.joins.split(',').indexOf(member.id+'') > -1) {
                                this.actually ++
                            }
                        }
                    }
                }
                /*if (res.data.data.main.joins != null && res.data.data.main.joins != undefined) {
                    let arr = res.data.data.main.joins.split(',')
                    this.actually = arr.length - 1
                }*/
                if (res.data.data.main.attachFile != null) {
                    res.data.data.main.attachFile.forEach(i => {
                        this.imageList.push(i.filePath)
                        this.tmp.push(this.base + i.filePath)
                    })
                }
            })
        },
        close() {
            this.reset()
            this.show = false
            this.$emit('input', false)
            this.$emit('close')
        },

        reset() {
            this.disabled = true
            this.actually = ''
            this.should = ''
            this.imageList = []
            this.form = []
            this.input = ''
            this.title = ''
            this.form = {
                mode: '1'
            }
        },
        closeModal(val) {
            this.$emit('close')
            this.$emit('input', false)
        },
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
            }
        },
        show(val) {
            if (val) {
                this.id = this.meetingId
                this.form.meetingId = this.meetingId
                this.form.deptId = this.deptId
                this.getDateById(this.form.meetingId)
            } else {
                // this.closeModal(val)
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
        border: 1px solid white;
        border-top-color: black;

        .table {
            //font-size: 10px;
            border: 1px solid #EBEBEB;
            border-spacing: 0;
            border-collapse: collapse;
        }

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
