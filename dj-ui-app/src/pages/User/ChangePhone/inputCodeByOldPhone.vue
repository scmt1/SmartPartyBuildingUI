<template>
	<view>

		<view class="hint">
			<view class="text">请输入验证码</view>
			<view class="text2">验证码已发送至原手机: +86 {{oldPhone}}</view>
		</view>

		<view class="content">
			<view class="input-box">
				<u--input class="input" fontSize="26rpx" maxlength="1" v-model="form.code1" :focus="focus.focus1" border="none" @change="codeChange1" @focus="codeFocus1"></u--input>
			</view>
			<view class="input-box">
				<u--input class="input" fontSize="26rpx" maxlength="1" v-model="form.code2" :focus="focus.focus2" border="none" @change="codeChange2" @focus="codeFocus2" @keyup.delete.native="codeDelete2"></u--input>
			</view>
			<view class="input-box">
				<u--input class="input" fontSize="26rpx" maxlength="1" v-model="form.code3" :focus="focus.focus3" border="none" @change="codeChange3" @focus="codeFocus3" @keyup.delete.native="codeDelete3"></u--input>
			</view>
			<view class="input-box">
				<u--input class="input" fontSize="26rpx" maxlength="1" v-model="form.code4" :focus="focus.focus4" border="none" @change="codeChange4" @focus="codeFocus4" @keyup.delete.native="codeDelete4"></u--input>
			</view>
			<view class="input-box">
				<u--input class="input" fontSize="26rpx" maxlength="1" v-model="form.code5" :focus="focus.focus5" border="none" @change="codeChange5" @focus="codeFocus5" @keyup.delete.native="codeDelete5"></u--input>
			</view>
			<view class="input-box">
				<u--input class="input" fontSize="26rpx" maxlength="1" v-model="form.code6" :focus="focus.focus6" border="none" @change="codeChange6" @focus="codeFocus6" @keyup.delete.native="codeDelete6"></u--input>
			</view>
		</view>

		<view style="text-align: center; font-size: 28rpx; margin-top: 22rpx;">
			<text style="color: rgba(225, 53, 27, 1);">{{timer}}</text>
			<text style="color: rgba(225, 53, 27, 1);" @click="sendVCode()">{{content}}</text>
		</view>

		<view :class="!nextFlag?'next-button-false':'next-button-true'" @click="goNext()">
			下一步
		</view>

	</view>
</template>

