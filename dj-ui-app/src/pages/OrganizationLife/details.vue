<template>
	<view v-loading="loading">
		<view class="content-box">
			<view style="padding-top: 30rpx; padding-bottom: 20rpx;" v-if="organizationLifeInfo.meetingStatus == 1
				&& organizationLifeInfo.createBy == userInfo.id">
				<u-row>
					<u-col span="4">
						<view class="top-button button-left" @click="pickerShow = true">
							<view class="img"><image mode="heightFix" src="@/static/images/organizationLife/cancel.png"></image></view>
							<view class="text">删除{{ label.type }}</view>
						</view>
					</u-col>
					<u-col span="4">
						<view class="top-button button-center" @click="$handlerNavigate({ url: '/pages/OrganizationLife/initiate?id='+ id })">
							<view class="img"><image mode="heightFix" src="@/static/images/organizationLife/edit.png"></image></view>
							<view class="text">编辑{{ label.type }}</view>
						</view>
					</u-col>
					<u-col span="4">
						<view class="top-button button-right" @click="pickerShow2 = true">
							<view class="img"><image mode="heightFix" src="@/static/images/organizationLife/start.png"></image></view>
							<view class="text">开始{{ label.type }}</view>
						</view>
					</u-col>
				</u-row>
			</view>

			<view class="content">
				<view class="title" v-if="organizationLifeInfo.meetingStatus == 1">{{ label.type }}发起</view>
				<view class="list">
					<view class="img-box">
                        <view v-if="organizationLifeInfo.imgUrl && organizationLifeInfo.imgUrl.indexOf('upload') > -1">
                            <image class="img" mode="aspectFill" :src="base + organizationLifeInfo.imgUrl"></image>
                        </view>
                        <view v-else>
                            <image v-if="organizationLifeInfo.imgUrl && organizationLifeInfo.imgUrl.length > 0" class="img" mode="aspectFill" :src="organizationLifeInfo.imgUrl"></image>
                            <image v-else class="img" mode="aspectFill" src="@/static/images/organizationLife/fm.png"></image>
                        </view>
						<view class="tag">
							<image v-if="organizationLifeInfo.meetingStatus == 1" class="tag-bg" mode="widthFix" src="@/static/images/organizationLife/unplayed.png"></image>
							<image v-if="organizationLifeInfo.meetingStatus == 2" class="tag-bg" mode="widthFix" src="@/static/images/organizationLife/underway.png"></image>
							<image v-if="organizationLifeInfo.meetingStatus == 3" class="tag-bg" mode="widthFix" src="@/static/images/organizationLife/over.png"></image>
							<image v-if="organizationLifeInfo.meetingStatus == 4" class="tag-bg" mode="widthFix" src="@/static/images/organizationLife/over.png"></image>

							<view class="tag-text">{{ getDirectLabelByValue(organizationLifeInfo.meetingStatus, meetingStatus) }}</view>
						</view>
					</view>
					<view class="introduce-box">
						<view class="name">{{ organizationLifeInfo.meetingTopic }}</view>
						<view class="introduce">
							<view class="title">开始时间：</view>
							<view class="text">{{ organizationLifeInfo.startTime }}</view>
						</view>
						<view class="introduce">
							<view class="title">开始时间：</view>
							<view class="text">{{ organizationLifeInfo.endTime }}</view>
						</view>
						<view class="introduce">
							<view class="title">{{ label.type }}地址：</view>
							<view class="text">{{ organizationLifeInfo.meetingAddress }}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="interval"></view>

			<view class="content">
				<view class="title">{{ label.meetingContentLabel }}</view>
				<view class="text">
					{{ organizationLifeInfo.meetingContent }}
				</view>
			</view>

			<view class="interval"></view>

			<view class="content">
				<view class="title">
					<template v-if="organizationLifeInfo.meetingType != 3">
						<template v-if="organizationLifeInfo.meetingStatus != 3">
							拟参会人员
						</template>
						<template v-else>
						 参会人员
						</template>
					</template>
					<template v-if="organizationLifeInfo.meetingType == 3">
						<template v-if="organizationLifeInfo.meetingStatus != 3">
							拟参加活动人员
						</template>
						<template v-else>
						 参加活动人员
						</template>
					</template>

					（{{ partyMemberList.length }}）
				</view>
				<view>
					<view class="selectedPartyMemberList-box">
						<view style="width: 25%; display: inline-block;" v-for="(item, index) in partyMemberList" :key="index">
							<view class="partyMenber">
								<view class="avatar">
									<image v-if="item.avatar && item.avatar.length > 0" mode="aspectFill" :src="item.avatar"></image>
									<image v-else mode="aspectFill" src="@/static/images/user/default-avatar.png"></image>
								</view>
								<view class="name">{{ item.realName }}</view>
							</view>
						</view>

						<empty v-if="!partyMemberList || partyMemberList.length == 0" text="暂无人员" :marginTop="15"></empty>

						<view style="width: 25%; display: inline-block;" v-if="organizationLifeInfo.meetingStatus == 0" @click="popupShow = true">
							<view class="partyMenber">
								<view class="avatar" style="position: relative;">
									<image class="add-person-icon" mode="widthFix" src="@/static/images/organizationLife/add.png"></image>
								</view>
							</view>
						</view>

					</view>
				</view>
			</view>

			<view class="interval" v-if="organizationLifeInfo.meetingStatus != 1 && organizationLifeInfo.meetingStatus != 4"></view>

			<view class="content" v-if="organizationLifeInfo.meetingStatus != 1 && organizationLifeInfo.meetingStatus != 4">
				<view class="title">{{ label.type }}资料（{{ fileList.length }}）</view>
				<view class="file-list-box">

					<label class="file-list" v-for="(item, index) in fileList" :key="index" @click="downloadFile(item)">
						<view class="name-box" >
							<u-icon name="file-text-fill" color="rgba(19, 34, 112, 1)" size="54rpx"></u-icon>
							<view class="name">{{ item.attachmentName }}</view>
						</view>
						<view class="del-box">
							<u-icon name="download" color="rgba(225, 53, 27, 1)" size="32rpx"></u-icon>
							<!-- <image style="height: 30rpx;" mode="heightFix" src="@/static/images/organizationLife/view-file.png"></image> -->
							<view style="margin-left: 2px;">下载</view>
						</view>
						<!-- <view class="edit-box">
							<u-icon name="edit-pen-fill" color="rgba(225, 53, 27, 1)" size="30"></u-icon>
							<view>编辑</view>
						</view>
						<view class="del-box">
							<u-icon name="trash-fill" color="rgba(225, 53, 27, 1)" size="30"></u-icon>
							<view>删除</view>
						</view> -->
					</label>

					<empty v-if="!fileList || fileList.length == 0" text="暂无资料"></empty>

				</view>

				<!-- <view class="upload-file">
						<image class="img" mode="heightFix" src="@/static/images/organizationLife/upload.png"></image>
						<view class="upload-text">上传文件</view>
				</view> -->
			</view>

			<view class="interval"></view>

			<view class="content" v-if="organizationLifeInfo.meetingStatus != 1 && organizationLifeInfo.meetingStatus != 4">
				<view class="title">{{ label.type }}照片（{{ meetingImages.length }}）</view>
				<view class="meeting-images">
					<view :class="index == 0 || index%3 == 0 ?'image': 'image-right'" v-for="(item, index) in meetingImages" :key="index">
						<image @click="previewImage(meetingImages, item.attachmentRelativePath)" mode="aspectFill" :src="item.attachmentRelativePath"></image>
					</view>

					<empty v-if="!meetingImages || meetingImages.length == 0" text="暂无照片"></empty>

					<!-- <view class="add-image">
						<u-upload
							style="position: absolute; height: 100%; width: 100%; align-items: center; justify-content: center; "
							:fileList="imageList"
							@afterRead="afterRead"
							@delete="deletePic"
							name="6"
							multiple
							:maxCount="1"
						>
							<image mode="widthFix" src="@/static/images/organizationLife/add.png" style="position: relative; width: 68rpx;"></image>
						</u-upload>
					</view> -->
				</view>
			</view>

			<view class="content" v-if="organizationLifeInfo.meetingStatus != 1 && organizationLifeInfo.meetingStatus != 4">
				<view class="title" style="margin-top: 20rpx;">{{ label.meetingRecordLabel }}</view>
				<view class="meetingMinutes" v-if="organizationLifeInfo.situationRecord && organizationLifeInfo.situationRecord.length > 0">
                    <rich-text :nodes="organizationLifeInfo.situationRecord"></rich-text>
				</view>
				<empty v-else :text="'暂无'+ label.meetingRecordLabel" :marginTop="20"></empty>
			</view>

			<view class="content" v-if="organizationLifeInfo.meetingStatus != 1 && organizationLifeInfo.meetingStatus != 4
				&& organizationLifeInfo.meetingType != '3'">
				<view class="title" style="margin-top: 20rpx;">会议记录照片（{{ meetingRecordImages.length }}）</view>
				<view class="meeting-images">
					<view :class="index == 0 || index%3 == 0 ?'image': 'image-right'" v-for="(item, index) in meetingRecordImages" :key="index">
						<image mode="aspectFill" @click="previewImage(meetingRecordImages, item.attachmentRelativePath)" :src="item.attachmentRelativePath"></image>
					</view>
					<empty v-if="!meetingRecordImages || meetingRecordImages.length == 0" text="暂无会议记录照片"></empty>
				</view>
			</view>

			<view v-if="organizationLifeInfo.meetingStatus == 2 && organizationLifeInfo.createBy == userInfo.id" class="initiateMeeting-box">
				<view class="initiateMeeting" @click="pickerShow3 = true">
					取消{{ label.type }}
				</view>
			</view>

		</view>

		<selectPartMemberPicker :deptId="userInfo.deptId+''" :label="label.selectLabel" :popupShow="popupShow" :selectPartyMemberList="partyMemberList" @returnSelect="returnSelect" @close="popupShow = false"></selectPartMemberPicker>
		<confirmPicker :show="pickerShow" :title="'确定要删除此'+ label.type +'吗？'" @close="pickerShow = false" @confirm="delMeeting()"></confirmPicker>
		<confirmPicker :show="pickerShow2" :title="'确定要开始'+ label.type +'吗？'" @close="pickerShow2 = false" @confirm="startMeeting()"></confirmPicker>
		<confirmPicker :show="pickerShow3" :title="'确定要取消'+ label.type +'吗？'" @close="pickerShow3 = false" @confirm="cancelThisMeeting()"></confirmPicker>

	</view>
