/*
 * 问题管理功能
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月25日13:46:02
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月25日13:46:02
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/Empty.vue";

export default [{
  path: "/message",
  component: Empty,
  name: "消息通知",
  redirect: "noredirect",
  meta: {
    title: "消息通知",
    icon: "el-icon-info",
    funPoint: "message",
    requireAuth: true
  },
  children: [{
    path: "/message/list",
    name: "消息列表",
    component: Empty,
    meta: {
      title: "消息列表",
      funPoint: "message-list"
    },
    children: [{
      path: "/",
    name: "消息列表",
    component: () =>
      import("@/page/message/list.vue"),
    meta: {
      // title: "消息列表",
      funPoint: "message-list"
    },
    },{
      path: "/message/list/:id/readlist",
      name: "回执列表",
      component: () => import("@/page/message/readList.vue"),
      meta: {
        title: "回执列表",
        funPoint: "message-readlist"
      }
    }]
  }]
}, ]