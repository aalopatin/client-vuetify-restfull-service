import {isEmpty} from "../modules/utils";

const url = "/settingsreports"

export const getSettingReport = function ($axios, id, params = {}) {
  return $axios.get(url + `/${id}`, isEmpty(params) ? {} : { params: params })
}

export const createSettingReport = function ($axios, setting) {
  return $axios.post(url, setting)
}

export const saveSettingReport = function ($axios, setting) {
  return $axios.put(url+ `/${setting.id}`, setting)
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
