<script>
import routingIntercept from '@/utils/permission.js'
import {getPartyInfoByApp} from '@/api/partyMember'
import {setLocalStorageInfo, getLocalStorageInfo, removeLocalStorageInfo} from '@/utils/localStorageInfo'

export default {
  onLaunch: function() {
      uni.getSystemInfo({
          success: function(res) {
              // 客户端平台，值域为：ios、android
              if (res.platform == 'ios') {
                  uni.setStorageSync('iosUrl', window.location.href.split("#")[0])
              }
          }
      })
      // 判断浏览器环境
      var ua = navigator.userAgent.toLowerCase()
      if (ua.search(/MicroMessenger/i) > -1) {
          // 微信环境
          uni.setStorageSync('appType', "weixin")
      } else {
          uni.setStorageSync('appType', "other")
      }
		// 对路由进行统一拦截，实现路由导航守卫 router.beforeEach 功能
		routingIntercept()
  },
  onShow: function() {
		// 更新部分党员信息
		let userInfo = getLocalStorageInfo('userInfo')
		if (userInfo && userInfo != null && userInfo.id) {
			getPartyInfoByApp(userInfo.id).then(res => {
				if (res.code = '00000') {
					if (res.data == null) {
						removeLocalStorageInfo('userInfo')
						removeLocalStorageInfo('token')
						this.$store.dispatch('user/setUserInfo', {})
						uni.navigateTo({
							url: '/'
						})
					} else {
						setLocalStorageInfo('userInfo', res.data)
						this.$store.dispatch('user/setUserInfo', res.data)
					}
				}
			})
		}
  },
  // onHide: function() {
  // 	console.log('App Hide')
  // }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";

@font-face {
    font-family: "jtBlod";
    src: url('./static/fonts/PINGFANG BOLD.TTF');
}

@font-face {
    font-family: "jtMedium";
    src: url('./static/fonts/PINGFANG MEDIUM.TTF');
}

::v-deep .uni-input-placeholder {
	overflow: inherit;
}

::v-deep .u-toolbar__wrapper__cancel {
	font-size: 26rpx !important;
}

::v-deep .u-toolbar__wrapper__confirm {
	font-size: 26rpx !important;
}

::v-deep .u-picker__view__column__item {
	font-size: 26rpx !important;
}

::v-deep .u-form-item__body__right__message {
	font-size: 24rpx !important;
	line-height: 28rpx !important;
}
</style>
