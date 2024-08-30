<template>
    <el-dialog
        title="编辑"
        :visible.sync="dialogVisible"
        width="500px" @close="close()">
        <div style="display: inline-block;">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="text-align: left;">
                <el-form-item prop="title" label="标题：">
                    <el-input style="width: 230px;" maxlength="150" v-model="form.title" placeholder="标题" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="upStartTime" label="上传开始时间：">
                    <el-date-picker style="width: 230px;" v-model="form.upStartTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="upEndTime" label="上传结束时间：">
                    <el-date-picker style="width: 230px;" v-model="form.upEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="upStartTime" label="审核开始时间：">
                    <el-date-picker style="width: 230px;" v-model="form.auditStartTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="upEndTime" label="审核结束时间：">
                    <el-date-picker style="width: 230px;" v-model="form.auditEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <div style="color: #C0C4CC">提示：审核开始时间应大于上传结束时间</div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close()">取消</el-button>
            <el-button size="small" type="primary" @click="addOrUpdate()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {addTzTwoBestOneFirstTime, updateTzTwoBestOneFirstTime, getTzTwoBestOneFirstTimeById} from "@/api/tzTwoBestOneFirstTime";
import {mapGetters} from "vuex";

export default {
    name: "edit",
    props: {
        id: {
            default: null
        },
        value: {
            type: Boolean
        }
    },
    watch: {
        value(val) {
            this.dialogVisible = val
            if (val && this.id != null && this.id != '') {
                this.form.id = this.id
                this.getTzTwoBestOneFirstTime()
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            form: {
                id: '',
                deptId: '',
                title: '',
                upStartTime: null,
                upEndTime: null,
                auditStartTime: null,
                auditEndTime: null
            },
            rules: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                upStartTime: [{ required: true, message: '请选择上传开始时间', trigger: 'blur' }],
                upEndTime: [{ required: true, message: '请选择上传结束时间', trigger: 'blur' }],
                auditStartTime: [{ required: true, message: '请选择审核开始时间', trigger: 'blur' }],
                auditEndTime: [{ required: true, message: '请选择审核结束时间', trigger: 'blur' }],
            }
        }
    },
    computed: {
        ...mapGetters([
            'deptInfo'
        ]),
    },
    methods: {
        getTzTwoBestOneFirstTime() {
            getTzTwoBestOneFirstTimeById(this.id).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.form = data.data
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        addOrUpdate() {
            this.$refs.form.validate((valid) => {
                if (valid) {

                    this.form.upStartTime = this.formartDate(this.form.upStartTime, 'yyyy-MM-dd HH:mm:ss')
                    this.form.upEndTime = this.formartDate(this.form.upEndTime, 'yyyy-MM-dd HH:mm:ss')
                    this.form.auditStartTime = this.formartDate(this.form.auditStartTime, 'yyyy-MM-dd HH:mm:ss')
                    this.form.auditEndTime = this.formartDate(this.form.auditEndTime, 'yyyy-MM-dd HH:mm:ss')

                    if (this.form.upStartTime > this.form.upEndTime) {
                        this.$message.info('上传开始时间不能小于结束时间')
                        return
                    }

                    if (this.form.auditStartTime > this.form.auditEndTime) {
                        this.$message.info('审核开始时间不能小于结束时间')
                        return
                    }

                    if (this.form.auditStartTime < this.form.upEndTime) {
                        this.$message.info('审核开始时间不能小于上传结束时间')
                        return
                    }

                    if (this.form.id != null && this.form.id != '') {
                        updateTzTwoBestOneFirstTime({ tzTwoBestOneFirstTime: this.form }).then(res => {
                            let data = res.data
                            if (data.code == '00000') {
                                this.$message.success('提交成功')
                                this.$emit('refresh')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    } else {
                        this.form.deptId = this.deptInfo.id
                        addTzTwoBestOneFirstTime({ tzTwoBestOneFirstTime: this.form }).then(res => {
                            let data = res.data
                            if (data.code == '00000') {
                                this.$emit('refresh')
                                this.$message.success('提交成功')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                }
            })
        },
        close() {
            this.form.id = ''
            this.form.deptId = ''
            this.form.title = ''
            this.form.upStartTime = ''
            this.form.upEndTime = ''
            this.form.auditStartTime = ''
            this.form.auditEndTime = ''
            this.$emit('close')
        },
        refresh() {
            this.form.id = ''
            this.form.deptId = ''
            this.form.title = ''
            this.form.upStartTime = ''
            this.form.upEndTime = ''
            this.form.auditStartTime = ''
            this.form.auditEndTime = ''
            this.$emit('refresh')
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
                    for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
                    return m.length == 1 ? val : val.substring(val.length - m.length)
                })
            }
            return fmt
        }
    }
}
</script>

<style scoped>

</style>
