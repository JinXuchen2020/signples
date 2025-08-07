import { createI18n } from '@/uni_modules/lime-i18n'
import zhCN from "./lang/zh"
import en from './lang/en'
import kr from "./lang/kr"
import jp from "./lang/jp"
// import { getStorageSync, setStorageSync } from '@/uni_modules/uni-storage'

// 定义支持的语言类型
export type LangType = 'zh-CN' | 'en' | 'kr' | 'jp'

// 从本地存储获取语言设置，
const defl = uni.getStorageSync('language') as string

let defaultLang =  'zh-CN'
if(defl != ''){
	defaultLang = defl
}

const tabBars = new UTSJSONObject({
	'en': ['HOME','USER CENTER'],
	'zh-CN': ["首页", "我的"],
	'kr': ['홈','내 정보'],
	'jp': ['ホーム','マイページ'],
});
// 创建i18n实例
const i18n = createI18n({
	legacy: false, // 使用Vue 3的Composition API
	globalInjection: true, // 全局注入$t方法
	locale: defaultLang,
	fallbackLocale: 'zh-CN',
	messages: {
		'zh-CN': zhCN,
		'en': en,
		"kr": kr,
		"jp":jp
	},
	tabBars: tabBars
})

// 切换语言的方法
export const changeLanguage = (lang: string) => {
  i18n.global.locale.value = lang
  uni.setStorageSync('language', lang)
  
  uni.showToast({
  	icon: 'none',
  	title: '已设置语言',
  	duration: 3000,
  	success: () => { 
  	}
  })
}

export default i18n
