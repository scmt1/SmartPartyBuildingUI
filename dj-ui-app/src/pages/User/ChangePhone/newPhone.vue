<template>
	<view>

		<view class="hint">
			<view class="text">输入新手机号码</view>
			<view class="text2">更换手机号后，下次可使用新手机号登录</view>
			<view class="text2">当前手机号：{{currentPhone}}</view>
		</view>

		<view class="phone-text">手机号码</view>
		<view class="form-box">
			<u--form :labelStyle="labelStyle" labelPosition="left" :model="newInfo" labelWidth="55rpx"  ref="uForm">
				<u-form-item label="+86" prop="login.phone" borderBottom>
					<u--input fontSize="26rpx" class="input" v-model="newInfo.newPhone" border="none" clearable  placeholder="请输入新手机号码"></u--input>
				</u-form-item>
			</u--form>
		</view>

		<view :class="!newInfo.newPhone.length > 0?'next-button-false':'next-button-true'" @click="goNext()">
			下一步
		</view>

	</view>
</template>

<script>
	import {sendVCode,validNewPhone} from '@/api/login'
	import {getLocalStorageInfo,setLocalStorageInfo} from '@/utils/localStorageInfo'
	export default {
		name: 'oldPassword',
		data() {
			return {
				currentPhone:'',
				oldPassword:'',
				newInfo: {
					newPhone: ''
				},
				labelStyle: {
					'fontSize': '26rpx',
					'fontWeight': 500
				},
			}
		},
		created() {
			this.currentPhone=getLocalStorageInfo('userInfo').phone
			this.oldPassword = getLocalStorageInfo('oldPassword')
			/*try {
				xm.setNavigationBarTitle({title: "更改手机号码"});
			} catch (error) {
				document.title = "更改手机号码";
			}*/
		},
		methods: {


			goNext() {
				if (this.newInfo.newPhone&&this.newInfo.newPhone.length > 0) {
					// 手机号正则表达式
					  const phoneRegex = /^1[3456789]\d{9}$/;

					  if (!phoneRegex.test(this.newInfo.newPhone)) {
						  uni.showToast({
							duration:1000,
							icon:'none',
							title:'电话格式不正确'
							})
							return false
					  }
					uni.hideKeyboard()

					let data = {
						phone: this.newInfo.newPhone,
					}
					validNewPhone(data).then(res=>{

						if (res.code == '00000') {
								sendVCode({partyMember: data}).then(res => {
									if (res.code == '00000') {
										setLocalStorageInfo('newPhone',this.newInfo.newPhone)
									} else {
										uni.showToast({
										  icon: 'none',
										  title: res.msg,
										  duration: 2000
										})
									}
								})
								uni.navigateTo({
									url: './inputCode'
								})
						}else{
							uni.showToast({
								icon: 'none',
								title: res.msg,
								duration: 2000
							})
							return false
						}
					})
				}else{
					uni.showToast({
						duration:1000,
						icon:'none',
						title:'号码不能为空'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hint  {
		padding: 30rpx 25rpx;
		background: rgba(247, 247, 247, 1);
		display: flex;
		flex-direction: column;

		.text {
			font-size: 32rpx;
			font-size: 700;
		}

		.text2 {
			font-size: 24rpx;
		}
	}

	.phone-text {
		margin-top: 50rpx;
		padding: 0 25rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.form-box {
		padding: 0 25rpx;

		.input {
			font-size: 30rpx;
			font-weight: 900;
			margin-left: 15rpx;
		}
	}

	.next-button-false {
		margin: auto;
		height: 70rpx;
		width: 306rpx;
		border-radius: 10rpx;
		background: rgba(240, 154, 140, 1);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 700;
		margin-top: 81rpx;
		cursor: pointer;
		user-select: none;
	}

	.next-button-true {
		margin: auto;
		height: 70rpx;
		width: 306rpx;
		border-radius: 10rpx;
		background: rgba(225, 53, 27, 1);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 700;
		margin-top: 81rpx;
		cursor: pointer;
		user-select: none;
	}
</style>
