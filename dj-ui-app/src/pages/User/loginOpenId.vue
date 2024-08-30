<template>
	<view v-loading="loading">
		<view>
			<image mode="widthFix" src="@/static/images/user/login-bg-img.png"></image>
		</view>

		<view class="content-box">
			<view class="text1">您好！</view>
			<view>
				<text class="text2">欢迎来到，</text>
				<text class="text3">
					酒城智慧机关党建
				</text>
			</view>
			<view class="phone-text">手机号码</view>
			<view class="form-box">
				<u--form :labelStyle="labelStyle" labelPosition="left" :model="login" labelWidth="55rpx" ref="uForm">
					<u-form-item label="+86" prop="phone" borderBottom>
						<u--input fontSize="30rpx" type="number" class="input" v-model="login.phone" border="none"
							placeholder="请输入手机号码"></u--input>
					</u-form-item>
				</u--form>
			</view>

			<view>
				<view class="code-text">验证码</view>
				<view class="form-box">
					<u--form :labelStyle="labelStyle" labelPosition="left" :model="login" labelWidth="55rpx"
						ref="uForm">
						<u-form-item prop="phone" borderBottom>
							<u--input fontSize="30rpx" class="input" v-model="login.verificationCode" maxlength="6"
								border="none" placeholder="请输入验证码"></u--input>
							<u-button v-if="!timerShow" class="code-button" slot="right" :disabled="disabled1"
								@click="getVcode">{{content}}</u-button>
							<u-button v-if="timerShow" class="code-button red-btn" style="margin-left: 10rpx;"
								slot="right">{{timer}}秒重新获取</u-button>
						</u-form-item>
					</u--form>
				</view>
			</view>

			<view style="margin-top: 110rpx;">
				<view class="login-button-seleced" style="margin-bottom: 16px;" @click="loginBtn()">
					绑定并登录
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
        sendBindVCode
	} from '@/api/login'
    import {
        wxBindPhone
    } from '@/api/partyMember'
	import {
		setLocalStorageInfo
	} from '@/utils/localStorageInfo'
	import {
		createNamespacedHelpers
	} from 'vuex'
	import {
		getLocalStorageInfo
	} from '@/utils/localStorageInfo'
    import util from '@/utils/util'
	const {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} = createNamespacedHelpers('user')

	export default {
		name: 'login',
		data() {
			return {
				content: '获取验证码',
				login: {
					phone: '',
					password: '',
					verificationCode: ''
				},
				labelStyle: {
					'fontSize': '26rpx',
					'fontWeight': 500
				},
				disabled1: false,
			}
		},
		computed: {
			...mapState([
				'timer',
				'timerShow',
				'loading'
			])
		},
		onLoad() {
            console.log(window.location.href)
		},
		onReady() {
			this.setTimerShow(false);
			this.setTimer(60);
			this.setLoading(false);
		},
		methods: {
			...mapMutations(['setTimer', 'setTimerShow', 'setLoading']),
			getVcode() {
				uni.hideKeyboard()
				if (!uni.$u.test.mobile(this.login.phone)) {
					uni.showToast({
						icon: 'none',
						title: "请填写手机号或手机号有误！",
						duration: 1500
					})
					return
				}
				let data = {
					phone: this.login.phone,
				}
                sendBindVCode({
					partyMember: data
				}).then(res => {
					if (res.code == '00000') {
						this.startTimer()
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 2000
						})
					}
				})
			},
			startTimer() {
				this.setTimerShow(true);
				// this.timer = 60 // 重置计时器为60秒
				this.setTimer(60);
				let initTimer = 60;
				const countdown = setInterval(() => {

					let newTimer = initTimer;
					initTimer -= 1;
					this.setTimer(newTimer);
					if (newTimer <= 0) {
						clearInterval(countdown)
						this.setTimerShow(false);
						this.content = '重新获取'
					}
				}, 1000);
			},
			//登录
			loginBtn() {
			    if(!this.login.phone){
			        uni.showToast({
                        icon: 'none',
                        title: '请输入手机号!',
                        duration: 2000
                    })
                    return
                }
                if(!this.login.verificationCode){
                    uni.showToast({
                        icon: 'none',
                        title: '请输入验证码!',
                        duration: 2000
                    })
                    return
                }
				uni.showLoading({
					title: '正在登陆...'
				})
				this.loginByPassword()
			},
			loginByPassword() {
				uni.hideKeyboard()
                let data2 = {
                    phone: this.login.phone,
                    code: this.login.verificationCode,
                    openid:uni.getStorageSync("openId")
                }
                wxBindPhone({
                    data: data2
                }).then(res => {
                    if (res.code == '00000') {
                        setLocalStorageInfo('userInfo', res.data)
                        setLocalStorageInfo('token', res.token)

                        this.$emit('refresh', {
                            refresh: true
                        })

                        uni.navigateTo({
                            url: '/pages/Home/Home'
                        })
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg,
                            duration: 2000
                        })
                    }
                })
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-search__content__input--placeholder {
		font-size: 26rpx;
	}

	.content-box {
		padding: 0 100rpx 30rpx 100rpx;
		margin-top: -30rpx;

		.text1 {
			font-size: 50rpx;
			font-weight: 900;
			color: rgba(225, 53, 27, 1);
		}

		.text2 {
			font-size: 34rpx;
			font-weight: 500;
		}

		.text3 {
			font-size: 40rpx;
			font-weight: 900;
			color: rgba(225, 53, 27, 1);
		}

		.phone-text {
			margin-top: 80rpx;
			font-size: 28rpx;
			font-weight: 500;
		}

		.form-box {
			margin-top: 17rpx;

			.input {
				font-size: 30rpx;
				font-weight: 900;
				margin-left: 15rpx;
			}
		}

		.code-text {
			margin-top: 40rpx;
			font-size: 28rpx;
			font-weight: 500;
		}

		.code-button {
			border-radius: 10rpx;
			border-color: rgba(225, 53, 27, 1);
			height: 65rpx;
			color: rgba(225, 53, 27, 1);
			font-size: 24rpx;
			font-weight: 500;
		}

		.login-button-not-seleced {
			border: 2px solid rgba(225, 53, 27, 1);
			width: 100%;
			text-align: center;
			height: 80rpx;
			line-height: 76rpx;
			font-size: 30rpx;
			color: rgba(225, 53, 27, 1);
			font-size: 700;
			border-radius: 10rpx;
			cursor: pointer;
			user-select: none;
		}

		.login-button-seleced {
			border: 2px solid rgba(225, 53, 27, 1);
			background: rgba(225, 53, 27, 1);
			width: 100%;
			text-align: center;
			height: 80rpx;
			line-height: 76rpx;
			font-size: 30rpx;
			color: white;
			font-size: 700;
			border-radius: 10rpx;
			cursor: pointer;
			user-select: none;
		}

		.red-btn {
			color: rgba(225, 53, 27, 1);
		}

	}
</style>