<template>
	<view>
		<view class="vote-title">
			“戮力同心"战疫情微视频网络投票活动
		</view>

		<view class="count-down-text">
			结束倒计时
		</view>

		<view class="count-down-box">
			<view class="number">29</view>
			<view>天</view>
			<view class="number">22</view>
			<view>时</view>
			<view class="number">31</view>
			<view>分</view>
			<view class="number">07</view>
			<view>秒</view>
		</view>

		<u-row class="statistics-box">
			<u-col span="4" class="line">
				<view class="statistics-number">10</view>
				<view class="statistics-name">参选者数量</view>
			</u-col>
			<u-col span="4" class="line">
				<view class="statistics-number">2781</view>
				<view class="statistics-name">累计票数</view>
			</u-col>
			<u-col span="4">
				<view class="statistics-number">17261</view>
				<view class="statistics-name">累计访问量</view>
			</u-col>
		</u-row>

		<view class="vote-time">
			2023-05-01 00:00:00至2023-05-30 11:59:59
		</view>

		<view class="interval"></view>

		<view>
			<view class="title">
				<view class="title-icon">
					<image mode="heightFix" src="@/static/images/vote/flag.png"></image>
				</view>
				<view class="title-text">活动说明：</view>
			</view>
			<view class="introduce">
				为落实习近平总书记关于新冠肺炎疫情防控的一系列重要批示、指示精神和党中央、国务院关于疫情防控和经济社会发展的战略部署。横岗街道创新创业中心联合横岗街道维稳综治办举办了“战疫，我们在行动”微视频大赛。
			</view>
		</view>

		<view class="interval"></view>

		<view>
			<view class="title">
				<view class="title-icon">
					<image mode="heightFix" src="@/static/images/vote/vote-number.png"></image>
				</view>
				<view class="title-text">
					投票次数：
					<text class="text">每人每天限投1次</text>
				</view>
			</view>
		</view>

		<view class="interval"></view>

		<view>
			<view class="title">
				<view class="title-icon">
					<image mode="heightFix" src="@/static/images/vote/organization.png"></image>
				</view>
				<view class="title-text">
					发起组织：
					<text class="text">泸州国资委</text>
				</view>
			</view>
		</view>

		<view class="interval"></view>

		<view>
			<view class="title">
				<view class="title-icon">
					<image mode="heightFix" src="@/static/images/vote/phone.png"></image>
				</view>
				<view class="title-text">
					联系方式：
					<text class="text">0830-1586254</text>
				</view>
			</view>
		</view>

		<view class="interval"></view>
	</view>
</template>

<script>
	export default {
		name:"voteInfo",
		created() {
			/*try {
				xm.setNavigationBarTitle({title: "投票活动-活动信息"});
			} catch (error) {
				document.title = "投票活动-活动信息";
			}*/
		},
	}
</script>

<style lang="scss" scoped>
	.vote-title {
		margin-top: 30rpx;
		font-size: 30rpx;
		font-weight: 700;
		text-align: center;
	}

	.count-down-text {
		margin-top: 30rpx;
		text-align: center;
		font-size: 30rpx;
		color: rgba(225, 53, 27, 1);
	}

	.count-down-box {
		margin-top: 15rpx;
		justify-content: center;
		display: flex;
		font-size: 30rpx;
		color: rgba(225, 53, 27, 1);

		.number {
			background: rgba(225, 53, 27, 1);
			color: white;
			padding: 0 8rpx;
			border-radius: 10rpx;
			margin: 0 8rpx;
		}
	}

	.statistics-box {
		margin-top: 40rpx;

		.line {
			border-right: 1px solid rgba(229, 229, 229, 1);
		}

		.statistics-number {
			padding: 0 10rpx;
			text-align: center;
			color: rgba(225, 53, 27, 1);
			font-size: 40rpx;
			font-weight: 700;
		}

		.statistics-name {
			padding: 0 10rpx;
			text-align: center;
			font-size: 28rpx;
		}
	}

	.vote-time {
		margin-top: 20rpx;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
		 background-image: linear-gradient(to right, rgba(246, 217, 177, 1) , rgba(250, 245, 238, 1));
	}

	.interval {
		width: 100%;
		height: 1px;
		transform: scale(1, 0.4);
		background: rgb(208, 208, 208);
		margin: 30rpx 0;
		transform: scale(1, 0.5);
	}

	.title {
		display: flex;
		align-items: center;

		.title-icon {
			height: 28rpx;
		}

		.title-text {
			margin-left: 5rpx;
			font-weight: 700;
			font-size: 30rpx;

			.text {
				font-size: 26rpx;
				font-weight: 400;
			}
		}
	}

	.introduce {
		margin-top: 20rpx;
	}
</style>
