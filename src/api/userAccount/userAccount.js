import request from '@/utils/request'

/**
 * 设置一个角色为主角色
 * @param data 角色id
 * @returns {Object}
 */
export function setMainAccount(data) {
  return request({
    url: 'corpUser/setMainAccount?accountId=' + data,
    method: 'put'
  })
}

/**
 * 删除一个角色
 * @param data 角色id
 * @returns {Object}
 */
export function delAccount(data) {
  return request({
    url: 'account/delAccount?accountId=' + data,
    method: 'delete'
  })
}

/**
 * 判断指定角色是否在系统中存在
 * @param data 角色名
 * @returns {Object}
 */
export function checkAccountExist(accountName) {
  return request({
    url: 'corpUser/checkAccountExist?accountName=' + accountName,
    method: 'get'
  })
}
