<template>
    <el-dialog title="编辑" :visible.sync="modalShow" width="530px" append-to-body :close-on-click-modal="false" @close="close" class="editPayFee">
        <el-form ref="form" :model="detail" label-width="140px;">
            <el-form-item label="姓名:" class="input-row">
                {{ detail.name }}
            </el-form-item>
            <el-form-item label="缴纳月份:" class="input-row">
                {{ detail.payMonth }}
            </el-form-item>
            <el-form-item label="应缴费用（元）:" class="input-row">
                <el-input-number v-model="detail.shouldPay" :min="0.01" :precision="2"></el-input-number>
            </el-form-item>
            <el-form-item label="备注:" class="input-row">
                <el-input type="textarea" rows="5" maxlength="1000" show-word-limit
                          style="width: 100%; font-size: 13px;" placeholder="请输入备注（1000字以内）"
                          v-model="detail.remark">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="footer">
            <el-button size="small" @click="close">关闭</el-button>
            <el-button size="small" type="primary" @click="updateDetail()">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {getPayFeeDetailById, updatePayFeeDetail} from "@/api/jcxfPayFeeDetail";

export default {
    name: "editPayFee",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            default: null
        }
    },
    watch: {
        show() {
            this.modalShow = this.show
            if (this.modalShow) {
                this.getPayFeeDetail()
            }
        }
    },
    data() {
        return {
            modalShow: false,
            detail: {}
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        getPayFeeDetail() {
            getPayFeeDetailById(this.id + '').then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.detail = data.data
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        updateDetail() {
            let data = {
                id: this.detail.id + '',
                shouldPay: this.detail.shouldPay + '',
                remark: this.detail.remark
            }
            updatePayFeeDetail(data).then(res => {
                const data = res.data
                if (data.code == '00000') {
                    this.$message.success('保存成功')
                    this.close()
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.editPayFee {
    /deep/.el-icon-minus {
        line-height: 38px;
    }
    /deep/.el-icon-plus {
        line-height: 38px;
    }
}
</style>
