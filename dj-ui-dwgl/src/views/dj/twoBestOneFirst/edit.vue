<template>
    <el-dialog title="编辑" :visible.sync="dialogVisible" append-to-body width="860px" @close="close(false)" :close-on-click-modal="false">
        <el-form ref="form" :model="form" label-width="110px" style="text-align: center;">
            <div style="width: 800px; margin: auto; text-align: left;">

                <div>
                    <el-form-item prop="tableType" label="申请批次：" style="flex: 1">
                        <!--                        <el-select style="width: 100%;" v-model="form.timeId" :disabled="id != null && id != ''" @change="tableTypeChange" placeholder="请输入选择申请批次">
                                                    <el-option v-for="item in addTimeList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                                                </el-select>-->
                        {{ timeShowTitle }}
                    </el-form-item>
                </div>

                <div style="display: flex;">
                    <el-form-item prop="tableType" label="提交类型：" style="flex: 1">
                        <el-select style="width: 100%;" v-model="form.tableType" :disabled="id != null && id != ''"
                                   @change="tableTypeChange" placeholder="请输入选择荣誉类型">
                            <el-option v-for="item in twoBestOneFirstTableTypeList" :key="item.itemValue"
                                       :label="item.label" :value="item.itemValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="idCard" label="党员：" label-width="90px" v-if="form.tableType == '1' || form.tableType == '2'">
                        <el-select style="width: 250px" v-model="form.partyMemberId" clearable @change="optionSelect($event)"
                                   filterable placeholder="请选择党员">
                            <el-option v-for="item in partyMemberOptions" :key="item.id"
                                       :label="item.realName+'：'+ item.idcard" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <template v-if="form.tableType == '1' || form.tableType == '2'">
                    <div class="info" v-if="Object.keys(selectPartyMemberInfo).length > 0">
                        <div style="flex: 1; padding-right: 10px;">
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="8">姓名<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini" v-model="selectPartyMemberInfo.realName"/>
                                </el-col>
                                <el-col :span="8">性别<span style="color:red;">*</span>：
                                    <el-select class="table-item" size="mini" v-model="selectPartyMemberInfo.sex">
                                        <el-option v-for="item in sexList" :key="item.itemValue" :label="item.label"
                                                   :value="item.itemValue"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">民族<span style="color:red;">*</span>：
                                    <el-select class="table-item" size="mini" v-model="selectPartyMemberInfo.national">
                                        <el-option v-for="item in nationList" :key="item.itemValue" :label="item.label"
                                                   :value="item.itemValue"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="8">出生年月<span style="color:red;">*</span>：
                                    <el-date-picker style="width: 100%;" size="mini"
                                                    v-model="selectPartyMemberInfo.birthday"
                                                    placeholder="请选择时间"></el-date-picker>
                                </el-col>
                                <el-col :span="8">籍贯<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini"
                                              v-model="selectPartyMemberInfo.nativePlace"/>
                                </el-col>
                                <el-col :span="8">参加工作时间<span style="color:red;">*</span>：
                                    <el-date-picker style="width: 100%;" size="mini"
                                                    v-model="selectPartyMemberInfo.joinWork" type="month"
                                                    placeholder="请选择时间"></el-date-picker>
                                </el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="8">入党时间<span style="color:red;">*</span>：
                                    <el-date-picker style="width: 100%;" size="mini"
                                                    v-model="selectPartyMemberInfo.partyTime" type="date"/>
                                </el-col>
                                <el-col :span="8">学历<span style="color:red;">*</span>：
                                    <el-select class="table-item" size="mini" v-model="selectPartyMemberInfo.education">
                                        <el-option v-for="item in educationList" :key="item.itemValue"
                                                   :label="item.label" :value="item.itemValue"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">职称<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini"
                                              v-model="selectPartyMemberInfo.professional"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="24">工作单位及职位<span style="color:red;">*</span>：<br>
                                    单位<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini" v-model="deptInfo.name"/>
                                    职务<span style="color:red;">*</span>：
                                    <el-select class="table-item" size="mini" v-model="selectPartyMemberInfo.position">
                                        <el-option v-for="item in positionList" :key="item.itemValue"
                                                   :label="item.label" :value="Number(item.itemValue)"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="14">单位地址<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini" v-model="deptInfo.address"/>
                                </el-col>
                                <el-col :span="10">单位电话<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini" v-model="deptInfo.phone"/>
                                </el-col>
                            </el-row>
                            <el-row :gutter="15" class="info-item">
                                <el-col :span="14">身份证号<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini" v-model="selectPartyMemberInfo.idcard"/>
                                </el-col>
                                <el-col :span="10">本人电话<span style="color:red;">*</span>：
                                    <el-input class="table-item" size="mini" v-model="selectPartyMemberInfo.phone"/>
                                </el-col>
                            </el-row>
                        </div>
                        <div style="width: 180px; text-align: center;">
                            <el-upload
                                    v-loading="uploadLoading"
                                    accept='.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP'
                                    class="avatar-uploader"
                                    :action="'#'"
                                    :show-file-list="false"
                                    :headers="{Authorization: $cookie.get('Authorization_party_vp')}"
                                    :before-upload="beforeImageUpload">
                                <img v-if="form.avatar" :src="form.avatar" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            照片
                        </div>

                    </div>

                    <el-form-item prop="resume" label="个人简历：" label-width="110px">
                        <div style="color: #909399">
                            {{ placeholder.resume }}
                        </div>
                        <div style="display: flex;">
                            <div style="margin-right: 15px; font-size: 20px;"><i class="el-icon-circle-plus"
                                                                                 @click="addResume()"></i></div>
                            <div style="display: flex; flex-direction: column; width: 100%;">
                                <div style="margin-bottom: 15px; display: flex;" v-for="(item, index) in resumeList"
                                     :key="index">
                                    <div>
                                        <el-date-picker style="width: 150px;" v-model="item.startTime" type="month"
                                                        placeholder="开始时间"></el-date-picker>
                                        &nbsp;&nbsp;-&nbsp;&nbsp;
                                        <el-date-picker style="width: 150px;" v-model="item.endTime" type="month"
                                                        placeholder="结束时间"></el-date-picker>
                                    </div>
                                    <div style="margin: 0 15px; flex: 1;">
                                        <el-input v-model="item.value" placeholder="请输入内容"/>
                                    </div>
                                    <div style="font-size: 20px;"><i class="el-icon-remove"
                                                                     @click="delResume(index)"></i></div>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </template>

                <template v-else-if="form.tableType == '3'">
                    <el-form-item prop="baseCondition" label="党组织名称：">
                        <el-input class="table-item" v-model="deptInfo.name"/>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="baseCondition" label="所在地区：">
                                <select-area @selected="regionSelected" style="margin-top: 5px;"></select-area>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="baseCondition" label="党员人数：">
                                <el-input-number style="width: 100%;" v-model="deptInfo.partyMemberTotal" :min="1" :max="10000"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="baseCondition" label="党组织负责人：">
                                <el-input class="table-item" v-model="selectPartyMemberInfo.realName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="baseCondition" label="联系电话：">
                                <el-input class="table-item" v-model="selectPartyMemberInfo.phone"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="baseCondition" label="基本情况：">
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">党支部下设x个党小组，有*名正式党员、*名预备党员，支部班子成员有*人.....<br/>（1）党组织的类别；<br/>（2）党组织所属党总支和党支部数量等；
                                <br/>（3）党员的数量。近3年来党组织班子成员有受党纪、政务处份的，以及本单位发生过重大责任事故或在社会上影响较大事件的需注明。
                            </div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <el-input v-model="form.baseCondition" type="textarea" :autosize="{ minRows: 4}"
                                  :placeholder="placeholder.baseCondition"></el-input>
                    </el-form-item>
                </template>

                <el-form-item prop="commendCondition" label="曾受表彰情况：">
                    <div style="color: #909399">
                        {{ placeholder.commendCondition }}
                    </div>
                    <div style="display: flex;">
                        <div style="margin-right: 15px; font-size: 20px;"><i class="el-icon-circle-plus"
                                                                             @click="addCommendCondition()"></i></div>
                        <div style="display: flex; flex-direction: column; width: 100%">
                            <div style="margin-bottom: 15px; display: flex;"
                                 v-for="(item, index) in commendConditionList" :key="index">
                                <div>
                                    <el-date-picker style="width: 150px;" v-model="item.time" type="month"
                                                    placeholder="请选择时间"></el-date-picker>
                                </div>
                                <div style="margin-left: 15px;">
                                    <el-input style="width: 100%;" v-model="item.name" placeholder="请输入获奖名称"/>
                                </div>
                                <template v-if="form.tableType == '1' || form.tableType == '2'">
                                    <div style="margin-left: 15px; flex: 1;">
                                        <el-input v-model="item.dept" placeholder="请输入授予单位"/>
                                    </div>
                                </template>
                                <div style="margin-left: 15px; font-size: 20px;"><i class="el-icon-remove"
                                                                                    @click="delCommendCondition(index)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="mainDeed" label="主要事迹：">
                    <el-input v-model="form.mainDeed" type="textarea" maxlength="1000" show-word-limit
                              :autosize="{ minRows: 4}" :placeholder="placeholder.mainDeed"></el-input>
                </el-form-item>
            </div>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close(false)">取消</el-button>
            <el-button size="small" type="primary" @click="save">确定</el-button>
        </span>
        <cropper ref="cropper" :auto-crop-width="250" :auto-crop-height="350" :fixed="false"
                 @cropperResult="uploadCropperImg"></cropper>
    </el-dialog>
