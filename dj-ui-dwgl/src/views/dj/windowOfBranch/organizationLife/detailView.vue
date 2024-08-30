<template>
    <div class="con">
        <div @click="back(form)" style="text-align: right;margin: 0 30px;">
            <el-button size="small" class="topBtn" icon="el-icon-arrow-left">返回</el-button>
        </div>

        <div class="container1">
            <el-card class="left">
                <div class="left-card">
                    <div class="left-text-title">
                        <div class="left-title">{{ form.meetingTopic }}</div>
                    </div>
                    <div class="left-text">
                        <div class="text-label">党小组名称：</div>
                        <div class="text-value">{{ form.deptName }}</div>
                    </div>
                    <div class="left-text">
                        <div class="text-label">主持人：</div>
                        <div class="text-value">{{ form.hostName }}</div>
                    </div>
                    <div class="left-text">
                        <div class="text-label">会议地址：</div>
                        <div class="text-value">{{ form.meetingAddress }}</div>
                    </div>
                    <div class="left-img">
                        <el-image :src="form.imgUrl" class="img" :preview-src-list="[form.imgUrl]"/>
                    </div>
                    <div class="left-text" style="margin-top: 30px" ref="content">
                        <div class="text-label">会议介绍：</div>
                        <div class="text-value" :style="contentStyle">
                            {{ form.intro != null && form.intro != '' ? form.intro : '无' }}
                        </div>
                    </div>
                    <div class="left-text" style="margin-top: 30px" ref="content">
                        <div class="text-label">会议议程：</div>
                        <div class="text-value" :style="contentStyle">
                            {{ form.meetingContent != null && form.meetingContent != '' ? form.meetingContent : '无' }}
                        </div>
                    </div>
                    <div style="width: 90.5%;float: right;display: flex;" v-if="isShow">
                        <a class="toggle-btn" v-if="!isExpanded" @click="toggleContent"
                           style=" display: inline-block;;cursor: pointer;margin-top: 8px;font-size: 15px">{{
                                buttonText
                            }}</a>
                        <a class="toggle-btn" v-else @click="toggleContent"
                           style=" display: inline-block;;cursor: pointer;font-size: 15px">{{ buttonText }}</a>
                    </div>
                    <div style="height: 70px"></div>
                </div>
            </el-card>
            <div class="right">
                <div class="right-card" style="display: flex; flex-direction: column; ">
                    <div style="flex: 1">
                        <div class="right-box">
                            <div style="display: flex;padding-bottom: 10px;border-bottom: 1px solid #e4e7ed;">
                                <div class="right-box-big">参会人员</div>
<!--                                <div class="right-box-small">-->
<!--                                    <span>{{ joinCount }}</span>-->
<!--                                    <span v-if="shouldJoinList != null">/{{ shouldJoinList.length }}</span>人-->
<!--                                </div>-->
                            </div>
                            <div class="right-con" style="max-height: 50%; overflow: auto;display: flex;flex-wrap: wrap;">
                                <template v-if="shouldJoinList != null">
                                    <div class="right-con-avatar" v-for="(item,index) in shouldJoinList" :key="item.id">
                                        <div class="right-con-img">
                                            <img :src="item.avatar" v-if="item.avatar!=null&&item.avatar!=''" :class="item.isJoin ? 'right-con-image' : 'right-con-image2'">
                                            <img :src="online" v-else :class="item.isJoin ? 'right-con-image' : 'right-con-image2'">
                                        </div>
                                        <div class="right-con-name">{{ item.realName }}</div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="right-con-avatar" v-for="(item,index) in joinList" :key="item.id">
                                        <div class="right-con-img">
                                            <img :src="item.avatar" v-if="item.avatar!=null&&item.avatar!=''"
                                                 :class="item.isJoin ? 'right-con-image' : 'right-con-image'">
                                            <img :src="online" v-else
                                                 :class="item.isJoin ? 'right-con-image' : 'right-con-image'">
                                        </div>
                                        <div class="right-con-name">{{ item.partyName }}</div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <div class="right-box" style="margin-top: 20px">
                            <div class="right-box-big" style="padding-bottom: 10px;border-bottom: 1px solid #e4e7ed;margin-left: 0;padding-left: 30px;">会议图片</div>
                            <div class="img-container">
                                <div class="image" v-for="(item,index) in imageList" :key="index">
                                    <el-image :src="item.attachmentRelativePath" class="img-item"
                                              :preview-src-list="[item.attachmentRelativePath]"/>
                                </div>
                                <p v-if="imageList == null || imageList.length == 0" style="color:#333333;font-size: 16px;text-align: center;font-weight: bold;width: 100%;">暂无图片</p>
                            </div>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <div class="right-box" style="margin-top: 20px">
                            <div class="right-box-big" style="padding-bottom: 10px;border-bottom: 1px solid #e4e7ed;margin-left: 0;padding-left: 30px;">会议文件</div>
                            <div class="file-container">
                                <div class="file" v-for="(item,index) in fileList" :key="index">
                                    <div style="display:flex;align-items: center;">
                                        <img :src="file" class="file-item"/>
                                        <div style="margin-left: 10px;font-size: 16px;">{{ item.attachmentName }}</div>
                                    </div>
                                    <div class="down" style="cursor:pointer;margin-right: 5%;font-size: 16px;"
                                         @click="downFile(item.attachmentRelativePath, item.attachmentName)">下载
                                    </div>
                                </div>
                                <p v-if="fileList == null || fileList.length == 0" style="color:#333333;font-size: 16px;text-align: center;font-weight: bold;">暂无文件</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import fileDownload from 'js-file-download'

