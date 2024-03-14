import request from '@/utils/request'

// 查询话题列表
export function listPost(query) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}

// 查询话题详细
export function getPost(title) {
  return request({
    url: '/system/post/' + title,
    method: 'get'
  })
}

// 新增话题
export function addPost(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改话题
export function updatePost(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除话题
export function delPost(title) {
  return request({
    url: '/system/post/' + title,
    method: 'delete'
  })
}
