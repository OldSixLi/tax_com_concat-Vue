const getters = {
  menurouter: state => state.menu.routers,
  showFullWidth: state => state.showFullWidth,
  userName:state=>state.userInfo.name
  // roles: state => state.user.roles 
}
export default getters
