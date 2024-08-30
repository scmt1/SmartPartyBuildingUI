<template>
    <el-dialog title="修改党费标准" :visible.sync="dialogVisible" width="520px" @close="dialogVisible = false" append-to-body
               class="payFeeStandardModal">
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px" v-loading="saveLoading" :disabled="disabled">
            <div style="display: flex;justify-content: space-evenly;font-weight: bold;font-size: 16px;margin-bottom: 15px;">
                <p>{{ realName }}</p>
                <p>{{ currentMonth }}月份</p>
                <p>当前党费（元）：{{ currentShouldPay }}</p>
            </div>
            <el-form-item prop="paymentType" label="交纳类型：">
                <el-select v-model="form.paymentType" clearable placeholder="请选择" @change="onSelectChange"
                           style="width: 80%;">
                    <el-option v-for="(item,index) in paymentTypeList" :key="index" :label="item"
                               :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="paymentReason" label="原因：" v-if="form.paymentType !== '按工资比例交纳'">
                <el-select v-model="form.paymentReason" clearable placeholder="请选择" style="width: 80%;">
                    <el-option v-for="(item,index) in paymentReasonList" :key="index" :label="item"
                               :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="reasonOther" label="其他说明：" v-if="form.paymentReason === '其他'">
                <el-input type="textarea" :autosize="{ minRows: 4}" maxlength="200" show-word-limit placeholder="请输入内容"
                          v-model="form.reasonOther" style="width: 80%;"></el-input>
            </el-form-item>
            <el-form-item prop="paymentBase" label="交纳基数：" v-if="form.paymentType === '按工资比例交纳'">
                <el-input-number v-model="form.paymentBase" controls-position="right" :min="0" style="width: 80%;"
                                 @blur="onPaymentBaseChange"></el-input-number>
            </el-form-item>

            <el-form-item prop="paymentRatio" label="交纳比例：" v-if="form.paymentType === '按工资比例交纳'">
                <span>{{ form.paymentRatio }}</span>
            </el-form-item>
            <el-form-item prop="shouldPay" label="党费交纳标准：">
                <span style="color: rgb(244, 110, 101);"
                      v-if="form.paymentType === '按工资比例交纳' || form.paymentType === '免交'"> {{ form.shouldPay }}（元）</span>
                <el-input-number v-else v-model="form.shouldPay" :min="0" controls-position="right"
                                 style="width: 80%;"></el-input-number>
            </el-form-item>

            <el-form-item prop="confirmMaterial" label="印证材料：" v-if="form.paymentType !== '按工资比例交纳'">
                <el-upload
                        v-loading="uploadLoading"
                        accept='.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP'
                        class="avatar-uploader"
                        :action="'#'"
                        :show-file-list="false"
                        :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                        :before-upload="beforeImageUpload">
                    <img v-if="form.confirmMaterial" :src="form.confirmMaterial" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <cropper ref="cropper" :auto-crop-width="200" :auto-crop-height="150" :fixed="false"
                     @cropperResult="uploadCropperImg"></cropper>

        </el-form>
        <div slot="footer" class="footer">
            <el-button size="small" @click="dialogVisible=false">关闭</el-button>
            <el-button v-if="!disabled" size="small" type="primary" @click="submitForm()" v-loading="saveLoading">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {uploadFile} from "@/api/minionFile";
import cropper from "@/views/dj/components/cropper.vue";
import {
    getShouldPayData,
    queryPayFeeDetailByPerson,
    updatePayFeeDetailByBatchMonth
} from "../../../api/jcxfPayFeeDetail";

