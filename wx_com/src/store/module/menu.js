/*
 * 个人权限设置Vuex模块
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月3日16:55:28
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月3日16:55:28
 */
/* jshint esversion: 6 */
"use strict"

import { baseRights } from '@/_config/index';
import { allMenu } from '@/router/index';

//用户的基本权限
let baseUserRights = [...baseRights];

const menu = {
  state: {
    //用户可访问路由
    routers: filterAsyncRouter(allMenu, baseUserRights), 
    //用户角色
    roles: [] 
  },
  mutations: {
    /**
     * 修改用户所拥有的角色 
     * @returns 
     */
    changeRole(state, arr) {
      state.roles = arr;
    },
    /**
     * 修改routers 
     * @returns 
     */
    UPDATE_ROUTERS: (state, userRights) => {
      state.routers = filterAsyncRouter(allMenu, userRights);
    }
  },
  actions: {
    getAppMenu({ commit }, rights) {
      return new Promise(resolve => {
        commit('UPDATE_ROUTERS', [...new Set([...baseUserRights, ...rights])]);
        resolve();
      })
    }
  }
}

/**
 * 通过meta.point判断是否与当前用户权限匹配
 * @param roles 用户权限集合
 * @param route 路由
 */
function hasPermission(roles, route) {
  if (menu) { 
    if (menu.state.roles.some(x => x.roleName == "sys")) {
      return true;// 管理员用户处理逻辑
    }
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

export default menu;
