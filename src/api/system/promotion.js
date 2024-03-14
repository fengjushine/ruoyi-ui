import request from '@/utils/request'

// 查询广告推广列表
export function listPromotion(query) {
  return request({
    url: '/system/promotion/list',
    method: 'get',
    params: query
  })
}

// 查询广告推广详细
export function getPromotion(id) {
  return request({
    url: '/system/promotion/' + id,
    method: 'get'
  })
}

// 新增广告推广
export function addPromotion(data) {
  return request({
    url: '/system/promotion',
    method: 'post',
    data: data
  })
}

// 修改广告推广
export function updatePromotion(data) {
  return request({
    url: '/system/promotion',
    method: 'put',
    data: data
  })
}

// 删除广告推广
export function delPromotion(id) {
  return request({
    url: '/system/promotion/' + id,
    method: 'delete'
  })
}
