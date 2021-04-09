import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import '@/assets/css/base.scss';
import '@/assets/css/table.scss';
import axios from 'axios'

// axios.defaults.baseURL = 'http://124.71.169.242:6060';
axios.defaults.baseURL = 'http://121.37.181.1:6060';
// axios.defaults.baseURL = 'http://192.168.1.118:6060';

axios.interceptors.request.use(request => {
  let data = {
    id: 1,
    version: '',
    method: request.url.split('/').join('.').replace('.', ''),
    token: '',
    params: request.data,
  }
  request.url = '';
  request.data = data;
  // console.log('发送请求')
  // console.log(request.data)
  return request;
});

axios.interceptors.response.use(response => {
  // console.log('收到了响应：');
  // console.log(response.data);
  return response.data;
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
