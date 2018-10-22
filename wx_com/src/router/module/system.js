/*
 * 系统管理模块路由注册
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日15:07:07
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月7日14:34:57
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/empty.vue";
export default [{
  path: "/system",
  component: Empty,
  name: "系统管理",
  redirect: "",
  meta: {
    title: "系统管理",
    icon: "el-icon-setting",
    funPoint: "system",
    requireAuth: true
  },
  children: [{
    path: "/system/role",
    name: "用户列表",
    component: () => import("@/page/system/role.vue"),
    meta: {
      title: "用户列表",
      funPoint: "system-role"
    },
  },
  {
    path: "/system/user",
    name: "用户列表",
    component: () =>
      import("@/page/system/user.vue"),
    meta: {
      title: "用户列表",
      funPoint: "system-user"
    },children:[
      {
        path:"/system/user/depart/:departId",
        component: () =>import("@/page/system/depart.vue"),
      },{
        path:"",
        component: () =>import("@/page/system/depart.vue"),
      }
    ]
  },
  {
    path: "/system/depart",
    name: "部门选择",
    component: () =>
      import("@/page/system/depart.vue"),
    meta: {
      title: "部门选择",
      funPoint: "system-depart"
    },
  }]
}]
