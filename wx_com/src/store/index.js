/*
 * Vuex全局状态管理
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月25日17:12:17
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月25日17:12:17
 */
/* jshint esversion: 6 */
"use strict"
import Vue from 'vue';
import Vuex from 'vuex';
import menu from './module/menu.js';
import getters from './getters';
import {token,  wxComId, wxUserId} from "@/_config/index.js";

let storage = window.localStorage;

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { menu },
  state: {
    isLogin: true,
    token: token|| storage.getItem('shuiqitong_token') ||"" ,
    comInfo: {}, // 微信相关信息
    userInfo: {}, // 微信相关信息
    checkState:storage.getItem('checkState')||4, //0:审核中 1:审核通过  2:审核失败 3:重新提交审核  4:未提交审核
    departmentId: 0,
    currentSelectRole: "",
    currentSelectRoleName: "",
    checkValue: "", //部门选择人员ID
    companyId: storage.getItem('currenComId') || wxComId || "", //微信公司ID 
    comUserId: storage.getItem('comUserId') || wxUserId || "", //员工在此公司微信的ID 
    companyTree: [], //公司部门架构 (树形数据)
    wxComTree: [], //微信返回的公司部门架构  (扁平数据)
  },
  getters,
  mutations: {
    /**
     * 修改token 
     */
    changeToken(state, token) {
      if (token != state.token) {
        storage.setItem('shuiqitong_token',token);
        axios.defaults.headers.common['token'] = token;
      }
      state.token = token;
    },
    /**
     * 修改当前企业审核状态 
     */
    changeCheckState(state, currentState, reason = "") {
      if (currentState == 2) {
        state.failReason = reason;
      }
      storage.setItem('checkState',currentState);
      state.checkState = currentState;
    },
    /**
     * 修改当前活跃的部门ID (针对选择角色功能)
     * @returns 
     */
    changeActiveDepartId(state, id) {
      state.departmentId = id;
    },
    /**
     * 选择的人员(针对选择角色功能)
     * @returns 
     */
    changeCheckValue(state, value) {
      state.checkValue = value;
    },
    /**
     * 当前要修改的角色(针对选择角色功能)
     * @returns 
     */
    changeCurrentSelectRole(state, value) {
      state.currentSelectRole = value;
    },
    /**
     * 当前要修改的角色名称(针对选择角色功能)
     * @returns 
     */
    changeRoleName(state, value) {
      state.currentSelectRoleName = value;
    },
    /**
     * 设置当前企业ID 
     * @returns 
     */
    setComId(state, value) {
      storage.setItem('currenComId', value);
      state.companyId = value;
    },
    /**
     * 设置当前企业下UserId 
     */
    setComUserId(state, value) {
      storage.setItem('comUserId', value);
      state.comUserId = value;
    },
    /**
     * 微信接口返回的部门信息 
     */
    setComTree(state, tree) {
      state.companyTree = tree;
    },
    /**
     * 将微信返回的部门 解析成树状结构
     */
    setwxComTree(state, tree) {
      state.wxComTree = tree;
    },
    /**
     * 获取当前的微信用户信息 
     * @returns 
     */
    setwxUserInfo(state, info) {
      state.userInfo = info;
    }
  }
});

export default store;
