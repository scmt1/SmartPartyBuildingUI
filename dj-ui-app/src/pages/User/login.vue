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

			<view v-if="loginType == 2">
				<view class="code-text">密码</view>
				<view class="form-box">
					<u--form :labelStyle="labelStyle" labelPosition="left" :model="login" labelWidth="55rpx"
						ref="uForm">
						<u-form-item prop="login.password" borderBottom>
							<u--input fontSize="30rpx" class="input" v-model="login.password" border="none"
								:password="true" placeholder="请输入密码"></u--input>
							<view style="height: 65rpx;"></view>
						</u-form-item>
					</u--form>
				</view>
			</view>

			<view v-if="loginType == 1">
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

			<view style="margin-top: 30rpx;">
				<view class="login-button-seleced" style="margin-bottom: 16px;" @click="loginBtn()">
					登录
				</view>
				<view v-if="loginType === 1" :class="loginType === 2?'login-button-seleced':'login-button-not-seleced'"
					@click="loginTypeChange(2)" style="margin-top: 30rpx; margin-bottom: 30rpx;">
					密码登录
				</view>
				<view v-if="loginType === 2" :class="loginType === 1?'login-button-seleced':'login-button-not-seleced'"
					@click="loginTypeChange(1)" style="margin-top: 30rpx; margin-bottom: 30rpx;">
					验证码登录
				</view>
                <view style="display: grid;justify-content: center;" @click="getUrl()">
                    <view style="display: flex;justify-content: center;">
                        <image style="height: 80rpx;width: 80rpx;" src="@/static/wx-icon.png"></image>
                    </view>
                    <view style="text-align: center;">微信一键登录</view>
                </view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		partyMemberLogin,
		partyMemberLoginByCode,
		sendVCode
	} from '@/api/login'
	import {
		setLocalStorageInfo
	} from '@/utils/localStorageInfo'
	import {
		encrypt
	} from '@/utils/crypto'
	import {
		createNamespacedHelpers
	} from 'vuex'
    const config = require('@/utils/config.js')
	import {
		getLocalStorageInfo
	} from '@/utils/localStorageInfo'
    import util from '@/utils/util'
    import {wxLogin} from "@/api/partyMember"
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
				// timerShow:false,
				// timer: 60,
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
				loginType: 2,
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
            let code = this.getQueryVariable("code")
            let userInfo = getLocalStorageInfo('userInfo')
            let openid = userInfo.openid
            console.log("code",code)
            console.log("openid",openid)
            if(code){
                let data = {
                    code:code
                }
                wxLogin({data:data}).then(res =>{
                    console.log("wxLogin",res)
                    if(res.code == "00000"){
                        setLocalStorageInfo('userInfo', res.data)
                        setLocalStorageInfo('token', res.token)
                        this.$emit('refresh', {
                            refresh: true
                        })
                        uni.navigateTo({
                            url: '/pages/Home/Home'
                        })
                    }else{
                        console.log("OpenId",res)
                        if(res.code == "222222"){
                            uni.setStorageSync("openId",res.data)
                            uni.navigateTo({
                                url:"/pages/User/loginOpenId"
                            })
                        }
                    }
                })
            }
			// let userInfo = getLocalStorageInfo('userInfo')
			// let token = getLocalStorageInfo('token')
            //
			// if (userInfo && token && userInfo != null && token != null &&
			// 	token != undefined && token != undefined) {
			// 	uni.navigateTo({
			// 		url: "/"
			// 	})
			// }
			// this.setLoading(true);
		},
		onReady() {
			this.setTimerShow(false);
			this.setTimer(60);
			this.setLoading(false);
		},
		methods: {
			...mapMutations(['setTimer', 'setTimerShow', 'setLoading']),
            // 获取url参数
            getQueryVariable(variable){
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == variable) { return pair[1]; }
                }
                return (false);
            },
            getUrl(){
                let redirectUrl = config.domainAddress + '/#/pages/User/login';
                redirectUrl = encodeURIComponent(redirectUrl);
                let appid = config.mpAppId;
                let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' +
                    redirectUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                window.location.href = url;
            },
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
				sendVCode({
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

					// this.timer -= 1;
					let newTimer = initTimer;
					initTimer -= 1;
					this.setTimer(newTimer);
					if (newTimer <= 0) {
						clearInterval(countdown)
						// this.timerShow = false
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
                if(this.loginType == 2){
                    if(!this.login.password){
                        uni.showToast({
                            icon: 'none',
                            title: '请输入密码!',
                            duration: 2000
                        })
                        return
                    }
                }
				uni.showLoading({
					title: '正在登陆...'
				})
				this.loginByPassword(this.loginType)
			},
			loginTypeChange(type) {
				this.loginType = type
			},
			loginByPassword(type) {
				uni.hideKeyboard()
				if (type == 1) {
					let data2 = {
						phone: this.login.phone,
						code: this.login.verificationCode
					}
					partyMemberLoginByCode({
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
				} else {
					let data2 = {
						phone: this.login.phone,
						password: encrypt(this.login.password)
					}
					partyMemberLogin({
						data: data2
					}).then(res => {
						if (res.code == '00000') {
							setLocalStorageInfo('userInfo', res.data)
							setLocalStorageInfo('token', res.token)

							// this.$store.dispatch('user/setUserInfo', res.data)
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
			margin-top: 30rpx;
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