/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 前台AJAX请求统一封装
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月30日09:23:12
 */
/* jshint esversion: 6 */

import { BASE_URL } from '@/_config/index';
import Qs from 'qs';
import store from '@/store/index.js';
/*
:'######:::'#######::'##::: ##:'########:'####::'######:::
'##... ##:'##.... ##: ###:: ##: ##.....::. ##::'##... ##::
 ##:::..:: ##:::: ##: ####: ##: ##:::::::: ##:: ##:::..:::
 ##::::::: ##:::: ##: ## ## ##: ######:::: ##:: ##::'####:
 ##::::::: ##:::: ##: ##. ####: ##...::::: ##:: ##::: ##::
 ##::: ##: ##:::: ##: ##:. ###: ##:::::::: ##:: ##::: ##::
. ######::. #######:: ##::. ##: ##:::::::'####:. ######:::
:......::::.......:::..::::..::..::::::::....:::......::::

*/
/**
 * 全局统一ajax配置 
 */
let storage = window.localStorage;
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['token'] = storage.getItem('shuiqitong_token') || store.state.token;

/*
'##::::'##::::'###::::'##::: ##:'########::'##:::::::'########:'########::
 ##:::: ##:::'## ##::: ###:: ##: ##.... ##: ##::::::: ##.....:: ##.... ##:
 ##:::: ##::'##:. ##:: ####: ##: ##:::: ##: ##::::::: ##::::::: ##:::: ##:
 #########:'##:::. ##: ## ## ##: ##:::: ##: ##::::::: ######::: ########::
 ##.... ##: #########: ##. ####: ##:::: ##: ##::::::: ##...:::: ##.. ##:::
 ##:::: ##: ##.... ##: ##:. ###: ##:::: ##: ##::::::: ##::::::: ##::. ##::
 ##:::: ##: ##:::: ##: ##::. ##: ########:: ########: ########: ##:::. ##:
..:::::..::..:::::..::..::::..::........:::........::........::..:::::..::
*/
/**
 * 错误Response的处理
 * @param {*} err 
 */
const successHandler = data => {
  if (data.status && data.status >= 200 && data.status <= 300) {
    //已经转化JSON了
    let ajaxData = data.data;
    errorHandler(ajaxData); //token失效或者公司状态过期的处理
    return ajaxData;
  }
  return data;
};

const errHandler = err => {
  if (err.response) {
    if (err.response.status == 504 || err.response.status == 404) {
      // MessageBox.error({
      //   message: '请求服务失败，请重试！'
      // });
    } else if (err.response.status == 403) {
      // MessageBox.error({
      //   message: '权限不足,请联系管理员!'
      // });
    } else {
      // MessageBox.error({
      //   message: '未知错误!'
      // });
    }
  }
  return Promise.reject(err);
};

/**
 * 统一处理所有的response 
 * @returns 
 */
axios.interceptors.response.use(successHandler, errHandler);

/*
'##::::'##:'########:'########:'##::::'##::'#######::'########:::'######::
 ###::'###: ##.....::... ##..:: ##:::: ##:'##.... ##: ##.... ##:'##... ##:
 ####'####: ##:::::::::: ##:::: ##:::: ##: ##:::: ##: ##:::: ##: ##:::..::
 ## ### ##: ######:::::: ##:::: #########: ##:::: ##: ##:::: ##:. ######::
 ##. #: ##: ##...::::::: ##:::: ##.... ##: ##:::: ##: ##:::: ##::..... ##:
 ##:.:: ##: ##:::::::::: ##:::: ##:::: ##: ##:::: ##: ##:::: ##:'##::: ##:
 ##:::: ##: ########:::: ##:::: ##:::: ##:. #######:: ########::. ######::
..:::::..::........:::::..:::::..:::::..:::.......:::........::::......:::
*/

/**
 * GET 请求封装 
 * @returns 
 */
const $get = (url, params) => {
  return axios.get(url, {
    params
  });
};

/**
 * POST 方法封装
 *
 * @param {*} url
 * @param {*} data
 * @returns
 */
const $post = (url, data) => {
  return axios({
    method: "POST",
    url,
    data,
    transformRequest: [data => Qs.stringify(data)],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });
};

Vue.prototype.$get = $get;
Vue.prototype.$post = $post
Vue.prototype.$http = axios;
Vue.prototype.$ajax = axios;

/**
 * token失效或者公司状态过期的处理
 *
 * @param {*} ajaxData 返回的数据
 */
function errorHandler(ajaxData) {
  if (!ajaxData.success && ajaxData.message != "") {
    let msgState = ajaxData.message;
    if (msgState == "-1") {
      //如果用户登录身份失效
      storage.setItem('shuiqitong_token', '');
      storage.setItem('comUserId', '');
      storage.setItem('currenComId', '');
      if (storage.getItem('isTokenFail') != "1") {
        storage.setItem('isTokenFail', '1');
        alert(`您的登陆信息已失效,请重新登陆!`);
        Vue.prototype.$to("/first");
      }
    }
    // -2 企业信息不存在、已被作废
    // -3 企业未提交审核  
    // -4 企业审核未通过     
    // -5企业审核中
    else if (msgState == "-3" || msgState == "-2") {
      Vue.prototype.$to("/infoChecking/4");
    }
    else if (msgState == "-4") {
      Vue.prototype.$to("/infoChecking/2");
    }
    else if (msgState == "-5") {
      Vue.prototype.$to("/infoChecking/3");
    }
  }
}

