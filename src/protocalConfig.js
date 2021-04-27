// axios.defaults.baseURL = 'http://124.71.169.242:6060';
// axios.defaults.baseURL = 'http://121.37.181.1:6060';
// axios.defaults.baseURL = 'http://192.168.1.118:6060';

import SocketIO from "socket.io-client"
import VueSocketIO from 'vue-socket.io'
import axios from "axios";
import Vue from 'vue';

// let socketURL = 'http://121.37.181.1:29090';
//
// // 配置webSocket
// let socket = new VueSocketIO({
//   debug: true,
//   connection: SocketIO(socketURL),
//   vuex: {   // 不需要用到vuex这个可以不加
//     store,
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   }
// })
// Vue.use(socket);

function getBaseURL() {
  return new Promise((resolve, reject) => {
    // 配置axios
    if (process.env.NODE_ENV === 'production') {
      axios.get('./webConfig.json').then(({ data } ) => {
        // 基础地址
        console.log(data);
        axios.defaults.baseURL = data.baseURL;
        axios.defaults.timeout = data.timeout;
        // socketURL = data.socketURL;

        resolve();
      }).catch(err => {
        axios.defaults.baseURL = 'http://localhost:8080';
        reject();
      })
    } else {
      axios.defaults.baseURL = 'http://121.37.181.1:6060';
      resolve()
    }
  })
}

export { getBaseURL }



