<template xmlns="http://www.w3.org/1999/html">
    <Modal class="mo2" v-model="show" :mask-closable="false" :closable="false" width="30%">
        <div class="body" id="pdfDom" ref="orderForm1" style=" padding: 20px 40px 40px 30px;width: auto;">
            <div class="modal-header" style="  padding: 15px 5px;text-align: center;">
                <h4 class="modal-title" style=" font-size: 26px;">{{ form.realName }}</h4>
            </div>
            <div class="row" style="font-weight:bold;display: flex;margin-left:10px">
                <div class="col-sm-6" :style="colsm6">
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">姓名</div>
                        <div class="content" :style="content"> {{ form.realName }}</div>
                    </div>
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">性别</div>
                        <div class="content" :style="content">{{ form.sex == 2 ? '女' : '男' }}</div>
                    </div>
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">民族</div>
                        <div class="content" :style="content">
                            {{ convertFiled(form.national, 'nation') ? convertFiled(form.national, 'nation') : '--' }}
                        </div>
                    </div>
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">身份证号</div>
                        <div class="content" :style="content"> {{ form.idcard }}</div>
                    </div>
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">手机号码</div>
                        <div class="content" :style="content"> {{ form.phone }}</div>
                    </div>
<!--                    <div class="col-sm-6-div" :style="colsm6div">-->
<!--                        <div class="labels" :style="labels">从事职业</div>-->
<!--                        <div class="content" :style="content">-->
<!--                            {{convertFiled(form.flowType, 'flowType') ? convertFiled(form.flowType, 'flowType') : '&#45;&#45;' }}-->
<!--                        </div>-->
<!--                    </div>-->
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">流动状态</div>
                        <div class="content" :style="content">
                            {{convertFiled(form.floatingStatus, 'floatingStatus') ? convertFiled(form.floatingStatus, 'floatingStatus') : '--' }}
                        </div>
                    </div>
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">流动到何处</div>
                        <div class="content" :style="content"> {{ form.flowPlace }}</div>
                    </div>
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">流出日期</div>
                        <div class="content" :style="content"> {{ form.transferTime }}</div>
                    </div>
                    <div class="col-sm-6-div" :style="colsm6div">
                        <div class="labels" :style="labels">流动类型</div>
                        <div class="content" :style="content">
                            {{convertFiled(form.floatingOutType, 'floatingOutType') ? convertFiled(form.floatingOutType, 'floatingOutType') : '--' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer" slot="footer">
            <el-button size="small" @click="close">关 闭</el-button>
            <el-button type="primary" size="small" class="btn-blue" @click="toGetPdf">导出PDF</el-button>
        </div>
    </Modal>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import util from '@/libs/util'
import {VueCropper} from 'vue-cropper'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
    name: 'previewFlowOutPDF',
    components: {
        ElImageViewer,
        VueCropper
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        partyId: {
            type: String,
            default: ''
        },
        previewType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            content: ' width: 80%;margin-left: 100px;text-align:right;',
            labels: ' font-weight: bold;text-align: left;width: 40%;',
            colsm6: ' margin-left: 0px; font-size: 20px;',
            colsm6div: ' display: flex;margin-top: 20px;',
            zhanwei: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
            show: this.value,
            ids: [],
            tmp: [],
            image: '',
            visible: false,
            imgName: '',
            disabled: false,
            base: util.nginxUrl,
            // base: "/tempFileUrl",
            type: '',
            title: '',
            loadimg: false,
            modal1: false,
            idCardImgList: [],
            flowTypeList: [],
            floatingStatusList: [],
            floatingOutTypeList: [],
            idCardImgDefaultList: [],
            workPositionList: [],
            partyStateList: [],
            personTypeList: [],
            positionList: [],
            educationList: [],
            nationList: [],
            sexList: [{'name': '男', 'value': 1}, {'name': '女', 'value': 2}],
            id: '',
            formLabelWidth: '100px',
            dialogFormVisible: true,
            form: {
                ids: [],
                deptId: '',
                idCardImgList: [],
                areaName: '',
                isFirstSecretary: '',
                isOutsideCity: '',
                workPosition: '',
                flowPlace: '',
                isFlow: '',
                lostTime: '',
                isLost: '',
                partyState: '',
                telephone: '',
                isPoverty: '',
                transferTime: '',
                personType: '',
                partyTim: '',
                education: '',
                birthday: '',
                realName: '',
                idcard: '',
                sex: '',
                national: '',
                one: '',
                isSuffer: '',
                number: '',
                phone: '',
                state: '',
                disappear: '',
                date4: '',
                flow: '',
                direction: '',
                out: ''
            }
        }
    },
    methods: {
        convertFiled(row, type) {
            let tmp = ''
            if (type == 'nation') {
                this.nationList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'position') {
                this.positionList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'personType') {
                this.personTypeList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'education') {
                this.educationList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'partyState') {
                this.partyStateList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'workPosition') {
                this.workPositionList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'flowType') {
                this.flowTypeList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'floatingStatus') {
                this.floatingStatusList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            } else if (type == 'floatingOutType') {
                this.floatingOutTypeList.forEach(i => {
                    if (i.value == row) {
                        tmp = i.title
                    }
                })
            }
            return tmp
        },
        toGetPdf() {
            let _this = this
            let myBox = this.$refs.orderForm1 //获取ref里面的内容
            this.getPdf(myBox, this.form.realName, 500.28, 500.28, 550.28, 900.89)//PDF高，PDF宽，页宽，页高
        },
        // 下载pdf
        pdfDownload() {
            let _this = this
            let myBox = this.$refs.orderForm1 //获取ref里面的内容
            html2canvas(myBox, {
                useCORS: true, //是否尝试使用CORS从服务器加载图像
                allowTaint: true,
                dpi: 300, //解决生产图片模糊
                scale: 3, //清晰度--放大倍数
            }).then(function (canvas) {
                let contentWidth = canvas.width
                let contentHeight = canvas.height
                let pageHeight = contentWidth / 592.28 * 841.89 // 一页pdf显示html页面生成的canvas高度;
                let leftHeight = contentHeight //未生成pdf的html页面高度
                let position = 0 //pdf页面偏移
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                // let imgWidth = 595.28
                let imgWidth = 500.28  //页面宽度
                let imgHeight = 500.28 / contentWidth * contentHeight
                let pageData = canvas.toDataURL('image/jpeg', 1.0)
                let PDF = new JsPDF('I', 'pt', [600.28, 900.89])

                // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    PDF.addImage(pageData, 'JPEG', 20, 20, imgWidth, imgHeight)
                } else {
                    while (leftHeight > 0) {
                        PDF.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight
                        position -= 841.89
                        if (leftHeight > 0) {
                            PDF.addPage()
                        }
                    }
                }
                let g = new Date().getTime()//1637120820767
                PDF.save(_this.$t(_this.form.realName + g) + '.pdf')//下载标题
            })
        },
        closeImg() {
            this.visible = false
        },
        close() {
            // this.$router.push({path: 'index'})
            // this.$emit('input', false)
            this.$emit('close')
        },
        handleBeforeUpload(file) {
            if (this.attachmentList) {
                const check = this.attachmentList.length < 5
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 5 张图片。'
                    })
                    return check
                }
            }

            let fileType = file.type.toString().substring(file.type.toString().lastIndexOf('/') + 1, file.type.toString().length)
            if (fileType) {
                if (fileType.toLowerCase() != 'jpg' && fileType.toLowerCase() != 'jpeg' && fileType.toLowerCase() != 'png') {
                    // this.$message.error('附件格式不正确，请选择图片格式！');
                    return
                }
            }

            let data = window.URL.createObjectURL(new Blob([file]))
            this.fileName = file.name
            this.option.img = data

            this.modal1 = true
            return false//取消自动上传
        },
        regionChange(e) {
            let values = ''
            let areaId = ''
            if (e) {
                // var dat = data.province.value ? data.province.value : '' + data.city !== undefined ? ',' + data.city.value : '' + data.area !== undefined ? ',' + data.area.value : '' + data.town !== undefined ? ',' + data.town.value : ''
                if (e.province) {
                    values = e.province.value
                    areaId = e.province.key
                }
                if (e.city) {
                    values += '-' + e.city.value
                    areaId += e.city.key
                }
                if (e.area) {
                    values += '-' + e.area.value
                    // this.form.formList[i].addressName = values;
                }
                if (e.town) {
                    values += '-' + e.town.value
                    // this.form.formList[i].addressName = values;
                }
            }
            this.areaId = areaId
            this.form.areaName = values
        },
        //身份证正面图片预览
        idCardImgView(v) {
            this.image = v
            this.visible = true
            // this.idCardImgList.push(v)
            // this.idCardImgShow = true
        },
        //身份证反面图片预览
        idCardSideImgView(url) {
            this.idCardSideList.push(nginxUrl + url)
            this.idCardSideImgShow = true
        },
        //身份证图片删除
        idCardImgRemove(file) {
            this.idCardImgList = []
            this.tmp = []
            this.ids.push(this.form.attachFiles[0].fileId)
        },
        idCardImgFormatError(file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: file.name + ' 文件格式不正确, 请选择jpg或者png。'
            })
        },
        idCardImgMaxSize(file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件  ' + file.name + ' 太大，不超过2M。'
            })
        },
        idCardImgBeforeUpload(file) {
            /*  const check = this.idCardImgList.length < 1
              if (!check) {
                this.$Notice.warning({
                  title: '最多可以上传1张图片。'
                })
                return check
              }*/

            /*  let fileType = file.type.toString().substring(file.type.toString().lastIndexOf('/') + 1, file.type.toString().length);
              if (fileType) {
                if (fileType.toLowerCase() != 'jpg' && fileType.toLowerCase() != 'jpeg' && fileType.toLowerCase() != 'png') {
                  // this.$message.error('附件格式不正确，请选择图片格式！');
                  return;
                }
              }*/
            let data = window.URL.createObjectURL(new Blob([file]))
            this.fileName = file.name
            this.option.img = data

            this.modal1 = true

            return false//取消自动上传
        },
        idCardImgSuccess(res, file) {
            let obj = {
                status: '',
                url: '',
                fileName: '',
                fileSize: '',
                type: '',
                fileUrl: '',
                fileType: '身份证'
            }
            if (res.code == 200) {
                this.applyForm.idCardImg = res.data
                obj.url = nginxUrl + res.data
                obj.fileUrl = res.data
                obj.status = file.status
                obj.fileName = file.name
                obj.fileSize = file.size
                obj.type = file.name.substring(file.name.lastIndexOf('.') + 1)
                this.idCardImgList.push(obj)
            }
        },
        init() {
            // debugger
            this.getdict('nation')
            this.getdict('education')
            this.getdict('position')
            this.getdict('personType')
            this.getdict('partyState')
            this.getdict('workPosition')
            this.getdict('flowType')
            this.getdict('floatingStatus')
            this.getdict('floatingOutType')
            if (this.id) {
                this.$http({
                    url: this.$http.adornUrl('/platform/partyMember/getPartyInfo?id=' + this.id),
                    method: 'get',
                    // params: this.$http.adornParams()
                }).then((res) => {
                    this.form = res.data
                    if (this.form) {
                        this.form.isFirstSecretary = this.form.isFirstSecretary ? this.form.isFirstSecretary : ''
                        this.form.isPoverty = this.form.isPoverty ? this.form.isPoverty : ''

                        this.form.birthday = this.formartDate(this.form.birthday, 'yyyy-MM-dd')
                        this.form.partyTime = this.formartDate(this.form.partyTime, 'yyyy-MM-dd')
                        this.form.transferTime = this.formartDate(this.form.transferTime, 'yyyy-MM-dd')
                        if (this.form.attachFiles) {
                            this.idCardImgList[0] = this.form.attachFiles[0]
                            this.tmp.push(this.base + this.form.attachFiles[0].filePath)
                        }
                    }
                })
            }
        },
        getdict(type) {
            let tmp = []
            this.$http({
                url: this.$http.adornUrl('/tDictData/getByType?type=' + type),
                method: 'get',
            }).then((res) => {
                if (type === 'nation') {
                    this.nationList = res.data
                    /* this.nationList.forEach(i => {
                       i.value = parseInt(i.value)
                     })*/
                } else if (type === 'education') {
                    this.educationList = res.data
                } else if (type === 'position') {
                    this.positionList = res.data
                    this.positionList.forEach(i => {
                        i.value = parseInt(i.value)
                    })
                } else if (type === 'personType') {
                    this.personTypeList = res.data
                    this.personTypeList.forEach(i => {
                        i.value = parseInt(i.value)
                    })
                } else if (type === 'partyState') {
                    this.partyStateList = res.data
                    this.partyStateList.forEach(i => {
                        i.value = parseInt(i.value)
                    })
                } else if (type === 'workPosition') {
                    this.workPositionList = res.data
                } else if (type === 7) {
                    this.organizationTypeList = res.data
                    this.organizationTypeList.forEach(i => {
                        i.value = parseInt(i.value)
                    })
                } else if (type === 'flowType') {
                    this.flowTypeList = res.data
                } else if (type === 'floatingStatus') {
                    this.floatingStatusList = res.data
                } else if (type === 'floatingOutType') {
                    this.floatingOutTypeList = res.data
                }
            })
            return tmp
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
        },
    },
    watch: {
        value(val) {
            if (val) {
                this.show = val
                this.title = this.modalTitle
                this.id = this.partyId
            } else {
                this.show = false
            }
        },
        show(val) {
            if (val) {
                this.init()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-content {
    //margin-top: -28px;
    width: 100%;

    .mo2 {
        .mo2 .ivu-modal-mask {
            z-index: 1009;
        }

        .mo2 .ivu-modal-wrap {
            z-index: 1009;
        }

        .body {
            padding: 20px 30px 30px 30px;
            /*background: #f8fafb;*/
            width: auto;

            .modal-header {
                padding: 5px 15px;
                text-align: center;

                .modal-title {
                    font-size: 26px;
                }
            }

            .row {
                //margin-right: -15px;
                //margin-left: -15px;
                display: flex;

                .col-sm-6 {
                    width: 50%;
                    margin-left: 35px;
                    font-size: 20px;

                    .col-sm-6-div {
                        display: flex;
                        margin-top: 20px;

                        .labels {
                            font-weight: bold;
                            text-align: left;
                            width: 33%;
                            /*margin-right: 50px;*/
                        }

                        .content {
                            /*margin-right: 20px;*/
                            width: 80%;
                            margin-left: 100px;
                        }
                    }


                    &:hover {
                        .demo-upload-list-cover {
                            display: block;
                        }
                    }

                    .demo-upload-list-cover {
                        display: none;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        /*height: 60px;*/
                        line-height: 60px;
                        background: rgba(0, 0, 0, .6);
                        text-align: center;

                        &:hover {
                            display: block;
                            background: rgba(0, 0, 0, .6);
                        }
                    }

                    .ivu-modal {
                        width: 660px !important;
                    }

                    .demo-upload-list {
                        display: inline-block;
                        width: 60px;
                        height: 60px;
                        text-align: center;
                        line-height: 60px;
                        border: 1px solid transparent;
                        border-radius: 4px;
                        overflow: hidden;
                        background: #fff;
                        position: relative;
                        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
                        margin-right: 4px;
                    }

                    .demo-upload-list img {
                        width: 100%;
                        height: 100%;
                    }

                    .demo-upload-list-cover {
                        display: none;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: rgba(0, 0, 0, .6);
                    }

                    .demo-upload-list:hover .demo-upload-list-cover {
                        display: block;
                    }

                    .demo-upload-list-cover i {
                        color: #fff;
                        font-size: 20px;
                        cursor: pointer;
                        margin: 0 2px;
                        margin-top: 30px;
                    }

                    .label {
                        ::v-deep.el-form-item__label {
                            line-height: 18px;
                        }
                    }


                    .el-form-item {
                        line-height: 20px;

                        .input-row {
                            width: 80%;
                            margin-right: 10px
                        }

                        padding-left: 10px !important;
                        margin-right: -12px;
                        margin-left: -15px;
                        margin-bottom: 15px;
                    }
                }
            }
        }
    }


    .modal-footer {
        padding: 15px;
        text-align: right;
        border-top: 1px solid #e5e5e5;

        .btn-white {
            border-radius: 3px;
            letter-spacing: 1px;
            color: inherit;
            background: white;
            border: 1px solid #e7eaec;

            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
        }

        .btn-blue {
            border-radius: 3px;
            letter-spacing: 1px;

            color: #FFFFFF;
            margin-left: 5px;
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-color: #3d86e7 !important;
            border-color: #3d86e7 !important;
        }
    }
}
</style>
