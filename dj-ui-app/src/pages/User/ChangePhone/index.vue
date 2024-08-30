<template>
	<view>
		<view class="hint">
			为保障您的账号安全，请于以下方式任选一种进行身份验证。
		</view>

		<view class="nav" @click="$handlerNavigate({ url: '/pages/User/ChangePhone/oldPassword?phone='+phone })">
			<view class="name">原密码验证</view>
			<view class="right-icon">
				<u-icon name="arrow-right" size="28rpx" color="rgba(56, 56, 56, 1)"></u-icon>
			</view>
		</view>

		<view class="nav" @click="$handlerNavigate({ url: '/pages/User/ChangePhone/inputCodeByOldPhone?phone='+phone })">
			<view class="name">短信验证码验证</view>
			<view class="right-icon">
				<u-icon name="arrow-right" size="28rpx" color="rgba(56, 56, 56, 1)"></u-icon>
			</view>
		</view>

	</view>
</template>

<script>
export default {
	name: 'index',
	data(){
		return{
			phone:''
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "更改手机号码"});
		} catch (error) {
			document.title = "更改手机号码";
		}*/
	},
	onLoad(option){
		this.phone = option.phone
	}
}
</script>

<style lang="scss" scoped>
	.hint  {
		padding: 0 25rpx;
		background: rgba(247, 247, 247, 1);
		font-size: 24rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
	}

	.nav {
		margin-top: 40rpx;
		padding: 0 25rpx;
		display: flex;
		align-items: center;

		.name {
			font-size: 30rpx;
			font-weight: 700;
			flex: 1;
		}

		.right-icon {
		}
	}
</style>
