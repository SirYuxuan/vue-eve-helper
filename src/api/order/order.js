import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'order',
    method: 'post',
    data,
  })
}

export default {add}
