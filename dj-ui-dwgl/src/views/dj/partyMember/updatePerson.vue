<template>
    <el-dialog :visible.sync="visible" width="80%" :title="title" append-to-body :close-on-click-modal="false"
               top="1vh">
        <div class="modal-content" id="pdfDom" ref="orderForm1">
            <div class="body">
                <el-form ref="form" :model="form" :rules="rules" label-width="190px">
                    <div class="row">
                        <div class="col-sm-6">
                            <el-form-item label="所属部门:" prop="deptName" class="input-row">
                                <div style="text-align: left; font-weight: bold;">{{ form.deptName }}</div>
                            </el-form-item>
                            <el-form-item label="姓名:" prop="realName"
                                          class="input-row">
                                <el-input v-model="form.realName" placeholder="请输入姓名" autocomplete="off"
                                          class="input-row"></el-input>
                            </el-form-item>

                            <el-form-item label="身份证号:" prop="idcard">
                                <el-input v-model="form.idcard" placeholder="请输入身份证号" autocomplete="off"
                                          class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="性别:" prop="sex">
                                <el-select v-model="form.sex" placeholder="请选择" class="input-row">
                                    <el-option v-for="(item, index) in sexList" :label="item.name" :value="item.value"
                                               :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="民族:" prop="national">
                                <el-select v-model="form.national" placeholder="请选择民族" class="input-row">
                                    <el-option v-for="(item,index) in nationList" :key="index" :label="item.label"
                                               :value="item.itemValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="出生日期:"
                                          prop="birthday">
                                <el-date-picker
                                        v-model="form.birthday"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="学历:" prop="education">
                                <el-select v-model="form.education" placeholder="请选择" class="input-row">
                                    <el-option v-for="(item,index) in educationList" :key="index" :label="item.label"
                                               :value="item.itemValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="加入党组织日期:" prop="partyTime" class="label">
                                <el-date-picker
                                        v-model="form.partyTime"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        class="input-row">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="转为正式党员日期:" prop="transferTime"
                                          class="label">
                                <el-date-picker
                                        v-model="form.transferTime"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        class="input-row">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="是否第一书记:" prop="isFirstSecretary"
                                          class="label">
                                <el-select v-model="form.isFirstSecretary" placeholder="请选择" class="input-row">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所在党支部职务:" prop="positionList" class="label">
                                <el-select v-model="form.position" placeholder="请选择" class="input-row" clearable>
                                    <el-option v-for="(item,index) in positionList" :key="index" :label=item.label
                                               :value="Number(item.itemValue)"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="人员类别:" prop="personType">
                                <el-select v-model="form.personType" placeholder="请选择" class="input-row">
                                    <el-option v-for="(item,index) in personTypeList" :key="index" :label=item.label
                                               :value="Number(item.itemValue)"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="头像:" class="label">
                                <el-upload
                                        v-loading="uploading"
                                        class="avatar-uploader"
                                        :action="'#'"
                                        :show-file-list="false"
                                        accept='.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP'
                                        :before-upload="beforeImageUpload">
                                    <img v-if="form.avatar && form.avatar.length" :src="form.avatar" class="avatar"
                                         v-loading="uploading">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </div>
                        <div class="col-sm-6">
                            <!--  <el-form-item label="是否贫困户:"  prop="isPoverty">
                                  <el-select v-model="form.isPoverty" placeholder="请选择" class="input-row">
                                      <el-option label="是" value="1"></el-option>
                                      <el-option label="否" value="0"></el-option>
                                  </el-select>
                              </el-form-item>-->
                            <el-form-item label="籍贯:" prop="nativePlace">
                                <el-input v-model="form.nativePlace" placeholder="请输入籍贯" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="是否是党务工作者:" prop="isPartyWorker" class="label">
                                <el-select v-model="form.isPartyWorker" placeholder="请选择" class="input-row"
                                           @change="handleSelectChange">
                                    <el-option label="是" :value='"1"' @click.native="handleSelectChange(1)"></el-option>
                                    <el-option label="否" :value='"0"' @click.native="handleSelectChange(2)"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="党务标签:" v-if="form.isPartyWorker == 1" prop="partyWorkerTips">
                                <div style="height: auto;text-align: center;display: flex;flex-wrap: wrap">
                                    <div v-for="(item,index) in partyWorkerList" :key="index"
                                         @click="selectTip(item.itemValue-1)"
                                         :class="!item.isSelect ? 'unSelect' :'Select'">
                                        <div style="line-height: 20px;">{{ item.label }}</div>
                                    </div>
                                </div>
                            </el-form-item>

                            <el-form-item label="是否困难党员:" prop="isSuffer" class="label">
                                <el-select v-model="form.isSuffer" placeholder="请选择" class="input-row">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="座机号码:" prop="telephone">
                                <el-input v-model="form.telephone" placeholder="请输入座机号码(以-分割)" autocomplete="off"
                                          class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码:" prop="phone">
                                <el-input v-model="form.phone" placeholder="请输入手机号码" autocomplete="off"
                                          class="input-row"></el-input>
                            </el-form-item>

                            <el-form-item label="党籍状态:" prop="partyState">
                                <el-select v-model="form.partyState" placeholder="请选择" class="input-row" clearable>
                                    <el-option v-for="(item,index) in partyStateList" :key="index" :label="item.label"
                                               :value="Number(item.itemValue)"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否失联党员:" prop="isLost">
                                <el-select v-model="form.isLost" placeholder="请选择" class="input-row" clearable>
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否流动党员:" prop="isFlow">
                                <el-select v-model="form.isFlow" placeholder="请选择" class="input-row" clearable>
                                    <el-option label="是" value=1></el-option>
                                    <el-option label="否" value=0></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="外出流向:" prop="flowPlace">
                                <el-input v-model="form.flowPlace" placeholder="请输入外出流向（最多50个字符）"
                                          autocomplete="off" maxlength="50" class="input-row"></el-input>
                            </el-form-item>
                            <el-form-item label="工作单位区域选择:" prop="areaName" class="label">
                                <el-input v-model="form.areaName" placeholder="请选择工作单位区域" autocomplete="off"
                                          :disabled="true" class="input-row"></el-input>
                                <!--                            <v-region-selects
                                                                clearable
                                                                v-model="areaId"
                                                                :area="false"
                                                                @change="regionChange"
                                                            />-->
                                <select-area @selected="regionSelected" :values="form.regionIds" ref="selectAreaRef" v-if="visible"
                                             style="margin-top: 5px;"></select-area>
                            </el-form-item>
                            <el-form-item label="工作岗位:" prop="workPosition">
                                <el-select v-model="form.workPosition" filterable placeholder="请选择" class="input-row"
                                           clearable>
                                    <el-option v-for="(item,index) in workPositionList" :key="index" :label="item.label"
                                               :value="item.itemValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否市外转接:" prop="isOutsideCity"
                                          class="label">
                                <el-select v-model="form.isOutsideCity" placeholder="请选择" class="input-row">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div class="modal-footer" slot="footer">
                    <el-button size="medium" @click="close()">关闭</el-button>
                    <el-button type="primary" size="medium" @click="submitForm('form')">保存</el-button>
                </div>

                <cropper ref="cropper" :auto-crop-width="300" :auto-crop-height="300" :fixed="false"
                         @cropperResult="cropperResult"></cropper>

            </div>
        </div>
    </el-dialog>

