/*
 * Vuex 状态Getter
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月25日17:13:09
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月25日17:13:09
 */
/* jshint esversion: 6 */
"use strict"
const getters = {
  departmentId: state => state.departmentId,
  checkValue: state => state.checkValue,
  companyTree: state => state.companyTree,
  wxComTree: state => state.wxComTree,
  roleId: state => state.currentSelectRole,
  roleName: state => state.currentSelectRoleName,
  userInfo: state => state.userInfo,
  companyId: state => state.companyId,
  comUserId: state => state.comUserId,
  checkState: state => state.checkState,
  token: state => state.token,
};
export default getters;
