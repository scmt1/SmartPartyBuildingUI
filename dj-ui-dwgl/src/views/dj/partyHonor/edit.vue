<template>
    <el-dialog title="党内荣誉编辑" :visible.sync="dialogVisible" width="560px">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px" style="text-align: center; padding: 0 20px 0 20px;">
            <div style="display: inline-block; margin: auto;">
                <el-form-item prop="honorType" label="荣誉类型：">
                    <el-select :disabled="form.id && form.id != null && form.id.toString().length > 0 ? true: false" style="width: 300px;" v-model="form.honorType" clearable @change="honorTypeChange" placeholder="请输入选择荣誉类型">
                        <el-option v-for="item in honorTypeOptions" :key="item.itemValue" :label="item.label" :value="item.itemValue"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="partyMemberId" label="获奖党员：" v-if="form.honorType == 2">
                    <el-select style="width: 300px;" v-model="form.partyMemberId" filterable clearable placeholder="请选择获奖党员">
                        <el-option v-for="item in partyMemberList" :key="item.id" :label="item.realName + ' - ' + item.idcard" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="imagePath" label="获奖照片：">
                    <el-upload
                        class="avatar-uploader"
                        :action="'#'"
                        accept=".jpg,.png,.jpeg"
                        :show-file-list="false"
                        :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                        :before-upload="beforeImageUpload">
                        <img v-if="form.imagePath" :src="form.imagePath" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item prop="honorName" label="荣誉名称：">
                    <el-input style="width: 300px;" maxlength="150" v-model="form.honorName" placeholder="荣誉名称" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item prop="awardName" label="颁发单位名称：">
                    <el-input style="width: 300px;" maxlength="150" v-model="form.awardName" placeholder="颁发单位名称" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item prop="honorClass" label="荣誉级别：">
                    <el-select style="width: 300px;" v-model="form.honorClass" clearable @change="honorTypeChange" placeholder="请输入选择荣誉类型">
                        <el-option v-for="item in honorClassOptions" :key="item.itemValue" :label="item.label" :value="item.itemValue"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="getYear" label="获奖时间：">
                    <el-date-picker style="width: 300px;" v-model="form.getYear" type="year" placeholder="选择年份"></el-date-picker>
                </el-form-item>
            </div>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
            <el-button size="small" type="primary" @click="save">确定</el-button>
        </span>
        <cropper ref="cropper" :auto-crop-width="848" :auto-crop-height="576" :fixed="false" @cropperResult="uploadCropperImg"></cropper>
    </el-dialog>
</template>

<script>
import {getPartMemberListByDeptId} from "@/api/jcxfPartyMember";
import {addTzPartyHonor, updateTzPartyHonor, getTzPartyHonorById} from "@/api/TzPartyHonor";
import {uploadImages} from "@/api/attachFile";
import cropper from "@/views/dj/components/cropper.vue";
import util from "@/libs/util";
import {getDictByType2} from "@/api/tDictData";
import {mapGetters} from "vuex";
import {uploadFile} from "@/api/minionFile";

