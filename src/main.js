import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/base.scss';
import '@/assets/css/table.scss';
import '@/protocalConfig';
import axios from "axios";
import {getBaseURL} from "@/protocalConfig";

Vue.use(ElementUI);

getBaseURL().then(() => {

  Vue.prototype.$http = axios;

  Vue.config.productionTip = false;

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
    // console.log(request.data.params)
    return request;
  });

  axios.interceptors.response.use(response => {
    // console.log('收到了响应：');
    // console.log(response.data);
    return response.data;
  })

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});

