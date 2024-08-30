<template>
    <div>
        <div style="background: white;padding: 10px 50px 50px;">
            <div style="display:flex;margin-top: 29px;margin-left:60px">
                <img src="../../../assets/message/customMessage.png">
                <div
                        style="font-size: 24px;font-family: Microsoft YaHei, Microsoft YaHei-Bold;font-weight: normal;text-align: LEFT;color: #E1351B;margin-left:14px">
                    自定义发送
                </div>
            </div>
            <div class="body">
                <div style="width: 60%; padding-right: 15px;">
                    <el-form ref="form" :model="form" :rules="rules" class="form" :label-width="'100px'">
                        <el-form-item label="任务名称:" prop="missionName">
                            <el-input v-model="form.missionName" placeholder="自定义发送任务" maxlength="100"
                                      size="small" class="input-row"/>
                        </el-form-item>
                        <el-form-item label="选择签名:" prop="sign" class="row">
                            <el-select v-model="form.sign" placeholder="请选择" style="width: 100%;" class="input-row">
                                <el-option v-for="item in messageSignList" :key="item.id" :label="item.sign" :value="item.sign"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="短信内容:" prop="content" class="row">
                            <el-input v-model="form.content" :rows="7" placeholder="【短信签名】请在此处输入短信内容"
                                      show-word-limit maxlength="1500" size="small"
                                      class="input-row" type="textarea"/>
                        </el-form-item>
                        <el-form-item label="发送时间" prop="sendTimeType" class="row">
                            <div style="display: flex;">
                                <el-radio-group v-model="form.sendTimeType" @input="selectType1" style="margin-top: 12px;">
                                    <el-radio label='1'>立即发送</el-radio>
                                    <el-radio label='2'>定时发送</el-radio>
                                </el-radio-group>
                                <el-date-picker
                                        v-if="timeShow"
                                        v-model="form.sendTime"
                                        style="margin-left:15px;width: 270px"
                                        type="datetime"
                                        :picker-options="pickerOptions0"
                                        placeholder="选择日期时间"/>
                            </div>
                        </el-form-item>
                        <el-form-item label="发送方式" prop="sendMod" class="row">
                            <el-radio-group v-model="form.sendMod" style="margin-top: 6px;">
                                <el-radio label='1' style="padding: 8px 8px 8px 0;">号码发送</el-radio>
                                <el-radio label='2' style="padding: 8px 8px 8px 0;">上传模板</el-radio>
                                <el-radio label='3' style="padding: 8px 8px 8px 0;">选择发送</el-radio>
                                <el-radio label='4' style="padding: 8px 8px 8px 0;">自定义用户组发送</el-radio>
                            </el-radio-group>
                            <div style="color:#e1351b;width: fit-content;" v-if="form.sendMod=='2'">
                                <div style="cursor:pointer;" @click="fileDown">文件模板下载</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="发送对象:" prop="sendObject" class="row">
                            <el-input v-if="form.sendMod=='1'" v-model="form.sendObject" :rows="7"
                                      placeholder="号码之间用英文逗号 , 隔开" show-word-limit
                                      maxlength="1500" size="small" class="input-row"
                                      type="textarea"/>
                            <div v-else-if="form.sendMod=='2'" style="border: #2d2f33;display: flex">
                                <Upload
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                        v-if="!buttonShow"
                                        :show-upload-list="false"
                                        :format="fileTypeArr"
                                        :on-success="uploadSuccess"
                                        :before-upload="handleUpload"
                                        :headers="upHeaders"
                                        ref="upload"
                                        type="drag"
                                        style="width: 374px;"
                                        size="small"
                                        name="file"
                                        action="">
                                    <div style="padding: 20px 0;height: 146.576px;">
                                        <i class="el-icon-upload"></i>
                                        <p>点击或将文件拖拽到这里上传</p>
                                    </div>
                                </Upload>
                                <div v-else>
                                    <el-input v-model="form.sendObject" :rows="7"
                                              show-word-limit :disabled="true" size="small"
                                              style="width: 300px; background-color: white;" class="input-row"
                                              type="textarea"/>
                                </div>
                                <div @click="reUpload" v-if="buttonShow"
                                     style="line-height:initial;color:#e24240;cursor: pointer">重新上传
                                </div>
                            </div>

                            <div v-else-if="form.sendMod=='3' || form.sendMod=='4'"
                                 style="border: #2d2f33;display: flex">
                                <div v-if="editShow"
                                     style="display: flex;align-items: center;justify-content: center;height:148.562px;width:299.328px;border: 1px dashed #dcdee2;border-radius: 4px;">
                                    <el-input v-model="form.sendObject" :rows="7"
                                              show-word-limit :disabled="true" size="small" style="width: 300px"
                                              class="input-row"
                                              type="textarea"/>
                                </div>
                                <div @click="selectSend" v-if="!editShow && form.sendMod=='3'"
                                     style="display: flex;align-items: center;justify-content: center;height:148.562px;width:299.328px;border: 1px dashed #dcdee2;border-radius: 4px;">
                                    <img src="../../../assets/message/add.png">
                                </div>
                                <div @click="selectSend" v-if="editShow && form.sendMod=='3'"
                                     style="line-height:initial;color:#e24240;cursor: pointer">编辑
                                </div>

                                <div v-if="form.sendMod=='4'">
                                    <el-select v-model="form.userGroup" placeholder="请选择" style="width: 100%;" clearable
                                               class="input-row" @change="onSelectChange">
                                        <el-option v-for="item in userGroupList" :key="item.id" :label="item.tagName"
                                                   :value="item.id"/>
                                    </el-select>
                                </div>
                                <div v-if="form.sendMod=='4'"
                                     style="display: flex;align-items: center;justify-content: center;height:148.562px;width:299.328px;border: 1px dashed #dcdee2;border-radius: 4px;">
                                    <el-input v-model="form.sendObject" :rows="7"
                                              show-word-limit :disabled="true" size="small" style="width: 300px"
                                              class="input-row"
                                              type="textarea"/>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div style="display: flex;    margin-left: 151px;">
                        <img style="height:100%;margin: auto 0;" src="../../../assets/message/warning.png">
                        <div class="font-tip">注意：重复的电话号码只会发送一次短信
                        </div>
                    </div>
                    <div style="display: flex;    margin-left: 151px;">
                        <img style="height:100%;margin: auto 0;" src="../../../assets/message/warning.png">
                        <div class="font-tip">模板文档要求：每行只填写一个号码，文件大小不超过300M
                        </div>
                    </div>
                    <!--                    <div style="display: flex;margin-top: 8px;margin-left: 151px;">
                                            <img style="height:100%;margin: auto 0;" src="../../../assets/message/warning.png">
                                            <div class="font-tip"></div>
                                        </div>-->
                    <div class="send-button" @click="valid">
                        <i v-if="sendMessageFlag" class="el-icon-loading" style="margin-right: 5px;"></i>发送短信
                    </div>
                </div>
                <div class="line"/>
                <div style="width: 40%;display: flex;align-items: center;justify-content: center;">
                    <div class="phone-container">
                        <div class="phone-screen">
                            <p>{{ form.sign + form.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <select-send :value="selectSendShow" :selectSendObject="selectSendObject" @cancel="cancel" @confirm="confirm"/>
    </div>
</template>

<script>
import XLSX from "xlsx";
import fileDownload from 'js-file-download'
import util from '@/libs/util'
import {sendMessage} from "@/api/tzMessage";
import selectSend from '@/components/selectSend/index'
import {getFileDateForDown} from "@/api/attachFile";
import {fileByteToBlob} from "@/utils/fileUtils";
import {queryCustomUserTag, getCustomUserTag} from "@/api/tzUserTag";
import {queryMessageSignList} from "@/api/tzMessageSign";

export default {
    name: 'Index',
    components: {
        selectSend
    },
    data() {
        return {
            buttonShow: false,
            uploadShow: false,
            base: util.nginxUrl,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
                }
            },
            editShow: false,
            selectSendShow: false,
            formLabelWidth: '100px',
            form: {
                missionName: '',
                sign: '',
                content: '',
                sendTimeType: '1',
                sendMod: '1',
                sendObject: '',
                userGroup: null
            },
            upHeaders: {
                'User-Type': 'Gov_User'
                // 'Authorization': Vue.cookie.get('Authorization_vs')
            },
            fileTypeArr: ['xlsx', 'xls'],
            timeShow: false,
            rules: {
                missionName: [
                    {required: true, message: '请输入任务名称', trigger: 'blur'}
                ],
                sign: [
                    {required: true, message: '请输选择签名', trigger: 'blur'}
                ],
                content: [
                    {required: true, message: '请输输入短信内容', trigger: 'blur'}
                ],
                sendTimeType: [
                    {required: true, message: '请选择发送时间', trigger: 'blur'}
                ],
                sendMod: [
                    {required: true, message: '请选择发送方式', trigger: 'blur'}
                ],
                sendObject: [
                    {required: true, message: "请输入发送对象，以','分割电话号码", trigger: 'blur'}
                ],
            },
            selectSendObject: [],
            sendMessageFlag: false,
            userGroupList: [],
            messageSignList:[]
        }
    },
    created() {
        document.title = "自定义发送";
        queryCustomUserTag({}).then(res => {
            if (res.data.code == '00000') {
                this.userGroupList = res.data.data
            }
        })
        queryMessageSignList().then(res => {
            if (res.data.code == '00000') {
                this.messageSignList = res.data.data
            }
        })
    },
    methods: {
        fileDown() {
            import("@/vendor/Export2Excel").then((excel) => {
                // 设置导出表格的头部
                const tHeader = ["电话号码"]
                // 调用我们封装好的方法进行导出Excel
                excel.export_json_to_excel({
                    // 导出的头部
                    header: tHeader,
                    // 导出的内容
                    data:[],
                    // 导出的文件名称
                    filename: "短信号码发送模板",
                    // 导出的表格宽度是否自动
                    autoWidth: true,
                    // 导出文件的后缀类型
                    bookType: "xlsx",
                })
            })
            // getFileDateForDown(this.base + '/excelTemplate/短信号码发送模板.xlsx').then(res => {
            //     const data = res.data
            //     if (data.code === '00000') {
            //         let result = res.data.data
            //         let blob = fileByteToBlob(result)
            //         let fileName = "短信号码发送模板.xlsx"
            //         fileDownload(blob, fileName)  //this.fileName 文件名
            //     }
            // })
        },
        confirm(selected) {
            this.selectSendObject = selected
            this.form.sendObject = ''
            if (selected && selected.length > 0) {
                selected.forEach(i => {
                    this.form.sendObject += i.phone + ','
                })
            }
            if (this.form.sendObject.length > 0) {
                let last = this.form.sendObject.substring(this.form.sendObject.length - 1, this.form.sendObject.length)
                if (last == ',') {
                    this.form.sendObject = this.form.sendObject.substring(0, this.form.sendObject.length - 1)
                }
            }
            this.editShow = true
            this.cancel()
        },
        cancel() {
            this.selectSendShow = false
        },
        selectSend() {
            this.selectSendShow = true
        },
        reUpload() {
            this.buttonShow = !this.buttonShow
        },
        reset() {
            this.form.missionName = ''
            this.form.sign = ''
            this.form.content = ''
            this.form.sendTimeType = '1'
            this.form.sendMod = '1'
            this.form.sendObject = ''

            /*this.form = {
                missionName: '',
                sign: '',
                content: '',
                sendTimeType: '1',
                sendMod: '1',
                sendObject: ''
            }*/
            this.buttonShow = false
            this.editShow = false
        },
        valid() {
            if (this.sendMessageFlag) {
                return
            }
            this.sendMessageFlag = true

            if (this.form.sendTimeType == 1) {
                this.form.sendTime = ''
            }

            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    this.sendMessageFlag = false
                    return false
                }
                this.sendMessage()
            })
        },
        sendMessage() {
            this.form.sendType = 1
            let data = this.form
            sendMessage(data).then(res => {
                this.sendMessageFlag = false
                if (res.data.code == '00000') {
                    this.$message({
                        message: '发送成功' + res.data.data.successCount + '条' + ',' + '发送失败' + res.data.data.errorCount + '条',
                        type: 'success',
                        duration: 5000
                    });

                    this.reset()
                } else {
                    this.$message.info(data.msg)
                }
            })
        },
        handleUpload(file) {
            // 检查文件类型是否为 Excel
            const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (fileType !== 'xls' && fileType !== 'xlsx') {
                this.$message.error('只能上传 Excel 文件')
                return false
            }
            // 读取 Excel 文件
            const reader = new FileReader()
            reader.onload = (e) => {
                const data = e.target.result
                const workbook = XLSX.read(data, {type: 'binary'})
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                console.log(worksheet)
                const tmp = XLSX.utils.sheet_to_json(worksheet)
                console.log(tmp)
                this.form.sendObject = ''
                if (tmp) {
                    this.columns = []
                    let phoneList = []
                    for (let i = 0; i < tmp.length; i++) {
                        const phone = tmp[i]['电话号码']
                        if (phoneList.indexOf(phone) < 0) {
                            phoneList.push(phone)
                            this.form.sendObject += phone + ','
                        }
                    }
                    if (this.form.sendObject.length > 0) {
                        let last = this.form.sendObject.substring(this.form.sendObject.length - 1, this.form.sendObject.length)
                        if (last == ',') {
                            this.form.sendObject = this.form.sendObject.substring(0, this.form.sendObject.length - 1)
                        }
                    }
                }
            }
            this.buttonShow = true
            reader.readAsBinaryString(file)

            return false
        },
        add() {
            /*    let data = {
              deptId: this.deptId.toString(),
              tzXxqgs: this.columns
            }
            console.log(112346523, data)
            addXxqgList(data).then(res => {
              if (res.data.code == '00000') {
                this.$message.success('导入成功')
                this.close()
              }
            })*/
        },
        uploadSuccess(response, file, fileList) {

        },
        selectType1(e) {
            if (e == 1) {
                this.timeShow = false
            } else {
                this.timeShow = true
            }
        },
        back() {
            if (this.$route.query.noGoBack) {
                this.$router.push({path: '/dashboard'})
            } else {
                this.$router.go(-1)
            }
        },
        onSelectChange(e) {
            if (e) {
                getCustomUserTag({id: e}).then(res => {
                    if (res.data.code == '00000') {
                        this.form.sendObject = res.data.data.tableData.map(item => item.phone).join(",")
                    }
                })
            }else {
                this.form.sendObject = ''
            }

        }
    }
}
</script>

