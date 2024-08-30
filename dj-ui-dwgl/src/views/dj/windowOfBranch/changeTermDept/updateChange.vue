<template>
    <Modal v-model="show" :title="title" :mask-closable="false" :closable="false" width="900px">
        <div class="modal-content">
            <div class="body">
                <el-form ref="form" :model="form" :inline="true" :rules="rules" :disabled="disabled">
                    <el-form-item label="班子届次:" :label-width="formLabelWidth" prop="teamSession"
                                  class="input-row">
                        <el-input-number v-model="form.teamSession" placeholder="班子届次"
                                         class="input-row" :min="1" style="width: 220px;"
                                         :disabled="editStatus"></el-input-number>
                    </el-form-item>
                    <el-form-item label="是否首届:" :label-width="formLabelWidth" prop="isFirst">
                        <el-radio-group v-model="form.isFirst" style="margin-top: 12px;" @change="radioChange">
                            <el-radio :label=0>否</el-radio>
                            <el-radio :label=1>是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="上次换届时间:" v-if="form.isFirst==0" :label-width="formLabelWidth"
                                  prop="lastSessionFinishTime" class="label">
                        <el-date-picker
                            style="width: 220px;"
                                v-model="form.lastSessionFinishTime"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                class="input-row">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="本次起始时间:" :label-width="formLabelWidth"
                                  prop="thisSessionStartTime" class="label">
                        <el-date-picker
                            style="width: 220px;"
                                @change=changevalue
                                v-model="form.thisSessionStartTime"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                class="input-row">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="本届届满时间:" :label-width="formLabelWidth"
                                  prop="thisSessionFinishTime" class="label">
                        <el-date-picker
                            style="width: 220px;"
                                v-model="form.thisSessionFinishTime"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                class="input-row">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="选举方式:" :label-width="formLabelWidth" prop="voteType">
                        <el-select v-model="form.voteType" placeholder="请选择" class="input-row" style="width: 220px;">
                            <el-option v-for="(item,index) in electTypeList" :key="index" :label="item.label"
                                       :value="parseInt(item.itemValue)"></el-option>
                        </el-select>
                    </el-form-item>

<!--                            <el-form-item v-for="(item,index) in positionList" :label="item.label" :key="index" :label-width="formLabelWidth" class="label">-->
<!--                                <el-select v-model="item.value" placeholder="请选择" class="input-row">-->
<!--                                    <el-option v-for="pitem in partyMemberList" :key="String(pitem.id)" :label="pitem.realName" :value="String(pitem.id)"></el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->

                    <el-form-item label="书记:" :label-width="formLabelWidth" prop="secretary">
                        <el-select v-model="form.secretary" placeholder="请选择" class="input-row" style="width: 220px;" filterable>
                            <el-option v-for="pitem in partyMemberList" :key="String(pitem.id)" :label="pitem.realName" :value="String(pitem.id)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="副书记:" :label-width="formLabelWidth" prop="deputySecretary">
                        <el-select v-model="form.deputySecretary" placeholder="请选择" style="width: 220px;" class="input-row" filterable>
                            <el-option v-for="pitem in partyMemberList" :key="String(pitem.id)" :label="pitem.realName" :value="String(pitem.id)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="组织委员:" :label-width="formLabelWidth" prop="committeeMember">
                        <el-select v-model="form.committeeMember" placeholder="请选择" style="width: 220px;" class="input-row" filterable>
                            <el-option v-for="pitem in partyMemberList" :key="String(pitem.id)" :label="pitem.realName" :value="String(pitem.id)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="纪检委员:" :label-width="formLabelWidth" prop="diCommitteeMember">
                        <el-select v-model="form.diCommitteeMember" placeholder="请选择" style="width: 220px;" class="input-row" filterable>
                            <el-option v-for="pitem in partyMemberList" :key="String(pitem.id)" :label="pitem.realName" :value="String(pitem.id)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宣传委员:" :label-width="formLabelWidth" prop="publicityCommitteeMember">
                        <el-select v-model="form.publicityCommitteeMember" placeholder="请选择" style="width: 220px;" class="input-row" filterable>
                            <el-option v-for="pitem in partyMemberList" :key="String(pitem.id)" :label="pitem.realName" :value="String(pitem.id)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="其他委员:" :label-width="formLabelWidth" prop="otherMembers">
                        <el-select v-model="otherMembersList" multiple placeholder="请选择" style="width: 220px;" class="input-row" filterable>
                            <el-option v-for="pitem in partyMemberList" :key="String(pitem.id)" :label="pitem.realName" :value="String(pitem.id)"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close()">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')" v-if="!disabled">保存</el-button>
        </div>
