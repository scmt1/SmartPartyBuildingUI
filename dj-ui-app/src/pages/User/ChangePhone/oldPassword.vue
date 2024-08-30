<template>
	<view>

		<view class="hint">
			<view class="text">验证原密码</view>
			<view class="text2">用于登录智慧党建平台的密码</view>
		</view>

		<view class="old-password-box">
			<u--form :labelStyle="labelStyle" labelPosition="top" :model="form" labelWidth="60rpx"  ref="uForm">
				<u-form-item label="密码" prop="login.phone" borderBottom>
					<u--input fontSize="26rpx" class="input" v-model="form.oldPassword" border="none" clearable placeholder="请输入密码" @change="oldPasswordInputChange"></u--input>
				</u-form-item>
			</u--form>
		</view>

		<view :class="!nextFlag?'next-button-false':'next-button-true'" @click="goNext()">
			下一步
		</view>
	</view>
</template>

<script>
	import { encrypt } from '@/utils/crypto'
	import {partyMemberPasswordVerify} from '@/api/partyMember'
	import { mapGetters } from 'vuex'
	import {setLocalStorageInfo,getLocalStorageInfo} from '@/utils/localStorageInfo'
	export default {
		name: 'oldPassword',
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		data() {
			return {
				form: {
					oldPassword: ''
				},
				labelStyle: {
					'fontSize': '26rpx',
					'fontWeight': 500
				},
				nextFlag: false
			}
		},

		created() {
			this.form.id = this.userInfo.id.toString()

			/*try {
				xm.setNavigationBarTitle({title: "更改手机号码"});
			} catch (error) {
				document.title = "更改手机号码";
			}*/
		},
		methods: {
			oldPasswordInputChange(e) {
				if (e.length > 0) {
					this.nextFlag = true
				}
			},
			//原密码验证
			partyMemberPasswordVerify(){

			},
			goNext() {
					if(this.form.oldPassword && this.form.oldPassword.trim() !== ""){
						let data = {
							id: this.userInfo.id + '',
							oldPassword: encrypt(this.form.oldPassword)
						}
						//原密码验证
						partyMemberPasswordVerify(data).then(res=>{
							if (res.code == '00000') {
								setLocalStorageInfo('oldPassword',this.form.oldPassword)
								uni.navigateTo({
								  url: './newPhone'
								});
							} else {
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
							duration: 1000,
							  icon: 'none',
							  title: '密码不能为空'
						})
						return false
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

	.old-password-box {
		padding: 0 25rpx;
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
