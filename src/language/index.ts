import { createI18n } from 'vue-i18n'
import zhCn from './zh-ch.ts'
import en from './en.ts'
import zhTw from './zh-tw.ts'
import elementEn from 'element-plus/es/locale/lang/en'
import elementZhCn from 'element-plus/es/locale/lang/zh-cn'
import elementZhTw from 'element-plus/es/locale/lang/zh-tw'

const lang = 'cn'

const messages = {
  en: {
    ...en,
    ...elementEn
  },
  cn: {
    ...zhCn,
    ...elementZhCn
  },
  tw: {
    ...zhTw,
    ...elementZhTw
  }
}

const i18n = createI18n({
  legacy: false,
  locale: lang,
  globalInjection: true,
  fallbackLocale: 'cn',
  messages: messages,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  missingWarn: true
})

export default i18n
