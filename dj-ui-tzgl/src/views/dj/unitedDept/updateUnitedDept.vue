<template>
    <el-dialog :visible.sync="show" title="新增组织" top="20px" width="1100px" :close-on-click-modal="false"
               :close-on-press-escape="false" @opened="init" @close="close()">
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" v-if="show" :label-width="formLabelWidth">
            <div class="body">
                <div style="display: flex;align-items: center;justify-content: center;">
                    <el-form-item label="上级机构："  prop="parentName">
                        <el-input :disabled="true" v-model="form.parentName" size="small" placeholder=""
                                  autocomplete="off" maxlength="80" class="input-row"></el-input>
                    </el-form-item>
                    <el-form-item label="组织名称："  prop="name">
                        <el-input v-model="form.name" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                </div>
                <div style="display: flex;">
                    <div style="width: 50%; padding-left: 30px;">
                        <el-form-item label="是否成立统战机构：" prop="isUnited">
                            <el-radio-group v-model="form.isUnited" class="input-row" @input="selectValue" style="margin-top: 8px;">
                                <el-radio :label=1>是</el-radio>
                                <el-radio :label=0>否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div style="width: 50%;">
                        <el-form-item label="所属部门：" prop="deptId">
                            <div>{{ form.jcxfSysDept != null? form.jcxfSysDept.name: '' }}</div>
                            <organizationTreePopover style="width: 350px;" :parentDeptId="parentDeptId+''" @chooseDept="chooseDept"></organizationTreePopover>
                        </el-form-item>
                    </div>
                </div>
                <div v-if="form.isUnited">
                    <div style="font-size: 15px;color: #3a9df3;display: flex ;align-items: center;">
                        <div style="margin-left: 20px">分管领导基本信息</div>
                        <div style="width: 80%;height: 1px;background-color: #f0f1f3;margin-left: 20px"></div>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-form-item label="姓名："  prop="leaderName">
                            <el-input v-model="form.leaderName" size="small" placeholder="" autocomplete="off"
                                      maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label="职务："  prop="position">
                            <el-input v-model="form.position" size="small" placeholder="" autocomplete="off"
                                      maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-form-item label="联系电话："  prop="phone">
                            <el-input v-model="form.phone" size="small" placeholder="" autocomplete="off" maxlength="80"
                                      class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <div class="input-row"></div>
                        </el-form-item>
                    </div>
                    <div style="font-size: 15px;color: #3a9df3;display: flex ;align-items: center;">
                        <div style="margin-left: 20px">统战工作职能部门</div>
                        <div style="width: 80%;height: 1px;background-color: #f0f1f3;margin-left: 20px"></div>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-form-item label="部门名称："  prop="functionalName">
                            <el-input v-model="form.functionalName" size="small" placeholder="" autocomplete="off"
                                      maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label="部门负责人："  prop="master">
                            <el-input v-model="form.master" size="small" placeholder="" autocomplete="off"
                                      maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-form-item label="负责人联系人电话："  prop="masterPhone">
                            <el-input v-model="form.masterPhone" size="small" placeholder="" autocomplete="off"
                                      maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item label="主办人员:："  prop="sponsor">
                            <el-input v-model="form.sponsor" size="small" placeholder="" autocomplete="off"
                                      maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-form-item label="主办人联系人电话："  prop="sponsorPhone">
                            <el-input v-model="form.sponsorPhone" size="small" placeholder="" autocomplete="off"
                                      maxlength="80" class="input-row"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <div class="input-row"></div>
                        </el-form-item>
                    </div>
                </div>
            </div>
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
import {getDictByType2} from "@/api/tDictData";
import {addUnitedDept, getUnitedDept} from '@/api/tzUnitedDept'
import Vue from 'vue'
import {mapGetters} from "vuex";
import organizationTreePopover from "@/views/dj/components/organizationTreePopover.vue";

export default {
    name: 'updateActive',
    components: {
        organizationTreePopover
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        parentId: {
            type: Number
        },
        tradeDeptName: {
            type: String
        },
        modeTitle: {
            type: String
        },
        parentDeptId: {
            type: String
        }
    },
    data() {
        return {
            disabled: false,
            form: {
                deptId: '',
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
            },
            formLabelWidth: '150px',
            show: this.value,
            rules: {
                isUnited: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                position: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                leaderName: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                master: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                functionalName: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                sponsor: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '字段不能为空', trigger: 'blur'},
                    {
                        type: 'string',
                        message: '联系电话有误！',
                        trigger: 'blur',
                        pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/
                    }
                ],
                masterPhone: [
                    {required: true, message: '字段不能为空', trigger: 'blur'},
                    {
                        type: 'string',
                        message: '联系电话有误！',
                        trigger: 'blur',
                        pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/
                    }
                ],
                sponsorPhone: [
                    {required: true, message: '字段不能为空', trigger: 'blur'},
                    {
                        type: 'string',
                        message: '联系电话有误！',
                        trigger: 'blur',
                        pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/
                    }
                ],
                deptId: [
                    {required: true, message: '请选择所属部门', trigger: 'blur'}
                ]
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
            tradeTypeList: []
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        chooseDept(data) {
            this.form.deptId = data.id
        },
        selectValue(e) {

        },
        getUnitedDept(id) {
            getUnitedDept(id).then(res => {
                if (res.data.code == '00000') {
                    this.form = res.data.data
                }
            })
        },
        reset() {
            this.input = ''
            this.fileList = []
            this.form = {
                deptId: '',
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
            this.reset()
            this.$emit('close')
        },
        refresh() {
            this.reset()
            this.$emit('refresh')
        },
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                let unitedDept = this.form
                if (unitedDept.deptId == null || unitedDept.deptId == '') {
                    this.$message.info('请选择部门')
                    return
                }

                addUnitedDept({unitedDept: unitedDept}).then(res => {
                    if (res.data.code == '00000') {
                        this.$message.success('保存成功')
                        this.refresh()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }).catch((e) => {
                })
            })
        },
        init() {
            this.getDict('tradeType')
        },
        getDict(type) {
            getDictByType2(type).then(res => {
                let data = res.data
                if (type === 'tradeType') {
                    this.tradeTypeList = data
                }
            })
        }
    },
    watch: {
        value(val) {
            this.show = val
            if (val) {
                this.form.parentName = this.tradeDeptName
                this.form.parentId = this.parentId
                if (this.modeTitle == '编辑') {
                    this.getUnitedDept(this.form.parentId)
                }
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

.body {
    padding: 20px 0px 30px 0px;
    width: auto;
    /*display: flex;*/

    /*justify-content: center;*/


    .label {
        ::v-deep.el-form-item__label {
            margin-top: 10px;
            line-height: 18px;
        }
    }


    .el-form-item {
        line-height: 20px;

        .input-row {
            width: 350px;
        }

        margin-bottom: 15px;
    }

}
</style>
