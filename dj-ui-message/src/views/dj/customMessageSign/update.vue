<template>
    <div>
        <el-dialog :title="title" :visible.sync="show" width="600px" @close="close()">
            <el-form ref="form" :rules="rules" label-width="120px" :model="form">
                <el-form-item prop="sign" label="签名：">
                    <el-input style="width: 400px;" size="small" v-model="form.sign" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="footer">
                <el-button size="small" type="info" @click="close">取消</el-button>
                <el-button size="small" style="background: #db0521;color:white" @click="save">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {saveMessageSign, getMessageSign,updateMessageSign} from "@/api/tzMessageSign";

export default {
    name: "update",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        id: {
            type: Number
        }
    },
    data() {
        return {
            form: {
                sign: null
            },
            labelWidth: '100px',
            rules: {
                sign: [
                    {required: true, message: '签名不能为空', trigger: 'blur'}
                ],
            },
            modalShow: false,
            show: this.value,
            title: '',
        }
    },
    methods: {
        save() {
            this.$refs.form.validate((validate) => {
                if (!validate) {
                    return false
                }
                let data = {
                    tzMessageSign:{
                        sign: this.form.sign,
                        id: this.id,
                    }
                }
                if(this.id){
                    updateMessageSign(data).then(res => {
                        if (res.data.code == '00000') {
                            this.$message.success("修改成功")
                            this.refresh()
                        }
                    })
                }else{
                    saveMessageSign(data).then(res => {
                        if (res.data.code == '00000') {
                            this.$message.success("提交成功")
                            this.refresh()
                        }
                    })
                }
            })
        },
        close() {
            this.show = false
            this.form = {
                sign:''
            }
            this.$emit('close')
        },
        refresh() {
            this.show = false
            this.form = {
                sign:''
            }
            this.$emit('refresh')
        },
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.title = this.modalTitle
                if (this.id) {
                    getMessageSign(this.id).then(res => {
                        if (res.data.code == '00000') {
                            this.form.sign = res.data.data.sign
                        }
                    })
                }
            }
        }
    },
}
</script>

<style lang="scss" scoped>

.footer {
    text-align: right;
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
}
</style>
