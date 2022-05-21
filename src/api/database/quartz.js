import request from '@/utils/request'

export function edit(data){
  return request({
    url: 'quartz',
    method: 'post',
    data,
  })
}

export function add(data){
  return request({
    url: 'quartz',
    method: 'post',
    data,
  })
}

export function runJob(groupName,name){
  return request({
    url: `quartz/runJob?groupName=${groupName}&name=${name}`,
    method: 'post',
  })
}


export function del(ids){
  return request({
    url: 'quartz',
    method: 'delete',
    data: ids,
  })
}

export default { edit, del, add, runJob }
