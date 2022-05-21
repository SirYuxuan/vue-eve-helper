import request from '@/utils/request'

export function build(param) {
  return request({
    url: '/menu/build',
    method: 'get',
    param,
  })
}

export function edit(data){
  return request({
    url: 'menu',
    method: 'put',
    data,
  })
}

export function add(data){
  return request({
    url: 'menu',
    method: 'post',
    data,
  })
}

export function del(ids){
  return request({
    url: 'menu',
    method: 'delete',
    data: ids,
  })
}

export default { edit, del, add }
