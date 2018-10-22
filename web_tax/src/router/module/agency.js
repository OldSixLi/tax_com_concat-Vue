/*
 * 分局信息管理模块路由注册
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日15:07:07
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月7日14:42:31
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/Empty.vue";

export default [{
    path: "/agency",
    name: "分局管理",
    component: Empty,
    redirect: "noredirect",
    meta: {
      icon: "el-icon-printer",
      funPoint: "agency",
      requireAuth: true
    },
    children: [{
        path: "/agency/checked",
        name: "分局列表",
        component: () =>
          import("@/page/agency/checkedList.vue"),
        meta: {
          funPoint: "agency-checked"
        },
      },
      {
        path: "/agency/checking",
        name: "分局审核",
        component: () =>
          import("@/page/agency/checkedList.vue"),
        meta: {
          funPoint: "agency-checking"
        }
      }
    ]
  }

]
