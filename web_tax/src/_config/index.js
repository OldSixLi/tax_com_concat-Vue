/**
 * 当前请求的接口地址  根据生产和开发环境区分地址 
 * @returns 
 */
const devUrl = `http://192.168.106.12:8080/`;
const prodUrl = `...`; //正式环境地址
export const serviceUrl = process.env.NODE_ENV === 'production' ? prodUrl : devUrl;
/**
 * token信息 区分开发环境与生产环境
 */
const prodToken=`tax_92f7a67b263e403db2fd255c9205cde3`;
export const token = process.env.NODE_ENV === 'production' ?prodToken: '';
/**
 * 当前UserID
 */
export const wxUserId = "";
/**
 * 当前用户登录企业代码 ComID
 */
export const wxComId = "";
/**
 * 微信应用代码 
 */
export const appId = "...";
/**
 * 微信应用代码 
 */
export const agentId = 1000012;
/**
 * 回调地址 
 */
export const redirectUrl = "http://TODO-URL/auth"; //此处需要修改为主页地址
/**
 * 扫码登录的地址 
 * @returns 
 */
export const wxUrl = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${appId}&agentid=${agentId}&redirect_uri=${encodeURIComponent(redirectUrl)}&state=`;