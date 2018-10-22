/*
 * 问卷功能路由模块
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年10月8日14:00:22
 * @Last Modified by: 马少博
 * @Last Modified time:2018年10月8日14:00:22
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/Empty.vue";


export default [{
  path: "/quan",
  component: Empty,
  name: "问卷管理",
  redirect: "noredirect",
  meta: {
    title: "问卷管理",
    icon: "el-icon-tickets",
    funPoint: "quan",
    requireAuth: true
  },
  children: [{
    path: "/quan/list",
    name: "问卷列表",
    component: Empty,
    meta: {
      title: "问卷列表",
      funPoint: "quan-list"
    },
    children: [{
        path: "/",
        component: () =>
          import("@/page/quan/list.vue"),
        meta: {
          funPoint: "quan-list"
        }
      },
      {
        path: "/quan/list/detail",
        name: "问卷详情",
        component: () =>
          import("@/page/quan/detail.vue"),
        meta: {
          title: "问卷详情",
          funPoint: "quan-detail"
        },
      },
      {
        path: "/quan/list/add",
        // name: "新增问卷",
        component: () =>
          import("@/page/quan/add.vue"),
        meta: {
          title: "新增问卷",
          funPoint: "quan-add"
        },
      },
      {
        path: "/quan/list/ansList/:qnaId",
        // name: "调查结果",
        component: () =>
          import("@/page/quan/ansList.vue"),
        meta: {
          title: "调查结果",
          funPoint: "quan-add"
        },
      },
      {
        path: "/quan/list/ansDetail/:qnaId/:userId",
        // name: "调查结果",
        component: () =>
          import("@/page/quan/andDetail.vue"),
        meta: {
          title: "答案详情",
          funPoint: "quan-add"
        },
      }
    ]
  }]
}, ]