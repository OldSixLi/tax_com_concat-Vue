/*
 * 系统常用方法封装
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月11日10:12:04
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月11日10:12:04
 */
/* jshint esversion: 6 */
"use strict"

import { Toast, MessageBox } from 'mint-ui';
import router from '@/router';

/**
 * promise.finally实现 
 * @returns 
 */
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(function (value) {
      P.resolve(callback()).then(function () {
        return value;
      });
    },
    function (reson) {
      P.resolve(callback()).then(function () {
        throw reason;
      });
    });
};

/**
 * alert提示框信息 Promise格式
 *
 * @param {string} [str=""]
 * @returns
 */
const $alert = (str = "") => MessageBox.alert(str);

/**
 * confirm 提示框信息 Promise格式
 *
 * @param {string} [str=""]
 * @param {string} [title="提示"]
 * @returns
 */
const $confirm = (str = "", title = "提示") => MessageBox.confirm(str, title);

/**
 * prompt 提示框信息 Promise格式
 *
 * @param {string} [str=""]
 * @param {string} [title="提示"]
 * @returns
 */
const $prompt = (str = "", title = "提示") => MessageBox.prompt(str, title);

/**
 * 页面中间显示Toast提示
 *
 * @param {string} [str=""] 提示的文字内容
 */
const $tip = (str = "") => {
  Toast({
    message: str,
    duration: 3000
  });
};

/**
 * 路由后退方法
 *
 * @param {*} [num=-1] 后退的页面数
 */
const $back = (num = -1) => {
  router.go(num);
}

/**
 * 路由跳转方法
 *
 * @param {string} [path=""] 路径
 */
const $to = (path = "") => {
  router.push({
    path
  });
}

/**
 * 获取当前页面的参数
 *
 * @param {*} t 需要传入this
 * @returns
 */
const $param = (t) => {
  return t.$route.params;
};

/**
 * 统一在Vue.prototype上注册方法
 */
Vue.prototype.$alert = $alert;
Vue.prototype.$confirm = $confirm;
Vue.prototype.$prompt = $prompt;
Vue.prototype.$back = $back;
Vue.prototype.$tip = $tip;
Vue.prototype.$to = $to;
Vue.prototype.$param = $param;
