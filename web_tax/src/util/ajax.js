/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 前台AJAX请求统一封装
 * @Last Modified by: 马少博
 * @Last Modified time:2018年8月27日13:34:11
 */
/* jshint esversion: 6 */

import { Message } from 'element-ui';
import { serviceUrl } from '@/_config'
import store from '@/store/index.js';
import Qs from 'qs';

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
let AUTH_TOKEN =store.state.token|| "6666"; //用户请求token
axios.defaults.baseURL = serviceUrl;
axios.defaults.headers.common['token'] = AUTH_TOKEN;

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
 *
 * @param {*} err 
 */
function errorHandler(err) {
  if (err.response.status == 504 || err.response.status == 404) {
    Message.error({
      message: '请求服务失败，请重试！'
    });
  } else if (err.response.status == 403) {
    Message.error({
      message: '权限不足,请联系管理员!'
    });
  } else {
    Message.error({
      message: '未知错误!'
    });
  }
}

const successHandler = data => {
  if (data.status && data.status >= 200 && data.status <= 300) {
    return data.data;
  }
  return data;
};

const errHandler = err => {
  errorHandler(err);
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
 * get请求封装 
 * @returns 
 */
Vue.prototype.$get = (url, params) => {
  return axios.get(
    url, {
      params
    }
  );
};

Vue.prototype.$post = (url, data) => {
  return axios({
    method: "POST",
    url,
    data,
    transformRequest: [data => Qs.stringify(data)],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });
}

Vue.prototype.$http = axios;
Vue.prototype.$ajax = axios;
