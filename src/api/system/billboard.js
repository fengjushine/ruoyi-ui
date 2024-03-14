import request from '@/utils/request'

// 查询全站公告列表
export function listBillboard(query) {
  return request({
    url: '/system/billboard/list',
    method: 'get',
    params: query
  })
}

// 查询全站公告详细
export function getBillboard(id) {
  return request({
    url: '/system/billboard/' + id,
    method: 'get'
  })
}

// 新增全站公告
export function addBillboard(data) {
  return request({
    url: '/system/billboard',
    method: 'post',
    data: data
  })
}

// 修改全站公告
export function updateBillboard(data) {
  return request({
    url: '/system/billboard',
    method: 'put',
    data: data
  })
}

// 删除全站公告
export function delBillboard(id) {
  return request({
    url: '/system/billboard/' + id,
    method: 'delete'
  })
}
