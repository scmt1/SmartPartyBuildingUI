<template>
	<view v-loading="loading">
		<view class="content-box">
			<view class="title">{{ formLabel.titleLabel }}</view>
			<view class="u-demo-block__content">
				<u--form labelPosition="left" labelWidth="260rpx" :labelStyle="labelStyle" :model="form" :rules="rules1" ref="uForm1">
					<u-form-item label="会议类型" borderBottom>
						<u-radio-group v-model="form.meetingType" activeColor="rgb(225, 53, 27)" size="32rpx" placement="column" @change="meetingTypeChange">
						    <u-radio labelSize="32rpx" :customStyle="radioStyle" v-for="(item, index) in radiolist" :key="index" :label="item.label" :name="Number(item.itemValue)">
						    </u-radio>
						  </u-radio-group>
					</u-form-item>

					<u-form-item label="三会一课类型" borderBottom v-if="form.meetingType == 1">
						<u-radio-group v-model="form.classType" activeColor="rgb(225, 53, 27)" size="32rpx" placement="column">
						    <u-radio labelSize="32rpx" :customStyle="radioStyle" v-for="(item, index) in radiolist2" :key="index" :label="item.label" :name="item.itemValue">
						    </u-radio>
						  </u-radio-group>
					</u-form-item>

					<u-form-item class="item" :label="formLabel.meetingNameLabel" prop="meetingTopic" borderBottom>
						<u--input fontSize="32rpx" maxlength="100" v-model="form.meetingTopic" border="none" :placeholder="'请输入'+formLabel.meetingNameLabel"></u--input>
					</u-form-item>

					<u-form-item class="item" :label="formLabel.startTimeLabel" prop="startTime" borderBottom @click="showCalendarStar = true; hideKeyboard()">
						<u--input fontSize="32rpx" style="pointer-events: none;" v-model="form.startTime" disabled disabledColor="#ffffff" border="none"></u--input>
						<u-icon size="28rpx" slot="right" name="arrow-right"></u-icon>
					</u-form-item>

					<u-form-item class="item" :label="formLabel.endTimeLabel" prop="endTime" borderBottom @click="showCalendarEnd = true; hideKeyboard()">
						<u--input fontSize="32rpx" style="pointer-events: none;" v-model="form.endTime" disabled disabledColor="#ffffff" border="none"></u--input>
						<u-icon size="28rpx" slot="right" name="arrow-right"></u-icon>
					</u-form-item>

					<u-form-item class="item" :label="formLabel.addrLabel" prop="meetingAddress" borderBottom>
						<u--input fontSize="32rpx" v-model="form.meetingAddress" border="none"></u--input>
					</u-form-item>

				</u--form>

				<u--form labelPosition="bottom" labelWidth="260rpx" :labelStyle="labelStyle" :model="form" :rules="rules2" ref="uForm2">
					<u-form-item v-if="form.meetingType != 3" class="item" label="会议介绍" prop="intro">
						<u--textarea v-model="form.intro" placeholder="请输入会议介绍" confirm-type="send"
							class="textarea" count :height="380" maxlength="500">
						</u--textarea>
					</u-form-item>

					<u-form-item class="item" :label="formLabel.meetingContentLabel" prop="meetingContent">
						<u--textarea v-model="form.meetingContent" :placeholder="'请输入'+formLabel.meetingContentLabel" confirm-type="send"
							class="textarea" count :height="380" maxlength="500">
						</u--textarea>
					</u-form-item>
				</u--form>

				<u--form labelPosition="left" labelWidth="260rpx" :labelStyle="labelStyle" :model="form">
					<u-form-item class="item" label="封面图片">
						<u-upload
							:fileList="images"
							@beforeRead="beforeRead"
							@afterRead="cropperImage"
							@delete="deletePic"
							name="5"
							:maxCount="1"
							width="140rpx"
							height="140rpx"
							:previewFullImage="true"
						></u-upload>
					</u-form-item>

					<u-form-item class="item" :label="formLabel.partyMemberListLabel" prop="form.person" @click="popupShow = true">
						<u-icon size="50rpx" color="red" v-if="partyMemberList.length == 0" slot="right" name="plus-circle-fill"></u-icon>
						<u-icon size="50rpx" color="red" v-else-if="partyMemberList.length > 0" slot="right" name="edit-pen-fill"></u-icon>
					</u-form-item>

				</u--form>

				<view class="selectedPartyMemberList-box">
					<view style="width: 25%; display: inline-block;" v-for="(item, index) in partyMemberList" :key="index" v-if="item.checked">
						<view class="partyMenber">
							<view class="avatar">
								<image v-if="item.avatar && item.avatar.length > 0" mode="aspectFill" :src="item.avatar"></image>
								<image v-else mode="aspectFill" src="@/static/images/user/default-avatar.png"></image>
							</view>
							<view class="name">{{ item.realName }}</view>
						</view>
					</view>
				</view>

				<view class="initiateMeeting-box">
					<view class="initiateMeeting" @click="saveMeeting()">
						确认发起
					</view>
				</view>

				<u-datetime-picker
					ref="datetimePicker1"
					:show="showCalendarEnd"
					mode="datetime"
					:minDate="new Date().getTime()"
					:itemHeight="70"
					closeOnClickOverlay
					@close="endCalendarClose"
					@confirm="endCalendarConfirm"
					@cancel="endCalendarClose"
					:formatter="formatter"
				></u-datetime-picker>

				<u-datetime-picker
					ref="datetimePicker2"
					:show="showCalendarStar"
					mode="datetime"
					:minDate="new Date().getTime()"
					:itemHeight="70"
					closeOnClickOverlay
					@close="starCalendarClose"
					@confirm="starCalendarConfirm"
					@cancel="starCalendarClose"
					:formatter="formatter"
				></u-datetime-picker>

				<selectPartMemberPicker :label="formLabel.selectLabel" :popupShow="popupShow" :deptId="userInfo.deptId + ''" :selectPartyMemberList="partyMemberList" @returnSelect="returnSelect" @close="popupShow = false"></selectPartMemberPicker>

				<view class="cropper" v-if="cropper">
					<qf-image-cropper :src="cropperPath" :width="580" :height="340" :radius="0" @close="cropper = false" @crop="afterRead"></qf-image-cropper>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
