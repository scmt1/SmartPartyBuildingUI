<template>
  <view v-loading="loading">
    <view class="header-box">
			<image mode="widthFix" src="@/static/images/user/bg-img.png" ></image>

			<view class="avatar-box">
				<view class="avatar-img">
					<image v-if="userInfo.avatar == null || userInfo.avatar.length == 0" mode="aspectFill" src="@/static/images/user/default-avatar.png"></image>
					<image else mode="aspectFill" :src="base + userInfo.avatar"></image>
				</view>
				<view class="right-text" v-if="!login" @click="$handlerNavigate({ url: '/pages/User/login' })">
					未登录
				</view>
				<view class="right-text" v-if="login">
					<view class="user-name">{{ userInfo.realName }}</view>
					<view class="dept-text">{{ userInfo.deptName }}</view>
				</view>
			</view>

		</view>

		<!-- <view class="personal-box" v-if="login" @click="$handlerNavigate({ url: '/pages/Credit/Details' })">

			<view class="credit-box">
				<view class="image"><image mode="heightFix" src="@/static/images/user/credit-star.png"></image></view>
				<view class="number">1189</view>
				<view class="name">个人学分</view>
			</view>

			<view class="points-ranking-box">
				<view class="image"><image mode="heightFix" src="@/static/images/user/points-ranking-star.png"></image></view>
				<view class="number">124</view>
				<view class="name">学习强国积分排名</view>
			</view>

			<view class="credit-ranking-box">
				<view class="image"><image mode="heightFix" src="@/static/images/user/credit-ranking-star.png"></image></view>
				<view class="number">23</view>
				<view class="name">学习排名</view>
			</view>

		</view> -->

		<!-- <view class="cut-off" v-if="login"></view> -->

<!--		<view class="study">-->
<!--			<view class="text">学习强国积分排名</view>-->
<!--			<view class="button" @click="$handlerNavigate({ url: '/pages/User/xxqg' })">-->
<!--				立即查看-->
<!--				<u-icon color="rgba(225, 53, 27, 1)" size="18rpx" name="arrow-right"></u-icon>-->
<!--			</view>-->
<!--		</view>-->

		<view class="user-nav" >

			<view class="nav-item" :style="login?'margin-top: 25rpx;':''" @click="$handlerNavigate({ url: '/pages/User/personalData' })">
				<view class="icon-box">
					<image class="nav-icon" mode="aspectFit" src="@/static/images/user/data.png"></image>
				</view>
				<view class="nav-text">
					个人资料管理
				</view>
				<view class="nav-point">
					<u-icon class="point" size="26rpx" name="arrow-right"></u-icon>
				</view>
			</view>

			<view class="nav-item" @click="$handlerNavigate({ url: '/pages/User/Honor/index' })">
				<view class="icon-box">
					<image class="nav-icon2" mode="aspectFit" src="@/static/images/user/honor.png"></image>
				</view>
				<view class="nav-text">
					个人荣誉管理
				</view>
				<view class="nav-point">
					<u-icon class="point" size="26rpx" name="arrow-right"></u-icon>
				</view>
			</view>

			<view class="nav-item" v-if="login" @click="pickerShow = true">
				<view class="icon-box">
					<image class="nav-icon3" mode="aspectFit" src="@/static/images/user/logout.png"></image>
				</view>
				<view class="nav-text">
					退出登录
				</view>
				<view class="nav-point">
					<u-icon class="point" size="26rpx" name="arrow-right"></u-icon>
				</view>
			</view>

		</view>

		<confirmPicker :show="pickerShow" :title="'确定要退出登录吗？'" @close="pickerShow = false" @confirm="logout()"></confirmPicker>

  </view>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from 'vuex'
import util from '@/utils/util'
import confirmPicker from '@/components/confirmPicker/index'
import {removeLocalStorageInfo} from '@/utils/localStorageInfo'
import setting from "@/utils/setting";
const config = require('@/utils/config.js')
const { mapState, mapMutations } = createNamespacedHelpers('user')

