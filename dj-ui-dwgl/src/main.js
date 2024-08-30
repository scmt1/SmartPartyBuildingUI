import "./public-path";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { createRouter, createWebHashHistory } from "vue-router";
import store from "./store";
import echarts from '@/utils/echarts'

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

import {hidePhoneNumber,hideIdCardNumber} from '@/utils/tool'
Vue.prototype.hidePhoneNumber = hidePhoneNumber
Vue.prototype.hideIdCardNumber = hideIdCardNumber

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

// Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
const messages = ['success', 'warning', 'info', 'error'];
messages.forEach(type => {
  ElementUI.Message[type] = options => {
    if(typeof options === 'string') {
      options = {
        message: options
      }
      options.duration = 1500; // 默认值3000毫秒
    }
    options.type = type;
    return ElementUI.Message(options);
  }
})
Vue.use(ElementUI)
Vue.use(router)

Vue.component('v-region-selects', RegionSelects)

import '@/permission'
import {constant} from "lodash/util";
// 按钮权限 - 判断本部门是否最后一级且为支部
Vue.directive('permission-leaf', {
  inserted: function (el, binding) {
    const typeList = [631, 632, 931, 932]
    const deptInfo = store.getters.deptInfo
    if ((!deptInfo.isLeaf || typeList.indexOf(deptInfo.type) < 0) && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
})

// 按钮权限 - 判断选中部门是否支部
/*Vue.directive('permission-zb', {
  update: function (el, binding) {
    const typeList = [631, 632, 931, 932]
    const deptInfo = binding.value
    if (typeList.indexOf(deptInfo.type) < 0 && el) {
      el.style.display = 'none'
    } else {
      el.style.display = 'inline-block'
    }
  }
})*/

// 按钮权限 - 选中数据是否是最后一级且为支部
Vue.directive('permission-leaf-zb', {
  update: function (el, binding) {
    const typeList = [631, 632, 931, 932]
    const deptInfo = binding.value
    if ((!deptInfo.isLeaf || typeList.indexOf(deptInfo.type) < 0) && el) {
      el.style.pointerEvents = 'none'
      el.style.opacity = '0.5'
    } else {
      el.style.pointerEvents = 'auto'
      el.style.opacity = '1'
    }
  }
})

Vue.directive('permission-notZb', {
  update: function (el, binding) {
    const typeList = [631, 632, 931, 932]
    const deptInfo = binding.value
    if (deptInfo && deptInfo.type) {
      if (typeList.indexOf(deptInfo.type) > -1 && el) {
        el.style.pointerEvents = 'none'
        el.style.opacity = '0.5'
      } else {
        el.style.pointerEvents = 'auto'
        el.style.opacity = '1'
      }
    }
  }
})

// 按钮权限 - 两优一先审核
Vue.directive('permission-parent-and-role', {
  update: function (el, binding) {
    const value = binding.value || ['', '', '', '']

    const crateDeptId = value[0]
    const role = value[1]
    const status = value[2]
    const parentId = value[3]
    let flag = false
    let buttonRole = []

    const deptInfo = store.getters.deptInfo

    if(deptInfo.buttonRole) {
      buttonRole = deptInfo.buttonRole.split(',')
    }

    // 根据状态判断是否出现审核
    if (deptInfo.id == crateDeptId && status == '1') {
      flag = true
    } else if (parentId == deptInfo.id && status == '2' ) {
      flag = true
    } else if (buttonRole.indexOf(role) > -1 && status == '4') {
      flag = true
    }
    if (!flag && el.parentNode) {
      el.parentNode.removeChild(el)
    }

  }
})

// 按钮权限 - 该数据是否与本部门id相同
Vue.directive('permission-contrast', {
  inserted: function (el, binding) {
    const value = binding.value || ''
    const deptInfo = store.getters.deptInfo
    if (value != deptInfo.id && el.parentNode) {
      // 使用隐藏，避免table中仅刷新数据无法重现按钮的情况
      el.style.display = 'none'
      // el.parentNode.removeChild(el)
    } else {
      el.style.display = 'inline-block'
    }
  }
})

Vue.directive('permission-contrast-update', {
  update: function (el, binding) {
    const value = binding.value || ''
    const deptInfo = store.getters.deptInfo
    if (value != deptInfo.id && el.parentNode) {
      // 使用隐藏，避免table中仅刷新数据无法重现按钮的情况
      el.style.display = 'none'
    } else {
      el.style.display = 'inline-block'
    }
  }
})

// 按钮权限 - 该数据是否与本部门id相同或者本部门有相关权限
Vue.directive('permission-button-role-dept', {
  inserted: function (el, binding) {
    const value = binding.value || ['','']
    const valueButtonRole = value[0]
    const valueDeptId = value[1]

    const deptInfo = store.getters.deptInfo

    let roleFlag = true
    if(deptInfo.buttonRole) {
      const buttonRole = deptInfo.buttonRole.split(',')
      if (buttonRole.indexOf(valueButtonRole) < 0) {
        roleFlag = false
      }
    }

    const deptId = deptInfo.id
    let deptFlag = true
    if (deptId != valueDeptId) {
      deptFlag = false
    }

    if (!roleFlag && !deptFlag && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
})

// 按钮权限 - 本部门是否有相关权限范围
Vue.directive('permission-button-role', {
  inserted: function (el, binding) {
    const value = binding.value || ['']
    const valueButtonRole = value[0]

    const deptInfo = store.getters.deptInfo
    if(deptInfo.buttonRole){
      const buttonRole = deptInfo.buttonRole.split(',')
      if (buttonRole.indexOf(valueButtonRole) < 0 && el.parentNode) {
        //el.parentNode.removeChild(el)
        el.style.display = 'none'
      } else {
        el.style.display = 'inline-block'
      }
    } else {
      //el.parentNode.removeChild(el)
      el.style.display = 'none'
    }
  }
})


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
  window.localStorage.setItem("bsin-microAppMount", "3");
}

export async function mount(props) {
  action.setGlobalState({ appId: props.appId });
  props.setGlobalState({ appId: props.appId })
  let appInfo = {
    appId: props.appId,
    appCode: props.name
  }
  await store.dispatch('setAppInfo', appInfo)
  render(props)
}

export async function unmount() {
  window.localStorage.setItem("bsin-microAppMount", "2");

  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
}

// 注册子应用;
/*registerMicroApps([
  {
    name: "bsin-ui-upms", // 子应用名称
    entry: "http://10.82.44.34:8003", // 子应用入口
    container: "#react", // 子应用所在容器
    activeRule: "#/dwgl/bsin-ui-upms", // 子应用触发规则（路径）
    props: { action }
  },
]);*/

// 开启服务,配置项见官方文档
start();