</template>

<script>
import {getDictByType} from "@/api/tDictData"
import {getDictByCode} from "@/api/jcxfSysDictionary"
import {getTzOrganizationLife, setPlanMeetingParty, getPlanMeetingPartyMemberInfo,
			deleteTzOrganizationLife, startMeeting, findImgById, findStudyFile,
        cancelMeeting} from '@/api/tzOrganizationLife'
import selectPartMemberPicker from './selectPartMemberPicker'
import confirmPicker from '@/components/confirmPicker/index'
import empty from '@/components/empty/index.vue'
import util from '@/utils/util'
import { mapGetters, createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
	name: 'introduce',
	components: {
		selectPartMemberPicker,
		confirmPicker,
		empty
	},
	data() {
		return {
			base: util.jcxfUrl,
			meetingStatus: [],
			organizationLifeInfo: {},
			partyMemberList: [],
			fileList: [],
			meetingImages: [],
			meetingRecordImages: [],
			id: '',
			popupShow: false,
			pickerShow: false,
			pickerShow2: false,
			pickerShow3: false,
			label: {
				type: '',
				selectLabel: '',
				meetingContentLabel: '',
				meetingRecordLabel: ''
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
	onLoad(option){
		this.id = option.id
		this.init()
		this.setLoading(true);
	},
	onReady() {
		this.setLoading(false);
	},
	methods: {
		...mapMutations(['setLoading']),
		previewImage(urls, url) {
			let urlsArray = []
			for(let i= 0; i < urls.length; i++) {
				urlsArray.push(url)
			}

			let data = {
				count: url,
				urls: urlsArray
			}
			uni.previewImage(data)
		},
		setLabel() {
			if (this.organizationLifeInfo.meetingType == '3') {
				this.label.type = '活动'
				this.label.selectLabel = '参加活动'
				this.label.meetingContentLabel = '活动流程'
				this.label.meetingRecordLabel = '备注'
			} else {
				this.label.type = '会议'
				this.label.selectLabel = '参会'
				this.label.meetingContentLabel = '会议议程'
				this.label.meetingRecordLabel = '会议记录'
			}
		},
		async init() {
			await this.getDict('meetingStatus')
			this.getOrganizationLife()
		},
		getDict(type) {
			return new Promise((resolve, reject) => {
				getDictByCode(type).then(res => {
					if (type === 'meetingStatus') {
						this.meetingStatus = res.data
					}
					resolve(res)
				})
			})
		},
		getDirectLabelByValue(value, direct) {
			if (!value) {
				return
			}
			for (let i = 0; i < direct.length; i++) {
				if (value == direct[i].itemValue) {
						return direct[i].label
				}
			}
		},
		getPlanMeetingPartyMember() {
			getPlanMeetingPartyMemberInfo(this.id).then(res => {
				if (res.code == '00000') {
                    let list = res.data;
                    for (let i = 0; i < list.length; i++) {
                        if(list[i].avatar){
                            list[i].avatar = list[i].avatar.replace("http://10.4.117.31:7000", util.minionUrl);
                        }
                    }
					this.partyMemberList = list
				}
			})
		},
		/*getJoinsPartyMemberList() {
			getJoinsPartyMemberListByMeetingId(this.organizationLifeInfo.id).then(res => {
				if (res.code == '00000') {
					this.partyMemberList = res.data
				}
			})
		},*/
		afterRead(event) {

		},
		deletePic(event) {

		},
		getOrganizationLife() {
			let data = {
				id: this.id,
				//detptId: 25595
			}
			getTzOrganizationLife(data).then(res =>{
				if (res.code == '00000') {
					this.organizationLifeInfo = res.data.main
					this.setLabel()

					// 进行中和已结束，则查询上传文件和照片
					if (this.organizationLifeInfo.meetingStatus == 2 || this.organizationLifeInfo.meetingStatus == 3) {
						findImgById(this.organizationLifeInfo.id).then(res => {
							if (res.code == '00000') {
                                let list1 = res.data.list1;
                                let list2 = res.data.list2;
                                for (let i = 0; i < list1.length; i++) {
                                    if(list1[i].attachmentRelativePath){
                                        list1[i].attachmentRelativePath = list1[i].attachmentRelativePath.replace("http://10.4.117.31:7000", util.minionUrl);
                                    }
                                }
                                for (let i = 0; i < list2.length; i++) {
                                    if(list2[i].attachmentRelativePath){
                                        list2[i].attachmentRelativePath = list2[i].attachmentRelativePath.replace("http://10.4.117.31:7000", util.minionUrl);
                                    }
                                }
								this.meetingImages = list1
								this.meetingRecordImages = list2
							}
						})

						findStudyFile(this.organizationLifeInfo.id).then(res => {
							if (res.code == '00000') {
                                let list = res.data;
                                for (let i = 0; i < list.length; i++) {
                                    if(list[i].attachmentRelativePath){
                                        list[i].attachmentRelativePath = list[i].attachmentRelativePath.replace("http://10.4.117.31:7000", util.minionUrl);
                                    }
                                }
								this.fileList = list
							}
						})

					}

					if (this.organizationLifeInfo.meetingStatus == 1 || this.organizationLifeInfo.meetingStatus == 2) {
						//如果是未结束，则读取拟参会人员，如果已结束，则读取实际参会人员
						this.getPlanMeetingPartyMember()
					} else if (this.organizationLifeInfo.meetingStatus == 3) {
                        let list = res.data.joinList;
                        for (let i = 0; i < list.length; i++) {
                            if(list[i].avatar){
                                list[i].avatar = list[i].avatar.replace("http://10.4.117.31:7000", util.minionUrl);
                            }
                        }
						const joinList = list
						this.partyMemberList = []

						// 主持人id
						let hostId = this.organizationLifeInfo.host
						// 记录人id
						let recorderId = this.organizationLifeInfo.recorder
						let ids = []
						if (hostId != recorderId) {
							ids.push(Number(hostId))
							ids.push(Number(recorderId))
						} else {
							ids.push(Number(hostId))
						}
						// 拟参会人员
						/* let planJoin = res.data.shouldJoinList
						if (planJoin && planJoin != null) {
							for (let i = 0; i < planJoin.length; i++) {
								if (ids.indexOf(planJoin[i].id) > -1) {
									joinList.push({
										partyName: planJoin[i].realName,
										avatar: planJoin[i].avatar
									})
								}
							}
						} */

						let joinIds = []
						for (let i = 0; i < joinList.length; i++) {
							joinIds.push(joinList[i].id)
							let val = {
									realName: joinList[i].partyName,
									avatar: joinList[i].avatar
							}
							if (this.partyMemberList.indexOf(val) < 0) {
									this.partyMemberList.push(val)
							}
						}
						for (let i = 0; i < ids.length; i++) {
							if (joinIds.indexOf(ids[i]) < 0) {
								if (ids[i] == hostId) {
									let val = {
										realName: this.organizationLifeInfo.hostName,
										avatar: this.organizationLifeInfo.hostAvatar
									}
									this.partyMemberList.push(val)
								} else if (ids[i] == recorderId){
									let val = {
										realName: this.organizationLifeInfo.recorderName,
										avatar: this.organizationLifeInfo.recorderAvatar
									}
									this.partyMemberList.push(val)
								}
							}
						}

					}
				}
			})
		},
		returnSelect(event) {
			this.popupShow = false

			let personIds = ''
			for (let i = 0; i < event.length; i++) {
				personIds = personIds + event[i].id + ','
			}

			if (personIds.length > 0) {
				personIds = personIds.substring(0, personIds.length - 1)
			}

			this.setPlanParty(personIds)
		},
		setPlanParty(personIds) {
			const data = {
				id: this.id + '',
				partyIds: personIds + ''
			}

			setPlanMeetingParty({ data: data }).then(res => {
				if (res.code == '00000') {
					uni.showToast({
					  icon: 'none',
					  title: '保存成功！',
					  duration: 2000
					})
					this.getPlanMeetingPartyMember()
				}
			})
		},
		delMeeting() {
			let ids = [this.id]
			deleteTzOrganizationLife(ids).then(res => {
				if (res.code == '00000') {
					uni.navigateBack()
				}
			})
		},
		startMeeting() {
			this.pickerShow2 = false

			if (this.partyMemberList.length == 0 ) {
				uni.showToast({
				  icon: 'none',
				  title: '请选择拟参会人员',
				  duration: 2000
				})
				return
			}

			this.startThisMeeting()
		},
		startThisMeeting() {
			let data = {
				id: this.id
			}
			startMeeting(data).then(res => {
				if (res.code == '00000') {
					this.getOrganizationLife()
				} else {
					uni.showToast({
						icon: 'none',
						title: res.msg,
						duration: 2000
					})
				}
			})
		},
		cancelThisMeeting() {
			let data = {
				id: this.id
			}
			this.pickerShow3 = false
			cancelMeeting(data).then(res => {
				if (res.code == '00000') {
					this.getOrganizationLife()
				}
			})
		},
        downloadFile(item) {
            let url = item.attachmentRelativePath  //文件下载地址
            let name = item.attachmentName  //文件下载后的名称（带后缀）
            // 创建a标签
            let a = document.createElement('a')
            // 定义下载名称
            a.download = name
            // 隐藏标签
            a.style.display = 'none'
            // 设置文件路径
            a.href = url
            // 将创建的标签插入dom
            document.body.appendChild(a)
            // 点击标签，执行下载
            a.click()
            // 将标签从dom移除
            document.body.removeChild(a)
			// // 酒城e通下载文件
			// lightAppJssdk.file.downloadFile({
			//     url: item.attachmentRelativePath,//文件线上地址
			//     fileName: item.attachmentName, //文件名,若为空,则从url中截取,文件名可能没有后缀
			//     header: "", //默认为空,有请求头需要的话,传json string
			//     success: function(data) {},
			//     fail: function(data) {}
			// });
		}
	}
}
</script>

<style lang="scss" scoped>
	.empty {
		text-align: center;
		background: rgba(245, 245, 245, 1);
		font-size: 26rpx;
		color: rgb(206, 209, 216);
	}

	.initiateMeeting-box {
		margin-top: 20rpx;
		padding: 20rpx 80rpx 30rpx 80rpx;

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
.content-box {
	padding: $content-box-padding;
	padding-bottom: 30rpx;

	.top-button {
		display: flex;
		background: rgba(225, 53, 27, 1);
		border-radius: 10rpx;
		height: 70rpx;
		align-items: center;
		justify-content: center;

		.img {
			height: 32rpx;
		}

		.text {
			margin-left: 10rpx;
			color: white;
			font-size: 28rpx;
			font-weight: bold;
			text-align: justify;
			text-align-last: left;
		}
	}

	.button-left {
		margin-right: 14rpx;
	}
	.button-center {
		margin: 0 7rpx;
	}
	.button-right {
		margin-left: 14rpx;
	}

	.content {
		padding-top: 15rpx;

		.title {
			font-size: 32rpx;
			font-weight: 700;
		}

		.list {
			display: flex;
			padding-top: 20rpx;

			.img-box {
				position: relative;

				.img {
					border-radius: 10rpx;
					width: $life-image-width;
					height: $life-image-height;
				}

				.tag {
					position: absolute;
					top: 0;
					.tag-bg {
						position: absolute;
						width: 120rpx;
					}
					.tag-text {
						position: absolute;
						color: white;
						width: 80rpx;
						left: 15rpx;
						top: 6rpx;
						font-size: 24rpx;
						font-weight: bold;
					}
				}
			}

			.introduce-box {
				padding-left: 15rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;

				.name {
					font-weight: bold;
					font-size: 28rpx;
				}

				.introduce {
					display: flex;

					.title {
						line-height: 43rpx;
						font-weight: 400;
						font-size: 24rpx;
						color: rgb(134, 134, 134);
					}
					.text {
						line-height: 43rpx;
						margin-top: 0;
						flex: 1;
						text-align: justify;
						text-align-last: left;
					}
				}
			}
		}

		.text {
			font-size: 26rpx;
			line-height: 50rpx;
			margin-top: 20rpx;
			text-align: justify;
			text-align-last: left;
		}

		.meetingMinutes {
			margin-top: 20rpx;
			background: rgba(245, 245, 245, 1);
			border-radius: 10rpx;
			padding: 30rpx 20rpx;
			font-size: 26rpx;
			line-height: 50rpx;
		}

		.selectedPartyMemberList-box {
			.partyMenber {
				margin: auto;
				display: flex;
				flex-direction: column;
				width: 120rpx;
				.avatar {
					margin-top: 20rpx;
					border-radius: 50%;
					overflow: hidden;
					width: 120rpx;
					height: 120rpx;
					background: rgba(245, 245, 245, 1);

					.add-person-icon {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 50rpx;
					}
				}
				.name {
					margin-top: 5rpx;
					text-align: center;
					font-size: 26rpx;
				}
			}
		}
	}

	.file-list-box {
		display: flex;
	  flex-direction: column;
		margin-top: 15rpx;

		.file-list {
			display: flex;
			font-size: 24rpx;

			.name-box {
				display: flex;
				flex: 1;
				align-items: center;

				.name {
					color: rgb(60, 60, 60);
					font-weight: bold;
					text-decoration: underline;
				}
			}

			/* .edit-box {
				display: flex;
				color: rgba(166, 166, 166, 1);
				align-items: center;
			} */

			.del-box {
				display: flex;
				color: rgba(166, 166, 166, 1);
				align-items: center;
				margin-left: 15rpx;
			}
		}

	}

	/* .upload-file {
		margin-top: 15rpx;
		background: rgba(225, 53, 27, 1);
		color: white;
		display: flex;
		justify-content: center;
		height: 60rpx;
		align-items: center;
		border-radius: 10rpx;

		.img {
			height: 30rpx;
		}

		.upload-text {
			margin-left: 10rpx;
			font-size: 26rpx;
		}
	} */

	.meeting-images {
		margin-top: 20rpx;
		.image {
			border-radius: 10rpx;
			width: 220rpx;
			height: 188rpx;
			display: inline-block;
			overflow: hidden;
			margin-top: 10rpx;
		}
		.image-right {
			margin-top: 10rpx;
			border-radius: 10rpx;
			width: 220rpx;
			height: 188rpx;
			display: inline-block;
			margin-left: 20rpx;
			overflow: hidden;
		}
		/* .add-image {
			margin-top: 20rpx;
			display: inline-block;
			position: relative;
			border-radius: 10rpx;
			width: 220rpx;
			height: 188rpx;
			margin-left: 20rpx;
			background: rgba(245, 245, 245, 1);
		} */
	}

	.interval {
		width: 100%;
		height: 1px;
		transform: scale(1, 0.4);
		background: rgb(208, 208, 208);
		margin: 30rpx 0;
		transform: scale(1, 0.5);
	}


}
</style>
