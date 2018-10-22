 /**
  * 格式化时间
  *
  * @export
  * @param {*} date
  * @returns
  */
 export function formatTime(date) {
   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   const hour = date.getHours();
   const minute = date.getMinutes();
   const second = date.getSeconds();

   const t1 = [year, month, day].map(add0).join('-');
   const t2 = [hour, minute, second].map(add0).join(':');

   return `${t1} ${t2}`;
 }

 /**
  * 时间戳转化为正常时间 
  * @param {any} shijianchuo  时间戳 精确到毫秒
  * @returns 正常时间
  */
 export function toNormalTime(shijianchuo) {
   var time = new Date(parseInt(shijianchuo));
   return formatTime(time);
 }



 function add0(m) {
   return m < 10 ? '0' + m : m;
 }
 /**
  * 时间转化为时间戳
  *
  * @export
  * @param {*} timestr 时间
  * @returns
  */
 export function toTimestamp(timestr) {
   return Date.parse(new Date(timestr)).toString() == "NaN" ? 0 : Date.parse(new Date(timestr));
 }


 /**
  * 去除字符串中的空格
  *
  * @param {*} str 字符串
  * @param {*} type 1-所有空格  2-前后空格  3-前空格 4-后空格
  * @returns 处理后的字符串
  */
 export const trim = (str, type) => {
   switch (type) {
     case 1:
       return str.replace(/\/s+/g, "");
     case 2:
       return str.replace(/(^\/s*)|(\/s*$)/g, "");
     case 3:
       return str.replace(/(^\/s*)/g, "");
     case 4:
       return str.replace(/(\/s*$)/g, "");
     default:
       return str;
   }
 }
 