import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入进度条
import NProgress from 'nprogress'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
axios.defaults.headers.post['Content-Type'] = 'application/x-www-from-urlencoded'
Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:3000/'
Vue.prototype.$http = axios

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function(val) {
  const dt = new Date(val)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours + '').padStart(2, '0')
  const mm = (dt.getMinutes + '').padStart(2, '0')
  const ss = (dt.getSeconds + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.filter('ellipsis', function(value) {
  if (!value) return ''
  if (value.length > 30) {
    return value.slice(0, 30) + '...'
  }
  return value
})

// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor /* { default global options } */)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
