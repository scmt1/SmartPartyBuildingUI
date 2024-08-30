<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="73%" @on-visible-change="visibleChange">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">参会人员配置</h4>
            </div>
            <div class="body">
                <el-form ref="form" :model="form" :rules="rules" :disabled="disabled">
                    <el-table
                            ref="multipleTable"
                            :data="tableData"
                            border
                            :cell-style="{'text-align':'center'}"
                            :header-cell-style="{'text-align':'center',background : '#eef1f6'}"
                            tooltip-effect="dark"
                            style="width: 100%">
                        <el-table-column prop="deptName" width="240" label="参会支部">
                            <template slot-scope="scope">
                                {{ scope.row.deptName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="host" width="170" label="主持人">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.host" placeholder="请选择" class="input-row" size="mini"
                                           style="width:140px">
                                    <el-option v-for="(item,i) in scope.row.personList" :key="i"
                                               :label=item.realName :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="record" width="170" label="记录人">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.record" placeholder="请选择"
                                           class="input-row"
                                           size="mini" style="width:140px">
                                    <el-option v-for="(item,i) in scope.row.personList" :key="i"
                                               :label=item.realName :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="joins" width="175" label="参会人员">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.joins" placeholder="请选择"
                                           multiple collapse-tags
                                           size="mini" style="width:150px">
                                    <el-option v-for="(item,i) in scope.row.personList"
                                               :disabled="item.checkDisabled"
                                               :label=item.realName :value=item.id
                                               :key="item.id"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="absent" width="175" label="无故缺席">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.absent" placeholder="请选择"
                                           multiple collapse-tags
                                           class="input-row" size="mini" style="width:150px">
                                    <el-option v-for="(item,i) in filerData(scope.row.personList, scope.row.joins)" :key="i"
                                               :disabled="item.checkDisabled"
                                               :label=item.realName
                                               :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sick" width="175" label="病假">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.sick" placeholder="请选择"
                                           multiple collapse-tags
                                           class="input-row" size="mini" style="width:150px">
                                    <el-option v-for="(item,i) in filerData(scope.row.personList, scope.row.joins)" :key="i"
                                               :label=item.realName :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="common" width="175" label="公假">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.common" placeholder="请选择"
                                           multiple collapse-tags
                                           class="input-row" size="mini" style="width:150px">
                                    <el-option v-for="(item,i) in filerData(scope.row.personList, scope.row.joins)" :key="i"
                                               :label=item.realName :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="thing" width="175" label="事假">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.thing" placeholder="请选择"
                                           multiple
                                           collapse-tags
                                           class="input-row" size="mini"
                                           style="width:150px">
                                    <el-option v-for="(item,i) in filerData(scope.row.personList, scope.row.joins)" :key="i"
                                               :label=item.realName :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="later" width="175" label="迟到">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.later" placeholder="请选择"
                                           multiple
                                           collapse-tags
                                           class="input-row" size="mini"
                                           style="width:150px">
                                    <el-option v-for="(item,i) in filerData(scope.row.personList, scope.row.joins)" :key="i"
                                               :label=item.realName :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="flow" width="175" label="流动党员参会">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.flow" placeholder="请选择" multiple
                                           collapse-tags
                                           class="input-row" size="mini"
                                           style="width:150px">
                                    <el-option v-for="(item,i) in fluxList" :key="i" :label=item.realName
                                               :value=item.id></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作" fixed="right" width="120">
                           <template slot-scope="scope">

                           </template>
                         </el-table-column>-->
                    </el-table>
                </el-form>
            </div>
        </div>
        <div style="display: flex; flex-direction: row; margin-top: 10px;">
            <div style="line-height: 40px;">其他参会支部选择：</div>
            <div style="width: 400px;">
                <el-select v-model="selectDept" value-key="id" @change="selectDeptChange" multiple filterable style="width: 100%;"
                           placeholder="请选择">
                    <el-option v-for="(item, index) in treeOptions" :key="index" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util'
import {VueCropper} from 'vue-cropper'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {endMeeting, getPlanMeetingPartyMemberInfo} from "@/api/jcxfOrganizationLife";
import {queryOneselfFlowPartyMemberList} from "@/api/jcxfPartyMember";
import {queryOneselfPartyMemberList} from "@/api/jcxfPartyMember";
import {getSameClassDeptListByDeptId} from "@/api/jcxfSysDept";

export default {
    name: 'meetingCompoent',
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
            checkDisabled: false,
            personAllList: [],
            fluxList: [],
            tableData: [{'deptName': ''}],
            data: {deptId: '', deptName: ''},
            id: '',
            show: this.value,
            ids: [],
            tmp: [],
            image: '',
            visible: false,
            imgName: '',
            disabled: false,
            base: util.nginxUrl,
            type: '',
            modal1: false,
            personList: [],
            formLabelWidth: '100px',
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
            },
            rules: {
                meetingType: [
                    {required: true, message: '请选择会议类型', trigger: 'change'}
                ],
                meetingName: [
                    {required: true, message: '这是必填字段', trigger: 'change'}
                ],
                startTime: [
                    {required: true, message: '这是必填字段', trigger: 'change'}
                ],
                endTime: [
                    {required: true, message: '这是必填字段', trigger: 'change'}
                ],
                addr: [
                    {required: true, message: '这是必填字段', trigger: 'change'}
                ],
                meetingContent: [
                    {required: true, message: '这是必填字段', trigger: 'change'}
                ]
            },
            treeOptions: [],
            selectDept: []
        }
    },
    methods: {
        //后面几个需要过滤掉参会人员
        filerData(personList, joinsList) {
            if(personList && joinsList) {
                let arr = [];
                personList.forEach(item => {
                    let find = joinsList.find(e => e == item.id);
                    if (!find) {
                        arr.push(item)
                    }
                })
                return arr;
            }else {
                return []
            }
        },
        visibleChange(event) {
            if (!event) {
                this.close()
            }
        },
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                let va = []
                for (let i = 0; i < this.tableData.length; i++) {
                    const data = this.tableData[i]
                    // const key = data.deptId + '_index'
                    //
                    // let absent = ''
                    // if (this.form.absent[key] && this.form.absent[key].length > 0) {
                    //     absent = this.form.absent[key].substring(0, this.form.absent[key].length - 1)
                    // }
                    //
                    // let sick = ''
                    // if (this.form.sick[key] && this.form.sick[key].length > 0) {
                    //     sick = this.form.sick[key].substring(0, this.form.sick[key].length - 1)
                    // }
                    //
                    // let common = ''
                    // if (this.form.common[key] && this.form.common[key].length > 0) {
                    //     common = this.form.common[key].substring(0, this.form.common[key].length - 1)
                    // }
                    //
                    // let thing = ''
                    // if (this.form.thing[key] && this.form.thing[key].length > 0) {
                    //     thing = this.form.thing[key].substring(0, this.form.thing[key].length - 1)
                    // }
                    //
                    // let later = ''
                    // if (this.form.later[key] && this.form.later[key].length > 0) {
                    //     later = this.form.later[key].substring(0, this.form.later[key].length - 1)
                    // }
                    //
                    // let flow = ''
                    // if (this.form.flow[key] && this.form.flow[key].length > 0) {
                    //     flow = this.form.flow[key].substring(0, this.form.flow[key].length - 1)
                    // }
                    //
                    // let joins = ''
                    // if (this.form.joins[key] && this.form.joins[key].length > 0) {
                    //     joins = this.form.joins[key].substring(0, this.form.joins[key].length - 1)
                    // }
                    //
                    let val = {
                        deptId: data.deptId,
                        members: [
                            {status: 0, member: data.absent ? data.absent.join(",") : ''},
                            {status: 1, member:  data.sick ? data.sick.join(",") : ''},
                            {status: 2, member:  data.common ? data.common.join(",") : ''},
                            {status: 3, member:  data.thing ? data.thing.join(",") : ''},
                            {status: 4, member:  data.later ? data.later.join(",") : ''},
                            {status: 5, member:  data.host},
                            {status: 6, member: data.record},
                            {status: 7, member: data.flow ? data.flow.join(",") : ''},
                            {status: 8, member: data.joins ? data.joins.join(",") : ''}
                        ]
                    }
                    va.push(val)
                }

                let userInformation = JSON.parse(window.localStorage.getItem("userInformation"))

                let value = {
                    meetingId: this.meetingId,
                    data: JSON.stringify(va),
                    updateBy: userInformation.userId
                }
                endMeeting({data: value}).then((res) => {
                    const data = res.data
                    if (data.code == '00000') {
                        this.visible = false
                        this.close()
                        this.$message.success('保存成功')
                        this.$emit('refresh')
                    } else {
                        this.$message.error('保存失败')
                    }
                })
            })
        },
        getPlanMeetingPartyMember(id, deptId) {
            getPlanMeetingPartyMemberInfo(id).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    this.tableData[0].personList = result.data
                    this.$forceUpdate()
                }
            })
        },
        getDateById(id) {
            let data = {}
            data.deptId = id
            queryOneselfPartyMemberList({data: data}).then((res) => {
                const data = res.data
                if (data.code == '00000') {
                    if (data.data.length == 0) {
                        this.$message.info('暂无人员可选')
                        for (let i = 0; i < this.selectDept.length; i++) {
                            if (this.selectDept[i] == id) {
                                this.selectDept.splice(i, 1)
                                break
                            }
                        }
                        for (let i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].deptId == id) {
                                this.tableData.splice(i, 1)
                                break
                            }
                        }
                        return
                    }

                    let find = this.tableData.find(item => item.deptId == id);
                    find.personList = data.data
                    this.$forceUpdate()
                }
            })

            queryOneselfFlowPartyMemberList(data).then((res) => {
                this.fluxList[id + '_index'] = res.data.data
            })
        },
        close() {
            this.$refs['form'].resetFields()
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
            this.reset()
            this.show = false
            this.$emit('input', false)
            this.$emit('close')
        },
        reset() {
            this.joins = {}
            this.absent = {}
            this.sick = {}
            this.common = {}
            this.thing = {}
            this.later = {}
            this.flow = {}
            this.disabled = false
            /*this.form = {
                mode: '1'
            }*/
        },
        closeModal(val) {
            this.$emit('close')
            this.$emit('input', false)
        },
        getOrganizationTree() {
            const deptId = this.$route.query.deptId
            getSameClassDeptListByDeptId(deptId + '').then(res => {
                const data = res.data
                if (data.code == "00000") {
                    this.treeOptions = data.data
                }
            })
        },
        selectDeptChange() {
            if (this.selectDept.length < this.tableData.length - 1) {
                for (let j = 1; j < this.tableData.length; j++) {
                    const data = this.tableData[j]
                    let flag = true
                    for (let i = 0; i < this.selectDept.length; i++) {
                        const dept = this.selectDept[i]
                        if (dept.id == data.deptId) {
                            flag = false
                            break
                        }
                    }
                    if (flag) {
                        this.tableData.splice(j, 1)
                        break
                    }
                }
            } else {
                this.selectDept.forEach(item => {
                    this.getDateById(item)
                    this.tableData.push({
                        deptName: this.treeOptions.find(tree => tree.id == item).name,
                        deptId: item
                    })
                })
            }


            // 减少
            // if (this.selectDept.length < this.tableData.length - 1) {
            //     for (let j = 1; j < this.tableData.length; j++) {
            //         const data = this.tableData[j]
            //         let flag = true
            //         for (let i = 0; i < this.selectDept.length; i++) {
            //             const dept = this.selectDept[i]
            //             if (dept.id == data.deptId || data.deptId == this.deptId) {
            //                 flag = false
            //                 break
            //             }
            //         }
            //         if (flag) {
            //             this.personList = data.data
            //             this.tableData.splice(j, 1)
            //             break
            //         }
            //     }
            // } else {
            //     for (let i = 0; i < this.selectDept.length; i++) {
            //         const dept = this.selectDept[i]
            //         let flag = true
            //         for (let j = 0; j < this.tableData.length; j++) {
            //             const data = this.tableData[j]
            //             if (dept.id == data.deptId) {
            //                 flag = false
            //                 break
            //             }
            //         }
            //         if (flag) {
            //             const va = {
            //                 deptName: dept.name,
            //                 deptId: Number(dept.id)
            //             }
            //             this.tableData.push(va)
            //         }
            //         this.getDateById(dept.id)
            //     }
            //
            // }
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.data.deptId = this.deptId
                this.data.deptName = this.deptName
            }
        },
        show(val) {
            if (val) {
                this.tableData = [{}]
                this.id = this.meetingId
                this.form.meetingId = this.meetingId
                this.tableData[0].deptName = this.deptName
                this.tableData[0].deptId = Number(this.deptId)
                this.form.deptId = this.deptId
                this.getPlanMeetingPartyMember(this.id, this.form.deptId)
                this.getOrganizationTree()
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
