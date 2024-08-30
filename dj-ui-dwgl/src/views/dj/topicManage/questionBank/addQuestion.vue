<template>
    <Modal v-model="show" :mask-closable="false" :closable="false" width="600px">
        <div>
            <div class="modal-header">
                <h1 class="modal-title">{{ modalTitle }}</h1>
            </div>
            <div class="body">
                <el-form ref="form" :model="form" :rules="rules" :disabled="disabled"
                >
                    <el-form-item label="题库名字：" :label-width="formLabelWidth" prop="name" class="input-row">
                        <el-input v-model="form.name" size="small" placeholder="请填写名字" autocomplete="off"
                                  class="input-row"></el-input>
                    </el-form-item>
                    <el-form-item label="题库描述：" :label-width="formLabelWidth" prop="description" class="input-row">
                        <el-input v-model="form.description" placeholder="请输入简介（不超过500字符）" type="textarea"
                                  rows="5" show-word-limit size="small" class="input-row" maxlength="500"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
        </div>
    </Modal>
</template>

<script>
import {findQuestionBankById, addQuestionBank} from '@/api/tzQuestionBank.js'
import {mapGetters} from "vuex";

export default {
    name: "questBankManage",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        questionId: {
            type: String
        }
    },
    data() {
        return {
            formLabelWidth: '100px',
            disabled: false,
            show: this.value,
            form: {},
            rules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                ],
                description: [
                    {required: true, message: '该字段不能为空', trigger: 'blur'},
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
        findQuestionBankById() {
            let data = {id: this.questionId}
            findQuestionBankById({data: data}).then(res => {
                if (res.data.code == '00000') {
                    this.form = res.data.data
                }
            })
        },
        submitForm() {
            let deptId = this.deptInfo.id
            let that = this
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                this.form.deptId = deptId
                let data = this.form
                addQuestionBank({data: data}).then(res => {
                    if (res.data.code = '00000') {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            //duration: 1000
                        })
                    } else {
                        this.$message({
                            message: '保存失败',
                            type: 'error',
                            //duration: 1000
                        })
                    }
                    that.close()
                }).catch((e) => {

                })
            })
        },
        reset() {
            this.disabled = false
            this.modalTitle = ''
            this.form = {}
        },
        close() {
            this.reset()
            this.show = false
            this.$emit('input', false)
            this.$emit('close')
        },
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                // this.title = this.modalTitle
                if (this.modalTitle === '新增') {

                } else {
                    this.findQuestionBankById()
                }
                if (this.modalTitle === '详情') {
                    this.disabled = true
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
.modal-header {
    text-align: center;
}
</style>
