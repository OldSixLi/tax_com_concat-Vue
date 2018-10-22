/*
 * 个人权限设置Vuex模块
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月3日16:55:28
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月3日16:55:28
 */
/* jshint esversion: 6 */
"use strict"

import {
  allMenu
} from '@/router/index';

let b = {
  userid: 1,
  userinfo: {},
  role: ["", ""],
  authList: [{
    auth: "company",
    level: 1
  }, {
    auth: "company-checking",
    level: 2
  }]
}

let userAuth = [
  "admin",
  // "system",
  // "system-user",
  // "system-userinfo",
  // "system-role",
  // "company",
  // "company-checking",
  // "company-checked",
  // "agency",
  // "agency-checking",
  // "agency-checked",
  'question',
  'question-list',
  'message',
  'message-list'
];
/**
 * 通过meta.point判断是否与当前用户权限匹配
 * @param roles 用户权限集合
 * @param route 路由
 */
function hasPermission(roles, route) {
  if (roles.indexOf('admin') > -1) {
    return true;
  }
  
  if (route.meta && route.meta.funPoint) {
    return roles.some(role => route.meta.funPoint == role)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routerList
 * @param roles
 */
function filterAsyncRouter(routerList, roles) {
    const accessedRouters = routerList.filter(route => {
      if (hasPermission(roles, route)) {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, roles);
        }
        return true;
      }
      return false;
    })
    return accessedRouters;

}

const menu = {
  state: {
    routers: filterAsyncRouter(allMenu, userAuth)
  },
  mutations: {
    UPDATE_ROUTERS: (state, userRoles) => {
      state.routers = filterAsyncRouter(allMenu, userRoles);
    }
  },
  actions: {
    getAppMenu({
      commit
    }, data) {
      return new Promise(resolve => {
        const {
          roles
        } = data;
        commit('UPDATE_ROUTERS', roles);
        resolve();
      })
    }
  }
}

export default menu
