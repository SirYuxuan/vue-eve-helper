import store from '@/store'

export default {
  inserted(el, binding) {
    const { value } = binding
    const permissions = store.getters['user/permissions'] || ['NONE']
    let newVal
    if (!(value instanceof Array)) {
      newVal = [value]
    } else {
      newVal = value
    }
    if (newVal && newVal instanceof Array) {
      if (newVal.length > 0) {
        const permissionRoles = newVal
        const hasPermission = permissions.some((role) => {
          return permissionRoles.includes(role)
        })
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`使用方式： v-auth="['admin','editor']"`)
    }
  },
}
