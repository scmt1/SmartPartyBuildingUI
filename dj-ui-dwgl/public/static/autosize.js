!(function(win, doc){
  function setFontSize() {
    // 获取window 宽度
    // zepto实现 $(window).width()就是这么干的
    var winWidth =  window.innerWidth;
    doc.documentElement.style.fontSize = (winWidth / 1920) * 100 + 'px'
    //设置页面元素根元素的px大小，然后所有rem以此为基准。
  }
  var evt = 'onorientationchange' in win ? 'orientationchange' : 'resize'
  var timer = null
  win.addEventListener(evt, function () {
    clearTimeout(timer)
    timer = setTimeout(setFontSize, 300);
  }, false)

  win.addEventListener("pageshow", function(e) {
    if (e.persisted) {
    clearTimeout(timer);
    timer = setTimeout(setFontSize, 300);
    }
  }, false)

  //初始化
  setFontSize()

}(window, document))
