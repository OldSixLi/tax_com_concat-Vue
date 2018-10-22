/*
 * 企业信息管理模块路由注册
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日15:07:07
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月7日14:42:31
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/empty.vue";

export default [{
    path: "/ask",
    name: "问答功能",
    component: Empty,
    redirect: "noredirect",
    meta: {
      title: "问答功能",
      icon: "el-icon-document",
      funPoint: "ask"
    },
    children: [{
        path: "/ask/add",
        name: "添加问题",
        component: () => import("@/page/ask/add.vue"),
        meta: {
          title: "添加问题",
          funPoint: "ask-add"
        },
      },
      {
        path: "/ask/list",
        name: "问题列表",
        component: () => import("@/page/ask/list.vue"),
        meta: {
          title: "问题列表",
          funPoint: "ask-list"
        }
      },
      {
        path: "/ask/detail/:id",
        name: "问题详情",
        component: () => import("@/page/ask/detail.vue"),
        meta: {
          title: "问题详情",
          funPoint: "ask-detail"
        }
      }
    ]
  }
]
