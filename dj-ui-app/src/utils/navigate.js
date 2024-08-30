
// 页面跳转事件

export const handlerNavigate = (obj) => {
  uni.navigateTo(obj)
}

export const handlerTab = (obj) => {
  uni.switchTab(obj)
}
