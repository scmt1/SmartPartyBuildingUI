<template>
    <el-dialog :visible.sync="show" title="工作机构" top="20px" width="1000px" :close-on-click-modal="false"
               :close-on-press-escape="false" @opened="init" @close="close()">
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" :label-width="formLabelWidth" v-if="show">
            <div class="body">
                <div style="margin-left:-10px; flex: 1;">
                    <el-form-item label="所属工会：" prop="parentName">
                        <el-input :disabled="true" v-model="form.parentName" size="small" placeholder=""
                                  autocomplete="off" maxlength="80" class="input-row"></el-input>
                    </el-form-item>
                    <el-form-item label="工会类型：" prop="type">
                        <el-select v-model="form.type" placeholder="请选择" class="input-row" size="mini">
                            <el-option v-for="(item,index) in tradeTypeList" :key="index" :label="item.label"
                                       :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公司职务：" prop="position">
                        <el-input v-model="form.position" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                    <el-form-item label="工会总人数：" prop="personCount">
                        <el-input-number v-model="form.personCount" :min="0" size="small"></el-input-number>
                        <!--                        <el-input v-model="form.personCount" size="small" placeholder="" autocomplete="off" maxlength="80" class="input-row"></el-input>-->
                    </el-form-item>
                    <el-form-item label="所属部门：" prop="deptId">
                        <div>{{ form.jcxfSysDept != null? form.jcxfSysDept.name: '' }}</div>
                        <organization-tree-popover :parentDeptId="parentDeptId" @chooseDept="chooseDept"></organization-tree-popover>
                    </el-form-item>
                </div>
                <div style="margin-left:10px; flex: 1;">
                    <el-form-item label="工会名称：" prop="name">
                        <el-input v-model="form.name" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                    <el-form-item label="工会负责人：" prop="master">
                        <el-input v-model="form.master" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：" prop="phone">
                        <el-input v-model="form.phone" size="small" placeholder="" autocomplete="off" maxlength="80"
                                  class="input-row"></el-input>
                    </el-form-item>
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
import {addTradeUnion, getTradeUnion} from '@/api/tzTradeUnion'
import organizationTreePopover from "@/views/dj/components/organizationTreePopover.vue";
import Vue from 'vue'
import {mapGetters} from "vuex";

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
        tradeName: {
            type: String
        },
        modeTitle: {
            type: String
        }
    },
    data() {
        return {
            disabled: false,
            form: {
                parentName: '',
                type: '',
                position: '',
                personCount: 0,
                name: '',
                master: '',
                phone: '',
                parentId: '',
                deptId:""
            },
            formLabelWidth: '110px',
            show: this.value,
            rules: {
                type: [
                    {required: true, message: '请选择工会类型', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入公会名称', trigger: 'blur'}
                ],
                phone: [
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
            tradeTypeList: [],
            parentDeptId: null
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
            /*this.form.jcxfSysDept.id = data.id
            this.form.jcxfSysDept.name = data.name*/
        },
        getTradeUnionById(id) {
            getTradeUnion(id).then(res => {
                if (res.data.code == '00000') {
                    this.form = res.data.data;
                    this.form.type = this.form.type.toString();
                    if (this.form.jcxfSysDept && this.form.jcxfSysDept != null) {
                        this.parentDeptId = this.deptInfo.id
                    } else {
                        this.parentDeptId = this.form.jcxfSysDept.parentId
                    }
                }
            })
        },
        reset() {
            this.input = ''
            this.fileList = []
            this.form = {
                parentName: '',
                type: '',
                position: '',
                personCount: '',
                name: '',
                master: '',
                phone: '',
                parentId: ''
            }
        },
        close() {
            this.reset()
            this.$emit('close')
        },
        refresh(id) {
            this.reset()
            this.$emit('refresh',id)
        },
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                let trade = this.form
                if (this.form.deptId == null || this.form.deptId == '') {
                    this.$message.info('请选择部门')
                    return
                }

                addTradeUnion({trade: trade}).then(res => {
                    if (res.data.code == '00000') {
                        this.$message.success('保存成功')
                        this.refresh(res.data.data.id)
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
                this.form.parentName = this.tradeName
                this.form.parentId = this.parentId
                if (this.modeTitle == '编辑') {
                    this.getTradeUnionById(this.form.parentId)
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.modal-header {
    padding: 5px 10px;
    text-align: center;

    .modal-title {
        font-size: 16px;
    }
}

.body {
    padding: 20px 10px 30px 10px;
    width: auto;
    display: flex;

    justify-content: center;

    &:hover {
        .demo-upload-list-cover {
            display: block;
        }
    }


    .label {
        ::v-deep.el-form-item__label {
            /*margin-top: 10px;*/
            /*line-height: 18px;*/
        }
    }


    .el-form-item {
        line-height: 20px;

        .input-row {
            width: 100%;
        }

        margin-bottom: 15px;
    }

}
/deep/.el-input--mini .el-input__inner {
    height: 32px;
    line-height: 32px;
}
/deep/.el-form-item__label{
    line-height: 32px;
}
/deep/.el-icon-minus {
    line-height: 30px;
}
/deep/.el-icon-plus {
    line-height: 30px;
}
</style>
