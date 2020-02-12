import {isEmpty} from "../modules/utils";

const url = `/reports`

export const getReport = function ($axios, id, params = {}) {
  return $axios.get(url + `/${id}`, isEmpty(params) ? {} : { params: params })
}

export const createReports = function ($axios, reports) {
  return $axios.post(url, { data: reports })
}

export const findAllReports = function($axios, params = {}){
  return $axios.get(url, isEmpty(params) ? {} : { params: params })
}

export const deleteReport = function ($axios, id) {
  return $axios.delete(url + `/${id}`)
}

export default {
  get: getReport,
  create: createReports,
  findAll: findAllReports,
  delete: deleteReport
}

