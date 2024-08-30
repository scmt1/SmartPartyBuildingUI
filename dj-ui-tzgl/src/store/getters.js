const getters = {
    userInfo: state => state.user.userInfo,
    deptInfo: state => state.dept.deptInfo,
    appInfo: state => state.app.appInfo,
    tradeUnionRole: state => state.user.tradeUnionRole,
    unitedDeptRole: state => state.user.unitedDeptRole,
}
export default getters
