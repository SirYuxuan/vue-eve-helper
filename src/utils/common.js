import store from '@/store'

export default {
  /**
   * 判断指定权限是否存在
   * @param str
   * @returns {boolean}
   */
  hasAuth(str) {
    const permissions = store.getters['user/permissions'] || ['NONE']
    return permissions.includes(str)
  },
  toThousands(str) {
    return toThousands(str)
  },
}

export function toThousands(str) {
  let i
  let newStr = ''
  let count = 0
  str = str + ''
  if (str.indexOf('.') === -1) {
    for (i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr + '.00' //自动补小数点后两位
    return str
  } else {
    for (i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr //逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
    return str
  }
}
