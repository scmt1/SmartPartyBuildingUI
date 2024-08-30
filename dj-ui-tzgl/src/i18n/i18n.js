import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './langs/en'
import zhCnLocale from './langs/zhCn'
import enElementLocale from 'element-ui/lib/locale/lang/en'
import zhCnElementLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'zh_CN',
  messages: {
    en: {
      ...enLocale,
      ...enElementLocale
    },
    zh_CN: {
      ...zhCnLocale,
      ...zhCnElementLocale
    }
  }
})

export default i18n
