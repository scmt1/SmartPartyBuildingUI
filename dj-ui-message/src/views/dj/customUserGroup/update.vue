<template>
    <div>
        <el-dialog :title="title" :visible.sync="show" width="600px" @close="close()">
            <el-form ref="form" :rules="rules" label-width="120px" :model="form">
                <el-form-item prop="tagName" label="用户组名称：">
                    <el-input style="width: 400px;" size="small" v-model="form.tagName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-button size="small" type="primary" @click="chooseUser" style="margin-bottom: 10px;">选择用户</el-button>
            <el-table
                    max-height="500"
                    v-loading="tableLoading"
                    :data="tableData"
                    :header-cell-style="{'text-align':'center',background : '#f8f8f9'}"
                    border
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column type="index" align="center" windth="60"/>
                <el-table-column label="姓名" prop="realName" min-width="100" align="center"/>
                <el-table-column label="手机号码" prop="phone" min-width="150" align="center"/>
            </el-table>
            <div slot="footer" class="footer">
                <el-button size="small" type="info" @click="close">取消</el-button>
                <el-button size="small" style="background: #db0521;color:white" @click="save">保存</el-button>
            </div>
        </el-dialog>
        <select-send :value="selectSendShow" :selectSendObject="tableData" @cancel="cancel" @confirm="confirm"/>
    </div>
</template>
<script>
import {mapGetters} from "vuex";
import selectSend from '@/components/selectSend/index'
import {addCustomUserTag, getCustomUserTag} from "../../../api/tzUserTag";

export default {
    name: "update",
    components: {selectSend},
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
                tagName: null
            },
            labelWidth: '100px',
            rules: {
                tagName: [
                    {required: true, message: '用户组名称不能为空', trigger: 'blur'}
                ],
            },
            modalShow: false,
            show: this.value,
            title: '',
            deptId: '',
            tableLoading: false,
            tableData: [],
            selectSendShow: false,
        }
    },
    methods: {
        save() {
            this.$refs.form.validate((validate) => {
                if (!validate) {
                    return false
                }
                if (this.tableData.length == 0) {
                    this.$message.error("请选择对应的用户")
                    return false
                }
                let data = {
                    tagName: this.form.tagName,
                    id: this.id,
                    userIdList: this.tableData.map(item => String(item.id))
                }
                addCustomUserTag(data).then(res => {
                    if (res.data.code == '00000') {
                        this.$message.success("提交成功")
                        this.refresh()
                    }
                })
            })
        },
        close() {
            this.show = false
            this.form = {}
            this.$emit('close')
        },
        refresh() {
            this.show = false
            this.form = {}
            this.$emit('refresh')
        },
        chooseUser() {
            this.selectSendShow = true
        },
        confirm(selected) {
            this.tableData = selected
            this.cancel()
        },
        cancel() {
            this.selectSendShow = false
        },
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
                this.deptId = this.deptInfo.id + ''
                this.title = this.modalTitle
                this.tableData = []
                if (this.id) {
                    getCustomUserTag({id: this.id}).then(res => {
                        if (res.data.code == '00000') {
                            this.form.tagName = res.data.data.tagName
                            this.tableData = res.data.data.tableData
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
