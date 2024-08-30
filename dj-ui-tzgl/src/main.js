import "./public-path";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { createRouter, createWebHashHistory } from "vue-router";
import store from "./store";
import echarts from '@/utils/echarts'

import '@/permission'

// 导入qiankun.js
import { registerMicroApps, start } from "qiankun";
import {action} from './actions';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/icon.css'
import i18n from './i18n/i18n'
import VueCookie from 'vue-cookie'
import { RegionSelects } from 'v-region'

//视频插件
import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video

Vue.use(VueCookie)
Vue.prototype.$echarts = echarts


import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

// Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(ElementUI)
Vue.use(router)

Vue.component('v-region-selects', RegionSelects)

let instance = null;
function render(props = {}) {
  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount("#app")
}
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log("vue");
  window.localStorage.setItem("bsin-microAppMount", "3");
}

export async function mount(props) {
  action.setGlobalState({ appId: props.appId });
  props.setGlobalState({ appId: props.appId });
  let appInfo = {
    appId: props.appId,
    appCode: props.name
  }
  await store.dispatch('setAppInfo', appInfo)
  render(props)
}

export async function unmount() {
  console.log("unvue");
  window.localStorage.setItem("bsin-microAppMount", "2");

  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
}

// 注册子应用;
registerMicroApps([
  {
    name: "bsin-ui-upms", // 子应用名称
    entry: "http://127.0.0.1:8003", // 子应用入口
    container: "#react", // 子应用所在容器
    activeRule: "#/tzgl/bsin-ui-upms", // 子应用触发规则（路径）
    props: { action }
  },
]);

// 开启服务,配置项见官方文档
start();