<script>
	import { mapGetters, createNamespacedHelpers } from 'vuex'
	import {validCode,sendVCode} from '@/api/login'
	import {getLocalStorageInfo} from '@/utils/localStorageInfo'
	const { mapState, mapActions, mapMutations } = createNamespacedHelpers('user')

	export default {
		name: 'inputCode',
		computed: {
			...mapGetters([
				'userInfo'
			]),
			...mapState([
				'timer',
				'timerShow',
				'loading'
			])
		},
		data() {
			return {
				oldPhone:'',
				code:'',
				form: {
					code1: '',
					code2: '',
					code3: '',
					code4: '',
					code5: '',
					code6: ''
				},
				focus: {
					focus1: true,
					focus2: false,
					focus3: false,
					focus4: false,
					focus5: false,
					focus6: false
				},
				nextFlag: false,
				content:'后重发验证码',
				// timerShow:false,
				// timer: 60,
				timeList: [],
				calTime: 0,
			}
		},
		onLoad(option){
			this.oldPhone = option.phone
		},
		onReady() {
		        this.setTimerShow(false);
		        this.setTimer(60);
		    },
		created(){
			this.id = this.userInfo.id.toString()
			this.sendVCode()
			this.startTimer()
		},
		watch: {
			'form': {
				handler(newValue, oldValue) {
					if (this.form.code1.length == 1 && this.form.code2.length == 1 && this.form.code3.length == 1 && this.form.code4.length == 1 && this.form.code5.length == 1 && this.form.code6.length == 1 ) {
						this.nextFlag = true
					} else {
						this.nextFlag = false
					}
				},
				deep: true
			},
		},
		methods: {
			...mapMutations(['setTimer', 'setTimerShow', 'setLoading']),
			sendVCode(){
				let data = {
					phone: this.oldPhone,
				}
				sendVCode({partyMember: data}).then(res => {
					if (res.code == '00000') {
						uni.showToast({
						  icon: 'none',
						  title: "发送成功",
						  duration: 2000
						})
						//重新计时
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
				//   this.timerShow = true
				//   this.timer = 60 // 重置计时器为60秒
				//   const countdown = setInterval(() => {
				// 	this.timer -= 1;
				// 	if (this.timer <= 0) {
				// 	  clearInterval(countdown)
				// 	  this.timerShow = false
				// 	  this.content = '重新获取'
				// 	}
				//   }, 1000);
				this.setTimerShow(true);
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
			goNext() {
				if (this.form.code1.length == 1 && this.form.code2.length == 1 && this.form.code3.length == 1  && this.form.code4.length == 1  && this.form.code5.length == 1  && this.form.code6.length == 1 ) {
					this.code = this.form.code1 + this.form.code2 + this.form.code3 + this.form.code4 + this.form.code5 + this.form.code6 + ''
					let data = {
						phone: this.oldPhone,
						code:this.code
					}
					validCode(data).then(res=>{
						if(res.code == '00000'){
							uni.navigateTo({
							  url: './newPhone'
							});
						}else{
						uni.showToast({
						  icon: 'none',
						  title: '验证码错误',
						  duration: 2000
						})
					}
				})

				}else{
					uni.showToast({
					  icon: 'none',
					  title: "验证码不能为空",
					  duration: 2000
					})
				}
			},
			codeChange1(e) {
				if (e.length == 1) {
					this.focus.focus1 = false
					this.focus.focus2 = true
					this.calTime = this.form.code1;
				}
			},
			codeChange2(e) {
				if (e.length == 1) {
					this.focus.focus2 = false
					this.focus.focus3 = true
					this.calTime = this.form.code2;
				}
			},
			codeChange3(e) {
				if (e.length == 1) {
					this.focus.focus3 = false
					this.focus.focus4 = true
					this.calTime = this.form.code3;
				}
			},
			codeChange4(e) {
				if (e.length == 1) {
					this.focus.focus4 = false
					this.focus.focus5 = true
					this.calTime = this.form.code4;
				}
			},
			codeChange5(e) {
				if (e.length == 1) {
					this.focus.focus5 = false
					this.focus.focus6 = true
					this.calTime = this.form.code5;
				}
			},
			codeChange6(e) {
				if (e.length == 1) {
					this.calTime = this.form.code6;
				}
			},
			codeFocus1() {
				this.focus.focus1 = true
				this.focus.focus2 = false
				this.timeList = [];
				this.pushTimeList(this.form.code1);
			},
			codeFocus2() {
				this.focus.focus1 = false
				this.focus.focus2 = true
				this.focus.focus3 = false
				this.timeList = [];
				this.pushTimeList(this.form.code2);
			},
			codeFocus3() {
				this.focus.focus2 = false
				this.focus.focus3 = true
				this.focus.focus4 = false
				this.timeList = [];
				this.pushTimeList(this.form.code3);
			},
			codeFocus4() {
				this.focus.focus3 = false
				this.focus.focus4 = true
				this.focus.focus5 = false
				this.timeList = [];
				this.pushTimeList(this.form.code4);
			},
			codeFocus5() {
				this.focus.focus4 = false
				this.focus.focus5 = true
				this.focus.focus6 = false
				this.timeList = [];
				this.pushTimeList(this.form.code5);
			},
			codeFocus6() {
				this.focus.focus5 = false
				this.focus.focus6 = true
				this.timeList = [];
				this.pushTimeList(this.form.code6);
			},
			pushTimeList(num) {
				// 如果聚焦，
				if (this.timeList.length < 2) {
					this.timeList.push(new Date().getTime())
				} else {
					this.timeList = [];
				}
			},
			calTimeList(num) {
				return new Promise((resolve, reject) => {
					if(num && this.calTime != num) {
						this.calTime = num;
						this.timeList = this.timeList.splice(this.timeList.length - 1, 1);
						resolve(false);
						return
					}
					if (this.timeList.length < 2) {
						this.timeList.push(new Date().getTime())
						resolve(false);
					} else {
						this.timeList = [];
						resolve(true);
					}
				})
			},
			async codeDelete2(e) {
				const result = await this.calTimeList(this.form.code2);
				if(!this.form.code2 && result) {
					this.focus.focus1 = true
					this.focus.focus2 = false
				}
			},
			async codeDelete3(e) {
				const result = await this.calTimeList(this.form.code3);
				if(!this.form.code3 && result) {
					this.focus.focus2 = true
					this.focus.focus3 = false
				}
			},
			async codeDelete4(e) {
				const result = await this.calTimeList(this.form.code4);
				if(!this.form.code4 && result) {
					this.focus.focus3 = true
					this.focus.focus4 = false
				}
			},
			async codeDelete5(e) {
				const result = await this.calTimeList(this.form.code5);
				if(!this.form.code5 && result) {
					this.focus.focus4 = true
					this.focus.focus5 = false
				}
			},
			async codeDelete6(e) {
				const result = await this.calTimeList(this.form.code6);
				if(!this.form.code6 && result) {
					this.focus.focus5 = true
					this.focus.focus6 = false
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

	.content {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		font-weight: bold;

		.input-box {
			width: 88rpx;
			height: 88rpx;
			border-radius: 10rpx;
			background: rgba(229, 229, 229, 1);
			margin: 0 20rpx;
			.input {
				padding-left: 10rpx !important;
				height: 88rpx;
				width: 44rpx;
				margin-left: 22rpx;
			}
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
