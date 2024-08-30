<template>
	<view>
		<view class="img">
			<image mode="widthFix" src="@/static/images/user/success.png"></image>
		</view>
		<view class="text">
			更改成功
		</view>
		<view class="button" @click='login'>
			重新登录
		</view>
	</view>
</template>

<script>
	import {removeLocalStorageInfo} from '@/utils/localStorageInfo'
	export default {
		name: 'changeSuccess',
		created(){
			removeLocalStorageInfo('userInfo')
			removeLocalStorageInfo('token')
			removeLocalStorageInfo('newPhone')
			removeLocalStorageInfo('oldPassword')
		},
		methods:{
			login(){
				uni.navigateTo({
					url: 'pages/User/login'
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