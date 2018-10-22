import VConsole from 'vconsole/dist/vconsole.min.js'
import App from './App.vue';
import router from './router';
import store from '@/store/index.js';

import '@/router/config';
import '@/global'; //element组件注册部分
import '@/util/ajax.js';
import '@/assets/css/index.css';
import './util/common.js';
import '@/util/filter/time.js';

Vue.config.productionTip = false;
let vConsole = new VConsole();
new Vue(
  //注册Vue实例
  {
    el: '#app',
    router,
    store,
    components: {
      App
    },
    template: '<App/>'
  }
)