</template>

<script>

import util from '@/libs/util'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {addPartyMember} from "@/api/jcxfPartyMember";
import {getPartyInfo} from "@/api/jcxfPartyMember";
import {getDictByType, getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {uploadFile} from "@/api/minionFile";
import SelectArea from "@/components/selectArea.vue";
import cropper from "@/views/dj/components/cropper.vue";
import {getTzSysDept} from "@/api/jcxfSysDept";

export default {
    name: 'updatePerson',
    components: {
        SelectArea,
        ElImageViewer,
        cropper
    },
    data() {
        return {
            partyWorkerShow: false,
            avatarPath: '',
            id: '',
            previewShow: false,
            ids: [],
            tmp: [],
            image: '',
            visible: false,
            uploading: false,
            imgName: '',
            areaId: {
                province: '',
                city: '',
                area: '',
                town: ''
            },
            base: util.jcxfUrl,
            title: '',
            partyWorkerList: [],
            workPositionList: [],
            partyStateList: [],
            personTypeList: [],
            positionList: [],
            educationList: [],
            nationList: [],
            sexList: [{'name': '男', 'value': 1}, {'name': '女', 'value': 2}],
            type: '',
            form: {
                ids: [],
                deptId: '',
                deptName: '',
                areaName: '',
                isFirstSecretary: '',
                isOutsideCity: '',
                flowPlace: '',
                isFlow: '',
                lostTime: '',
                isLost: '',
                partyState: '',
                telephone: '',
                isPoverty: '',
                transferTime: '',
                personType: '',
                partyTime: '',
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
                workPosition: '',
                out: '',
                isPartyWorker: '0',
                nativePlace: ''
            },
            rules: {
                realName: [
                    {required: true, message: '请输入姓名', trigger: 'change'},
                    {min: 2, max: 10, message: '长度在 2 到 10 个汉字', trigger: 'change'}
                ],
                idcard: [
                    {required: true, message: '请输入身份证号', trigger: 'change'},
                    // {min: 18, max: 19, message: '请输入正确的身份证号', trigger: 'change'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'change'}
                ],
                national: [
                    {required: true, message: '请选择民族', trigger: 'change'}
                ],
                birthday: [
                    {required: true, message: '请选择出生日期', trigger: 'change'}
                ],
                education: [
                    {required: true, message: '请选择学历', trigger: 'change'}
                ],
                partyTime: [
                    {required: true, message: '请选择加入党组织日期', trigger: 'change'}
                ],
                // transferTime: [
                //     {required: true, message: '请选择日期', trigger: 'change'}
                // ],
                // position: [
                //     {required: true, message: '请选择职务', trigger: 'change'}
                // ],
                // personType: [
                //     {required: true, message: '请选择类别', trigger: 'change'}
                // ],
                // isFirstSecretary: [
                //     {required: true, message: '请选择是否为第一书记', trigger: 'change'}
                // ],
                // isPoverty: [
                //     {required: true, message: '请选择是否为贫困户', trigger: 'change'}
                // ],
                // isSuffer: [
                //     {required: true, message: '请选择是否为困难党员', trigger: 'change'}
                // ],
                // isPartyWorker: [
                //     {required: true, message: '请选择是否为党务工作者', trigger: 'change'}
                // ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'change'},
                    // {type: 'string', message: '联系电话有误！', trigger: 'blur', pattern: /^1[3456789]\d{9}$/}
                ],
                // state: [
                //     {required: true, message: '请选择党籍状态', trigger: 'change'}
                // ],
                // workPosition: [
                //     {required: true, message: '请选择工作岗位', trigger: 'change'}
                // ],
                // isOutsideCity: [
                //     {required: true, message: '请选择是否为市外转接', trigger: 'change'}
                // ],
                // partyState: [
                //     {required: true, message: '请选择党籍状态', trigger: 'change'}
                // ]
            },
        }
    },
    created() {

    },
    methods: {
        openDialog(id, type, deptId) {
            this.visible = true
            this.form.id = id
            this.id = id
            this.type = type

            this.$nextTick(() => {
                this.$refs['form'].resetFields()
            })
            if (this.type == 0) {
                this.title = '编辑'
            } else if (this.type == 1) {
                this.title = '详情'
            } else if (this.type == 3) {
                this.title = '新增'
                this.form.deptId = deptId
                getTzSysDept(this.form.deptId).then(res => {
                    const data = res.data
                    if (data.code == '00000') {
                        this.form.deptName = data.data.name
                    }
                })
            }
            this.init()
        },
        partyWorkerFinish() {
            this.partyWorkerShow = false
        },
        selectTip(e) {
            if (!this.partyWorkerList[e].isSelect) {
                this.partyWorkerList[e].isSelect = true
            } else {
                this.partyWorkerList[e].isSelect = false
            }
            this.$forceUpdate();
        },
        submitPartyWorker() {
            this.partyWorkerShow = false
        },
        handleSelectChange(e) {
            if (e == 1) {
                this.partyWorkerShow = true
            } else {
                this.partyWorkerShow = false
            }
        },
        preview() {
            this.previewShow = true
        },
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return
                }
                this.form.partyWorkerTips = []
                if (this.form.isPartyWorker == 1) {
                    this.partyWorkerList.forEach(i => {
                        if (!i.isSelect) {
                            return false
                        } else {
                            this.form.partyWorkerTips.push(i.itemValue)
                        }
                    })
                    if (!this.form.partyWorkerTips || this.form.partyWorkerTips.length == 0) {
                        this.$message.info('请选择党务工作者标签')
                        return false
                    }
                    this.form.partyWorkerTips = this.form.partyWorkerTips.join(',');
                }
                this.form.ids = this.ids
                let data = this.form
                addPartyMember(data).then((res) => {
                    this.visible = false
                    const result = res.data
                    if (result.code == "00000") {
                        this.$message.success("保存成功")
                        this.visible = false
                    } else {
                        this.$message.error(result.msg)
                    }
                }).catch((e) => {
                })
            })
        },
        close() {
            this.visible = false
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
            return false
        },
        cropperResult(file) {
            this.uploading = true
            let reader = new FileReader()
            reader.readAsDataURL(file.data)
            reader.onload = () => {
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.avatar = res.data.url
                        this.uploading = false
                    }
                })
            }
        },
        regionSelected(event) {
            this.form.areaName = event.areaName
            this.form.areaId = event.areaId
            this.form.regionIds = event.deptRegionIds
        },
        regionChange(e) {
            let values = ''
            let areaId = ''
            if (e) {
                if (e.province) {
                    values = e.province.value
                    areaId = e.province.key
                    this.areaId.province = e.province.key
                }
                if (e.city) {
                    values += '-' + e.city.value
                    areaId += '-' + e.city.key
                    this.areaId.city = e.city.key
                }
                if (e.area) {
                    values += '-' + e.area.value
                    areaId += '-' + e.area.key
                    this.areaId.area = e.area.key
                }
                if (e.town) {
                    values += '-' + e.town.value
                    areaId += '-' + e.town.key
                    this.areaId.town = e.town.key
                }
            }
            this.form.areaId = areaId
            this.form.areaName = values
        },
        init() {
            Promise.all([
                this.getDict('nation'),
                this.getDict('education'),
                this.getDict('position'),
                this.getDict('personType'),
                this.getDict('partyState'),
                this.getDict('workPosition'),
                this.getDict2('partyWorker')
            ]).then(() => {
                if (this.form.id) {
                    getPartyInfo(this.form.id).then((res) => {
                        this.form = res.data.data
                        if (this.form.isPartyWorker == '1') {
                            this.form.partyWorkerTips = this.form.partyWorkerTips.split(',')
                            for (let i = 0; i < this.partyWorkerList.length; i++) {
                                const itemValue = this.partyWorkerList[i].itemValue;
                                if (this.form.partyWorkerTips.includes(itemValue)) {
                                    this.partyWorkerList[i].isSelect = true;
                                }
                            }
                        }
                        this.$nextTick(() => {
                            this.$refs.selectAreaRef.setData(this.form.regionIds)
                        })
                    })
                }

            })
        },
        getDict(type) {
            return new Promise((resolve, reject) => {
                getDictByCode(type).then((res) => {
                    let data = res.data.data
                    if (type === 'nation') {
                        this.nationList = data
                    } else if (type === 'education') {
                        this.educationList = data
                    } else if (type === 'position') {
                        this.positionList = data
                    } else if (type === 'personType') {
                        this.personTypeList = data
                    } else if (type === 'partyState') {
                        this.partyStateList = data
                    } else if (type === 'workPosition') {
                        this.workPositionList = data
                    }
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            })
        },
        getDict2(type) {
            return new Promise((resolve, reject) => {
                getDictByType2(type).then((res) => {
                    let data = res.data
                    if (type === 'partyWorker') {
                        this.partyWorkerList = data
                    }
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.unSelect {
    background-color: rgb(144, 147, 152);
    margin-bottom: 10px;
    margin-left: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    color: white;
}

.Select {
    background-color: rgb(72, 162, 255);
    margin-bottom: 10px;
    margin-left: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    color: white;
}

.avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.modal-content {
    background: white;

    .modal-header {
        padding: 15px 15px;
        text-align: center;

        .modal-title {
            font-size: 26px;
        }
    }

    .body {
        width: 95%;
        margin: auto;

        .row {
            //margin-right: -15px;
            //margin-left: -15px;
            display: flex;

            .col-sm-6 {
                width: 50%;

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
                        width: 100%;
                    }

                    margin-bottom: 15px;
                }
            }
        }
    }

    .modal-footer {
        width: 100%;
        margin: auto;
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