import {getDictByType} from "@/api/tDictData"
import selectPartMemberPicker from './selectPartMemberPicker'
import {addTzOrganizationLife, setPlanMeetingParty, getTzOrganizationLife, getPlanMeetingPartyMemberInfo, updateTzOrganizationLife} from '@/api/tzOrganizationLife'
import QfImageCropper from '@/uni_modules/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.vue'
import util from '@/utils/util'
import { mapGetters, createNamespacedHelpers } from 'vuex'
import {uploadFile} from "@/api/minionFile";
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name: 'introduce',
	components: {
		selectPartMemberPicker,
		QfImageCropper
	},
	data() {
		return {
			base: util.jcxfUrl,
			radioStyle: {
				marginBottom: '15rpx'
			},
			radiolist: [],
			radiolist2: [],
			labelStyle: {
				fontSize: '32rpx'
			},
			placeholderStyle: {
				fontSize: '32rpx'
			},
			rules1: {
				'meetingTopic': {
					type: 'string',
					required: true,
					message: '请输入名称',
					trigger: ['blur', 'change']
				},
				'startTime': {
					type: 'string',
					required: true,
					message: '请选择开始时间',
					trigger: ['blur', 'change']
				},
				'endTime': {
					type: 'string',
					required: true,
					message: '请选择结束时间',
					trigger: ['blur', 'change']
				},
				'meetingAddress': {
					type: 'string',
					required: true,
					message: '请输入地址',
					trigger: ['blur', 'change']
				},
			},
			rules2: {
				'intro': {
					type: 'string',
					required: true,
					message: '请输入内容',
					trigger: ['blur', 'change']
				},
				'meetingContent': {
					type: 'string',
					required: true,
					message: '请输入会议议程',
					trigger: ['blur', 'change']
				},
			},
			id: '',
			form: {
				meetingType: 1,
				classType: '1',
				meetingTopic: '',
				startTime: '',
				endTime: '',
				meetingAddress: '',
				meetingContent: '',
				intro: '',
				imgUrl: '',
				deptId: '',
				deptName: ''
			},
			showCalendarStar: false,
			showCalendarEnd: false,
			popupShow: false,
			partyMemberList: [],
			images: [],
			cropper: false,
			cropperPath: '',
			formLabel: {
				selectLabel: '参会',
				titleLabel: '会议发起',
				meetingNameLabel: '会议名称',
				startTimeLabel: '会议开始时间',
				endTimeLabel: '会议结束时间',
				addrLabel: '会议地址',
				meetingContentLabel: '会议议程',
				partyMemberListLabel: '拟参会人员',
			}
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		]),
		...mapState([
			'loading'
		])
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "发起会议"});
		} catch (error) {
			document.title = "发起会议";
		}*/
	},
	onShow() {
		this.init()
	},
	onReady() {
		this.$refs.uForm1.setRules(this.rules1)
		this.$refs.uForm2.setRules(this.rules2)
		// 微信小程序需要用此写法
		this.$refs.datetimePicker1.setFormatter(this.formatter)
		this.$refs.datetimePicker2.setFormatter(this.formatter)
        this.setLoading(false);
	},
	onLoad(option){
		if (option && option.id) {
			this.id = option.id
			this.getOrganizationLife()
			this.getPlanMeetingPartyMember()
		}
		this.setLoading(true);
	},
	methods: {
		async init() {
			await this.getDict('meetingType')
			await this.getDict('meetingSHYK')
		},
		...mapMutations(['setLoading']),
		meetingTypeChange() {
			if (this.form.meetingType == 3) {
				this.formLabel.selectLabel = '参加活动'
				this.formLabel.titleLabel = '活动发起'
				this.formLabel.meetingNameLabel = '活动名称'
				this.formLabel.startTimeLabel = '活动开始时间'
				this.formLabel.endTimeLabel = '活动结束时间'
				this.formLabel.addrLabel = '活动地址'
				this.formLabel.meetingContentLabel = '活动流程'
				this.formLabel.partyMemberListLabel = '拟参加活动人员'
			} else {
				this.formLabel.selectLabel = '参会'
				this.formLabel.titleLabel = '会议发起'
				this.formLabel.meetingNameLabel = '会议名称'
				this.formLabel.startTimeLabel = '会议开始时间'
				this.formLabel.endTimeLabel = '会议结束时间'
				this.formLabel.addrLabel = '会议地址'
				this.formLabel.meetingContentLabel = '会议议程'
				this.formLabel.partyMemberListLabel = '拟参会人员'
			}
		},
		getOrganizationLife() {
			let data = {
				id: this.id + '',
				deptId: this.userInfo.deptId + ''
			}
			getTzOrganizationLife(data).then(res =>{
				if (res.code == '00000') {
					this.form = res.data.main
                    if(this.form.imgUrl){
                        this.form.imgUrl = this.form.imgUrl.replace("http://10.4.117.31:7000",util.minionUrl);
                    }
					this.images = [{
						status: 'success',
						message: '',
						url: this.form.imgUrl
					}]

					this.meetingTypeChange()
				}
			})
		},
		getPlanMeetingPartyMember() {
			getPlanMeetingPartyMemberInfo(this.id).then(res => {
				if (res.code == '00000') {
                    for (let i = 0; i < res.data.length; i++) {
                        if(res.data[i].avatar){
                            res.data[i].avatar = res.data[i].avatar.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
					this.partyMemberList = res.data
					for (let i = 0; i < this.partyMemberList.length; i++) {
						this.partyMemberList[i].checked = true
					}
				}
			})
		},
		getDict(type) {
			return new Promise((resolve, reject) => {
				getDictByType(type).then(res => {
					if (type === 'meetingType') {
						this.radiolist = res
					} else if (type === 'meetingSHYK') {
						this.radiolist2 = res
					}
					resolve(res)
				})
			})
		},
		hideKeyboard() {
			uni.hideKeyboard()
		},
		starCalendarConfirm(event) {
			if (event.value >= new Date(this.form.startTime).getTime()) {
				uni.$u.toast('开始时间必须小于结束时间')
				return
			}

			this.form.startTime = uni.$u.timeFormat(event.value, 'yyyy-mm-dd hh:MM')
			this.showCalendarStar = false
		},
		starCalendarClose() {
			this.showCalendarStar = false
		},
		endCalendarConfirm(event) {
			if (event.value <= new Date(this.form.startTime).getTime()) {
				uni.$u.toast('结束时间必须大于开始时间')
				return
			}
			this.form.endTime = uni.$u.timeFormat(event.value, 'yyyy-mm-dd hh:MM')
			this.showCalendarEnd = false
		},
		endCalendarClose() {
			this.showCalendarEnd = false
		},
		formatter(type, value) {
			if (type === 'year') {
					return `${value}年`
			}
			if (type === 'month') {
					return `${value}月`
			}
			if (type === 'day') {
					return `${value}日`
			}
			if (type === 'hour') {
					return `${value}时`
			}
			if (type === 'minute') {
					return `${value}分`
			}

			return value
		},
		returnSelect(event) {
			this.popupShow = false
			this.partyMemberList = event
		},
		beforeRead(file, lists, name) {
			let tmp = file.name.split('.')
			if (file.type != 'image') {
				uni.$u.toast('请选择图片文件')
				return false
			}
			if (file.size > 5242880 * 2) {
				uni.$u.toast('文件不能大于10M')
				return false
			}
		},
		cropperImage(event) {
			this.fileLists = [].concat(event.file)
            this.images = []
            this.fileLists.map((item) => {
                this.images.push({
                    ...item,
                    status: 'uploading',
                })
            })
			this.cropperPath = this.fileLists[0].url
			this.cropper = true
		},
		async afterRead(event) {
			this.cropper = false
            let lists = [].concat(event.tempFilePath)
            const result = await this.uploadFilePromise(lists[0])
            let item = this.images[0]
            this.images.splice(0, 1, Object.assign(item, {
                status: 'success',
                message: '',
                url: result
            }))
		},
		deletePic(e) {
			this.images = []
			this.form.imgUrl = ''
		},
		async uploadFilePromise(base64File) {
            return new Promise((resolve, reject) => {
                uploadFile({imgUrl: base64File, imgName: this.fileLists[0].name}).then(res => {
                    if (res) {
                        res.url = res.url.replace("http://10.4.117.31:7000", util.minionUrl);
                        this.form.imgUrl = res.url
                        resolve(this.form.imgUrl)
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: '上传失败',
                            duration: 2000
                        })
                        resolve()
                    }
                })
            })
			// let file = this.dataURLtoBlob(baseFile, 'image')
			// return new Promise((resolve, reject) => {
            //     uploadFile(file).then((res) => {
			// 			if (res.code == '200') {
			// 				this.form.imgUrl = res.data.result.fileRealPath
			// 				resolve(this.form.imgUrl)
			// 			} else {
			// 				uni.showToast({
			// 				  icon: 'none',
			// 				  title: '上传失败',
			// 				  duration: 2000
			// 				})
            //   resolve()
			// 			}
			// 		})
			// })
		},
		dataURLtoBlob(base64, name) {//base64转file
			let arr = base64.split(','),
				type = arr[0].match(/:(.*?);/)[1],
				suffix = type.split('/')[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n)
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new File([u8arr], `${name}.${suffix}`, {
				type: type,
			})
		},
		saveMeeting() {
			if (this.form.imgUrl == '' || this.form.imgUrl == null || this.form.imgUrl == undefined) {
				uni.$u.toast('请上传封面图片')
				return
			}

			if (this.partyMemberList.length == 0) {
				uni.$u.toast('请选择拟参会人员')
				return
			}

			this.$refs.uForm1.validate().then(res => {
				this.$refs.uForm2.validate().then(res => {
					if (this.form.meetingType != 1) {
						this.form.classType = null
					}

					if(this.form.imgUrl.indexOf("util.minionUrl")){
                        this.form.imgUrl = this.form.imgUrl.replace(util.minionUrl,"http://10.4.117.31:7000");
                    }
					this.form.deptId = this.userInfo.deptId
					this.form.deptName = this.userInfo.deptName
					if (this.id && this.id.length > 0) {
						this.form.id = this.id
						updateTzOrganizationLife(this.form).then(res => {
							if (res.code == '00000') {
								this.setPlanParty(this.form.id)
							}
						})
					} else {
						addTzOrganizationLife(this.form).then(res1 =>{
							if (res1.code == '00000') {
								this.setPlanParty(res1.data.id)
							}
						})
					}

				}).catch(errors => {
					//uni.$u.toast('2校验失败')
				})
			}).catch(errors => {
				//uni.$u.toast('1校验失败')
			})
			/* uni.navigateTo({
				url: '/pages/OrganizationLife/details'
			}) */
		},
		setPlanParty(id) {
			let personIds = ''
			for (let i = 0; i < this.partyMemberList.length; i++) {
				personIds = personIds + this.partyMemberList[i].id + ','
			}
			if (personIds.length > 0) {
				personIds = personIds.substring(0, personIds.length - 1)
			}
			const data = {
				id: id + '',
				partyIds: personIds + ''
			}
			setPlanMeetingParty({ data: data }).then(res2 => {
				if (res2.code == '00000') {
					uni.navigateTo({
						url: '/pages/OrganizationLife/details?id=' + id
					})
				} else {
					uni.showToast({
						title: res2.msg,
						icon: 'none'
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>

	.item {
		margin-top: 25rpx;
	}

	::v-deep .u-textarea__field {
		font-size: 32rpx;
	}

	.item {
		margin-top: 20rpx;
	}

	.content-box {
		padding: $content-box-padding;

		.title {
			padding-top: 15rpx;
			font-size: 32rpx;
			font-weight: bold;
		}

		.textarea{
			margin-top: 15rpx;
			background: rgba(245, 245, 245, 1);
		}

		.initiateMeeting-box {
			margin: 40rpx 0 20rpx 0;
			padding: 0 80rpx;

			.initiateMeeting {
				width: 100%;
				border-radius: 10rpx;
				padding: 20rpx;
				text-align: center;
				color: #fff;
				font-weight: bold;
				font-size: 30rpx;
				background: rgb(225, 53, 27);
			}
		}

		::v-deep .u-popup__content {
			border-radius: 10rpx;
		}

		.selectedPartyMemberList-box {
			.partyMenber {
				margin: auto;
				display: flex;
				flex-direction: column;
				width: 120rpx;
				.avatar {
					width: 120rpx;
					height: 120rpx;
					margin-top: 20rpx;
					border-radius: 50%;
					overflow: hidden;
				}
				.name {
					margin-top: 5rpx;
					text-align: center;
					font-size: 26rpx;
				}
			}
		}
	}
</style>
