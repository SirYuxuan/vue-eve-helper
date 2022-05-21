import request from '@/utils/request'
import qs from 'qs'

export function doGet(url, params) {
  return request({
    url:
      url +
      (params === undefined
        ? ''
        : '?' + qs.stringify(params, { indices: false })),
    method: 'get',
  })
}
export function doPost(url, data) {
  return request({
    url: url,
    method: 'post',
    data,
  })
}

export function doDel(url, data) {
  return request({
    url: url,
    method: 'delete',
    data,
  })
}

export function doPut(url, data) {
  return request({
    url: url,
    method: 'put',
    data,
  })
}
export async function asyncGet(url, params) {
  return request({
    url:
      url +
      (params === undefined
        ? ''
        : '?' + qs.stringify(params, { indices: false })),
    method: 'get',
  })
}

export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob',
  })
}
