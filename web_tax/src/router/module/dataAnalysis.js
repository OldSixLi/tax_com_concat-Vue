/*
 * 数据分析模块路由注册
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年8月31日15:07:07
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月7日14:42:31
 */
/* jshint esversion: 6 */
"use strict"

import Empty from "@/page/Empty.vue";

export default [{
    path: "/data",
    name: "数据统计",
    redirect: "noredirect",
    component: Empty,
    meta: {
      title: "数据统计",
      icon: "el-icon-edit",
      funPoint: "data"
    },
    children: [
      // {
      //     path: "/data/TODO",
      //     name: "功能建设中",
      //     component: () => import("@/page/data/checkedList.vue"),
      //     meta: {
      //       title: "分局列表",
      //       funPoint: "data-checked"
      //     },
      // }
    ]
  }

]
