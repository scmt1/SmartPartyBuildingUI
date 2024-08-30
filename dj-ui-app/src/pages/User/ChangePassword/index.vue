<template>
	<view>
		<view class="hint">
			为保障您的账号安全，请于以下方式任选一种进行身份验证。
		</view>

		<!-- <template v-if="step == 'index'"> -->
		<template v-if="step == 'index'">
			<!-- <view class="nav" @click="changeStep('oldPassword')"> -->
			<view class="nav"@click="$handlerNavigate({ url: '/pages/User/ChangePassword/oldPassword' })">
				<view class="name">原密码验证</view>
				<view class="right-icon">
					<u-icon name="arrow-right" size="28rpx" color="rgba(56, 56, 56, 1)"></u-icon>
				</view>
			</view>

			<view class="nav" @click="$handlerNavigate({ url: '/pages/User/ChangePassword/inputCode' })">
				<view class="name">短信验证码验证</view>
				<view class="right-icon">
					<u-icon name="arrow-right" size="28rpx" color="rgba(56, 56, 56, 1)"></u-icon>
				</view>
			</view>
		</template>

	<!-- 	<template v-if="step == 'oldPassword'">
			<oldPassword @succee="changeStep('newPassword')"></oldPassword>
		</template>

		<template v-if="step == 'newPassword'">
			<newPassword @succee="changeStep('changeSuccess')"></newPassword>
		</template>

		<template v-if="step == 'changeSuccess'">
			<changeSuccess></changeSuccess>
		</template> -->


	</view>
</template>

<script>
import oldPassword from './oldPassword'
import newPassword from './newPassword'
import changeSuccess from './changeSuccess'
import { mapGetters } from 'vuex'
import {getLocalStorageInfo} from '@/utils/localStorageInfo'
import {changeNewPhone,sendVCode} from '@/api/login'
export default {
	name: 'index',
	components: {
		oldPassword,
		newPassword,
		changeSuccess
	},
	data() {
		return {
			step: 'index'
		}
	},
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "更改密码"});
		} catch (error) {
			document.title = "更改密码";
		}*/
	},
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	onShow() {
		let userInfo = getLocalStorageInfo('userInfo')
		let token = getLocalStorageInfo('token')

		if (!userInfo || !token || userInfo == null || token == null
        || userInfo == undefined || token == undefined) {
			this.$store.dispatch('user/setUserInfo', {})
			uni.navigateTo({
			  url: "/pages/User/login"
			})
		}
		//console.log('显示了')
	},
	methods: {
		changeStep(value) {
			this.step = value
		}
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
