/*
 * 数据分析模块路由注册
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日15:07:07
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月7日14:42:31
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/empty.vue";

export default [{
    path: "/message",
    name: "消息通知",
    redirect: "noredirect",
    component: Empty,
    meta: {
      title: "消息通知",
      icon: "el-icon-edit",
      funPoint: "message"
    },
    children: [{
        path: "/message/detail/:id",
        name: "消息详情",
        component: () => import("@/page/message/detail.vue"),
        meta: {
          title: "消息详情",
          funPoint: "message-detail"
        },
      },
      {
        path: "/message/list",
        name: "消息列表",
        component: () => import("@/page/message/list.vue"),
        meta: {
          title: "消息列表",
          funPoint: "message-list"
        },
      }
    ]
  }

]