export default {
  name: 'User',
	components: {
		confirmPicker
	},
  data() {
    return {
			base: util.jcxfUrl,
      login: true,
			pickerShow: false
    }
  },
	created() {
		/*try {
			xm.setNavigationBarTitle({title: "我的"});
		} catch (error) {
			document.title = "我的";
		}*/
	},
	computed: {
		...mapGetters([
			'userInfo'
		]),
		...mapState([
			'loading'
		])
	},
	onReady() {
		this.setLoading(false);
	},
	onLoad(){
		this.setLoading(true);
	},
  methods: {
		...mapMutations(['setLoading']),
		logout() {
			removeLocalStorageInfo('userInfo')
			removeLocalStorageInfo('token')
			this.$store.dispatch('user/setUserInfo', {})
            if(setting.loginType() === "JECT-LOGIN"){
                lightAppJssdk.navigation.close ({
                    success:function(data){//成功回调
                    },
                    fail:function(data){//错误返回
                    }
                })
            }else{
                window.location.href = config.domainAddress + "/#/pages/Home/Home";
                // uni.navigateTo({
                //     url: "/pages/Home/Home"
                // })
            }
		}
  }
}
</script>

<style lang="scss" scoped>
	.header-box {
		position: relative;

		.avatar-box {
			display: flex;
			align-items: center;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			padding-left: 37rpx;

			.avatar-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;
			}

			.right-text {
				flex: 1;
				padding-right: 30rpx;
				padding-left: 30rpx;
				font-size: 50rpx;
				color: white;

				.user-name {
					font-size: 34rpx;
					font-weight: 700;
				}

				.dept-text {
					font-size: 28rpx;
					font-weight: 700;
				}
			}
		}
	}



	.personal-box {
		display: flex;
		padding: 0 25rpx;
		margin-top: 20rpx;

		.credit-box {
			padding: 25rpx;
			width: calc(32% - 6rpx);
			background-size: 100% 100%;
			text-align: center;
			background-image: url('@/static/images/user/credit-bg-img.png');

			.image {
				display: inline-block;
				height: 88rpx;
			}

			.number {
				font-size: 32rpx;
				font-weight: 900;
				color: rgba(240, 105, 14, 1);
			}

			.name {
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(235, 132, 62, 1);
			}
		}

		.points-ranking-box {
			margin-left: calc(2% + 9rpx);
			padding: 25rpx;
			width: calc(32% - 6rpx);
			background-size: 100% 100%;
			text-align: center;
			background-image: url('@/static/images/user/points-ranking-bg-img.png');
			.image {
				display: inline-block;
				height: 88rpx;
			}

			.number {
				font-size: 32rpx;
				font-weight: 900;
				color: rgba(215, 53, 48, 1);
			}

			.name {
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(215, 53, 48, 1);
			}
		}

		.credit-ranking-box {
			margin-left: calc(2% + 9rpx);
			padding: 25rpx;
			width: calc(32% - 6rpx);
			background-size: 100% 100%;
			text-align: center;
			background-image: url('@/static/images/user/credit-ranking-bg-img.png');
			.image {
				display: inline-block;
				height: 88rpx;
			}

			.number {
				font-size: 32rpx;
				font-weight: 900;
				color: rgba(238, 49, 46, 1);
			}

			.name {
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(238, 49, 46, 1);
			}
		}
	}

	.cut-off {
		margin-top: 40rpx;
		background: rgba(247, 247, 247, 1);
		height: 20rpx;
	}

	.study {
		background-image: url('@/static/images/user/qianguo-bg.png');
		background-size: 100% 100%;
		width: calc(100% - 50rpx);
		margin-left: 25rpx;
		height: 120rpx;
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
		display: flex;
		align-items: center;
		position: relative;
		margin-top: -40rpx;
		margin-bottom: 25rpx;

		.text {
			color: white;
			font-size: 28rpx;
			font-weight: 500;
			margin: auto;
		}

		.button {
			margin: auto;
			background: white;
			width: 174rpx;
			height: 47rpx;
			line-height: 47rpx;
			border-radius: 30rpx;
			color: rgba(225, 53, 27, 1);
			font-size: 26rpx;
			font-weight: 500;
			text-align: center;
			display: flex;
			justify-content: center;
		}
	}

	.user-nav {
		display: flex;
		flex-direction: column;
		padding: 0 25rpx 25rpx 25rpx;

		.nav-item {
			display: flex;
			margin-top: 60rpx;

			.icon-box {
				width: 46rpx;

				.nav-icon {
					width: 44rpx;
					margin: auto;
				}

				.nav-icon2 {
					width: 46rpx;
					margin: auto;
				}

				.nav-icon3 {
					width: 30rpx;
					margin: auto;
				}
			}


			.nav-text {
				font-weight: 700;
				padding-left: 20rpx;
				font-size: 30rpx;
			}

			.nav-point {
				flex: 1;
				padding-top: 8rpx;
				.point {
					float: right;
				}
			}
		}
	}
</style>
