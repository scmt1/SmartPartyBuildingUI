<template>
    <el-dialog :visible.sync="show" :title="'新增人员 - '+ getLabelForItemValue(unitedObject, unitedObjectList)"
               top="20px" width="1100px" :close-on-click-modal="false"
               :close-on-press-escape="false" @opened="init">
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" v-if="show" :label-width="formLabelWidth">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="所属党组织："  prop="unitedName">
                        <el-input :disabled="true" v-model="form.unitedName" size="small" placeholder=""
                                  autocomplete="off" class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="姓名："  prop="name">
                        <el-input v-model="form.name" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="性别："  prop="sex">
                        <el-select v-model="form.sex" placeholder="请选择" class="input-row" size="small">
                            <el-option label="男" :value=1></el-option>
                            <el-option label="女" :value=2></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="民族："  prop="national">
                        <el-select v-model="form.national" placeholder="请选择" class="input-row" size="small">
                            <el-option v-for="(item,index) in nationalList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="籍贯："  prop="nativePlace">
                        <el-input v-model="form.nativePlace" size="small" placeholder="" autocomplete="off"
                                  maxlength="80" class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="学历："  prop="education">
                        <el-select v-model="form.education" placeholder="请选择" class="input-row" size="small">
                            <el-option v-for="(item,index) in educationList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="学位："  prop="degree">
                        <el-select v-model="form.degree" placeholder="请选择" class="input-row" size="small">
                            <el-option v-for="(item,index) in degreeList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label=" 毕业院校及专业："  prop="university">
                        <el-input v-model="form.university" size="small" placeholder="" autocomplete="off"
                                  maxlength="80" class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label=" 职务："  prop="position">
                        <el-input v-model="form.position" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="专业技术职称："  prop="technology">
                        <el-input v-model="form.technology" size="small" placeholder="" autocomplete="off"
                                  maxlength="80" class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="职级："  prop="level">
                        <el-input v-model="form.level" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="现任职时间："  prop="officeTime">
                        <el-date-picker
                            size="small"
                            v-model="form.officeTime"
                            type="date"
                            placeholder="请选择时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            class="input-row">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="['1'].indexOf(unitedObject) > -1">
                    <el-form-item label="政治面貌："  prop="politicalOutlook">
                        <el-select v-model="form.politicalOutlook" placeholder="请选择" class="input-row" size="small">
                            <el-option v-for="(item,index) in politicalOutlookList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" v-if="['3'].indexOf(unitedObject) > -1">
                    <el-form-item label="认定时间："  prop="identifyTime">
                        <el-date-picker
                            size="small"
                            v-model="form.identifyTime"
                            type="date"
                            placeholder="请选择时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            class="input-row">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="12" v-if="['1', '3', '5', '6'].indexOf(unitedObject) > -1">
                    <el-form-item style="width: 50%;" label="政治安排情况："
                                  prop="politicalArrangements">
                        <el-input v-model="form.politicalArrangements" size="small" placeholder="" autocomplete="off"
                                  maxlength="80" class="input-row"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="['2'].indexOf(unitedObject) > -1">
                    <el-form-item style="width: 50%;" label="加入何民主党派："
                                  prop="joinParty">
                        <el-input v-model="form.joinParty" size="small" placeholder="" autocomplete="off"
                                  maxlength="80" class="input-row"></el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="12" v-if="['2'].indexOf(unitedObject) > -1">
                    <el-form-item style="width: 50%;" label="民主党派所任职："
                                  prop="positionParty">
                        <el-input v-model="form.positionParty" size="small" placeholder="" autocomplete="off"
                                  maxlength="80" class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="联系电话："  prop="phone">
                        <el-input v-model="form.phone" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                </el-col>
            </el-row>

        </el-form>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关 闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')" v-if="!disabled">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import util from '@/libs/util'
import defaultImg from "@/assets/upload.png"
import {getTzSysDept} from "@/api/jcxfSysDept";
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {addUnitedPerson, getUnitePerson} from '@/api/tzUnitedPerson'
import Vue from 'vue'
import {mapGetters} from "vuex";

