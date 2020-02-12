import {isEmpty} from "../modules/utils";

const url = "/periods"

export const createPeriod = function ($axios, period) {
  return $axios.post(url, period)
}

export const savePeriod = function ($axios, period) {
  return $axios.put(url + `/${period.id}`, period)
}

export const findAllPeriods = function($axios, params = {}){
  return $axios.get(url, isEmpty(params) ? {} : { params: params })
}

export const deletePeriod = function ($axios, id) {
  return $axios.delete(url + `/${id}`)
}

export default {
  create: createPeriod,
  save: savePeriod,
  findAll: findAllPeriods,
  delete: deletePeriod,
}
