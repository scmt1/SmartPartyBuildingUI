<template>
	<view>
		<view class="top-box">
			<view class="top-left">
				<image mode="widthFix" src="@/static/images/vote/rank-top-left.png"></image>
			</view>
			<view class="center">排行榜</view>
			<view class="top-right">
				<image mode="widthFix" src="@/static/images/vote/rank-top-right.png"></image>
			</view>
		</view>

		<view class="bottom-img">
			<image mode="widthFix" src="@/static/images/vote/top.png"></image>
		</view>

		<view>

			<view class="rank-list">
				<view class="cover-img">
					<image mode="heightFix" src="@/static/images/vote/list-cover.png"></image>
				</view>
				<view class="right-box">
					<view class="left-content">
						<view class="name">李晓霞</view>
						<view class="number-info">
							<text class="number">2589</text>票
						</view>
						<view class="num">编号：01</view>
					</view>
				</view>
				<view class="right-img">
					<image mode="heightFix" src="@/static/images/vote/first.png"></image>
				</view>
			</view>


			<view class="rank-list">
				<view class="cover-img">
					<image mode="heightFix" src="@/static/images/vote/list-cover.png"></image>
				</view>
				<view class="right-box">
					<view class="left-content">
						<view class="name">李晓霞</view>
						<view class="number-info">
							<text class="number">2589</text>票
						</view>
						<view class="num">编号：01</view>
					</view>
				</view>
				<view class="right-img2">
					<image class="img" mode="heightFix" src="@/static/images/vote/other.png"></image>
					<view class="right-text">第5名</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		name:"ranking",
		created() {
			/*try {
				xm.setNavigationBarTitle({title: "投票活动-参选排名"});
			} catch (error) {
				document.title = "投票活动-参选排名";
			}*/
		},
	}
</script>

<style lang="scss" scoped>
	.top-box {
		display: flex;
		align-items: center;
		margin-top: -80rpx;

		.top-left {
			flex: 1;
		}

		.center {
			font-size: 40rpx;
			font-weight: 700;
		}

		.top-right {
			flex: 1;
		}
	}

	.bottom-img {
		margin-top: -120rpx;
	}

	.rank-list {
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
		overflow: hidden;
		background: rgba(252, 249, 243, 1);

		.cover-img {
			height: 165rpx;
		}

		.right-box {
			flex: 1;
			padding: 0 20rpx;

			.left-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				font-size: 28rpx;
				justify-content: center;

				.name {
					font-weight: 500;
				}

				.number-info {
					font-weight: 500;
					color: rgba(225, 53, 27, 1);
					margin-top: 10rpx;

					.number {
						font-size: 34rpx;
					}
				}

				.num {
					font-size: 24rpx;
					margin-top: 10rpx;
				}

			}
		}

		.right-img {
			height: 165rpx;
		}

		.right-img2 {
			position: relative;
			height: 165rpx;
			padding-right: 20rpx;

			.img {
				height: 125rpx;
			}

			.right-text {
				color: white;
				position: absolute;
				top: 0;
				line-height: 105rpx;
				width: calc(100% - 20rpx);
				text-align: center;
				white-space: normal;
			}
		}
	}
</style>
