import router from './index';
import NProgress from 'nprogress'; // 组件加载进度条
import 'nprogress/nprogress.css';
import store from "@/store";

NProgress.configure({
  showSpinner: false // 配置顶部进度条
});


router.beforeEach((to, from, next) => {
  // 页面顶部进度条
  NProgress.start();
  // 根据当前的环境确定是否添加权限
  process.env.NODE_ENV === 'production'?loginCheck(to, next):next();

});

router.afterEach(() => {
  NProgress.done(); // 关闭
});

/**
 * 校验当前登录状态
 *
 * @param {*} to
 * @param {*} next
 */
function loginCheck(to, next) {
  if (to.path != '/login' && to.path != '/auth' && !store.state.isLogin) {
    var urlObj = new UrlSearch();
    if (!urlObj.code) {
      Vue.prototype.$message({
        message: '您尚未登录,请登录后再进行操作！',
        type: 'warning'
      });
      next('/login');
    }
    else {
      next();
    }
  }
  else {
    next();
  }
}

/**
 * 分隔获取各个参数
 * 根据URL地址获取其参数
 */
function UrlSearch() {
  var name, value;
  var str = location.href; //取得整个地址栏
  var num = str.indexOf("?");
  str = str.substr(num + 1);
  var arr = str.split("&"); //各个参数放到数组里
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}