import axios from 'axios'
import online from "@/assets/organizationLife/online.png"
import indexImg from "@/assets/organization/indexImg.png"
import {getTzOrganizationLife, findStudyFile} from "@/api/jcxfOrganizationLife";
import util from '@/libs/util'
import file from '@/assets/organizationLife/file.png'

export default {
    name: "detailView",
    data() {
        return {
            fileList: [],
            file: file,
            partyMemberList: [],
            list: 20,
            online: online,
            isShow: false,
            isExpanded: false, // 初始状态为收起
            contentHeight: 105,
            indexImg: indexImg,
            form: {
                deptId: '',
                deptName: '',
                meetingId: ''
            },
            should: 0,
            actually: 0,
            imageList: [],
            base: util.jcxfUrl,
            deptName: '',
            shouldJoinList: [],
            joinList: [],
            joinCount: 0,
            host: '',
            recorder: ''
        }
    },
    computed: {
        contentStyle() {
            return {
                maxHeight: this.isExpanded ? 'none' : this.contentHeight + 'px',
                overflow: 'hidden'
            }
        },
        buttonText() {
            return this.isExpanded ? '收起' : '展开'
        }
    },
    created() {
        this.form.deptId = this.$route.query.deptId.toString()
        this.form.deptName = this.$route.query.deptName
        this.deptName = this.$route.query.deptName
        this.form.meetingId = this.$route.query.id
        this.getDateById(this.form.meetingId)
        this.queryFile()
    },
    methods: {
        downFile(url, fileName) {
            window.open(url);
            // axios.get(url, {
            //     responseType: 'blob' //返回的数据类型
            // }).then(res => {
            //     fileDownload(res.data, fileName)  //this.fileName 文件名
            // })
        },
        queryFile() {
            findStudyFile(this.form.meetingId).then((res) => {
                if (res.data.code = '00000') {
                    this.fileList = res.data.data
                }
            })
        },
        toggleContent() {
            this.isExpanded = !this.isExpanded
        },
        back() {
            this.$router.push({
                path: '/dwgl/organizationLife/startMeeting',
                query: {deptId: this.form.deptId, deptName: this.deptName}
            })
        },
        getDateById() {
            getTzOrganizationLife(this.form.deptId, this.form.meetingId).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    this.form = data.data.main
                    this.form.deptName = this.deptName

                    // 会议照片z
                    this.imageList = data.data.imageList

                    // 应参加人员
                    this.shouldJoinList = data.data.shouldJoinList
                    // 实际参加人员
                    this.joinList = data.data.joinList
                    this.joinCount = this.joinList.length

                    //主持人
                    this.host = this.form.host
                    //记录人
                    this.recorder = this.form.recorder

                    if (this.shouldJoinList != null) {
                        for (let i = 0; i < this.shouldJoinList.length; i++) {
                            for (let k = 0; k < this.joinList.length; k++) {
                                if (this.shouldJoinList[i].id == this.joinList[k].id) {
                                    this.shouldJoinList[i].isJoin = true
                                }
                            }
                            if (this.shouldJoinList[i].id == this.host) {
                                this.shouldJoinList[i].isJoin = true
                            }

                            if (this.shouldJoinList[i].id == this.recorder) {
                                this.shouldJoinList[i].isJoin = true
                            }
                        }
                        for (let i = 0; i < this.shouldJoinList.length; i++) {
                            if (this.shouldJoinList[i].isJoin) {
                                this.joinCount++
                            }
                        }
                    }

                }
                this.checkHeight();
            })
        },
        checkHeight() {
            this.$nextTick(() => {
                const contentHeight = this.$refs.content.getBoundingClientRect().height;
                if (contentHeight >= 100) {
                    this.isShow = true
                }
            });
        },
    }

}
</script>

