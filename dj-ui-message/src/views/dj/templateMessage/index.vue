<template>
    <div>
        <div style="background: white;padding: 10px 50px 50px;">
            <div style="display:flex;margin-top: 29px;margin-left:60px">
                <img src="../../../assets/message/customMessage.png">
                <div
                        style="font-size: 24px;font-family: Microsoft YaHei, Microsoft YaHei-Bold;font-weight: normal;text-align: LEFT;color: #E1351B;margin-left:14px">
                    模板发送
                </div>
            </div>
            <div class="body">
                <div style="width: 60%; padding-right: 15px;">
                    <el-form ref="form" :model="form" :rules="rules" class="form" :label-width="'100px'">
                        <el-form-item label="任务名称:" prop="missionName">
                            <el-input v-model="form.missionName" placeholder="自定义发送任务" maxlength="100"
                                      size="small" class="input-row"/>
                        </el-form-item>
                        <el-form-item label="选择模板:" prop="content" class="row">
                            <div class="form-button" @click="selectTemplate()">
                                <img src="../../../assets/message/jiantou.png">
                                <div class="form-button-font">选择模板</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="短信内容:" prop="content" class="row">
                            <el-input v-model="form.content" :disabled="true" :rows="7" placeholder="请选择短信模板"
                                      show-word-limit maxlength="1500" size="small" class="input-row" type="textarea"/>
                            <div v-if="templateParamJson != null && Object.keys(templateParamJson).length > 0"
                                 style="margin-top: 10px; text-align: center;">
                                <table border="1" cellspacing="0" cellpadding="0"
                                       style="text-align: center; background-color: white;">
                                    <tr style="background-color: rgb(248, 248, 249)">
                                        <th style="padding: 0 10px;">变量</th>
                                        <th style="padding: 0 10px;">变量类型</th>
                                        <th style="padding: 0 10px;">说明</th>
                                    </tr>
                                    <tr v-for="(item, key) in templateParamJson" :key="key">
                                        <td style="padding: 0 10px;">{{ key }}</td>
                                        <td style="padding: 0 10px;">
                                            {{ getLabelByValue(item, messageTemplateParamTypeList) }}
                                        </td>
                                        <td style="padding: 0 10px;">
                                            {{ getRemarkByValue(item, messageTemplateParamTypeList) }}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </el-form-item>
                        <el-form-item label="发送时间" prop="sendTimeType" class="row">
                            <div style="display: flex;">
                                <el-radio-group v-model="form.sendTimeType" @input="selectType1" style="margin-top: 12px;">
                                    <el-radio label="1">立即发送</el-radio>
                                    <el-radio label="2">定时发送</el-radio>
                                </el-radio-group>
                                <el-date-picker
                                        v-if="timeShow"
                                        v-model="form.sendTime"
                                        style="margin-left:15px;width: 270px"
                                        type="datetime"
                                        placeholder="选择日期时间"/>
                            </div>
                        </el-form-item>
                        <el-form-item label="发送方式" prop="sendMod" class="row">
                            <el-radio-group v-model="form.sendMod" style="margin-top: 6px;">
                                <el-radio label="2" style="padding: 8px 8px 8px 0;">文件发送</el-radio>
                                <el-radio label="3" style="padding: 8px 8px 8px 0;">选择发送</el-radio>
                                <el-radio label='4' style="padding: 8px 8px 8px 0;">自定义用户组发送</el-radio>
                            </el-radio-group>
                            <div style="color:#e1351b">
                                <div style="cursor:pointer;" @click="fileDown">文件模板下载</div>
                            </div>
                        </el-form-item>
                        <el-form-item label="发送对象:" prop="content" class="row">
                            <el-input v-if="form.sendMod=='1'" v-model="form.sendObject" :rows="7"
                                      placeholder="号码之间用英文隔开" show-word-limit maxlength="1500" size="small"
                                      style="width: 300px" class="input-row" type="textarea"/>

                            <div v-else-if="form.sendMod=='2'" style="border: #2d2f33;display: flex">
                                <Upload
                                        v-if="uploadShow"
                                        :show-upload-list="false"
                                        :format="fileTypeArr"
                                        :on-success="uploadSuccess"
                                        ref="upload"
                                        :before-upload="handleUpload"
                                        :headers="upHeaders"
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
                                <!--                                <el-input v-else v-model="form.sendObject" :rows="7" placeholder="号码之间用英文逗号,隔开"
                                                                          show-word-limit :disabled="true" size="small" style="width: 300px;cursor: pointer"
                                                                          class="input-row" type="textarea"/>-->
                                <div v-else>
                                    <table border="1" cellspacing="0" cellpadding="0"
                                           style="text-align: center; background-color: white;">
                                        <tr style="background-color: rgb(248, 248, 249)">
                                            <th style="padding: 0 5px;">序号</th>
                                            <th style="padding: 0 5px;">电话</th>
                                            <th style="padding: 0 5px;"
                                                v-for="(content, key) in form.sendObject[0].tpContent" :key="key">
                                                {{ key }}
                                            </th>
                                        </tr>
                                        <tr v-for="(item, index) in form.sendObject" :key="index">
                                            <td>{{ index + 1 }}</td>
                                            <td style="padding: 0 5px;">{{ item.mobile }}</td>
                                            <td style="padding: 0 5px;" v-for="(content, index2) in item.tpContent"
                                                :key="index2">
                                                {{ content }}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div @click="reUpload" v-if="!uploadShow"
                                     style="width: 90px; margin-left: 10px; line-height: 40px; color: #e24240; cursor: pointer">
                                    重新上传
                                </div>
                            </div>

                            <div v-else-if="form.sendMod=='3'" style="border: #2d2f33;display: flex">
                                <div v-if="editShow"
                                     style="display: flex;align-items: center;justify-content: center;height:148.562px;width:299.328px;border: 1px dashed #dcdee2;border-radius: 4px;">
                                    <el-input v-if="form.sendMod == '3'" v-model="form.sendObject" :rows="7"
                                              placeholder="号码之间用英文逗号,隔开"
                                              show-word-limit size="small" style="width: 300px" class="input-row"
                                              type="textarea"/>
                                </div>
                                <div @click="selectSend" v-else
                                     style="display: flex;align-items: center;justify-content: center;height:148.562px;width:299.328px;border: 1px dashed #dcdee2;border-radius: 4px;">
                                    <img src="../../../assets/message/add.png">
                                </div>

                                <div @click="selectSend" v-if="editShow"
                                     style="line-height:initial;color:#e24240;cursor: pointer">编辑
                                </div>
                            </div>
                            <div style="border: #2d2f33;display: flex">
                                <div v-if="form.sendMod=='4'">
                                    <el-select v-model="form.userGroup" placeholder="请选择" style="width: 100%;"
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
                            <div>
                                <table style="margin-top: 10px;">
                                    <tr v-for="(item, index) in tpContent" :key="index">
                                        <td style="padding: 5px 0;">{{ item.key }}：</td>
                                        <td style="padding: 5px 0;">
                                            <el-input v-model="item.value" style="width: 220px"></el-input>
                                        </td>
                                    </tr>
                                </table>
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
            <select-template :value="selectShow" :modal-title="title" @close="closeSelectShow()"
                             @selectRow="selectRow"/>
            <select-send :value="selectSendShow" :selectSendObject="selectSendObject" @cancel="cancel"
                         @confirm="confirm"/>
        </div>
    </div>
