<template>
    <Modal v-model="dialogFormVisible" :title="title" :mask-closable="false" :closable="false" width="1200px" @on-visible-change="visibleChange">
        <div class="modal-content">
            <div class="body">
                <el-form ref="form" :model="form" :rules="rules" :disabled="disabled">
                    <div class="row">
                        <div class="col-sm-6">
                            <el-form-item label="姓名：" :label-width="formLabelWidth" prop="realName" class="input-row">
                                <el-input v-model="form.realName" placeholder="请输入姓名" autocomplete="off" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证号：" :label-width="formLabelWidth" prop="idcard">
                                <el-input v-model="form.idcard" placeholder="请输入身份证号" autocomplete="off" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="性别：" :label-width="formLabelWidth" prop="sex">
                                <el-select v-model="form.sex" placeholder="请选择" class="input-row">
                                    <el-option v-for="(item,index) in sexList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="民族：" :label-width="formLabelWidth" prop="national">
                                <el-select v-model="form.national" placeholder="请选择民族" class="input-row">
                                    <el-option v-for="(item,index) in nationList" :key="index" :label="item.label" :value="Number(item.itemValue)"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="毕业院校及专业：" :label-width="formLabelWidth" prop="collagesMajors" class="label">
                                <el-input v-model="form.collagesMajors" placeholder="请输入毕业院校(不超过255个字符)" autocomplete="off" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="学历：" :label-width="formLabelWidth" prop="education">
                                <el-select v-model="form.education" placeholder="请选择" class="input-row">
                                    <el-option v-for="(item,index) in educationList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="出生日期：" :label-width="formLabelWidth" prop="birthday">
                                <el-date-picker
                                    v-model="form.birthday"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="手机号码：" :label-width="formLabelWidth" prop="phone">
                                <el-input v-model="form.phone" placeholder="请输入手机号码" autocomplete="off" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="家庭住址：" :label-width="formLabelWidth" prop="address">
                                <el-input v-model="form.address" placeholder="请输入家庭住址(最长50个字符)" autocomplete="off" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="归属部门：" :label-width="formLabelWidth" prop="deptName" class="input-row">
                                <el-input v-model="form.deptName" placeholder="" autocomplete="off" class="input-row" :disabled="true"></el-input>
                            </el-form-item>
                        </div>
                        <div class="col-sm-6">
                            <el-form-item label="工作单位：" :label-width="formLabelWidth" prop="workUnit" class="input-row">
                                <el-input v-model="form.workUnit" placeholder="" autocomplete="off" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="工作岗位：" :label-width="formLabelWidth" prop="workPosition">
                                <el-select v-model="form.workPosition" placeholder="请选择" class="input-row" clearable>
                                    <el-option v-for="(item,index) in workPositionList" :key="index" :label="item.label" :value="item.itemValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="发展纪实阶段：" :label-width="formLabelWidth" prop="personType" class="label">
                                <el-select v-model="form.personType" placeholder="请选择" class="input-row" @change="developStateChange">
                                    <el-option v-for="(item,index) in developStateList" :key="index" :label="item.label" :value="Number(item.itemValue)"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="提交入党申请书时间：" v-if="form.personType == 1 || form.personType == 2 || form.personType == 3 || form.personType == 4 || form.personType == 5" :label-width="formLabelWidth" prop="submitDate" class="label">
                                <el-date-picker
                                    v-model="form.submitDate"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="列为入党积极分子时间：" v-if="form.personType == 2 || form.personType == 3 || form.personType == 4 || form.personType == 5" :label-width="formLabelWidth" prop="activeDate" class="label">
                                <el-date-picker
                                    v-model="form.activeDate"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="确定为发展对象时间：" v-if="form.personType == 3 || form.personType == 4 || form.personType == 5" :label-width="formLabelWidth" prop="developDate" class="label">
                                <el-date-picker
                                    v-model="form.developDate"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="讨论吸收为预备党员时间：" v-if="form.personType == 4 || form.personType == 5" :label-width="formLabelWidth" prop="partyTime" class="label">
                                <el-date-picker
                                    v-model="form.partyTime"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="转为正式党员日期：" v-if="form.personType == 5" :label-width="formLabelWidth" prop="transferTime" class="label">
                                <el-date-picker
                                    v-model="form.transferTime"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="是否参加集中培训：" v-if="form.personType == 2 || form.personType == 3" :label-width="formLabelWidth" class="label">
                                <el-select v-model="form.isTrain" placeholder="请选择" class="input-row" >
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="培训开始时间：" v-if="form.isTrain == '1'" :label-width="formLabelWidth" class="label">
                                <el-date-picker
                                        v-model="form.trainStartTime"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="培训结束时间：" v-if="form.isTrain == '1'" :label-width="formLabelWidth"  class="label">
                                <el-date-picker
                                        v-model="form.trainEndTime"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="是否合格：" v-if="form.isTrain == '1'"  :label-width="formLabelWidth"  class="label">
                                <el-select v-model="form.isQualified" placeholder="请选择" class="input-row" >
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所在组织变更情况：" :label-width="formLabelWidth" class="label">
                                <el-input type="textarea" v-model="form.changeOrganization" placeholder="所在组织变更情况" autocomplete="off" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="是否为返乡农民工：" v-if="form.isTrain!='1'" :label-width="formLabelWidth" prop="isReturnWorkers" class="label">
                                <el-select v-model="form.isReturnWorkers" placeholder="请选择" class="input-row">
                                    <el-option label="是" :value="1"></el-option>
                                    <el-option label="否" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否延期：" :label-width="formLabelWidth" prop="isLate">
                                <el-select v-model="form.postponeFlag" placeholder="请选择" class="input-row">
                                    <el-option label="是" :value="1"></el-option>
                                    <el-option label="否" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close('close')">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')" v-if="!disabled">保存</el-button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util'
