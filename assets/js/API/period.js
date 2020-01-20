import {isEmpty} from "../modules/utils";
import {deleteParameter, saveParameter} from "./parameter";
import {createCompany, deleteCompany, findAllCompanies, getCompany, saveCompany} from "./company";

const url = "/admin/periods"

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
  save: savePeriod,
  findAll: findAllPeriods,
  delete: deletePeriod,
}
