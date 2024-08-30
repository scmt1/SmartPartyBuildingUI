//JECT-LOGIN H5-LOGIN
export default {
    loginType(){
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            //当前为微信内置浏览器环境
            return "H5-LOGIN"
        } else if (ua.indexOf('hanweb') > -1) {
            return "JECT-LOGIN"
        } else {
            return "H5-LOGIN"
        }
    }
}
