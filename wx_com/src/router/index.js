/*
 * 路由注册模块
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日13:49:38
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月30日09:18:07
 */
/* jshint esversion: 6 */
import Router from 'vue-router';
import Empty from '@/page/empty.vue';
import Lost from '@/page/404.vue';
import system from './module/system.js';
import ask from './module/ask.js';
import message from './module/message.js';
import question from './module/questionnaire.js';

Vue.use(Router);
/*
 █████╗ ███████╗██╗   ██╗███╗   ██╗ ██████╗
██╔══██╗██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝
███████║███████╗ ╚████╔╝ ██╔██╗ ██║██║
██╔══██║╚════██║  ╚██╔╝  ██║╚██╗██║██║
██║  ██║███████║   ██║   ██║ ╚████║╚██████╗
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝
*/
/**
 * 此处注册所有和权限相关的路由
 * @returns 
 */
export const allMenu = [
  // NOTE:路由的注册顺序会影响到菜单的展示顺序,所以要顺延添加路由注册文件
  ...system,
  ...ask,
  ...message,
  ...question
  // ... 在此处注册new router
];

/*
 █████╗ ██╗     ██╗
██╔══██╗██║     ██║
███████║██║     ██║
██╔══██║██║     ██║
██║  ██║███████╗███████╗
╚═╝  ╚═╝╚══════╝╚══════╝
*/
export default new Router({
  mode: "history",
  routes: [{
      path: '/',
      name: 'Index',
      component: Empty,
      children: [{
          path: '/',
          name: '主页',
          component: () => import('@/page/index.vue')
        }, {
          path: '/regist',
          name: '注册信息',
          component: () => import('@/page/regist.vue')
        }, {
          path: '/infoChecking/:state',
          name: '检查结果',
          component: () => import('@/page/infoCheck.vue')
        }, {
          path: '/auth',
          name: '授权登陆',
          component: () => import('@/page/auth.vue')
        }, {
          path: '/clear',
          name: '清除应用',
          component: () => import('@/page/clear.vue')
        }, {
          path: '/first',
          name: '获取信息',
          component: () => import('@/page/first.vue')
        },
        ...allMenu
      ]
    },
    {
      path: '/noauth', //没有权限
      name: '403',
      component: () => import('@/page/403.vue'),
    },
    {
      path: '*',
      name: '404',
      component: Lost,
    }
  ]
});