<!--        <el-drawer-->
<!--                :modal="false"-->
<!--                title="选择领导班子"-->
<!--                :visible.sync="joinVisible"-->
<!--                size="460px">-->
<!--            <div class="row_right">-->
<!--                <div style="line-height: 2;padding: 30px;text-align:center;margin-top: -38px">-->
<!--                    <div v-if="personList !=null && personList.length > 0" style="margin-left:-15px; height: 100%;">-->
<!--                        <el-checkbox-group v-model="personIds" @change="changeBox">-->
<!--                            <div class="row_right_img" v-for="(item,index) in  personList" :key="index">-->
<!--                                <label>-->
<!--                                    <img v-if="item.avatar===null||item.avatar.length===0" :src="defaultHeader"-->
<!--                                         class="img"-->
<!--                                         style="object-fit: cover;">-->
<!--                                    <img :src=" base + item.avatar" v-else class="img" style="object-fit: cover;">-->
<!--                                    <div>-->
<!--                                        <p class="row_right_img_p">-->
<!--                                            <el-checkbox :label="item.id+''" :name="item.realName">-->
<!--                                                {{ item.realName }}<br>-->
<!--                                                {{ item.phone }}-->
<!--                                            </el-checkbox>-->
<!--                                        </p>-->
<!--                                    </div>-->
<!--                                </label>-->
<!--                            </div>-->
<!--                        </el-checkbox-group>-->
<!--                    </div>-->
<!--                    <el-empty v-else description="暂无数据"></el-empty>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div style="float: left;text-align: center; width: 100%; margin-top: 30px; margin-bottom: 10px;">-->
<!--                <el-button @click="joinVisible = false" size="small">取消</el-button>-->
<!--                <el-button type="primary" @click="saveLeaders" size="small">保存</el-button>-->
<!--            </div>-->
<!--        </el-drawer>-->
    </Modal>

</template>

