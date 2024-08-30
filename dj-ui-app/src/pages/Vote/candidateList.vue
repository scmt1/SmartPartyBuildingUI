<template>
	<view style="margin-top: 30rpx;">

		<u-search @search="seek" @custom="seek" class="search" searchIconSize="45" placeholder="姓名/编号" v-model="search.keyword"></u-search>

		<view @click="popupShow = true" :class="index%2 == 1 ? 'option-list option-right':'option-list' " v-for="(item, index) in optionList" :key="index">
			<image mode="widthFix" src="@/static/images/vote/list-cover.png"></image>
			<view class="option-content">
				<view class="option-text">
					<view>李晓霞</view>
					<view class="number">117票</view>
				</view>
				<view class="button-box">
					<view class="button">
						<image mode="widthFix" src="@/static/images/vote/left-button.png"></image>
						<view  class="button-name">投票</view>
					</view>
					<view class="button">
						<image mode="widthFix" src="@/static/images/vote/right-button.png"></image>
						<view class="button-name">详情</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup customStyle="width: calc(100% - 60rpx); border-radius: 10rpx;" mode="center" :show="popupShow" @open="popupOpen">
			<view class="popup-close">
				<u-icon style="float: right;" @click="popupClose" color="rgba(196, 196, 196, 1)" size="48rpx" name="close-circle-fill"></u-icon>
			</view>
			<view class="popup-content">
				<view class="popup-img">
					<image mode="widthFix" src="@/static/images/vote/coverImg1.png"></image>
				</view>
				<view class="popup-title">
					<text>张成旭</text>
					<text class="text1">编号2</text>
					<text class="text2">117票</text>
				</view>
				<view class="text3">
					参选者介绍
				</view>
				<view class="text4">
					作为东南大学计软智学生会宣传部部长、主席，张晨旭负责宣传部视频制作工作，还组建了学院的视频栏目组，同时担任学校电视台技术部部长、台长，累计负责制作短片23部，社团宣传片7部。他还参与过朗诗地产宣传片、绿地桃园小镇MV以及东南大学2019本科招生宣传片的作。
				</view>
				<view class="button" @click="confirmVote">
					投票
				</view>
			</view>
		</u-popup>

		<u-popup customStyle="padding: 40rpx 0; width: 70%; border-radius: 10rpx;" mode="center" :show="popupConfirm">
			<view>
				<view class="popupConfirm-title">确定投票给此位参选者吗？</view>
				<view class="popupConfirm-box">
					<view class="popupConfirm-button" @click="okVote">确定</view>
					<view class="popupConfirm-button">取消</view>
				</view>
			</view>
		</u-popup>

		<u-popup customStyle="padding: 40rpx 0; width: 70%; border-radius: 10rpx;" mode="center" :show="popupSuccess">
			<view @click="closePopup">
				<image style="width: 88rpx; margin: auto;" mode="widthFix" src="@/static/images/vote/success.png"></image>
				<view style="text-align: center; margin-top: 20rpx; font-size: 30rpx; font-weight: 700;">投票成功</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		name:"candidateList",
		data() {
			return {
				search: {
					keyword: ''
				},
				optionList: [
					{},{},{},{}
				],
				popupShow: false,
				popupConfirm: false,
				popupSuccess: false
			}
		},
		created() {
			/*try {
				xm.setNavigationBarTitle({title: "投票活动-参选列表"});
			} catch (error) {
				document.title = "投票活动-参选列表";
			}*/
		},
		methods: {
			seek(event) {

			},
			popupClose() {
				this.popupShow = false
			},
			popupOpen() {

			},
			confirmVote() {
				this.popupShow = false
				this.popupConfirm = true
			},
			okVote() {
				this.popupConfirm = false
				this.popupSuccess = true
			},
			closePopup() {
				this.popupSuccess = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		background: rgba(242, 242, 242, 1);
		border-radius: 40px;
		height: 80rpx;
		font-size: 26rpx;

		::v-deep .u-search__content__input--placeholder {
			font-size: 25rpx;
		}

		::v-deep .u-search__action--active {
			background-color: rgba(225, 53, 27, 1);
			border-radius: 40px;
			height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			width: 140rpx;
			margin-right: 10rpx;
			font-size: 25rpx;
		}
	}

	.option-list {
		margin-top: 30rpx;
		width: calc(50% - 10rpx);
		border-radius: 10rpx;
		overflow: hidden;
		display: inline-block;

		.option-content {
			display: flex;
			flex-direction: column;
			background: rgba(252, 249, 243, 1);
			font-size: 28rpx;
			font-weight: 500;
			padding: 15rpx 20rpx 40rpx 20rpx;

			.option-text {
				display: flex;

				.number {
					flex: 1;
					text-align: right;
					color: rgba(225, 53, 27, 1);
				}
			}

			.button-box {
				display: flex;

				.button {
					cursor: pointer;
					user-select: none;
					margin-top: 20rpx;
					position: relative;
					width: 50%;

					.button-name {
						position: absolute;
						color: white;
						top: 45%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}
		}
	}

	.option-right {
		margin-left: 20rpx;
	}

	.popup-close {
		padding: 20rpx 20rpx 0 0;
	}

	.popup-content {
		padding: 0 40rpx 40rpx 40rpx;

		.popup-img {
			margin-top: 10rpx;
			border-radius: 10rpx;
			overflow: hidden;
		}

		.popup-title {
			margin-top: 40rpx;
			font-size: 30rpx;
			font-family: 500;

			.text1 {
				margin-left: 20rpx;
			}

			.text2 {
				margin-left: 20rpx;
				color: rgba(225, 53, 27, 1);
			}
		}

		.text3 {
			margin-top: 20rpx;
			font-size: 30rpx;
			font-weight: 700;
		}

		.text4 {
			margin-top: 20rpx;
			margin-bottom: 80rpx;
		}

		.button {
			font-weight: 700;
			font-size: 30rpx;
			border-radius: 10rpx;
			margin: auto;
			line-height: 80rpx;
			text-align: center;
			color: white;
			width: 350rpx;
			height: 80rpx;
			background: rgba(225, 53, 27, 1);
			cursor: pointer;
			user-select: none;
		}

	}

	.popupConfirm-title {
		font-size: 30rpx;
		font-weight: 700;
		text-align: center;
	}

	.popupConfirm-box {
		display: flex;
		margin-top: 60rpx;

		.popupConfirm-button {
			font-weight: 700;
			font-size: 30rpx;
			border-radius: 10rpx;
			background: rgba(225, 53, 27, 1);
			cursor: pointer;
			user-select: none;
			color: white;
			margin: auto;
			height: 60rpx;
			width: 180rpx;
			text-align: center;
			line-height: 60rpx;
		}
	}
</style>
