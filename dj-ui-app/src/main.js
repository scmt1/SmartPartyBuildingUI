import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
import uView from 'uview-ui'
// import '@/styles/global.scss'

import { formatImageUrl } from '@/utils/formatImageUrl'
import { handlerNavigate } from '@/utils/navigate'
import { formatTime } from '@/utils/moment'
import * as Loading from '@/utils/loading.js'
Vue.use(Loading)
Vue.config.productionTip = false
Vue.use(uView)
Vue.prototype.$formatImageUrl = formatImageUrl
Vue.prototype.$handlerNavigate = handlerNavigate
Vue.prototype.$formatTime = formatTime

// import '@/mock
import store from '@/store'

import VConsole from 'vconsole';

// 在需要使用vconsole的页面或组件中实例化vconsole
new VConsole();
App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()

// 更改默认单位为 rpx
uni.$u.config.unit = 'rpx'