<style lang="scss" scoped>
.file-container {
    margin-top: 25px;

    .file {
        /*float: left;*/
        display: flex;
        align-items: center;
        margin: 10px 10px;
        justify-content: space-between;

        div.down:hover {
            color: #07a2ff;
            cursor: pointer;
        }

        .file-item {

            display: flex;
            cursor: pointer;
            width: 20px;
            height: 20px;
            object-fit: cover;
        }
    }
}

::v-deep .el-card__body {
    padding: 0px;
}

.back-button {
    width: 80px;
    height: 36px;
    opacity: 1;
    border-radius: 5px;
    background: rgba(228, 53, 43, 1);
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    font-weight: 400;
    line-height: 36px;
    cursor: pointer;
}

.con {
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: auto;
    height: calc(100vh - 70px);;
    width: 100%;
}

.container1 {
    display: flex;
    margin: 20px 30px;
    flex: 1;

    .left {
        width: 50%;
        background: rgba(255, 255, 255, 0.7);

        .left-card {
            padding: 0px 20px 0px 20px;
            height: 100%;

            .left-text-title {
                display: flex;
                margin-top: 40px;
                margin-bottom: 10px;

                .left-title {
                    color: #c62536;
                    font-size: 26px;
                    font-weight: 700;
                    color: rgba(204, 49, 35, 1);
                }
            }

            .left-text {
                display: flex;
                margin-top: 10px;

                .text-label {
                    font-size: 18px;
                    color: #858585;
                }

                .text-value {
                    font-size: 18px;
                    color: #222;
                    word-break: break-word;
                    text-align: left;
                    flex: 1;
                }
            }

            .left-img {
                margin-top: 20px;
                text-align: center;

                .img {
                    width: 90%;
                    height:300px;
                }
            }
        }

    }

    .right {
        margin-left: 20px;
        width: 50%;

        .right-card {

            .box-card-item {
                /*width: 50%;*/
                display: flex;

                .box-card-one {
                    margin-left: 10px;
                }

                .box-img {
                    display: inline-block;
                    cursor: pointer;
                    width: 30px;
                    height: 35px;
                    margin: auto 0;
                }
            }

            .right-box {
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
                padding: 10px 0;
                background: rgba(255, 255, 255, 0.7);
                align-items: center;
                border-radius: 5px;

                .right-box-big {
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 0px;
                    color: #65656a;
                    margin-left: 30px;
                }

                .right-box-small {
                    font-size: 18px;
                    font-weight: 700;
                    margin-left: 20px;
                    color: #65656a;
                }
            }

            .right-con {
                overflow-y: auto;

                .right-con-avatar {
                    width: 90px;
                    //float: left;
                    margin: 0 10px 0 10px;

                    .right-con-img {
                        display: flex;
                        justify-content: center;
                        .right-con-image {
                            width: 70px;
                            height: 70px;
                            opacity: 1;
                            background: rgba(238, 234, 235, 1);
                            border-radius: 50%;
                            margin: auto 0;
                            margin-top: 20px;
                        }

                        .right-con-image2 {
                            width: 90px;
                            height: 90px;
                            opacity: 1;
                            background: rgba(192, 189, 190, 0.2);
                            border-radius: 50%;
                            margin: auto 0;
                            margin-top: 20px;
                            filter: grayscale(100%);
                        }

                        .right-con-noimage {
                            margin: 0 auto;
                            border-radius: 50%;
                            width: 50px;
                            height: 50px;
                            opacity: 1;
                            background: rgba(193, 189, 188, 1);
                        }
                    }

                    .right-con-name {
                        font-size: 16px;
                        letter-spacing: 0px;
                        line-height: 32.4px;
                        color: #222;
                        vertical-align: top;
                        text-align: center;
                    }
                }
            }

            .text-img {
                font-weight: bold;
                font-size: 18px;
                color: #af0000;
            }

            .img-container {
                margin: 10px 25px;
                display: flex;
                flex-wrap: wrap;
                .image {
                    margin: 10px 10px;

                    .img-item {
                        display: inline-block;
                        cursor: pointer;
                        width: 150px;
                        height: 90px;
                        object-fit: cover;
                    }
                }
            }


            .left-text {
                display: flex;
                margin-top: 10px;

                .text-label {
                    font-weight: bold;
                    font-size: 14px;
                    color: #65656a;
                    /*width: 100px;*/
                }

                .text-value {
                    font-weight: bold;
                    font-size: 14px;
                    color: #65656a;
                    word-break: break-word;
                    text-align: left;
                    width: 80%;
                }
            }
        }
    }
}
</style>
