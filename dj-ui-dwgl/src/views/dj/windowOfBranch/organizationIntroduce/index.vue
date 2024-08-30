<template>

    <div class="container-index" v-loading="dataListLoading">
        <tree-and-content>
            <template v-slot:tree>
                <organization-tree @selectByTree="selectByTree" @getDeptId="getDeptId" :loading="dataListLoading"></organization-tree>
            </template>

            <template v-slot:content>
                <div style="margin-bottom: 10px; font-size: 20px;font-weight: bold; text-align: center;">
                    {{ form.deptName }}
                </div>
                <div class="body">

                    <div class="row">
                        <div class="row_left" style="display: flex; flex-direction: column;">
<!--                            <div class="row_left_span">党内表彰:&nbsp;&nbsp;{{ convertFiled(form.demonstrativePartyOrg, 'demonstrativePartyOrg') ? convertFiled(form.demonstrativePartyOrg, 'demonstrativePartyOrg') : '无' }}</div>
                            -->
                            <div v-if="twoBestOneFirstList.length > 0"><b style="color: #464545">表扬/表彰：</b>
                                <div v-for="(item, index) in twoBestOneFirstList" :key="index" style="padding: 5px 10px; font-size: 13px;">
                                    {{ item.updateTime }}<span style="margin-left: 10px">{{ convertFiled(item.commendType, 'twoBestOneFirstCommend') }}</span><br>
                                    {{ convertFiled(item.tableType, 'twoBestOneFirstTable') }}
                                    <template v-if="item.tableType == '1' || item.tableType == '2'">
                                         - {{ JSON.parse(item.partyMemberInfo).realName }}
                                    </template>
                                </div>
                            </div>
                            <div class="row_left_span">
                                <b style="color: #5e5d5d">党员人数:</b>&nbsp;&nbsp;{{ form.partyNum }}名(预备党员{{ form.preCount }}名)</div>
                            <div class="row_left_span">
                                <b style="color: #5e5d5d">入党积极分子:</b>&nbsp;&nbsp;{{ form.activeCount }}
                            </div>
                            <div class="row_left_span">
                                <b style="color: #5e5d5d">本届起始时间:</b>&nbsp;&nbsp;{{ form.thisChangeTime }}
                            </div>
                            <div class="row_left_span">
                                <b style="color: #5e5d5d">本届届满时间:</b>&nbsp;&nbsp;{{ form.thisFinishTime }}
                            </div>
                            <div class="row_left_span">
                                <b style="color: #5e5d5d">党支部标签:</b>&nbsp;&nbsp;
                                <span v-if="selectDeptInfo.tag == null || selectDeptInfo.tag == ''">
                                    无
                                </span>
                                <span v-else>
                                    {{ convertFiled(selectDeptInfo.tag, 'deptTag')?convertFiled(selectDeptInfo.tag, 'deptTag'):'无' }}
                                </span>
                                <el-select v-if="tagFlag && editTagFlag" size="small" clearable v-model="selectDeptInfo.tag" class="input-row" @change="updateDeptTagByDept">
                                    <el-option v-for="(item, index) in deptTagList" :label="item.label" :value="item.itemValue" :key="index"></el-option>
                                </el-select>
                                <el-icon v-if="tagFlag && !editTagFlag" class="el-icon-edit-outline" style="margin-left: 10px; color: red; cursor: pointer;" @click.native="editTagFlag = true"></el-icon>
                                <el-icon v-if="tagFlag && editTagFlag" class="el-icon-circle-close" style="margin-left: 10px; color: red; cursor: pointer;" @click.native="editTagFlag = false"></el-icon>
                            </div>
                        </div>
                        <div class="row_right">
                            <div width="480px" style="line-height: 2;padding: 8px;text-align:center;margin-top: -38px">
                                <div style="margin-left:-15px; height: 100%;">
                                    <div class="row_right_img" v-for="(item,index) in  form.partyInfoList" :key="index">
                                        <img v-if="item.avatar===null||item.avatar.length===0" :src="defaultHeader" class="img" style="object-fit: cover;">
                                        <img :src=" base + item.avatar" v-else class="img" style="object-fit: cover;">
                                        <div>
                                            <p class="row_right_img_p">
                                                {{ item.realName }}
                                            </p>
                                            <p class="row_right_img_p">
                                                {{ convertFiled(item.position, 'position') ? convertFiled(item.position, 'position') : '暂无' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row2">
                        <!--左面部分-->
                        <div class="row2-left">
                            <div class="row2-top">
                                <div>支部介绍</div>
                                <div><el-button class="buttons" size="mini" @click="introEdit">编辑</el-button></div>
                            </div>
                            <div style="margin: 10px; display: flex; flex-direction: column;">
                                <div>
                                    <div v-if="!form.photo || form.photo==null">
                                        <img :src="defaultImg" class="img" style="width: 100%;">
                                    </div>
                                    <div v-else>
                                        <el-image
                                            fit="contain"
                                            style="max-width: 100%; max-height: 350px;"
                                            :src="base + form.photo"
                                            :preview-src-list="[base + form.photo]">
                                        </el-image>
<!--                                        <img :src="base + form.photo" style="max-width: 100%; max-height: 350px;">-->
                                    </div>

                                </div>
                                <div style="font-size: 16px; text-align: left; padding: 5px 5px;">
                                    <div v-if="form.deptIntroduction && form.deptIntroduction !=null && form.deptIntroduction.length > 0">{{ form.deptIntroduction }}</div>
                                    <div v-else style="margin: 30px 0; color: rgb(180,174,174); font-size: 14px;">暂无支部介绍</div>
                                </div>
                            </div>
                        </div>
                        <!--右面部分-->
                        <div class="row2-right">
                            <div class="row2-top">
                                <div>活动阵地</div>
                                <div><el-button class="buttons" size="mini" @click="deptEdit">编辑</el-button></div>
                            </div>
                            <div style="text-align: left; font-size: 16px; padding: 10px 5px; display: flex; flex-direction: column;">
                                <div>
                                    修建日期：{{form.activeDept && form.activeDept.createDate && form.activeDept.createDate!=null ? formartDate(form.activeDept.createDate, 'yyyy-MM-dd') : '暂无' }}
                                </div>
                                <div >
                                    是否是党建示范阵地：{{form.activeDept && form.activeDept.demonstrate && form.activeDept.demonstrate != null&& form.activeDept.demonstrate == 1 ? '是' : '否' }}
                                </div>
                                <div >
                                    面积：{{form.activeDept && form.activeDept.area && form.activeDept.area != null ? form.activeDept.area : '暂无' }}平方米(党组织活动场所面积)
                                </div>
                            </div>

                            <div style="margin-top: 10px;">
                                <el-row :gutter="15">
                                    <el-col :span="8" v-for="(item,index) in form.activeAttachFiles" :key="index">
                                        <img v-if="item.attachFiles===null" :src="defaultImg">
                                        <el-image
                                            fit="contain"
                                            style="width: 100%; aspect-ratio: 5 / 3;"
                                            :src="base + item.photo"
                                            :preview-src-list="[base + item.photo]">
                                        </el-image>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-image-viewer :initial-index=0 v-if="visible" :on-close="closeImg" :url-list="tmp"></el-image-viewer>
                            <div style="margin-top: 15px; padding: 0 5px; font-size:16px">阵地介绍：</div>
                            <div style="margin-left: 15px;margin-top:15px;font-size: 14px;">
                                <span v-if="form.activeDept && form.activeDept.positionIntroduction">{{ form.activeDept.positionIntroduction }}</span>
                                <div v-else style="margin: 30px 0; color: rgb(180,174,174)">暂无阵地介绍</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </tree-and-content>
        <activeEdit v-model="activeEditShow" :deptId="deptId+''" @close="close" @refresh="refresh" :modalTitle="title" :activeId="activeId"></activeEdit>
        <uploadImg v-model="uploadShow" :deptId="deptId+''" @close="close" @refresh="refresh" :modalTitle="title"></uploadImg>
    </div>

</template>
<script>
import organizationTree from '@/views/dj/components/organizationTree'
import activeEdit from '@/views/dj/windowOfBranch/organizationIntroduce/activeEdit'
import uploadImg from '@/views/dj/windowOfBranch/organizationIntroduce/uploadImg'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import util from '@/libs/util'
import {getDeptIntroduceById, updateDeptTag, getTzSysDept} from "@/api/jcxfSysDept";
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import defaultImg from "@/assets/defaultImg.png"
import defaultHeader from "@/assets/default-header.png"
import TreeAndContent from "@/components/TreeAndContent.vue";
import { mapGetters } from 'vuex'

export default {
    components: {
        TreeAndContent,
        organizationTree,
        activeEdit,
        uploadImg,
        ElImageViewer,
    },
    data() {
        return {
            defaultImg: defaultImg,
            defaultHeader: defaultHeader,
            status: true,
            activeId: '',
            base: util.jcxfUrl,
            demonstrativePartyOrg: '',
            visible: false,
            tmp: [],
            uploadShow: false,
            title: '',
            deptId: '',
            activeEditShow: false,
            display: false,
            personTypeList: [],
            positionList: [],
            demonstrativePartyOrgList: [],
            organizationTypeList: [],
            form: {
                demonstrativePartyOrg: null,
                activeCount: null,
                partyInfoList: [],
                deptName: '',
                photo: '',
                activeDept: '',
                thisFinishTime: null,
                thisChangeTime: null,
                activeAttachFiles: [],
                preCount: 0,
                deptIntroduction: ''
            },
            dataListLoading: false,
            dataList: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            // 加载状态
            loading: false,
            twoBestOneFirstList: [],
            twoBestOneFirstCommendList: [],
            twoBestOneFirstTableList: [],
            deptTagList: [],
            selectDeptInfo: {},
            tagFlag: false,
            editTagFlag: false
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo',
        ])
    },
    created() {
        this.getDict('organizationType')
        this.getDict('position')
        this.getDict('personType')
        this.getDict('rangeType')
        this.getDict2('twoBestOneFirstCommend')
        this.getDict2('twoBestOneFirstTable')
        this.getDict2('deptTag')
    },
    methods: {
        updateDeptTagByDept(tag) {
            let data = {
                id: this.deptId + '',
                tag: tag + ''
            }
            updateDeptTag(data).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.$message.success('保存成功')
                    this.editTagFlag = false
                    this.getDataById()
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        getDeptId(data) {
            this.deptId = data.deptId
            this.getDataById()
        },
        // 表格部分数据字段显示转换
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'demonstrativePartyOrg') {
                this.demonstrativePartyOrgList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type == 'position') {
                this.positionList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type === 'twoBestOneFirstCommend') {
                this.twoBestOneFirstCommendList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type === 'twoBestOneFirstTable') {
                this.twoBestOneFirstTableList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            } else if (type === 'deptTag') {
                this.deptTagList.forEach(i => {
                    if (i.itemValue == row) {
                        tmp = i.label
                    }
                })
            }
            return tmp
        },
        refresh() {
            this.activeEditShow = false
            this.uploadShow = false
            this.getDataById()
        },
        close() {
            this.activeEditShow = false
            this.uploadShow = false
        },
        imgView() {
            this.visible = true
        },
        closeImg() {
            this.visible = false
        },
        introEdit() {
            this.uploadShow = true
            this.title = '支部介绍编辑'
        },
        deptEdit() {
            this.activeEditShow = true
            this.title = '阵地介绍编辑'
        },
        selectByTree(data) {
            this.deptId = data.whereMap.deptId.toString()
            this.getDataById()
        },
        // 获取分页信息
        getDataById() {
            this.dataListLoading = true

            getTzSysDept(this.deptId).then(res => {
                if (res.data.code == '00000') {
                    this.selectDeptInfo = res.data.data
                }
            })
            getDeptIntroduceById(this.deptId).then(res =>{
                if (res.data.code == '00000') {
                    const data = res.data.data

                    this.twoBestOneFirstList = data.deptInfo.tzTwoBestOneFirstList

                    this.form.photo = data.deptInfo.deptPhoto
                    this.form.demonstrativePartyOrg = data.deptInfo.demonstrativePartyOrg
                    this.form.activeCount = data.activeCount
                    this.form.partyInfoList = data.partyInfoList
                    this.form.deptName = data.deptInfo.name
                    this.form.activeDept = data.activeDept
                    if (data.thisFinishTime && data.thisFinishTime != null) {
                        this.form.thisFinishTime = this.formartDate(data.thisFinishTime, 'yyyy-MM-dd')
                    } else {
                        this.form.thisFinishTime = '———'
                    }
                    if (data.thisChangeTime && data.thisChangeTime != null) {
                        this.form.thisChangeTime = this.formartDate(data.thisChangeTime, 'yyyy-MM-dd')
                    } else {
                        this.form.thisChangeTime = '———'
                    }

                    this.form.activeAttachFiles = data.activeAttachFiles
                    /*this.tmp = []
                    if (this.form.activeAttachFiles != null) {
                        this.form.activeAttachFiles.forEach(i => {
                            this.tmp.push(this.base + i.filePath)
                        })
                    }*/

                    if (this.form.activeDept == null) {
                        this.activeId = ''
                    } else {
                        this.activeId = this.form.activeDept.id.toString()
                    }
                    if (this.form.partyInfoList != null && this.form.partyInfoList.length > 0) {
                        this.form.partyNum = this.form.partyInfoList.length
                    } else {
                        this.form.partyNum = 0
                    }
                    this.form.preCount = data.preCount
                    this.form.deptIntroduction = data.deptIntroduction
                }
              /*  if (this.status === false) {
                    this.dataListLoading = false
                }*/
                this.dataListLoading = false
                this.$forceUpdate()
            }).catch(e => {
                this.dataListLoading = false
            })
        },
        getDict(type) {
            let tmp = []
            getDictByCode(type).then(res =>{
                let data = res.data.data
                if (type === 'organizationType') {
                    this.organizationTypeList = data
                } else if (type === 'position') {
                    this.positionList = data
                } else if (type === 'personType') {
                    this.personTypeList = data
                } else if (type === 'rangeType') {
                    this.demonstrativePartyOrgList = data
                }
            })
            return tmp
        },
        getDict2(type) {
            let tmp = []
            getDictByType2(type).then(res =>{
                let data = res.data
                if (type === 'twoBestOneFirstCommend') {
                    this.twoBestOneFirstCommendList = data
                } else if (type === 'twoBestOneFirstTable') {
                    this.twoBestOneFirstTableList = data
                } else if (type === 'deptTag') {
                    this.deptTagList = data
                }
            })
            return tmp
        },
        formartDate(date, fmt) {
            if (date == undefined || date == null || date.toString().trim().length <= 0) {
                return ''
            }
            if (typeof date === 'string') {
                date = new Date(date)
            }
            date = date == undefined ? new Date() : date
            date = typeof date == 'number' ? new Date(date) : date
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
            let obj = {
                'y': date.getFullYear(), // 年份，注意必须用getFullYear
                'M': date.getMonth() + 1, // 月份，注意是从0-11
                'd': date.getDate(), // 日期
                'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                'w': date.getDay(), // 星期，注意是0-6
                'H': date.getHours(), // 24小时制
                'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                'm': date.getMinutes(), // 分钟
                's': date.getSeconds(), // 秒
                'S': date.getMilliseconds() // 毫秒
            }
            let week = ['天', '一', '二', '三', '四', '五', '六']
            for (let i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    let val = obj[i] + ''
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
                    for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
    },
    watch: {
        deptInfo: {
            handler(nval, oval) {
                if(this.deptInfo.buttonRole){
                    const buttonRole = this.deptInfo.buttonRole.split(',')
                    if (buttonRole.indexOf('deptTag') > -1) {
                        this.tagFlag = true
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
.container-index {
    background-color: white;
    .body {
        .row {
            border-style: solid solid none;
            border-width: 1px 0px 0px 0px;
            border-color: #e7eaec;
            display: flex;
            flex-direction: row;
            padding: 10px 20px;

            .row_left {
                font-size: 16px;
                width: 260px;

                .row_left_span {
                    display: inline-block;
                    text-align: left;
                    margin-top: 5px;
                }

            }

            .row_right {
                width: calc(100% - 260px);
                max-height: 400px;
                overflow: auto;

                .row_right_img {
                    text-align: center;
                    margin-left: 20px;
                    margin-bottom: 10px;
                    float: left;
                    margin-top: 40px;
                    height: 100px;

                    .img {
                        display: inline-block;
                        // cursor: pointer;
                        width: 90px;
                        height: 90px
                    }

                    .row_right_img_p {
                        margin-top: 2px;
                        line-height: 15px;
                        margin-bottom: 2px
                    }
                }
            }
        }

        .row2 {
            width: 100%;
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            padding: 0 10px;
            text-align: left;

            .row2-left {
                width: 40%;
                height: auto;
                border-style: solid solid none;
                border-width: 4px 0px 0;
                border-color: #e7eaec;
            }

            .row2-top {
                display: flex;
                flex-direction: row;
                padding: 5px 10px;
                align-items: center;
                border-bottom: 1px solid rgb(230, 230, 230);
                font-size: 16px;
            }

            .row2-right {
                width: calc(60% - 10px);
                margin-left: 10px;
                height: auto;
                border-style: solid solid none;
                border-width: 4px 0px 0;
                border-color: #e7eaec;

                img {
                    width: 100%;
                }
            }

            .buttons {
                margin-left: 15px;
                padding: 5px 8px;
                color: #a68f7f;
                border-color: #a68f7f;
            }

        }

    }
}

.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-center-modal .ivu-modal {
    top: 0;
}

.amount {
    color: #31708f;
    font-size: 15px;
    margin-left: 20px;
    margin-right: 100px;
    margin-top: 20px;
}

.search {
    width: 92%;
    //margin-left: 20px;
    margin-top: 10px;
}

.tree {
    margin-left: 20px;
    margin-top: 20px;
}

.partyMember {

    .el-dialog el-dialog--center {

        ::v-deep.el-dialog__body {
            padding: 25px 25px 11px
        }

    }
}

.cells {
    color: red;
}
</style>