<style lang="scss" scoped>
@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");

::v-deep .el-textarea.is-disabled .el-textarea__inner {
    background-color: white;
    color: black;
}

.el-form-item {
    ::v-deep .el-form-item__content {
        text-align: left;
    }
}

.send-button {
    cursor: pointer;
    background: #e24240;
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: CENTER;
    color: #ffffff;
    line-height: 40px;
    height: 40px;
    width: 140px;
    border-radius: 3px;
    margin-left: 150px;
    margin-top: 20px;
}

.font-tip {
    margin-left: 12px;
    border-radius: 0px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Normal;
    font-weight: normal;
    text-align: LEFT;
    color: #7f7f7f;
}

.phone-container {
    width: 235px; /* 手机容器的宽度 */
    height: 480px; /* 手机容器的高度 */
    background-image: url("../../../assets/message/phone.png"); /* 手机屏幕背景图片路径 */
    background-size: cover;
    /*position: absolute;*/
    margin-left: auto;
    margin-right: auto;
    top: 15%;
}

.phone-screen {
    width: 88%; /* 手机屏幕的宽度 */
    height: 55%; /* 手机屏幕的高度 */
    /*background-color: white; !* 手机屏幕背景色 *!*/
    margin: 40% auto; /* 手机屏幕在手机容器中居中 */
    position: relative;
    white-space: pre-wrap;
    word-break: break-word;
    text-align: left;
    padding: 20px; /* 为了给文字留出一定的空白边距 */
}

.dynamic-text {
    position: absolute;
    top: 10%; /* 文字的垂直居中位置 */
    left: 35%; /* 文字的水平居中位置 */
    transform: translate(-50%, -50%); /* 居中文字 */
    text-align: left; /* 文字居中对齐 */
    white-space: pre-wrap; /* 可以自动换行的文字处理 */
}

.line {
    width: 0px;
    height: 624px;
    border: 1px solid #d7d7d7;
    margin-top: 3%;
}

.input-row {
    flex: 1;
    max-width: 470px;
    /*height: 36px;*/
    background: #ffffff;
    /*border: 1px solid #d7d7d7;*/
    border-radius: 3px;
}

.body {
    display: flex;

    .form {
        margin-top: 62px;
        margin-left: 110px;

        .row {
            margin-top: 28px;
        }
    }
}
</style>
