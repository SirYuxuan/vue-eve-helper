import request from '@/utils/request'

import {tokenName} from '@/config'
import {encrypt} from "@/utils/encrypt";

export async function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/user/info',
    method: 'get',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}

export function edit(data) {
  return request({
    url: 'user',
    method: 'put',
    data,
  })
}

export function updatePass(data) {
  let params = {
    ...data
  }
  params['oldPass'] = encrypt(params['oldPass'])
  return request({
    url: 'user/updatePass',
    method: 'put',
    data: params,
  })
}
export function updatePhone(data) {
  return request({
    url: 'user/updatePhone',
    method: 'put',
    data,
  })
}
export function updateEmail(data) {
  let params = {
    ...data
  }
  params['pass'] = encrypt(params['pass'])
  return request({
    url: 'user/updateEmail',
    method: 'put',
    data: params,
  })
}

export function sendUpdateMail(mail) {
  return request({
    url: 'user/sendUpdateMail?mail=' + mail,
    method: 'put',
  })
}

export function sendPhoneCode(data) {
  return request({
    url: 'user/sendPhoneCode' ,
    method: 'put',
    data
  })
}

export function add(data) {
  return request({
    url: 'user',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: 'user',
    method: 'delete',
    data: ids,
  })
}

export default {edit, del, add, updatePass, sendUpdateMail, updateEmail, updatePhone}
