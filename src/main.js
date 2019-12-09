// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import moment from 'moment'
import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
import { Pagination, Icon } from 'ant-design-vue'
import iconFront from './assets/iconfont/iconfont.js'
const usericon = Icon.createFromIconfontCN({
  scriptUrl: iconFront
})
Vue.config.productionTip = false
Vue.component('user-icon', usericon)
// mount axios Vue.$http and this.$http
Vue.filter('dateFmt', (input, formatString = 'YYYY-MM-DD') => {
  // es5函数参数设置默认值
  // const lastFormatString = formatString || ''

  // moment(input) 把时间字符串转成时间对象
  // format(formatString) 把时间对象，按照指定格式，格式化成符合条件的字符串
  return moment(input).format(formatString)
})
Vue.use(VueAxios)
Vue.use(Pagination)
new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
