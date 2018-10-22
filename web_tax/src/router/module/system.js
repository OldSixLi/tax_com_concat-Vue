/*
 * 系统管理模块路由注册
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日15:07:07
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月7日14:34:57
 */
/* jshint esversion: 6 */
"use strict"
import Empty from "@/page/Empty.vue";

export default [{
  path: "/system",
  component: Empty,
  name: "系统管理",
  redirect: "noredirect",
  meta: {
    title: "系统管理",
    icon: "el-icon-setting",
    funPoint: "system",
    requireAuth: true
  },
  children: [{
    path: "/system/userlist",
    name: "用户列表",
    component: () =>
      import("@/page/system/userlist.vue"),
    meta: {
      title: "用户列表",
      funPoint: "system-user"
    },
  }, {
    path: "/system/userinfo",
    name: "个人信息",
    component: () =>
      import("@/page/system/userinfo.vue"),
    meta: {
      title: "个人信息",
      funPoint: "system-userinfo"
    }
  }, {
    path: "/system/role",
    name: "角色管理",
    component: () =>
      import("@/page/system/role.vue"),
    meta: {
      title: "角色管理",
      funPoint: "system-role"
    }
  }]
}, ]
