import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'sde',
    method: 'post',
    data,
  })
}

export function startSde(id) {
  return request({
    url: 'sde/startSde?id=' + id,
    method: 'get',
  })
}
export function del(ids) {
  return request({
    url: 'sde',
    method: 'delete',
    data: ids,
  })
}

export default { del, add }
