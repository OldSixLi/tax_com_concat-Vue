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
  path: "/question",
  component: Empty,
  name: "问答管理",
  redirect: "noredirect",
  meta: {
    title: "问答管理",
    icon: "el-icon-question",
    funPoint: "question",
    requireAuth: true
  },
  children: [{
    path: "/question/list",
    name: "问题列表",
    component: () => import("@/page/question/list.vue"),
    meta: {
      title: "问题列表",
      funPoint: "question-list"
    },
  }]
}, ]