export default {
    name: "payFeeStandardModal",
    components: {
        cropper
    },
    data() {
        return {
            dialogVisible: false,
            uploadLoading: false,
            saveLoading: false,
            form: {
                paymentType: '按工资比例交纳',
                paymentReason: '',
                reasonOther: '',
                paymentBase: null,
                paymentRatio: '0.00%',
                confirmMaterial: '',
                shouldPay: '0.00',
            },
            formRules: {
                paymentType: [
                    {required: true, message: '交纳类型不能为空', trigger: 'blur'},
                ],
                paymentReason: [
                    {required: true, message: '原因不能为空', trigger: 'blur'},
                ],
                reasonOther: [
                    {required: true, message: '其他说明不能为空', trigger: 'blur'},
                ],
                paymentBase: [
                    {required: true, message: '交纳基数不能为空', trigger: 'blur'},
                ],
                shouldPay: [
                    {required: true, message: '交纳标准不能为空', trigger: 'blur'},
                ],
            },
            paymentTypeList: ['按工资比例交纳', '按标准交纳', '少交', '免交'],
            paymentReasonList1: ['固定金额交纳', '其他'],
            paymentReasonList2: ['特别贫困', '其他'],
            paymentReasonList: [],

            realName: '',
            currentMonth: '',
            currentYear: '',
            currentShouldPay: '0.00',

            monthArray: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
            partyMemberId: '',
            disabled: false,
            openType: null
        }
    },
    methods: {
        initOpen(row, year, month, flag) {
            this.openType = 1
            this.disabled = flag
            this.saveLoading = false
            this.dialogVisible = true
            this.currentYear = year;
            this.currentMonth = month;
            this.form = {
                paymentType: '按工资比例交纳',
                paymentReason: '',
                reasonOther: '',
                paymentBase: null,
                paymentRatio: '0.00%',
                confirmMaterial: '',
                shouldPay: '0.00',
            }
            this.saveLoading  = true
            queryPayFeeDetailByPerson({partyMemberId: String(row.partyMemberId), payMonth: this.currentYear + '-' + this.currentMonth}).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    if(data.data) {
                        this.form = data.data
                        this.form.paymentType = data.data.paymentType || '按工资比例交纳'

                        if(this.form.status === 1) {
                            //说明已交了
                            this.disabled = true
                        }
                    }
                }
                this.saveLoading  = false
            })
            this.realName = row.name
            this.partyMemberId = row.partyMemberId
            this.currentShouldPay = row[this.monthArray[month - 1]] || '0.00'

            this.form.payMonth = this.currentYear + '-' + this.currentMonth
        },
        repayOpen(row) {
            this.openType = 2
            this.saveLoading = false
            this.dialogVisible = true
            this.saveLoading  = true
            queryPayFeeDetailByPerson({partyMemberId: String(row.partyMemberId), payMonth: row.payMonth}).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    if(data.data) {
                        this.form = data.data
                        this.form.paymentType = data.data.paymentType || '按工资比例交纳'
                    }
                }
                this.saveLoading  = false
            })
            this.realName = row.name
            this.partyMemberId = row.partyMemberId
            this.currentShouldPay = row.shouldPay || '0.00'

            this.form.payMonth = row.payMonth
            this.form.id = row.id
        },
        submitForm() {
            this.saveLoading = true
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    this.saveLoading = false
                    return false
                }
                if (this.form.paymentType === '按工资比例交纳' && this.form.paymentBase === 0) {
                    this.saveLoading = false
                    this.$message.error("按工资比例交纳时交纳基数必须大于0")
                    return false
                }
                if (this.form.paymentType !== '免交' && this.form.shouldPay === 0) {
                    this.saveLoading = false
                    this.$message.error("党费交纳标准必须大于0")
                    return false
                }
                let data = {
                    tzPayFeeDetail: {
                        partyMemberId: String(this.partyMemberId),
                        ...this.form
                    }
                }
                if(this.openType === 1) {
                    updatePayFeeDetailByBatchMonth(data).then(res => {
                        let data = res.data
                        if (data.code == '00000') {
                            this.$message.success("保存成功！")
                            this.dialogVisible = false
                            this.$emit('refresh')
                        }
                    })
                }else {
                    //单个的需返回上一个界面，由上一个界面进行更新
                    this.dialogVisible = false
                    this.$emit('refresh', this.form)
                }
            })
        },
        onSelectChange(e) {
            this.form.paymentReason = ''
            this.form.reasonOther = ''
            this.form.paymentBase = null
            this.form.paymentRatio = '0.00%'
            this.form.confirmMaterial = ''
            this.form.shouldPay = '0.00'

            if (this.form.paymentType === '按标准交纳') {
                this.paymentReasonList = this.paymentReasonList1
            } else {
                this.paymentReasonList = this.paymentReasonList2
            }

            if (this.form.paymentType === '免交') {
                this.form.shouldPay = '0.00'
            }
        },
        beforeImageUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt5M = file.size / 1024 / 1024 < 5

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式!')
            }
            if (!isLt5M) {
                this.$message.error('上传图片大小不能超过 5MB!')
            }

            this.$refs.cropper.init(file)
        },
        uploadCropperImg(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                this.uploadLoading = true
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.uploadLoading = false
                        this.form.confirmMaterial = res.data.url
                    }
                })
            }
        },
        onPaymentBaseChange() {
            if(!this.form.paymentBase) {
                return
            }
            let data = {
                paymentBase: String(this.form.paymentBase),
                partyMemberId: String(this.partyMemberId),
            }
            getShouldPayData(data).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.form.paymentRatio = data.data.proportion
                    this.form.shouldPay = data.data.shouldPay
                }
            })
        }
    }
}
</script>

<style lang="less">
.payFeeStandardModal {
    .avatar-uploader ::v-deep .el-upload {
        border: 1px dashed #d9d9d9 !important;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader ::v-deep .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 150px;
        line-height: 150px;
        text-align: center;
    }

    .el-input-number__decrease, .el-input-number__increase {
        font-size: 19px !important;
    }
}
</style>