export default {
    name: "add",
    components: {
        cropper
    },
    data() {
        return {
            base: util.minionUrl,
            dialogVisible: false,
            form: {
                id: '',
                deptId: '',
                partyMemberId: '',
                partyMemberName: '',
                honorName: '',
                honorType: '',
                imagePath: '',
                honorClass: '',
                getYear: '',
                // status: 1,
                awardName: ''
            },
            partyMemberList: [],
            honorTypeOptions: [],
            honorClassOptions: [],
            rules: {
                honorType: [{ required: true, message: '请选择荣誉类型', trigger: 'blur' }],
                partyMemberId: [{ required: true, message: '请选择获奖党员', trigger: 'blur' }],
                honorName: [{ required: true, message: '请输入荣誉名称', trigger: 'blur' }],
                honorClass: [{ required: true, message: '请选择荣誉级别', trigger: 'blur' }],
                getYear: [{ required: true, message: '请选择获奖时间', trigger: 'blur' }],
                awardName: [{ required: true, message: '请输入颁奖单位名称', trigger: 'blur' }],
                imagePath: [{ required: true, message: '请选择获奖照片', trigger: 'blur' }],
            }
        }
    },
    mounted() {
        this.getDict('honorType')
        this.getDict('honorClass')
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
                if (type === 'honorType') {
                    this.honorTypeOptions = data
                } else if (type === 'honorClass') {
                    this.honorClassOptions = data
                }
            })
        },
        init(id) {
            if (id) {
                getTzPartyHonorById(id).then(res => {
                    const result = res.data
                    if (result.code == '00000') {
                        this.form = result.data
                        this.honorTypeChange()
                    } else {
                        this.$message.error(result.msg)
                    }
                })
            } else {
                this.reset()
            }
            this.dialogVisible = true
        },
        honorTypeChange() {
            if (this.form.honorType == 2) {
                getPartMemberListByDeptId(this.deptInfo.id + '').then(res => {
                    const result = res.data
                    if (result.code == '00000') {
                        this.partyMemberList = result.data

                        this.partyMemberList.forEach(item => {
                            item.idcard = this.hideIdCardNumber(item.idcard)
                        })
                        this.$forceUpdate()
                    }
                })
            }
        },
        beforeImageUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt5M = file.size / 1024 / 1024 < 5

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
            }
            if (!isLt5M) {
                this.$message.error('上传头像图片大小不能超过 5MB!')
            }

            this.$refs.cropper.init(file)
        },
        uploadCropperImg(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.cover = res.data.url
                        this.form.imagePath = res.data.url
                    }
                })
            }
        },
        save() {
            this.$refs.form.validate((valid) => {
                if (valid) {

                    if (this.form.imagePath == '') {
                        this.$message.info('请上传图片')
                        return
                    }
                    this.form.status=1
                    let data = {
                        tzPartyHonor: this.form
                    }

                    // 处理事件
                    data.tzPartyHonor.getYear = this.formartDate(data.tzPartyHonor.getYear, 'yyyy')

                    // 上传人
                    data.tzPartyHonor.uploadId = this.deptInfo.id

                    if (this.form.id == '') {
                        data.tzPartyHonor.deptId = this.deptInfo.id
                        addTzPartyHonor({ data: data }).then(res =>{
                            const result = res.data
                            if (result.code == '00000') {
                                this.$message.success('保存成功')
                                this.$emit('refresh')
                                this.dialogVisible = false
                            } else {
                                this.$message.error(result.msg)
                            }
                        })
                    } else {
                        updateTzPartyHonor({ data: data }).then(res =>{
                            const result = res.data
                            if (result.code == '00000') {
                                this.$message.success('保存成功')
                                this.$emit('refresh')
                                this.dialogVisible = false
                            } else {
                                this.$message.error(result.msg)
                            }
                        })
                    }
                }
            })
        },
        reset() {
            this.form.id = ''
            this.form.deptId = ''
            this.form.partyMemberId = ''
            this.form.partyMemberName = ''
            this.form.honorName = ''
            this.form.honorType = ''
            this.form.imagePath = ''
            this.form.honorClass = ''
            this.form.getYear = ''
            this.form.status = 1
        },
        formartDate(date, fmt) {
            if (date == undefined || date == null || date.toString().trim().length <= 0) {
                return ''
            }
            if (typeof date === 'string') {
                date = new Date(date)
            }
            date = date == undefined ? new Date() : date
            date = typeof date == 'number' ? new Date(date) : date
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
            let obj = {
                'y': date.getFullYear(), // 年份，注意必须用getFullYear
                'M': date.getMonth() + 1, // 月份，注意是从0-11
                'd': date.getDate(), // 日期
                'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                'w': date.getDay(), // 星期，注意是0-6
                'H': date.getHours(), // 24小时制
                'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                'm': date.getMinutes(), // 分钟
                's': date.getSeconds(), // 秒
                'S': date.getMilliseconds() // 毫秒
            }
            let week = ['天', '一', '二', '三', '四', '五', '六']
            for (let i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    let val = obj[i] + ''
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val]
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        },
    }
}
</script>

<style scoped lang="scss">
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
    height: 144px;
    line-height: 144px;
    text-align: center;
}

.avatar {
    width: 212px;
    height: 144px;
    display: block;
    object-fit: cover;
}
</style>
