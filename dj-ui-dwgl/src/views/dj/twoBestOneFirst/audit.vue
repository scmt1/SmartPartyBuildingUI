<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body width="560px" @close="close(false)">
        <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
            <el-form-item prop="auditMessage" label="审核意见：">
                <el-input type="textarea" :autosize="{ minRows: 4}" maxlength="100" show-word-limit placeholder="请输入内容"
                          v-model="form.auditMessage"></el-input>
            </el-form-item>
            <el-form-item prop="commendType" label=" 表彰/表扬类型：" v-if="lastAudit && status == '1'">
                <el-select class="table-item" v-model="form.commendType" style="width: 100%;">
                    <el-option v-for="item in commendTypeList" :key="item.itemValue" :label="item.label"
                               :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="commendImg" label=" 表彰/表扬图片：" v-if="lastAudit && status == '1'">
                <el-upload
                        v-loading="uploadLoading"
                        accept='.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP'
                        class="avatar-uploader"
                        :action="'#'"
                        :show-file-list="false"
                        :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                        :before-upload="beforeImageUpload">
                    <img v-if="form.commendImg" :src="form.commendImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close(false)">取消</el-button>
            <el-button size="small" type="primary" @click="save" v-loading="saveLoading">确定</el-button>
        </span>
        <cropper ref="cropper" :auto-crop-width="300" :auto-crop-height="200" :fixed="false"
                 @cropperResult="uploadCropperImg"></cropper>
    </el-dialog>
</template>

<script>
import {addAudit} from "@/api/tzTwoBestOneFirstAudit";
import {getDictByType2} from "@/api/tDictData";
import {mapGetters} from "vuex";
import {uploadFile} from "@/api/minionFile";
import cropper from "@/views/dj/components/cropper.vue";

export default {
    name: "audit",
    components: {
        cropper
    },
    props: {
        id: {
            default: null
        },
        show: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: null
        },
        lastAudit: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        show() {
            this.dialogVisible = this.show
            if (this.status === '1') {
                this.title = '通过'
                this.getDict('twoBestOneFirstCommend')
            } else if (this.status === '2') {
                this.title = '驳回'
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            title: '',
            form: {
                tbofId: '',
                auditDeptId: '',
                auditMessage: '',
                auditStatus: '',
                commendType: '',
                commendImg: '',
            },
            commendTypeList: [],
            formRules: {
                auditMessage: [
                    {required: true, message: '审核意见不能为空', trigger: 'blur'},
                ],
                commendType: [
                    {required: true, message: '表彰/表扬类型不能为空', trigger: 'change'},
                ],
                commendImg: [
                    {required: true, message: '表彰/表扬图片不能为空', trigger: 'change'},
                ],
            },
            saveLoading: false,
            uploadLoading: false
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        getDict(type) {
            getDictByType2(type).then((res) => {
                let data = res.data
                if (type === 'twoBestOneFirstCommend') {
                    this.commendTypeList = data
                }
            })
        },
        save() {
            this.saveLoading = true
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    this.saveLoading = false
                    return false
                }
                this.form.tbofId = this.id
                this.form.auditStatus = this.status
                this.form.auditDeptId = this.deptInfo.id

                let data = {
                    tzTwoBestOneFirstAudit: this.form
                }
                addAudit({data: data}).then(res => {
                    this.$message.success('提交成功')
                    this.$emit('refresh')
                    this.saveLoading = false
                })
            })
        },
        close(val) {
            this.form.tbofId = ''
            this.form.auditMessage = ''
            this.form.auditStatus = ''
            this.$emit('close', val)
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
                        this.form.commendImg = res.data.url
                    }
                })
            }
        },
    }
}
</script>

<style scoped>


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
    width: 300px;
    height: 200px;
    line-height: 200px;
    text-align: center;
}
</style>