</template>

<script>
import XLSX from "xlsx";
import fileDownload from 'js-file-download'
import util from '@/libs/util'
import selectTemplate from './selectTemplate'
import selectSend from '@/components/selectSend/index'
import {sendTemplateMessage} from "@/api/tzMessage";
import {getFileDateForDown} from "@/api/attachFile";
import {fileByteToBlob} from "@/utils/fileUtils";
import {getDictByType2} from "@/api/tDictData";
import {getCustomUserTag, queryCustomUserTag} from "../../../api/tzUserTag";

export default {
    name: 'Index',
    components: {
        selectTemplate,
        selectSend
    },
    data() {
        return {
            uploadShow: true,
            records: [],
            base: util.nginxUrl,
            editShow: false,
            title: '',
            selectShow: false,
            selectSendShow: false,
            formLabelWidth: '0px',
            form: {
                missionName: '',
                sign: '',
                content: '',
                sendTimeType: '1',
                sendMod: '2',
                sendObject: [],
                records: [],
                userGroup: null
            },
            upHeaders: {
                'User-Type': 'Gov_User'
                // 'Authorization': Vue.cookie.get('Authorization_vs')
            },
            fileTypeArr: ['xlsx', 'xls'],
            timeShow: false,
            sign: [{name: '【机关党委智慧党建云平台】', id: 1}, {name: '【酒城e通】', id: 2}],
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
            templateParamJson: {},
            tpContent: [],
            messageTemplateParamTypeList: [],
            userGroupList: []
        }
    },
    created() {
        document.title = "模板发送";
        queryCustomUserTag({}).then(res => {
            if (res.data.code == '00000') {
                this.userGroupList = res.data.data
            }
        })
    },
    mounted() {
        this.getDict('messageTemplateParamType')
    },
    methods: {
        validateTpContent(type, key, value) {
            let reg = ''
            if (type == 'valid_code') {
                reg = /^[a-zA-Z0-9]{4,6}$/
            } else if (type == 'mobile_number') {
                reg = /^\\d{1,15}$/
            } else if (type == 'other_number') {
                reg = /^[a-zA-Z0-9-]{1,32}$/
            } else if (type == 'amount') {
                reg = /^\d+\.\d+$/
            } else if (type == 'date') {
                reg = /^\d{4}(?:年\d{2}(?:月\d{2}(?:日\d{2}(?:时\d{2}(?:分\d{2}(?:秒\d{2})?)?)?)?)?)?$/
            } else if (type == 'others') {
                reg = /^[\u4e00-\u9fa5a-zA-Z0-9\x20]{1,35}$/
            } else if (type == 'chinese') {
                reg = /^[\u4e00-\u9fa5（）]{1,32}$/
            }
            if (!reg.test(value)) {
                this.$message.info('请注意变量{' + key + '}的格式')
                return false
            } else {
                return true
            }
        },
        getDict(type) {
            getDictByType2(type).then((res) => {
                let data = res.data
                if (type === 'messageTemplateParamType') {
                    this.messageTemplateParamTypeList = data
                }
            })
        },
        getLabelByValue(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == value) {
                    return dic[i].label
                }
            }
        },
        getRemarkByValue(value, dic) {
            for (let i = 0; i < dic.length; i++) {
                if (dic[i].itemValue == value) {
                    return dic[i].remark
                }
            }
        },
        reUpload() {
            this.uploadShow = !this.uploadShow
        },
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



            // getFileDateForDown(this.base + '/excelTemplate/文件模板.rar').then(res => {
            //     const data = res.data
            //     if (data.code === '00000') {
            //         let result = res.data.data
            //         let blob = fileByteToBlob(result)
            //         let fileName = "文件模板.rar"
            //         fileDownload(blob, fileName)  //this.fileName 文件名
            //     }
            // })
            /*let path = this.base + 'sk-paas/2023/07/文件模板.rar'
            let name = '文件模板.rar'

            axios.get(path, {
                responseType: 'blob' //返回的数据类型
            }).then(res => {
                fileDownload(res.data, name)  //this.fileName 文件名
            })*/
        },
        sendMessage() {
            this.form.records = []
            if (this.form.sendMod == '2') {
                // 文件发送时处理
                this.form.records = this.records
            } else if (this.form.sendMod == '3') {
                // 选择党员发送时处理
                if (this.tpContent == null) {
                    this.$message.info('请输入变量')
                    this.sendMessageFlag = false
                    return
                }
                let tpContent = {}
                for (let i = 0; i < this.tpContent.length; i++) {
                    tpContent[this.tpContent[i].key] = this.tpContent[i].value
                }
                for (let i = 0; i < this.form.sendObject.split(',').length; i++) {
                    this.form.records.push({
                        mobile: this.form.sendObject.split(',')[i],
                        tpContent: tpContent
                    })
                }
            }
            this.form.sendType = 2

            if (!this.form.records || this.form.records == '' || this.form.records.length == 0) {
                this.sendMessageFlag = false
                this.$message.error("请填写发送相关信息")
                return
            }
            let data = {
                tzMessage: this.form,
                tpId: this.form.temId.toString(),
                sign: this.form.sign,
                records: this.form.records
            }
            sendTemplateMessage(data).then(res => {
                this.sendMessageFlag = false
                const data = res.data
                if (data.code == '00000') {
                    this.$message.info({
                        content: '发送成功' + res.data.data.successCount + '条' + ',' + '发送失败' + res.data.data.errorCount + '条',
                        duration: 5,
                        closable: true
                    })
                    this.reset()
                } else {
                    this.$message.info(data.msg)
                }
            })
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
        confirm(selected) {
            this.records = []
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
        selectRow(row) {
            this.form.content = row.temContent
            // this.form.temId = row.temId
            this.form.sign = row.sign;
            this.records = []

            if (this.form.sendMod == '2') {
                this.form.sendObject = []

            } else if (this.form.sendMod == '3') {
                this.form.sendObject = ''
            }
            this.uploadShow = true
            this.editShow = false
            //提取{}里面的值
            var reg = /{(.+?)\}/;
            var reg_g = /{(.+?)\}/g;
            var result = []
            let obj = {}
            if(this.form.content){
                result = this.form.content.match(reg_g);
                console.log(result)
                if(result.length>0){
                    for (var i = 0; i < result.length; i++) {
                        let item = result[i]
                        obj[item.match(reg)[1]] = "chinese"
                    }
                }
            }
            this.templateParamJson = obj
            this.tpContent = []
            for (let key in this.templateParamJson) {
                this.tpContent.push({
                    key: key,
                    value: ''
                })
            }
        },
        closeSelectShow() {
            this.selectShow = false
        },
        selectTemplate() {
            this.selectShow = true
            this.title = '短信模板选择'
        },
        handleUpload(file) {
            if (!this.form.content || this.form.content == '') {
                this.$message.info("请先选择模板")
                return false
            }
            const matches = this.form.content.match(/{\w+}/g);
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
                const tmp = XLSX.utils.sheet_to_json(worksheet)
                // const tmp = test2.slice(2)
                let status = true
                if (tmp) {
                    this.records = []
                    this.form.sendObject = []
                    for (let i = 0; i < tmp.length; i++) {
                        if (Object.keys(tmp[i]).length <= 1) {
                            this.$message.info("请至少带入一个变量！！！")
                            status = false
                            break;
                        }

                        let variousKey = Object.keys(tmp[i])
                        let row = {
                            mobile: tmp[i]['手机号码'].toString(),
                            tpContent: {}
                        }

                        let content = {}
                        for (let j = 0; j < variousKey.length; j++) {
                            if (variousKey[j] != '手机号码') {
                                let value = tmp[i][variousKey[j]]
                                let key = variousKey[j]
                                let newObject = {}
                                newObject[key] = value
                                this.$set(row.tpContent, key, value);

                                content[variousKey[j]] = value
                            }
                        }

                        if (content.length > 0) {
                            let last = content.substring(content.length - 1, content.length)
                            if (last == ',') {
                                content = content.substring(0, content.length - 1)
                            }
                        }
                        let val = {
                            mobile: tmp[i]['手机号码'],
                            tpContent: content
                        }
                        this.form.sendObject.push(val)
                        this.records.push(row)
                    }
                }
                if (!status) {
                    return
                }
                this.uploadShow = false
            }
            reader.readAsBinaryString(file)

            return false
        },
        uploadSuccess(response, file, fileList) {

        },
        reset() {
            this.records = []
            this.form.missionName = ''
            this.form.sign = ''
            this.form.content = ''
            this.form.sendTimeType = '1'
            this.form.sendMod = '2'
            this.form.sendObject = []
            this.form.records = []

            this.selectSendObject = []
            this.tpContent = []
            this.templateParamJson = {}

            this.uploadShow = true
            this.editShow = false
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
    cursor: default;
}

.el-form-item {
    ::v-deep .el-form-item__content {
        text-align: left;
    }
}

.form-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 141px;
    height: 36px;
    background: rgba(226, 66, 64, 0.30);
    border: 1px solid #E24240;
    border-radius: 3px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: normal;
    text-align: CENTER;
    color: #E24240;
    line-height: 20px;
    cursor: pointer;

    .form-button-font {
        /*margin-left: 2px;*/

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
    /*width: 240px;*/
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
    text-align: left; /* 文字居中对齐 */
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