import {addDevelopPartyMember,updateDevelopPartyMember, getDevelopParty} from '@/api/jcxfDevelopParty'
import {getTzSysDept} from '@/api/jcxfSysDept'
import {getDictByType2} from '@/api/tDictData'
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {mapGetters} from "vuex";

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
        id: {
            type: String,
            default: ''
        },
        modalTitle: {
            type: String
        }
    },
    data() {
        return {
            disabled: false,
            title: '',
            developStateList: [],
            workPositionList: [],
            partyStateList: [],
            personTypeList: [],
            positionList: [],
            educationList: [],
            nationList: [],
            sexList: [{'name': '男', 'value': 1}, {'name': '女', 'value': 2}],
            formLabelWidth: '170px',
            dialogFormVisible: false,
            form: {
                id: '',
                realName: '',
                idcard: '',
                sex: '',
                national: '',
                collagesMajors: '',
                education: '',
                birthday: '',
                phone: '',
                address: '',
                deptName: '',
                workUnit: '',
                workPosition: '',
                personType: '',
                submitDate: '',
                activeDate: '',
                developDate: '',
                partyTime: '',
                transferTime: '',
                isTrain: '',
                trainStartTime: '',
                trainEndTime: '',
                isQualified: '',
                isReturnWorkers: '',
                changeOrganization: '',
                postponeFlag: ''
            },
            rules: {
                realName: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                    {min: 2, max: 10, message: '长度在 2 到 10 个汉字', trigger: 'blur'}
                ],
                idcard: [
                    {required: true, message: '请输入身份证号', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'change'}
                ],
                collagesMajors: [
                    {required: true, message: '请输入毕业院校和专业', trigger: 'blur'}
                ],
                national: [
                    {required: true, message: '请选择民族', trigger: 'change'}
                ],
                birthday: [
                    {required: true, message: '请选择日期', trigger: 'blur'}
                ],
                education: [
                    {required: true, message: '请选择学历', trigger: 'change'}
                ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'}
                ],
                personType: [
                    {required: true, message: '请选择发展阶段', trigger: 'change'}
                ],
                isReturnWorkers: [
                    {required: true, message: '请选择是否为农民工返乡', trigger: 'change'}
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        setNull(){
            this.form.isTrain = ""
            this.form.trainStartTime = null
            this.form.trainEndTime = null
            this.form.isQualified = null
        },
        developStateChange(value) {
            if (value == '1') {
                this.form.activeDate = ''
                this.form.developDate = ''
                this.form.partyTime = ''
                this.form.transferTime = ''
            } else if (value == '2') {
                this.form.developDate = ''
                this.form.partyTime = ''
                this.form.transferTime = ''
            } else if (value == '3') {
                this.form.partyTime = ''
                this.form.transferTime = ''
            } else if (value == '4') {
                this.form.transferTime = ''
            }
        },
        submitForm() {
            if (this.form.personType == 1) {
                this.setNull()
                if ((this.form.submitDate == null || this.form.submitDate == '') ||
                    ((this.form.activeDate != null && this.form.activeDate != '') ||
                        (this.form.developDate != null && this.form.developDate != '') ||
                        (this.form.partyTime != null && this.form.partyTime != '') ||
                        (this.form.transferTime != null && this.form.transferTime != '')
                    )) {
                    this.$message({
                        message: '请选择入党申请书提交时间',
                        type: 'error',
                    })
                    return
                }
            } else if ((this.form.personType == 2)) {
                if (((this.form.submitDate == null || this.form.submitDate == '') ||
                    (this.form.activeDate == null || this.form.activeDate == '')) ||
                    ((this.form.developDate != null && this.form.developDate != '') ||
                        (this.form.transferTime != null && this.form.transferTime != '') ||
                        (this.form.partyTime != null && this.form.partyTime != '')
                    )) {
                    this.$message({
                        message: '请选择列为入党积极分子及其之前的时间',
                        type: 'error',
                    })
                    return
                }
                if(!this.form.isTrain){
                    this.$message({
                        message: '请选择是否参加了集中培训',
                        type: 'error',
                    })
                    return
                }
                if(this.form.isTrain=="1"){
                    this.form.isReturnWorkers = ""
                    if(!this.form.trainStartTime){
                        this.$message({
                            message: '请选择培训开始时间',
                            type: 'error',
                        })
                        return
                    }
                    if(!this.form.trainEndTime){
                        this.$message({
                            message: '请选择培训结束时间',
                            type: 'error',
                        })
                        return
                    }
                    if(!this.form.isQualified){
                        this.$message({
                            message: '请选择培训是否合格',
                            type: 'error',
                        })
                        return
                    }
                }

            } else if ((this.form.personType == 3)) {
                if (((this.form.submitDate == null || this.form.submitDate == '') ||
                    (this.form.activeDate == null || this.form.activeDate == '') ||
                    (this.form.developDate == null || this.form.developDate == '')) ||
                    ((this.form.partyTime != null && this.form.partyTime != '') ||
                        (this.form.transferTime != null && this.form.transferTime != '')
                    )) {
                    this.$message({
                        message: '请选择确定为发展对象及其之前的时间',
                        type: 'error',
                    })
                    return
                }
                if(!this.form.isTrain){
                    this.$message({
                        message: '请选择是否参加了集中培训',
                        type: 'error',
                    })
                    return
                }
                if(this.form.isTrain=="1"){
                    this.form.isReturnWorkers = ""
                    if(!this.form.trainStartTime){
                        this.$message({
                            message: '请选择培训开始时间',
                            type: 'error',
                        })
                        return
                    }
                    if(!this.form.trainEndTime){
                        this.$message({
                            message: '请选择培训结束时间',
                            type: 'error',
                        })
                        return
                    }
                    if(!this.form.isQualified){
                        this.$message({
                            message: '请选择培训是否合格',
                            type: 'error',
                        })
                        return
                    }
                }
            } else if ((this.form.personType == 4)) {
                this.setNull()
                if (((this.form.submitDate == null || this.form.submitDate == '') ||
                    (this.form.activeDate == null || this.form.activeDate == '') ||
                    (this.form.developDate == null || this.form.developDate == '') ||
                    (this.form.partyTime == null || this.form.partyTime == '')) ||
                    (this.form.transferTime != null && this.form.transferTime != '')) {
                    this.$message({
                        message: '请选择确定为预备党员及其之前的时间',
                        type: 'error',
                    })
                    return
                }
            } else if ((this.form.personType == 5)) {
                this.setNull()
                if (((this.form.submitDate == null || this.form.submitDate == '') ||
                    (this.form.activeDate == null || this.form.activeDate == '') ||
                    (this.form.developDate == null || this.form.developDate == '') ||
                    (this.form.partyTime == null || this.form.partyTime == '') ||
                    (this.form.transferTime == null || this.form.transferTime == '')
                )) {
                    this.$message({
                        message: '请选择确定为正式党员及其之前的时间',
                        type: 'error',
                    })
                    return
                }
            }
            let that = this
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                this.form.attachFiles = this.idCardImgList
                let data = this.form

                if (this.form.id && this.form.id != null && this.form.id.toString().length > 0) {
                    data.updateBy = this.deptInfo.id +''
                } else {
                    data.createBy = this.deptInfo.id +''
                }
                if(this.form.id && this.form.id != null){
                    updateDevelopPartyMember({data: data}).then(res =>{
                        const data = res.data
                        if (data.code == '00000') {
                            this.$message({
                                message: '修改成功',
                                type: 'success',
                            })
                            that.refresh()
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error',
                            })
                        }
                    }).catch((e) => {
                        this.isSubmit = false
                    })
                }else{
                    addDevelopPartyMember({data: data}).then(res =>{
                        const data = res.data
                        if (data.code == '00000') {
                            this.$message({
                                message: '保存成功',
                                type: 'success',
                            })
                            that.refresh()
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error',
                            })
                        }
                    }).catch((e) => {
                        this.isSubmit = false
                    })
                }
            })
        },
        getDeptName(deptId) {
            getTzSysDept(deptId).then(res =>{
                const data = res.data.data
                this.form.deptName = data.name
            })
        },
        visibleChange(value) {
            if (!value) {
                this.close()
            }
        },
        close() {
            this.reset()
            this.$emit('close')
        },
        refresh() {
            this.reset()
            this.$emit('refresh')
        },
        reset() {
            this.tableData = []
            this.disabled = false
            this.title = ''
            this.form = {
                id: '',
                realName: '',
                idcard: '',
                sex: '',
                national: '',
                collagesMajors: '',
                education: '',
                birthday: '',
                phone: '',
                address: '',
                deptName: '',
                workUnit: '',
                workPosition: '',
                personType: '',
                submitDate: '',
                activeDate: '',
                developDate: '',
                partyTime: '',
                transferTime: '',
                isTrain: '',
                trainStartTime: '',
                trainEndTime: '',
                isQualified: '',
                isReturnWorkers: '',
                changeOrganization: '',
                postponeFlag: ''
            }
        },
        init() {
            this.getDict('nation')
            this.getDict('education')
            this.getDict('position')
            this.getDict('developType')
            this.getDict('partyState')
            this.getDict('workPosition')
        },
        getDict(type) {
            let tmp = []
            getDictByCode(type).then(res =>{
                const data = res.data.data
                if (type === 'nation') {
                    this.nationList = data
                } else if (type === 'education') {
                    this.educationList = data
                } else if (type === 'position') {
                    this.positionList = data
                } else if (type === 'developType') {
                    this.developStateList = data
                } else if (type === 'partyState') {
                    this.partyStateList = data
                } else if (type === 'workPosition') {
                    this.workPositionList = data
                }
            })
            return tmp
        },
        getDataById(id) {
            getDevelopParty(id).then(res =>{
                this.form = res.data.data
            })
        }
    },
    watch: {
        value(val) {
            this.dialogFormVisible = this.value
            if (val) {
                this.init()
                this.title = this.modalTitle
                if (this.title === '新增') {
                    this.form.deptId = this.parentId
                    this.getDeptName(this.form.deptId)
                } else {
                    this.form.id = this.id
                    this.getDataById(this.form.id)
                }
                if (this.title === '详情') {
                    this.disabled = true
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input.is-disabled .el-input__inner {
    background: white;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
    background: white;
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

    .body {
        padding: 20px 30px 30px 30px;
        background: #fff;
        width: auto;

        .row {
            //margin-right: -15px;
            //margin-left: -15px;
            display: flex;

            .col-sm-6 {
                width: 50%;
                margin-left: 35px;

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
