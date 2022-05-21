import request from '@/utils/request'


export function edit(data){
  return request({
    url: 'role',
    method: 'put',
    data,
  })
}

export function editMenu(data){
  return request({
    url: 'role/editMenu',
    method: 'put',
    data,
  })
}

export function add(data){
  return request({
    url: 'role',
    method: 'post',
    data,
  })
}

export function del(ids){
  return request({
    url: 'role',
    method: 'delete',
    data: ids,
  })
}

export default { edit, del, add, editMenu }