<script>
import {queryOneselfPartyMemberList} from "@/api/jcxfPartyMember";
import util from '@/libs/util'
import {addTzTermDept, getTzTermDept} from "@/api/jcxfTermDept";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import defaultHeader from "@/assets/default-header.png"
import {getPartMemberListByDeptId} from "@/api/jcxfPartyMember";
export default {
    name: 'updateDevelop',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        parentId: {
            type: String,
            default: ''
        },
        partyId: {
            type: String,
            default: ''
        },
        modalTitle: {
            type: String
        }
    },
    data() {
        return {
            leadersNames: '',
            defaultHeader: defaultHeader,
            personIds: [],
            joinVisible: false,
            personList: [],
            editStatus: false,
            eyPara: {
                amErrYear: ''
            },
            radio: 3,
            previewShow: false,
            id: '',
            deptId: '',
            show: this.value,
            ids: [],
            tmp: [],
            image: '',
            visible: false,
            imgName: '',
            disabled: false,
            base: util.nginxUrl,
            type: '',
            title: '',
            modal1: false,
            developStateList: [],
            workPositionList: [],
            partyStateList: [],
            personTypeList: [],
            positionList: [],
            educationList: [],
            electTypeList: [],
            nationList: [],
            sexList: [{'name': '男', 'value': 1}, {'name': '女', 'value': 2}],
            formLabelWidth: '130px',
            dialogFormVisible: true,
            otherMembersList: [],
            form: {
                deptId: '',
                isFirst: 0,
                teamSession: '',
                lastSessionFinishTime: '',
                thisSessionStartTime: '',
                thisSessionFinishTime: '',
                voteType: '',
                leadersNames: '',

                positionMember: '',

                secretary: '',
                deputySecretary: '',
                committeeMember: '',
                diCommitteeMember: '',
                publicityCommitteeMember: '',
                otherMembers: '',
            },
            rules: {
                thisSessionStartTime: [
                    {required: true, message: '请选择本次起始时间', trigger: 'change'}
                ],
                thisSessionFinishTime: [
                    {required: true, message: '请选择本届届满时间', trigger: 'change'}
                ],
                lastSessionFinishTime: [
                    {required: true, message: '请选择上次换届时间', trigger: 'change'}
                ],
                voteType: [
                    {required: true, message: '请选择选举方式', trigger: 'change'}
                ],
                teamSession: [
                    // {required: true, message: '请输入届次', trigger: 'blur'},
                    {
                        validator: (rule, value, callback) => {
                            if (/^(?:[1-9]\d*)$/.test(value) == false) {
                                callback(new Error('请输入正整数'))
                            } else {
                                callback()
                            }
                        },
                        trigger: 'change'
                    }
                ]
            },
            partyMemberList: []
        }
    },
    methods: {
        radioChange(e) {
            if(e == 1) {
                this.form.teamSession = 1;
            }
        },
        changeBox(e) {
            let tmp = ''
            for (let id of this.personIds) {
                const selectedPerson = this.personList.find(item => item.id === parseInt(id));
                if (selectedPerson) {
                    tmp = tmp + selectedPerson.realName + ','
                }
            }

            this.form.leadersNames = tmp
            this.$forceUpdate()
        },
        saveLeaders() {
            this.form.leaderIds = this.personIds + ''
            /*if (!this.form.leaderIds) {
                this.$message.info("领导班子不能为空")
                return
            }*/
            this.joinVisible = false
        },
        queryOneselfPartyMemberList() {
            this.personList = []
            this.personIds = []
            // 获取当前会议的拟参会人员ids
            let data = {}
            let id = this.deptId
            data.deptId = id
            queryOneselfPartyMemberList({data: data}).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    this.personList = data.data
                    this.$forceUpdate()
                    this.joinVisible = true
                }
            })

        },
        addDate(d, years) {
            // 获取当前日期加一年
            let date = new Date(d)
            let year = date.getFullYear() + years
            let month = date.getMonth() + 1
            let day = date.getDate()
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            let enTime = year + '-' + month + '-' + day + '  ' + '00' + ':' + '00' + ':' + '00'
            return enTime
        },
        changevalue(e) {
            // debugger
            this.form.thisSessionFinishTime = this.formartDate(new Date(this.addDate(e, 3)), 'yyyy-MM-dd HH:mm:ss')
        },
        submitForm() {
            if (this.form.thisSessionFinishTime < this.form.thisSessionStartTime) {
                this.$message.info('开始时间不能大于结束时间')
                return
            }

            this.form.otherMembers = this.otherMembersList ? this.otherMembersList.join(",") : ''

            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }

                if (this.form.isFirst == 1) {
                    this.form.lastSessionFinishTime = null
                }

                addTzTermDept({data: this.form}).then(res => {
                    this.visible = false
                    const data = res.data
                    if (data.code == '00000') {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            //duration: 1000
                        })
                        this.close()
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'error',
                            //duration: 1000
                        })
                    }
                }).catch((e) => {
                    this.isSubmit = false
                })
            })
        },
        close() {
            this.reset()
            this.$refs['form'].resetFields()
            this.$emit('close')
        },
        reset() {
            this.editStatus = false
            this.tableData = []
            this.otherMembersList = []
            this.input = ''
            this.disabled = false
            this.title = ''
            this.form = {
                deptId: '',
                isFirst: 0,
                teamSession: '',
                lastSessionFinishTime: '',
                thisSessionStartTime: '',
                thisSessionFinishTime: '',
                voteType: '',
                leadersNames: '',

                positionMember: '',

                secretary: '',
                deputySecretary: '',
                committeeMember: '',
                diCommitteeMember: '',
                publicityCommitteeMember: '',
                otherMembers: '',
            }

            this.$refs.form.resetFields()
        },
        init() {
            this.getDict('voteType')
            this.getDict('position')
            getPartMemberListByDeptId(this.parentId).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.partyMemberList = result.data
                    this.$forceUpdate()
                }
            })
        },
        getDict(type) {
            let tmp = []
            getDictByCode(type).then(res => {
                if (type === 'voteType') {
                    this.electTypeList = res.data.data
                } else if (type === 'position') {
                    this.positionList = res.data.data
                    this.positionList.forEach(item => item.value = "")
                }
            })
            return tmp
        },
        getDataById(id) {
            getTzTermDept(id).then(res => {
                this.form = res.data.data
                this.otherMembersList = this.form.otherMembers ? this.form.otherMembers.split(",") : []
            })
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
                    if (i == 'd') {
                        if (obj[i] < 10) {
                            obj[i] = '0' + obj[i]
                        }
                    }
                    for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.title = this.modalTitle
                this.deptId = this.parentId
                this.init()
                if (this.title === '新增') {
                    this.form.deptId = this.parentId
                } else {
                    this.editStatus = true
                    this.id = this.partyId
                    this.getDataById(this.partyId)
                }
                if (this.title === '详情') {
                    this.disabled = true
                }
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.row_right {
    float: left;
    width: 100%;

    .row_right_img {
        text-align: center;
        margin-left: 20px;
        margin-bottom: 10px;
        float: left;
        margin-top: 40px;
        height: 100px;

        .img {
            margin-left: 24px;
            display: inline-block;
            cursor: pointer;
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }

        .row_right_img_p {
            margin-top: 2px;
            line-height: 15px;
            margin-bottom: 2px
        }
    }
}

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

            .col-sm-6 {
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
                        width: 122px;
                    }
                }


                .el-form-item {
                    display: flex;
                    align-items: center;
                    line-height: 20px;

                    .input-row {
                        width: 200px;
                        margin-right: 10px
                    }

                    padding-left: 10px !important;
                    margin-right: -12px;
                    margin-left: -15px;
                    margin-bottom: 15px;

                    /deep/ .el-form-item__content {
                        margin-left: 0 !important;
                    }
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

/deep/ .el-input-number--mini .el-icon-minus {
    line-height: 26px !important;
}

/deep/ .el-input-number--mini .el-icon-plus {
    line-height: 26px !important;
}
/deep/.el-icon-minus {
    line-height: 38px;
}
/deep/.el-icon-plus {
    line-height: 38px;
}
</style>
