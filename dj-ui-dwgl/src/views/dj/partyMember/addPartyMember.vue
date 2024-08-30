<template>
    <div>
        <el-row :gutter="15">
            <el-form ref="from" :model="form" :rules="rules" size="medium" label-width="120px">
                <el-col :span="6">
                    <el-form-item label="姓名" prop="realName">
                        <el-input v-model="form.realName" placeholder="请输入姓名" clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="身份证号" prop="idcard">
                        <el-input v-model="form.idcard" placeholder="请输入身份证号" clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="form.sex" size="medium">
                            <el-radio v-for="(item, index) in sexOptions" :key="index" :label="item.value"
                                      :disabled="item.disabled">{{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="学历" prop="education">
                        <el-select v-model="form.education" placeholder="请选择学历" clearable>
                            <el-option v-for="(item, index) in educationOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="民族" prop="nation">
                        <el-select v-model="form.nation" placeholder="请选择民族" clearable>
                            <el-option v-for="(item, index) in nationOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="人员类别" prop="personType">
                        <el-select v-model="form.personType" placeholder="请选择人员类别" clearable
                        >
                            <el-option v-for="(item, index) in personTypeOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="出生日期" prop="birthday">
                        <el-date-picker v-model="form.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        placeholder="请选择出生日期"
                                        clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="入党时间" prop="partyTime">
                        <el-date-picker v-model="form.partyTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        placeholder="请选择入党时间"
                                        clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="转为正式党员日期" prop="transferTime">
                        <el-date-picker v-model="form.transferTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        placeholder="请选择转为正式党员日期"
                                        clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="党支部职务" prop="position">
                        <el-select v-model="form.position" placeholder="请选择党支部职务" clearable
                        >
                            <el-option v-for="(item, index) in positionOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="座机号码" prop="telephone">
                        <el-input v-model="form.telephone" placeholder="请输入座机号码(以-分割)" clearable
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="form.phone" placeholder="请输入手机号码" clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="党籍状态" prop="partyState">
                        <el-select v-model="form.partyState" placeholder="请选择党籍状态" clearable
                        >
                            <el-option v-for="(item, index) in partyStateOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="外出流向" prop="flowPlace">
                        <el-input v-model="form.flowPlace" placeholder="请输入外出流向" :maxlength="50" clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="所属部门" prop="deptName">
                        <el-select v-model="form.deptName" placeholder="请选择所属部门" clearable
                        >
                            <el-option v-for="(item, index) in deptNameOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="工作单位区域" prop="areaName">
                        <el-select v-model="form.areaName" placeholder="请选择工作单位区域" clearable
                        >
                            <el-option v-for="(item, index) in areaNameOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工作岗位" prop="workPosition">
                        <el-select v-model="form.workPosition" placeholder="请选择工作岗位" clearable>
                            <el-option v-for="(item, index) in workPositionOptions" :key="index" :label="item.label"
                                       :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="失联党员" prop="isLost">
                        <el-radio-group v-model="form.isLost" size="medium">
                            <el-radio v-for="(item, index) in isLostOptions" :key="index" :label="item.value"
                                      :disabled="item.disabled">{{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="第一书记" prop="isFirstSecretary">
                        <el-radio-group v-model="form.isFirstSecretary" size="medium">
                            <el-radio v-for="(item, index) in isFirstSecretaryOptions" :key="index" :label="item.value"
                                      :disabled="item.disabled">{{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="困难党员" prop="isSuffer">
                        <el-radio-group v-model="form.isSuffer" size="medium">
                            <el-radio v-for="(item, index) in isSufferOptions" :key="index" :label="item.value"
                                      :disabled="item.disabled">{{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="市外转接" prop="isOutsideCity">
                        <el-radio-group v-model="form.isOutsideCity" size="medium">
                            <el-radio v-for="(item, index) in isOutsideCityOptions" :key="index" :label="item.value"
                                      :disabled="item.disabled">{{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上传头像" prop="upload">
                        <el-upload ref="upload" :file-list="uploadfileList" :action="uploadAction" :auto-upload="false"
                                   :before-upload="uploadBeforeUpload" accept="image/*" list-type="picture-card">
                            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传不超过 2MB 的image/*文件</div>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item size="large">
                        <el-button type="primary" @click="submitForm">提交</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>
<script>
export default {
    components: {},
    props: [],
    data() {
        return {
            form: {
                realName: undefined,
                idcard: undefined,
                sex: 1,
                education: undefined,
                nation: undefined,
                personType: undefined,
                birthday: '',
                partyTime: '',
                transferTime: '',
                position: undefined,
                telephone: undefined,
                phone: undefined,
                partyState: undefined,
                flowPlace: undefined,
                deptName: undefined,
                areaName: undefined,
                workPosition: undefined,
                isLost: undefined,
                isFirstSecretary: 1,
                isSuffer: '',
                isOutsideCity: 1,
                upload: null,
            },
            rules: {
                realName: [{
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                }],
                idcard: [{
                    required: true,
                    message: '请输入身份证号',
                    trigger: 'blur'
                }],
                sex: [{
                    required: true,
                    message: '性别不能为空',
                    trigger: 'change'
                }],
                education: [{
                    required: true,
                    message: '请选择学历',
                    trigger: 'change'
                }],
                nation: [{
                    required: true,
                    message: '请选择民族',
                    trigger: 'change'
                }],
                personType: [{
                    required: true,
                    message: '请选择人员类别',
                    trigger: 'change'
                }],
                birthday: [{
                    required: true,
                    message: '请选择出生日期',
                    trigger: 'change'
                }],
                partyTime: [{
                    required: true,
                    message: '请选择入党时间',
                    trigger: 'change'
                }],
                transferTime: [{
                    required: true,
                    message: '请选择转为正式党员日期',
                    trigger: 'change'
                }],
                position: [{
                    required: true,
                    message: '请选择党支部职务',
                    trigger: 'change'
                }],
                telephone: [],
                phone: [{
                    required: true,
                    message: '请输入手机号码',
                    trigger: 'blur'
                }],
                partyState: [{
                    required: true,
                    message: '请选择党籍状态',
                    trigger: 'change'
                }],
                flowPlace: [],
                deptName: [],
                areaName: [],
                workPosition: [],
                isLost: [{
                    required: true,
                    message: '失联党员不能为空',
                    trigger: 'change'
                }],
                isFirstSecretary: [{
                    required: true,
                    message: '第一书记不能为空',
                    trigger: 'change'
                }],
                isSuffer: [{
                    required: true,
                    message: '困难党员不能为空',
                    trigger: 'change'
                }],
                isOutsideCity: [{
                    required: true,
                    message: '市外转接不能为空',
                    trigger: 'change'
                }],
            },
            uploadAction: 'https://jsonplaceholder.typicode.com/posts/',
            uploadfileList: [],
            sexOptions: [{
                "label": "男",
                "value": 1
            }, {
                "label": "女",
                "value": 0
            }],
            educationOptions: [{
                "label": "大学",
                "value": "大学"
            }, {
                "label": "研究生",
                "value": "研究生"
            }],
            nationOptions: [{
                "label": "汉族",
                "value": "汉族"
            }, {
                "label": "彝族",
                "value": "彝族"
            }],
            personTypeOptions: [{
                "label": "书记",
                "value": "书记"
            }, {
                "label": "其他",
                "value": "其他"
            }],
            positionOptions: [{
                "label": "书记",
                "value": "书记"
            }, {
                "label": "其他",
                "value": "其他"
            }],
            partyStateOptions: [{
                "label": "汉族",
                "value": "汉族"
            }, {
                "label": "彝族",
                "value": "彝族"
            }],
            deptNameOptions: [{
                "label": "部门1",
                "value": "部门1"
            }, {
                "label": "部门2",
                "value": "部门2"
            }],
            areaNameOptions: [{
                "label": "部门1",
                "value": "部门1"
            }, {
                "label": "部门2",
                "value": "部门2"
            }],
            workPositionOptions: [{
                "label": "部门1",
                "value": "部门1"
            }, {
                "label": "部门2",
                "value": "部门2"
            }],
            isLostOptions: [{
                "label": "是",
                "value": 1
            }, {
                "label": "否",
                "value": 0
            }],
            isFirstSecretaryOptions: [{
                "label": "是",
                "value": 1
            }, {
                "label": "否",
                "value": 0
            }],
            isSufferOptions: [{
                "label": "是",
                "value": 1
            }, {
                "label": "否",
                "value": 0
            }],
            isOutsideCityOptions: [{
                "label": "是",
                "value": 1
            }, {
                "label": "否",
                "value": 0
            }],
        }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
        submitForm() {
            this.$refs['from'].validate(valid => {
                if (!valid) return
                // TODO 提交表单
            })
        },
        resetForm() {
            this.$refs['from'].resetFields()
        },
        uploadBeforeUpload(file) {
            let isRightSize = file.size / 1024 / 1024 < 2
            if (!isRightSize) {
                this.$message.error('文件大小超过 2MB')
            }
            let isAccept = new RegExp('image/*').test(file.type)
            if (!isAccept) {
                this.$message.error('应该选择image/*类型的文件')
            }
            return isRightSize && isAccept
        },
        submitUpload() {
            this.$refs['upload'].submit()
        },
    }
}

</script>
<style scoped>
.el-upload__tip {
    line-height: 1.2;
}

</style>
