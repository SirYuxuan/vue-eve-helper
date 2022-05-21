import request from '@/utils/request'


export function edit(data){
  return request({
    url: 'dept',
    method: 'put',
    data,
  })
}

export function add(data){
  return request({
    url: 'dept',
    method: 'post',
    data,
  })
}

export function del(ids){
  return request({
    url: 'dept',
    method: 'delete',
    data: ids,
  })
}

export default { edit, del, add }
