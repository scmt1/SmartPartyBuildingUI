<template>
    <el-dialog :title="title" :visible.sync="show" width="600px" @close="close()">
        <div class="modal-content">
            <el-form ref="form" :rules="rules" label-width="100px" :model="form"
                     style="text-align: left; padding: 0 20px 0 20px;">
                <el-form-item label="占位符选择：" v-if="form.isVariable ==1">
                    <div>
                        <template v-for="(item, index) in checkboxList">
                            <el-checkbox v-model="checkboxSelectMap[item.itemValue+'_index']" :label="item.label"
                                         @change="checkLabel(item)"></el-checkbox>
                        </template>
                    </div>
                </el-form-item>
                <el-form-item label="任务名称：">
                    <el-input style="width: 400px;" size="small" v-model="form.missionName"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模板名称：">
                    <el-input style="width: 400px;" size="small" v-model="form.temName"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sign" label="短信签名：">
                    <el-input style="width: 400px;" size="small" v-model="form.sign" :disabled="true"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="temContent" label="内容编辑：">
                    <el-input style="width: 400px;" maxlength="500" :rows="5" show-word-limit
                              v-model="form.temContent"
                              type="textarea" placeholder="请输入内容" autocomplete="off"
                              :disabled="form.temId != null && form.temId != ''"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="添加备注：">
                    <el-input style="width: 400px;" maxlength="500" :rows="5" show-word-limit v-model="form.remark"
                              type="textarea" placeholder="请输入内容" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="footer">
                <el-button size="small" style="background: #db0521;color:white;border-color: #db0521;" @click="close">
                    取消
                </el-button>
                <el-button size="small" style="background: #db0521;color:white;border-color: #db0521;" @click="save">
                    保存
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import {queryMessageAutoByAdmin, updateMessageAutoById} from "@/api/tzAutoMessage.js"
import {mapGetters} from "vuex";

export default {
    name: "update",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // eslint-disable-next-line vue/require-default-prop
        modalTitle: {
            type: String
        },
        id: {
            type: String
        }
    },
    data() {
        return {
            name: '',
            year: '',
            checkedName: false,
            checkedYear: false,
            form: {
                isVariable: null
            },
            rules: {
                temContent: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                sign: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ],
                remark: [
                    {required: true, message: '字段不能为空', trigger: 'blur'}
                ]
            },
            modalShow: false,
            show: this.value,
            title: '',
            deptId: '',
            checkboxList: [],
            checkboxSelectMap: {}
        }
    },
    methods: {
        checkLabel(item) {
            if (this.form.temContent.indexOf(item.itemValue) > -1) {
                this.form.temContent = this.form.temContent.replace(item.itemValue, "");
            } else {
                this.form.temContent += item.itemValue
            }
        },
        save() {
            if (this.form.isVariable == 1) {
                if (!this.checkedName && !this.checkedYear) {
                    this.$message.error("请至少选择一个占位符")
                    return false
                }
            }

            this.$refs.form.validate((validate) => {
                if (!validate) {
                    return false
                }

                let data = {
                    tzMessageAuto: {
                        id: this.id,
                        missionName: this.form.missionName,
                        temName: this.form.temName,
                        temContent: this.form.temContent,
                        remark: this.form.remark
                    }
                }
                updateMessageAutoById(data).then(res => {
                    if (res.data.code == '00000') {
                        this.$message.success("修改成功")
                        this.refresh()
                    } else {
                        this.$message.error("修改失败")
                    }
                })
            })
        },
        CheckAllYear(e) {
            if (e) {
                this.form.temContent += "{year}";
            } else {
                this.form.temContent = this.form.temContent.replace("{year}", "");
            }
        },
        CheckAllName(e) {
            if (e) {
                this.form.temContent += "{name}";
            } else {
                this.form.temContent = this.form.temContent.replace("{name}", "");
            }
        },
        queryMessageAutoById() {
            queryMessageAutoByAdmin(this.id).then(res => {
                if (res.data.code == '00000') {
                    this.form = res.data.data

                    if (this.form.isVariable == 1) {
                        for (let i = 0; i < this.form.variableContent.split(',').length; i++) {
                            const data = this.form.variableContent.split(',')[i]
                            const value = data.split(':')
                            let val = {
                                label: value[0],
                                itemValue: value[1]
                            }
                            this.checkboxList.push(val)
                            if (this.form.temContent.indexOf(value[1]) > -1) {
                                this.checkboxSelectMap[value[1] + '_index'] = true
                            } else {
                                this.checkboxSelectMap[value[1] + '_index'] = false
                            }
                        }
                        this.$forceUpdate()
                    }
                }
            })
        },
        close() {
            this.checkedName = false
            this.checkedYear = false
            this.show = false
            this.form = {}
            this.$emit('close')
        },
        refresh() {
            this.checkedName = false
            this.checkedYear = false
            this.show = false
            this.form = {}
            this.$emit('refresh')
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.checkboxList = []
                this.deptId = this.deptInfo.id + ''
                this.title = this.modalTitle
                this.queryMessageAutoById()
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