</template>

<script>
import {getDictByType2} from "@/api/tDictData";
import {getDictByCode} from "@/api/jcxfSysDictionary";
import {getTzTwoBestOneFirstById} from "@/api/tzTwoBestOneFirst";
import {updateTzTwoBestOneFirstById, addTzTwoBestOneFirst} from "@/api/tzTwoBestOneFirst";
import {getPartMemberListByDeptId, getPartMemberListByDeptIds} from "@/api/jcxfPartyMember";
import {getTzSysDept} from "@/api/jcxfSysDept";
import util from "@/libs/util";
import {uploadImages} from "@/api/attachFile";
import cropper from "@/views/dj/components/cropper.vue";
import {mapGetters} from "vuex";
import {getAddTimeList, getTzTwoBestOneFirstTimeById} from "@/api/tzTwoBestOneFirstTime";
import {uploadFile} from "@/api/minionFile";
import SelectArea from "@/components/selectArea.vue";
export default {
    name: "edit",
    components: {
        cropper,
        SelectArea
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        id: {
            default: null
        },
        timeId: {
            default: null
        },
        timeTitle: {
            default: ''
        },
        deptId: {
            default: null
        },
    },
    watch: {
        value() {
            this.dialogVisible = this.value
            if (this.value && this.id != null) {
                this.form.id = this.id
                this.getTzTwoBestOneFirst()
            } else {
                this.form.timeId = this.timeId
                this.timeShowTitle = this.timeTitle
            }

            if (this.value) {
                this.placeholder.baseCondition = '请输入基本情况'
                this.placeholder.resume = '简历从高中填起，精确到月，不得断档'
                this.placeholder.commendCondition = '填写主要表彰奖励情况，不得超过5项，按时间先后排序；担任省级以上“两代表一委员“的填写在最后'
                this.placeholder.mainDeed = '主要事迹要求突出功绩、表述准确、文字精炼，1000字以内'

                this.getDict('twoBestOneFirstTable')
                this.getDict2('nation')
                this.getDict2('education')
                this.getDict2('position')
                if (this.id == null || this.id == '') {
                    this.getTzSysDeptInfo()
                }
                this.getPartMemberList()
                // this.addResume()
                // this.addCommendCondition()
            }
        }
    },
    data() {
        return {
            base: util.minionUrl,
            dialogVisible: false,
            twoBestOneFirstTableTypeList: [],
            partyMemberOptions: [],
            selectPartyMemberInfo: {},
            deptInfo: {},
            nationList: [],
            educationList: [],
            positionList: [],
            sexList: [{'label': '男', 'itemValue': 1}, {'label': '女', 'itemValue': 2}],
            resumeList: [],
            commendConditionList: [],
            form: {
                id: '',
                timeId: '',
                createDeptId: '',
                partyMemberId: '',
                tableType: '',
                baseCondition: '',
                resume: '',
                commendCondition: '',
                mainDeed: '',
                avatar: '',
                partyMemberInfo: {},
                deptInfo: {}
            },
            placeholder: {
                baseCondition: '',
                commendCondition: '',
                mainDeed: '',
                resume: ''
            },
            addTimeList: [],
            timeShowTitle: '',
            uploadLoading: false
        }
    },
    computed: {
        ...mapGetters(
                {vuexDeptInfo: 'deptInfo'}
        ),
    },
    methods: {
        regionSelected(event) {
            this.deptInfo.areaName = event.areaName
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
                this.uploadLoading = true
                uploadFile({imgUrl: reader.result, imgName: file.name}).then(res => {
                    if (res.code == '000000') {
                        this.form.avatar = res.data.url
                        this.uploadLoading = false
                    }
                })
            }
        },
        addResume() {
            this.resumeList.push({
                startTime: null,
                endTime: null,
                value: ''
            })
        },
        delResume(index) {
            this.resumeList.splice(index, 1)
        },
        addCommendCondition() {
            if (this.commendConditionList.length == 5) {
                this.$message.info('表彰情况填写不得超过5项')
                return
            }
            this.commendConditionList.push({
                time: null,
                name: '',
                dept: ''
            })
        },
        delCommendCondition(index) {
            this.commendConditionList.splice(index, 1)
        },
        getTzSysDeptInfo() {
            getTzSysDept(this.vuexDeptInfo.id).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.deptInfo = data.data
                }
            })
        },
        rest() {
            this.form.id = ''
            this.form.createDeptId = ''
            this.form.partyMemberId = ''

            // this.form.tableType = ''
            // this.form.baseCondition = ''
            // this.form.resume = ''
            // this.form.commendCondition = ''
            // this.form.mainDeed = ''
            this.form.avatar = ''
            this.form.partyMemberInfo = {}
            this.form.deptInfo = {}

            this.resumeList = []
            this.commendConditionList = []
            this.selectPartyMemberInfo = {}

            this.$refs.form.resetFields()
        },
        getDict(type) {
            getDictByType2(type).then((res) => {
                let data = res.data
                if (type === 'twoBestOneFirstTable') {
                    this.twoBestOneFirstTableTypeList = data
                    if (data.length > 0 && !this.id) {
                        this.form.tableType = data[0].itemValue
                    }
                }
            })
        },
        getDict2(type) {
            getDictByCode(type).then((res) => {
                let data = res.data.data
                if (type === 'nation') {
                    this.nationList = data
                } else if (type === 'education') {
                    this.educationList = data
                } else if (type === 'position') {
                    this.positionList = data
                }
            })
        },
        findTitleByValue(value, dic) {
            const data = dic.find(i => {
                if (i.itemValue == value) {
                    return i
                }
            })

            if (data && data.label) {
                return data.label
            }
            return '无'
        },
        getTzTwoBestOneFirst() {
            getTzTwoBestOneFirstById(this.form.id).then(res => {
                let data = res.data
                if (data.code == '00000') {
                    this.form = data.data
                    // 获取党员信息
                    if (this.form.tableType == '1' || this.form.tableType == '2') {
                        this.resumeList = JSON.parse(this.form.resume)
                    }

                    this.selectPartyMemberInfo = JSON.parse(this.form.partyMemberInfo)
                    this.deptInfo = JSON.parse(this.form.deptInfo)
                    this.commendConditionList = JSON.parse(this.form.commendCondition)
                    this.tableTypeChange()

                    getTzTwoBestOneFirstTimeById(this.form.timeId).then(res => {
                        const data = res.data
                        if (data.code == '00000') {
                            this.timeShowTitle = data.data.title
                        }
                    })
                }
            })
        },
        tableTypeChange() {
            if (this.form.tableType === '1' || this.form.tableType === '2') {
                this.placeholder.mainDeed = '主要事迹要求突出功绩、表述准确、文字精炼，1000字以内'
                if (this.resumeList.length === 0) {
                    // this.addCommendCondition()
                }
            } else if (this.form.tableType === '3') {
                this.placeholder.mainDeed = '主要写党组织发挥战斗堡垒作用的做法和成效等'
            }
        },
        getPartMemberList() {
            getPartMemberListByDeptIds(this.deptId + '').then(res => {
                const result = res.data
                if (result.code = '00000') {
                    this.partyMemberOptions = result.data
                }
            })
        },
        optionSelect(event) {
            if (event == null || !event) {
                this.form.partyMemberId = ''
                this.selectPartyMemberInfo = {}
                return
            }
            this.$nextTick(() => {
                this.form.partyMemberId = event
                this.selectPartyMemberInfo = this.partyMemberOptions.find(item => item.id == event)
            })
        },
        save() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.form.timeId == null || this.form.timeId == '') {
                        this.$message.info('申请批次不能为空')
                        return
                    }

                    if (!this.validateForm(this.selectPartyMemberInfo, this.deptInfo, this.form.tableType)) {
                        return false
                    }

                    if (this.form.mainDeed == null || this.form.mainDeed == '') {
                        this.$message.info('请填写主要事迹')
                        return
                    }

                    let data = {
                        tzTwoBestOneFirst: this.form
                    }

                    data.tzTwoBestOneFirst.deptInfo = JSON.stringify(this.deptInfo)
                    data.tzTwoBestOneFirst.partyMemberInfo = JSON.stringify(this.selectPartyMemberInfo)

                    if (data.tzTwoBestOneFirst.tableType == '1' || data.tzTwoBestOneFirst.tableType == '2') {
                        if (this.objectValidate(this.commendConditionList)) {
                            this.$message.info('请填写曾受表彰情况')
                            return
                        }

                        if (this.resumeList.length == 0 || this.objectValidate(this.resumeList)) {
                            this.$message.info('请填写个人简历')
                            return
                        }

                        if (data.tzTwoBestOneFirst.avatar == null || data.tzTwoBestOneFirst.avatar == '') {
                            this.$message.info('请上传照片')
                            return
                        }

                        data.tzTwoBestOneFirst.commendCondition = JSON.stringify(this.commendConditionList)
                        data.tzTwoBestOneFirst.resume = JSON.stringify(this.resumeList)

                        // 清除不必要数据
                        data.tzTwoBestOneFirst.baseCondition = ''

                    } else if (data.tzTwoBestOneFirst.tableType == '3') {

                        let commendConditionList = this.commendConditionList
                        for (let i = 0; i < commendConditionList.length; i++) {
                            delete commendConditionList[i].dept
                        }

                        if (this.objectValidate(commendConditionList)) {
                            this.$message.info('请填写曾受表彰情况')
                            return
                        }

                        data.tzTwoBestOneFirst.commendCondition = JSON.stringify(commendConditionList)

                        if (data.tzTwoBestOneFirst.baseCondition == null || data.tzTwoBestOneFirst.baseCondition == '') {
                            this.$message.info('请填写基本情况')
                            return
                        }

                        // 清除不必要数据
                        data.tzTwoBestOneFirst.resume = null
                    }

                    if (this.form.id != null && this.form.id.toString().length > 0) {
                        updateTzTwoBestOneFirstById({data: data}).then(res => {
                            let data = res.data
                            if (data.code == '00000') {
                                this.$message.success('保存成功')
                                this.rest()
                                this.$emit('refresh')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    } else {
                        this.form.createDeptId = this.vuexDeptInfo.id
                        addTzTwoBestOneFirst({data: data}).then(res => {
                            let data = res.data
                            if (data.code == '00000') {
                                this.$message.success('保存成功')
                                this.rest()
                                this.$emit('refresh')
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }


                }
            })
        },
        objectValidate(data) {
            let isEmpty = false
            for (let i = 0; i < data.length; i++) {
                Object.keys(data[i]).forEach(function (key) {
                    if (data[i][key] == null || data[i][key] == '') {
                        isEmpty = true
                    }
                })
            }
            return isEmpty
        },
        validateForm(partyMember, dept, type) {
            if (type === '1' || type === '2') {
                if (this.form.partyMemberId == null || this.form.partyMemberId == '') {
                    this.$message.info('请选择党员')
                    return
                }

                if(!partyMember.realName) {
                    this.$message.error('请填写姓名')
                    return false
                }
                if(!partyMember.birthday) {
                    this.$message.error('请填写出生年月')
                    return false
                }
                if(!partyMember.nativePlace) {
                    this.$message.error('请填写籍贯')
                    return false
                }
                if(!partyMember.joinWork) {
                    this.$message.error('请选择参加工作时间')
                    return false
                }
                if(!partyMember.partyTime) {
                    this.$message.error('请选择入党时间')
                    return false
                }
                if(!partyMember.professional) {
                    this.$message.error('请填写职称')
                    return false
                }
                if(!partyMember.idcard) {
                    this.$message.error('请填写身份证号')
                    return false
                }
                if(!partyMember.phone) {
                    this.$message.error('请填写联系电话')
                    return false
                }
                if(!partyMember.position) {
                    this.$message.error('请填写职务')
                    return false
                }
                if(!dept.name) {
                    this.$message.error('请填写单位名称')
                    return false
                }
                if(!dept.address) {
                    this.$message.error('请填写单位地址')
                    return false
                }
                if(!dept.phone) {
                    this.$message.error('请填写单位联系电话')
                    return false
                }
                return true
            } else if (type === '3') {
                if(!dept.name) {
                    this.$message.error('请填写单位名称')
                    return false
                }
                if(!dept.areaName) {
                    this.$message.error('请填写单位所在地区')
                    return false
                }
                return true
            }
        },
        close() {
            this.rest()
            this.$emit('close')
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

<style scoped lang="scss">
::v-deep .el-dialog__header {
    //text-align: center;
}

.info {
    background: #f8f8fa;
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
}

.info-item {
    margin-bottom: 10px;
}

.table-item {
    width: 100%;
}

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
    width: 175px;
    height: 265px;
    line-height: 265px;
    text-align: center;
}

.avatar {
    width: 175px;
    height: 245px;
    display: block;
    object-fit: cover;
}

.el-input-number {
    /deep/ .el-icon-plus {
        line-height: 38px;
    }

    /deep/ .el-icon-minus {
        line-height: 38px;
    }
}
</style>
