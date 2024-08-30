<template>
	<view>
		<view class="top-image">
			<image v-if="data.deptInfo.deptPhoto && data.deptInfo.deptPhoto.length > 0" mode="widthFix" :src="data.deptInfo.deptPhoto"></image>
			<empty v-else text="暂无图片" :height="150"></empty>
		</view>

		<view class="content-box">

			<view class="person-num">
				<view class="name">
					{{ data.deptInfo?data.deptInfo.name:'' }}
				</view>
				<view class="num">
					<view class="img">
						<image mode="widthFix" src="@/static/images/branchOverview/number.png"></image>
					</view>
					<view>党员：</view>
					<view class="text">{{ data.partyInfoList.length }}人</view>
				</view>
			</view>

			<view>
				<view class="meeting one">
					<view class="title1">三会一课（本年）</view>
					<view class="interval1"></view>
					<view class="num1">{{ number.typeNum1 }}<text class="text">次</text></view>
					<view class="img-box">
						<image class="img" mode="widthFix" src="@/static/images/branchOverview/meeting-one.png"></image>
					</view>
				</view>
			</view>

			<view>
				<view class="meeting two">
					<view class="title2">组织生活（本年）</view>
					<view class="interval2"></view>
					<view class="num2">{{ number.typeNum2 }}<text class="text">次</text></view>
					<view class="img-box">
						<image class="img" mode="widthFix" src="@/static/images/branchOverview/meeting-two.png"></image>
					</view>
				</view>
			</view>

			<view class="content">
				<view class="title">支部成员</view>

				<scroll-view scroll-x="true">
					<view class="content-list">
						<view :class="index == 0 ?'pserson-box': 'pserson-box interval'" v-for="(item, index) in data.partyInfoList" :key="index">
							<view class="avatar-box">
								<image v-if="item.avatar && item.avatar.length > 0" mode="aspectFit" :src="item.avatar"></image>
								<image v-else mode="aspectFit" src="@/static/images/user/default-avatar.png"></image>
							</view>
							<view class="name">{{ item.realName }}</view>
							<view class="position">{{ getDirectLabelByValue(item.position, positionList) }}</view>
						</view>
					</view>
				</scroll-view>

			</view>

			<view class="content">
				<view class="title">支部介绍</view>
				<view v-if="data.deptIntroduction && data.deptIntroduction.length > 0" class="textarea">
					{{ data.deptIntroduction }}
				</view>
				<empty v-else text="暂无支部介绍" :height="150"></empty>
			</view>

		</view>
	</view>
</template>

<script>
import {getDictByType} from "@/api/tDictData"
import {getDictByCode} from "@/api/jcxfSysDictionary"
import {getPlanMeetingAllNumAndTypeNum} from '@/api/tzOrganizationLife'
import empty from '@/components/empty/index.vue'
import util from '@/utils/util'
import { mapGetters } from 'vuex'

export default {
  name: 'introduce',
	components: {
		empty
	},
	props: {
		data: {
			type: Object,
			default: {
				deptInfo: {},
				partyInfoList: []
			}
		}
	},
	data() {
		return {
			base: util.jcxfUrl,
			positionList: [],
			number: {
				typeNum1: 0,
				typeNum2: 0
			}
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	async mounted() {
		await this.getDict('position')
		this.getMeetingNum('1') //会议类型 1三会一课，6组织生活会
		this.getMeetingNum('6')
	},
	methods: {
		getMeetingNum(meetingType) {
			let data = {
				meetingType: meetingType,
				deptId: this.userInfo.deptId + ''
			}
			getPlanMeetingAllNumAndTypeNum({ data: data }).then(res => {
				if (res.code == '00000') {
					if (meetingType == '1') {
						this.number.typeNum1 = res.data.num
					} else if (meetingType == '6') {
						this.number.typeNum2 = res.data.num
					}
				}
			})
		},
		getDict(type) {
			return new Promise((resolve, reject) => {
				getDictByCode(type).then(res => {
					if (type === 'position') {
						this.positionList = res.data
						resolve()
					}
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
			return '无职务'
		}
	}
}
</script>

<style lang="scss" scoped>
		.content-box {
			padding: $content-box-padding;

			.person-num {
				display: flex;
				margin: 30rpx 0;
				.name {
					font-size: 30rpx;
					font-weight: bold;
					flex: 1;
				}
				.num {
					font-size: 28rpx;
					display: flex;
					align-items: center;

					.img {
						width: 27rpx;
						margin-right: 5rpx;
					}
					.text {
						font-size: 30rpx;
						color: red;
						font-weight: bold;
					}
				}
			}

			.meeting {
				display: flex;
				padding: 20rpx 180rpx 20rpx 80rpx;
				font-weight: bold;
				border-radius: 5rpx;
				position: relative;
				overflow: hidden;

				.title1 {
					color: #ffffff;
					font-size: 28rpx;
				}

				.title2 {
					color: rgb(131, 47, 35);
					font-size: 28rpx;
				}

				.interval1 {
					margin-top: 2rpx;
					margin-left: 40rpx;
					margin-right: 40rpx;
					height: 30rpx;
					width: 3rpx;
					background-color: white;
				}

				.interval2 {
					margin-top: 2rpx;
					margin-left: 40rpx;
					margin-right: 40rpx;
					height: 30rpx;
					width: 3rpx;
					background-color: rgb(131, 47, 35);
				}

				.num1 {
					color: #ffffff;
					font-size: 28rpx;
					margin-right: 11rpx ;
					.text {
						font-size: 24rpx;
					}
				}

				.num2 {
					color: rgb(131, 47, 35);
					font-size: 28rpx;
					margin-right: 11rpx ;
					.text {
						font-size: 24rpx;
					}
				}

				.img-box {
					width: 65rpx;
					text-align: left;
					top: -10rpx;
					right: 100rpx;
					position: absolute;

				}

			}
			.one {
					background: linear-gradient(to right, rgba(249, 102, 77, 1), rgba(245, 59, 69, 1));
				}
			.two {
				margin-top: 20rpx;
				background: linear-gradient(to right, rgba(255, 244, 231, 1), rgba(255, 217, 171, 1));
			}


			.content {
				margin-top: 25rpx;
				margin-bottom: 25rpx;

				.title {
					font-weight: bold;
					font-size: 30rpx;
				}
				.content-list {
					margin-top: 30rpx;
					display: flex;
					//overflow: auto;

					.pserson-box {
						display: flex;
						flex-direction: column;
						text-align: center;

						.avatar-box {
							width: 120rpx;
							height: 120rpx;
							border-radius: 10rpx;
							overflow: hidden;
						}
						.name {
							font-size: 28rpx;
							margin-top: 10rpx;
						}
						.position {
							margin-top: 10rpx;
							color: red;
						}
					}

					.interval {
						margin-left: 20rpx;
					}
				}

				.textarea {
					line-height: 50rpx;
					font-size: 30rpx;
					margin-top: 15rpx;
					text-align: justify;
					text-align-last: left;
				}

			}

		}
</style>
