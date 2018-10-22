/*
 * 开发环境中使用到的固定配置(变量)
 * 可脱离微信环境,方便在PC端直接测试
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月26日09:13:32
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月26日09:13:32
 */
/* jshint esversion: 6 */
"use strict"
/*
'########::'########:'##::::'##:
 ##.... ##: ##.....:: ##:::: ##:
 ##:::: ##: ##::::::: ##:::: ##:
 ##:::: ##: ######::: ##:::: ##:
 ##:::: ##: ##...::::. ##:: ##::
 ##:::: ##: ##::::::::. ## ##:::
 ########:: ########:::. ###::::
........:::........:::::...:::::
开发环境
*/
// // token信息
// export const token = "5e09f269ffc347cc9b75ca2226b36a27";
// //企业微信中UserID
// export const wxUserId = "TDevG4_105";
// //企业微信中公司ID
// export const wxComId = "wxa059996e5d72516b";
// //请求的服务器地址
// export const BASE_URL = "http://192.168.106.12:8080/";


/*
'########::'########:::'#######::'########::
 ##.... ##: ##.... ##:'##.... ##: ##.... ##:
 ##:::: ##: ##:::: ##: ##:::: ##: ##:::: ##:
 ########:: ########:: ##:::: ##: ##:::: ##:
 ##.....::: ##.. ##::: ##:::: ##: ##:::: ##:
 ##:::::::: ##::. ##:: ##:::: ##: ##:::: ##:
 ##:::::::: ##:::. ##:. #######:: ########::
..:::::::::..:::::..:::.......:::........:::
正式环境
*/
// token信息
export const token = "";
//企业微信中UserID
export const wxUserId = "";
//企业微信中公司ID
export const wxComId = "";
//请求的服务器地址
const devUrl=`http://192.168.106.12:8080/`;
const prodUrl=`http://dev-ws.htyfw.com.cn:18000/`;
export const BASE_URL =  process.env.NODE_ENV === 'production' ? prodUrl : devUrl;

//微信授权后回调地址
export const redirectUrl="http://dev-ws.htyfw.com.cn/auth";

//系统中所有用户均可访问的功能
export const baseRights = [
  "message",
  "message-list",
  "message-detail",
  "question",
  "question-detail",
  "question-info"
]
