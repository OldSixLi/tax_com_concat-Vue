// import Vue from 'vue';
import Vuex from 'vuex';
import menu from './module/menu.js';
import getters from './getters';
import axios from 'axios';
import { token as TOKEN } from '@/_config'

let storage = window.sessionStorage;

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    menu
  },
  state: {
    //1为不收缩 0或其他为收缩
    showFullWidth: !(storage.getItem('isFullWidth') == "0"),
    //用户是否登录
    isLogin: storage.getItem('isLogin') == '1',
    //请求的token
    token: storage.getItem('tax_token') || TOKEN,
    // 个人微信信息
    userInfo: getUser(),
    // 公司信息
    comInfo: getCom()
  },
  getters,
  mutations: {
    /**
     * 更改个人信息
     *
     * @param {*} state
     * @param {*} userInfo
     */
    changeUserInfo(state, userInfo) {
      storage.setItem('userInfo', JSON.stringify(userInfo));
      state.userInfo = userInfo;
    },
    /**
     * 更改个人所属企业信息
     *
     * @param {*} state
     * @param {*} comInfo
     */
    changeComInfo(state, comInfo) {
      storage.setItem('comInfo', JSON.stringify(comInfo));
      state.comInfo = comInfo;
    },
    /**
     * 设置当前token
     *
     * @param {*} state
     * @param {*} token
     */
    changeToken(state, token) {

      storage.setItem('tax_token', token);
      axios.defaults.headers.common['token'] = token;
      state.token = token;
    },
    /**
     * 切换侧边栏收缩状态
     *
     * @param {*} state
     */
    changeSlideState(state) {
      state.showFullWidth = !state.showFullWidth;
      storage.setItem('isFullWidth', state.showFullWidth ? "1" : "0");
    },
    /**
     * 切换登陆状态
     * @returns 
     */
    changeLoginState(state, isLogin) {
      if (isLogin) {
        storage.setItem('isLogin', '1');
      } else {
        storage.setItem('isLogin', '0');
      }
      state.isLogin = isLogin;
      storage.setItem('isFullWidth', state.showFullWidth ? "1" : "0");
    }
  },
  actions: {
    /**
     * 登陆成功进行的操作
     *
     * @param {*} { commit } Vuex的事物提交
     * @param {*} token token值
     * @param {*} userInfo 个人信息
     * @param {*} comInfo 公司信息
     */
    logIn({
      commit
    }, data) {

      let token = data.token;
      let userInfo = data.employeeInfo;
      let comInfo = data.corpInfo;
      commit('changeLoginState', true);
      commit('changeToken', token);
      commit('changeUserInfo', userInfo);
      commit('changeComInfo', comInfo);
    },
    /**
     * 退出登录 清除数据并跳转至初始页面
     *
     * @param {*} { commit } Vuex中的commit
     */
    logOut({
      commit
    }) {
      Vue.prototype.$post(`/tax/login/logout`)
        .then(data => {
          commit('changeLoginState', false);
          commit('changeToken', '');
          Vue.prototype.$to('/login');
        }).catch(x => {
          commit('changeLoginState', false);
          commit('changeToken', '');
          Vue.prototype.$to('/login');
        })
    }
  }
});
/**
 * 本地存储UserInfo
 *
 * @returns
 */
function getUser() {
  let dataStr = storage.getItem('userInfo')
  return dataStr ? JSON.parse(dataStr) : {};
}
/**
 * 本地存储UserInfo
 *
 * @returns
 */
function getCom() {
  let dataStr = storage.getItem('comInfo')
  return dataStr ? JSON.parse(dataStr) : {};
}

export default store