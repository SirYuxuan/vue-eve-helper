import permission from './permission'

const install = function (Vue) {
  Vue.directive('auth', permission)
}

if (window.Vue) {
  window['auth'] = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
