/*
 * 路由注册模块
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日13:49:38
 * @Last Modified by: 马少博
 * @Last Modified time:2018年8月31日13:49:40
 */
/* jshint esversion: 6 */
import Router from 'vue-router';
import Index from '@/page/Index.vue';
import Login from '@/page/Login.vue';
import Hello from '@/components/HelloWorld';
import agency from './module/agency.js';
import company from './module/company.js';
import question from './module/question.js';
import message from './module/message.js';
import quan from './module/quan.js';

import system from './module/system.js';
import Lost from '@/page/404.vue';
Vue.use(Router);
/**
 * 此处注册所有菜单文件相关路由
 * @returns 
 */
export const allMenu = [
  // NOTE:路由的注册顺序会影响到菜单的展示顺序,所以要顺延添加路由注册文件
  // ...system,
  // ...company,
  // ...agency,
  ...question,
  ...message,
  ...quan
];

export default new Router({
  mode: "history",
  routes: [{
    path: '/',
    name: 'Index',
    component: Index,
    children: [{
      path: '/',
      name: '',
      component: Hello
    },
    ...allMenu
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }, {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/page/auth.vue'),
  },
  {
    path: '*',
    name: '404',
    component: Lost,
  }
  ]
});
