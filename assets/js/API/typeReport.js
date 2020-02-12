import {isEmpty} from "../modules/utils";

const url = `/typesreports`

export const findAllTypesReports = function($axios, params = {}){
  return $axios.get(url, isEmpty(params) ? {} : { params: params })
}

export const createTypeReport = function ($axios, typeReport) {
  return $axios.post(url, typeReport)
}

export const saveTypeReport = function ($axios, typeReport) {
  return $axios.put(url + `/${typeReport.id}`, typeReport)
}

export const deleteTypeReport = function ($axios, id) {
  return $axios.delete(url + `/${id}`)
}

export default {
  findAll: findAllTypesReports,
  create: createTypeReport,
  save: saveTypeReport,
  delete: deleteTypeReport
}
