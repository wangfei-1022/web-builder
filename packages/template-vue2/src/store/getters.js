const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  tplToken: state => state.user.templateToken,
  addRoutes: state => state.permission.addRoutes,
  favourRoutes: state => state.permission.favourRoutes,
  lastestRoutes: state => state.permission.lastestRoutes,
  errorLogs: state => state.errorLog.logs,
  cancelList: state => state.axiosCancel.cancelList
}
export default getters
