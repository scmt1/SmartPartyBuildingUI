<template>
	<view>
		<u-popup customStyle="padding: 80rpx 0; width: 70%; border-radius: 10rpx;" mode="center" :show="popupConfirm">
			<view>
				<view class="popupConfirm-title">{{ title }}</view>
				<view class="popupConfirm-box">
					<view class="popupConfirm-button" @click="popupClose()">{{ cancelText }}</view>
					<view class="popupConfirm-button" @click="popupConfirmOk()">{{ confirmText }}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	name: "index",
	props: {
		show: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		confirmText: {
			type: String,
			default: '确定'
		}
	},
	watch: {
		show(){
			this.popupConfirm = this.show
		}
	},
	data() {
		return {
			popupConfirm: false
		}
	},
	methods: {
		popupClose() {
			this.$emit('close')
		},
		popupConfirmOk() {
			this.$emit('confirm')
		}
	}
}
</script>

<style lang="scss" scoped>
	.popupConfirm-title {
		font-size: 30rpx;
		font-weight: 700;
		text-align: center;
		padding: 0 20rpx;
	}
	
	.popupConfirm-box {
		display: flex;
		margin-top: 40rpx;
		justify-content: center;
	
		.popupConfirm-button {
			font-weight: 700;
			font-size: 30rpx;
			border-radius: 10rpx;
			background: rgba(225, 53, 27, 1);
			cursor: pointer;
			user-select: none;
			color: white;
			height: 60rpx;
			width: 180rpx;
			text-align: center;
			line-height: 60rpx;
			margin: 0 13rpx;
		}
	}
</style>