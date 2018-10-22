// import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index.js';

import '@/router/config';
import '@/global'; //element组件注册部分
import '@/util/ajax.js';
import '@/util/common.js';

Vue.config.productionTip = false;

Vue.use('element-ui');

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
);

Vue.directive('areafocus', function (el, option) {
  el.querySelector('textarea').focus()
});