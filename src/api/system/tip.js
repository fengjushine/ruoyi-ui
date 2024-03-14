import request from '@/utils/request'

// 查询每日赠言列表
export function listTip(query) {
  return request({
    url: '/system/tip/list',
    method: 'get',
    params: query
  })
}

// 查询每日赠言详细
export function getTip(id) {
  return request({
    url: '/system/tip/' + id,
    method: 'get'
  })
}

// 新增每日赠言
export function addTip(data) {
  return request({
    url: '/system/tip',
    method: 'post',
    data: data
  })
}

// 修改每日赠言
export function updateTip(data) {
  return request({
    url: '/system/tip',
    method: 'put',
    data: data
  })
}

// 删除每日赠言
export function delTip(id) {
  return request({
    url: '/system/tip/' + id,
    method: 'delete'
  })
}
