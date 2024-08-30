<template>
	<view>
		<view class="img">
			<image mode="widthFix" src="@/static/images/user/success.png"></image>
		</view>
		<view class="text">
			更改成功
		</view>
		<view class="button" @click="goLogin()">
			重新登录
		</view>
	</view>
</template>

<script>
import {removeLocalStorageInfo} from '@/utils/localStorageInfo'

export default {
	name: 'changeSuccess',
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "更改密码"});
		} catch (error) {
			document.title = "更改密码";
		}*/
	},
	mounted() {
		removeLocalStorageInfo('userInfo')
		removeLocalStorageInfo('token')
		this.$store.dispatch('user/setUserInfo', {})
	},
	methods: {
		goLogin() {
			uni.navigateTo({
				url: '/pages/User/login'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.img {
		width: 148rpx;
		margin: auto;
		margin-top: 100rpx;
	}

	.text {
		margin-top: 35rpx;
		font-size: 36rpx;
		font-weight: 700;
		text-align: center;
	}

	.button {
		margin: auto;
		margin-top: 68rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 306rpx;
		height: 70rpx;
		border-radius: 10rpx;
		background: rgba(225, 53, 27, 1);
		color: white;
		font-size: 28rpx;
		font-weight: 700;
		cursor: pointer;
		user-select: none;
	}
</style>
