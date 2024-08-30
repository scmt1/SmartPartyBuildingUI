<template>
	<view v-loading="loading" class="content-box">

		<view class="content">
			<view class="top-box">
				<view class="next-button" @click="$handlerNavigate({ url: '/pages/Answer/SingleChoice' })">
					上一题
				</view>
				<view class="left-content">
					<view>剩余时间：</view>
					<view class="time">04</view>
					<view class="symbol">:</view>
					<view class="time">23</view>
				</view>
				<view class="next-button" @click="$handlerNavigate({ url: '/pages/Answer/MultipleChoice' })">
					下一题
				</view>
			</view>


				<view class="topic-box">
					<view class="name-box">
						<view class="icon"></view>
						<view class="text">判断题(20分)</view>
						<view>
							<text class="num-left">2</text>
							<text class="num-right">/3</text>
						</view>
					</view>
					<u-line class="line"></u-line>
					<view class="main-content-box">
						<view style="font-size: 30rpx; line-height: 45rpx;">
							2021年10月12日，习近平在《生物多样性公约》第十五次缔约方大会领导人峰会上指出昆明大会以“生态文明: 共建地球生命共同32为未来全球体”为主题，推动制定生物多样性保护具有重要意义。
						</view>
						<view class="source">
							来源: 习近平2021年10月12日在《生物多样性公约》第十五次缔约方大会领导人峰会上的主旨讲话
						</view>
						<view class="button-box">
							<view :class="selectedId == 1?'button-selected':'button'" @click="selectOption(1)">
								正确
							</view>
							<view :class="selectedId == 2?'button-selected':'button'" @click="selectOption(2)">
								错误
							</view>
						</view>
					</view>
				</view>
		</view>

		<view class="bottom-img">
			<image mode="widthFix" src="@/static/images/answer-bt-bg.png"></image>
		</view>

	</view>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	const { mapState, mapMutations } = createNamespacedHelpers('user')
export default {
	name: 'TrueOrFalseQuestions',
	data() {
		return {
			selectedId: null
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "专项答题"});
		} catch (error) {
			document.title = "专项答题";
		}*/
	},
	computed: {
		...mapState([
			'loading'
		])
	},
	onReady() {
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
	methods: {
		...mapMutations(['setLoading']),
		selectOption(id) {
			this.selectedId = id
		}
	}
}
</script>

<style lang="scss" scoped>
	.content-box {
		min-height: 100vh;
		background: rgba(252, 249, 243, 1);
		display: flex;
		flex-direction: column;

		.content {
			padding: 0 25rpx;
			flex: 1;

			.top-box {
				padding-top: 25rpx;
				display: flex;
				font-size: 26rpx;


				.left-content {
					flex: 1;
					font-weight: 700;
					display: flex;
					align-items: center;
					justify-content: center;

					.symbol {
						margin: 0 5rpx;
					}

					.time {
						padding: 0 3rpx 3rpx 3rpx;
						color: white;
						background: red;
						border-radius: 10rpx;
					}
				}

				.next-button {
					width: 142rpx;
					height: 60rpx;
					border-radius: 10rpx;
					background: rgba(225, 53, 27, 1);
					color: white;
					text-align: center;
					line-height: 60rpx;
				}
			}

			.topic-box {
				margin-top: 24rpx;
				background: white;
				border-radius: 10rpx;
				padding: 30rpx 15rpx;

				.name-box {
					display: flex;
					align-items: center;

					.icon {
						width: 8rpx;
						height: 28rpx;
						background: red;
					}

					.text {
						flex: 1;
						font-size: 28rpx;
						font-weight: 700;
						margin-left: 8rpx;
					}

					.num-left {
						font-weight: 700;
						font-size: 32rpx;
					}

					.num-right {
						font-weight: 700;
						color: rgb(170, 170, 170);
						font-size: 24rpx;
					}
				}

				.line {
					margin-top: 20rpx !important;
				}

				.main-content-box {
					padding: 30rpx 45rpx 50rpx 45rpx;
					line-height: 40rpx;

					.source {
						font-size: 28rpx;
						line-height: 40rpx;
						margin-top: 30rpx;
						color: rgb(215, 154, 76);
					}
					.button-box {
						margin-top: 70rpx;
						.button {
							margin-top: 20rpx;
							padding: 20rpx;
							border-radius: 10rpx;
							font-weight: 700;
							font-size: 28rpx;
							color: rgb(106, 107, 111);
							border: 1px solid rgb(242, 242, 242);
							background: rgb(251, 252, 254);
							&-selected {
								margin-top: 20rpx;
								padding: 20rpx;
								border-radius: 10rpx;
								font-weight: 700;
								font-size: 28rpx;
								color: rgb(245, 155, 34);
								border: 1px solid rgb(245, 159, 42);
								background: rgb(254, 245, 232);
							}
						}

					}
				}

			}
		}

		.bottom-img {
			margin-top: 20rpx;
			width: 100%;
		}

	}
</style>
