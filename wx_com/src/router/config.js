import router from './index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from "@/store";

NProgress.configure({
  showSpinner: false // 配置顶部进度条
});
/*
'########::'########:'########::'#######::'########::'########:
 ##.... ##: ##.....:: ##.....::'##.... ##: ##.... ##: ##.....::
 ##:::: ##: ##::::::: ##::::::: ##:::: ##: ##:::: ##: ##:::::::
 ########:: ######::: ######::: ##:::: ##: ########:: ######:::
 ##.... ##: ##...:::: ##...:::: ##:::: ##: ##.. ##::: ##...::::
 ##:::: ##: ##::::::: ##::::::: ##:::: ##: ##::. ##:: ##:::::::
 ########:: ########: ##:::::::. #######:: ##:::. ##: ########:
........:::........::..:::::::::.......:::..:::::..::........::
*/
router.beforeEach((to, _from, next) => {
  // 页面顶部进度条
  NProgress.start();
  //获取值
  let state = store.state.checkState;
  let routers = store.state.menu.routers;
  let comId = store.state.companyId;
  let userId = store.state.comUserId;
  let token = store.state.token;
  let roles = store.state.menu.roles;
  if (to.name != '清除应用') {
    try {
      // step1:校验当前网页是否有使用者的信息
      wxInfoCheck(comId, userId, to, next, token);

      // step2:校验当前公司的状态
      companyStateCheck(state, to, next);

      // step3:用户的权限校验
      userAuthCheck(roles, to, next, routers);

    } catch (error) {
      console.log(error);
    }
  } else {
    next();
  }
});
/*
:::'###::::'########:'########:'########:'########::
::'## ##::: ##.....::... ##..:: ##.....:: ##.... ##:
:'##:. ##:: ##:::::::::: ##:::: ##::::::: ##:::: ##:
'##:::. ##: ######:::::: ##:::: ######::: ########::
 #########: ##...::::::: ##:::: ##...:::: ##.. ##:::
 ##.... ##: ##:::::::::: ##:::: ##::::::: ##::. ##::
 ##:::: ##: ##:::::::::: ##:::: ########: ##:::. ##:
..:::::..::..:::::::::::..:::::........::..:::::..::
*/
router.afterEach((to, _from) => {
  NProgress.done(); // 关闭
  if (to.path == "/") {
    //每次进入主页重新拿一次权限,此处是因为管理员可能重新设置权限
    getRoleAndRight();
  }
});


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
 * 用户权限校验(针对页面reload做出处理)
 *
 * @param {*} roles 当前用户拥有的角色
 * @param {*} to 跳转路由
 * @param {*} next 跳转方法
 * @param {*} routers 当前用户权限所拥有的路由列表
 */
function userAuthCheck(roles, to, next, routers) {
  if (roles.length == 0 && to.name != "检查结果") {
    // getRoleAndRight()
    //   .then(_data => {
    //     let newroute = store.state.menu.routers;
    //     userRouterCheck(to, newroute, next);
    //   });
    next()
  } else {
    userRouterCheck(to, routers, next);
  }
}
/**
 * 获取用户的角色和权限
 *
 * @returns
 */
function getRoleAndRight() {
  return new Promise(function (resolve, _reject) {
    Vue.prototype.$get(`/self/getRoleAndRight`).then(data => {
      if (data.success) {
        store.commit(`changeRole`, data.bean.roles);
        store.dispatch(`getAppMenu`, data.bean.right);
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch(_err => {
      resolve(false);
    });
  });
}
/**
 * 判断当前页面是否已获取到登陆人员信息
 *
 * @param {*} comId 企业微信ID
 * @param {*} userId 员工在此企业中的ID
 * @param {*} to 跳转路径
 * @param {*} next
 * @param {*} token 当前用户TOKEN
 */
function wxInfoCheck(comId, userId, to, next, token) {
  if ((!comId || !userId) && to.name != "获取信息" && to.name != "授权登陆") {
    next("/first?path=" + to.fullPath);
  } else {
    //判断token是否存在
    if (!token && to.name != "获取信息" && to.name != "授权登陆") {
      getNewToken()
      next()
    }
    next();
  }
}
/**
 * 获取新的token
 *
 */
export function getNewToken() {
  let data = {
    comId: store.state.companyId,
    userId: store.state.comUserId
  };
  Vue.prototype.$post(`/self/reLogin`, data)
    .then(data => {
      if (data.success && data.bean.flag != "0") {
        let arr = data.bean.userRight;
        let rights = [];
        arr.forEach((value, _index) => {
          rights.push(value.rightName);
        });
        //修改全局状态
        store.commit("changeToken", data.bean.token);
        store.commit("changeRole", data.bean.roles);
        store.dispatch("getAppMenu", rights);
      }
    })
}
/**
 * 当前用户权限校验
 *
 * @param {*} to
 * @param {*} routers
 * @param {*} next
 */
function userRouterCheck(to, routers, next) {
  if (to.meta && to.meta.funPoint) {
    let parentRouter = to.matched[to.matched.length - 1].parent || null;
    if (parentRouter) {
      if (isHaveAuth(to, routers)) {
        next();
      } else {
        next("/noauth");
      }
    } else {
      next();
    }
  } else {
    next();
  }
}
/**
 * 判断用户是否有权限跳转
 *
 * @param {*} to 跳转的页面
 * @param {*} routers 用户有权限的路由集合
 * @returns
 */
function isHaveAuth(to, routers) {
  let isHave =
    routers.some(ele => {
      if (ele.children) {
        return isHaveAuth(to, ele.children);
      }
      return (ele.meta && ele.meta.funPoint) == to.meta.funPoint;
    });
  return isHave;
}

/**
 * 根据公司当前审核状态确定用户跳转的页面
 *
 * @param {*} state
 * @param {*} to
 * @param {*} next
 */
function companyStateCheck(states, to, next) {
  let state = store.state.checkState;
  if (to.name == "获取信息" || to.name == "授权登陆") {
    //授权页的时候不做校验
    next()
  } else {
    if ((state != 1) && to.name != "检查结果") { //如果当前企业的状态不是已通过
      if ((state == 2 || state == 4) && to.name == "注册信息") {
        next()
      } else {
        next({
          // TODO 此处添加跳转路由参数
          path:`/infoChecking/${state}?redirect=${encodeURIComponent(to.path)}`
        });
      }
    } else {
      // 如果已通过的话 就不能再次进入
      if (to.path == "/regist") {
        Vue.prototype.$alert("您的企业已通过审核,不能重新提交审核信息")
          .then(_action => {
            next("/")
          })
      } else {
        next();
      }
    }
  }
}
