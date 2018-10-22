/*
 * 问卷模块路由注册
 * @Author:路官睿 (2239635032@qq.com)
 * @Date: 2018年9月13日10:16:07
 * @Last Modified by: 路官睿
 * @Last Modified time:2018年9月13日10:16:07
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/empty.vue";

export default [{
  path: "/questionnaire",
  name: "问卷功能",
  component: Empty,
  redirect: "noredirect",
  meta: {
    title: "问卷功能",
    icon: "el-icon-document",
    funPoint: "question"
  },
  children: [{
      path: "/questionnaire/detail/:id",
      name: "问卷详情",
      component: () => import("@/page/questionnaire/detail.vue"),
      meta: {
        title: "问卷详情",
        funPoint: "question-detail"
      },
    },
    {
    path: "/questionnaire/quesinfo/:id",
    name: "问卷信息",
    component: () => import("@/page/questionnaire/quesInfo.vue"),
    meta: {
      title: "问卷信息",
      funPoint: "question-info"
    },
  }
  ]
}

]
