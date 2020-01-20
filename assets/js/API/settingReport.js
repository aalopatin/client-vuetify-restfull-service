import {isEmpty} from "../modules/utils";

const url = "/admin/settingsreports"

export const getSettingReport = function ($axios, id, params = {}) {
  return $axios.get(url + `/${id}`, isEmpty(params) ? {} : { params: params })
}

export const createSettingReport = function ($axios, company) {
  return $axios.post(url, company)
}

export const saveSettingReport = function ($axios, company) {
  return $axios.put(url+ `/${company.id}`, company)
}

export const deleteSettingReport = function ($axios, id) {
  return $axios.delete(url + `/${id}`)
}

export const findAllSettingsReports = function($axios, params = {}){
  return $axios.get(url, isEmpty(params) ? {} : { params: params })
}

export default {
  get: getSettingReport,
  create: createSettingReport,
  save: saveSettingReport,
  findAll: findAllSettingsReports,
  delete: deleteSettingReport
}
