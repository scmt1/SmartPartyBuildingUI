<template>
	<view v-loading="loading" class="content-box">

		<view style="flex: 1; padding: 25rpx; margin-top: 30rpx;">
			<view class="box">
				<view style="flex: 1;">
					<view style="font-size: 34rpx; font-weight: 700; line-height: 50rpx;">答题分数</view>
					<view style="margin-top: 20rpx; line-height: 50rpx; font-weight: 700;">
						<text style="font-size: 50rpx; color: rgba(225, 53, 27, 1);">83分/</text>
						<text style="font-size: 38rpx;">100分</text></view>
				</view>
				<view style="width: 200rpx;">
					<image mode="widthFix" src="@/static/images/answer/result-top-icon.png"></image>
				</view>
			</view>

			<view class="button-box">
				<view class="button" @click="$handlerNavigate({ url: '/pages/Answer/Resolution/ResolutionSingleChoice' })">
					<image class="img" mode="widthFix" src="@/static/images/answer/result-left-button.png"></image>
					<view class="text">查看解析</view>
				</view>
				<view class="button">
					<image class="img" mode="widthFix" src="@/static/images/answer/result-right-button.png"></image>
					<view class="text" >返回首页</view>
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
	name: 'AnswerResult',
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "答题结果"});
		} catch (error) {
			document.title = "答题结果";
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
		...mapMutations(['setLoading'])
	}
}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
    flex-direction: column;
		background: rgba(252, 249, 243, 1);
		min-height: 100vh;

		.box {
			padding: 0 40rpx 15rpx 60rpx;
			display: flex;
			align-items: center;
			background-image: url(@/static/images/answer/result-top-bg.png);
			background-size: 100% 100%;
		}

		.button-box {
			margin-top: 30rpx;
			display: flex;
			padding: 0 30rpx;

			.button {
				width: 50%;
				position: relative;

				.img {
				}

				.text {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 100%;
					line-height: 100%;
					font-weight: 700;
					color: white;
					font-size: 30rpx;
					text-align: center;
				}
			}
		}

		.bottom-img {
			margin-top: 20rpx;
			width: 100%;
		}

	}


</style>