export default {
    name: 'updateNonParty.vue',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        personId: {
            type: Number
        },
        tradeDeptName: {
            type: String
        },
        modeTitle: {
            type: String
        },
        unitedObject: {
            type: String
        },
        unitedId: {
            type: Number
        }
    },
    data() {
        return {
            disabled: false,
            nationalList: [],
            educationList: [],
            politicalOutlookList: [],
            form: {
                unitedName: '',
                name: '',
                sex: '',
                national: '',
                nativePlace: '',
                education: '',
                degree: '',
                university: '',
                position: '',
                technology: '',
                level: '',
                officeTime: '',
                politicalOutlook: '',
                politicalArrangements: '',
                phone: '',
                unitedObject: ''
            },
            formLabelWidth: '150px',
            show: this.value,
            rules: {
                name: [
                    {required: true, message: '姓名不能为空', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '性别不能为空', trigger: 'blur'}
                ],
                national: [
                    {required: true, message: '民族不能为空', trigger: 'blur'}
                ],
                nativePlace: [
                    {required: true, message: '籍贯不能为空', trigger: 'blur'}
                ],
                education: [
                    {required: true, message: '学历不能为空', trigger: 'blur'}
                ],
                degree: [
                    {required: true, message: '学位不能为空', trigger: 'blur'}
                ],
                university: [
                    {required: true, message: '毕业院校及专业不能为空', trigger: 'blur'}
                ],
                position: [
                    {required: true, message: '职务不能为空', trigger: 'blur'}
                ],
                technology: [
                    {required: true, message: '专业技术职称不能为空', trigger: 'blur'}
                ],
                level: [
                    {required: true, message: '职级不能为空', trigger: 'blur'}
                ],
                officeTime: [
                    {required: true, message: '现任职时间不能为空', trigger: 'blur'}
                ],
                politicalOutlook: [
                    {required: true, message: '政治面貌不能为空', trigger: 'blur'}
                ],
                politicalArrangements: [
                    {required: true, message: '政治安排情况不能为空', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '电话不能为空', trigger: 'blur'},
                    {
                        type: 'string',
                        message: '联系电话有误！',
                        trigger: 'blur',
                        pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/
                    }
                ],
                joinParty: [
                    {required: true, message: '加入何民主党派不能为空', trigger: 'blur'}
                ],
                positionParty: [
                    {required: true, message: '民主党派所任职不能为空', trigger: 'blur'}
                ],
                identifyTime: [
                    {required: true, message: '认定时间不能为空', trigger: 'blur'}
                ],
            },
            options: [],
            defaultImg: defaultImg,
            base: util.nginxUrl,
            fileTypeArr: ['doc', 'docx', 'ppt', 'pdf'],
            upHeaders: {
                'User-Type': 'Gov_User',
                'Authorization': Vue.cookie.get('Authorization_vs')
            },
            fileList: [],
            attachFile: {
                'fileName': '',
                'filePath': '',
                'fileSize': '',
                'type': '',
                'fileType': ''
            },
            tradeTypeList: [],
            unitedObjectList: [],
            degreeList: []
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        selectValue(e) {

        },
        getUnitePerson(id) {
            getUnitePerson(id).then(res => {
                if (res.data.code == '00000') {
                    this.form = res.data.data
                }
            })
        },
        reset() {
            this.input = ''
            this.fileList = []
            this.form = {
                parentName: '',
                isUnited: 1,
                position: '',
                leaderName: '',
                name: '',
                master: '',
                phone: '',
                parentId: '',
                functionalName: '',
                masterPhone: '',
                sponsor: '',
                sponsorPhone: ''
            }
        },
        close() {
            this.show = false
            this.$emit('close')
            this.reset()
        },
        submitForm() {
            let that = this
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                let unitedPerson = this.form
                addUnitedPerson({unitedPerson: unitedPerson}).then(res => {
                    if (res.data.code == '00000') {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 1000
                        })
                        that.close()
                    } else {
                        this.$message({
                            message: '保存失败',
                            type: 'error',
                            duration: 1000
                        })
                    }
                }).catch((e) => {
                    that.isSubmit = false
                })
            })
        },
        init() {
            this.getDict2('nation')
            this.getDict2('education')
            this.getDict('politicalOutlook')
            this.getDict('unitedObject')
            this.getDict('degree')
        },
        closeModal() {
            this.$emit('close')
        },
        getDict(type) {
            getDictByType2(type).then(res => {
                let data = res.data
                if (type === 'politicalOutlook') {
                    this.politicalOutlookList = data
                } else if (type === 'unitedObject') {
                    this.unitedObjectList = data
                } else if (type === 'degree') {
                    this.degreeList = data
                }
            })
        },
        getDict2(type) {
            getDictByCode(type).then(res => {
                let data = res.data.data
                if (type === 'nation') {
                    this.nationalList = data
                } else if (type === 'education') {
                    this.educationList = data
                }
            })
        },
        getLabelForItemValue(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == value) {
                    return dic[i].label
                }
            }
            return ''
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
            }
        },
        show(val) {
            if (val) {
                this.form.unitedName = this.tradeDeptName
                this.form.unitedObject = this.unitedObject
                this.form.personId = this.personId
                this.form.unitedId = this.unitedId
                if (this.modeTitle == '编辑') {
                    this.getUnitePerson(this.form.personId)
                }
            } else {
                this.closeModal()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.modal-header {
    padding: 5px 10px;
    /*text-align: center;*/

    .modal-title {
        font-size: 16px;
    }
}

.input-row {
    width: 320px !important;
}
</style>
