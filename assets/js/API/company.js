import {isEmpty} from "../modules/utils";

const url = "/companies"

export const getCompany = function ($axios, id) {
  return $axios.get(url + `/${id}`)
}

export const createCompany = function ($axios, company) {
  return $axios.post(url, company)
}

export const saveCompany = function ($axios, company) {
  return $axios.put(url+ `/${company.id}`, company)
}

export const deleteCompany = function ($axios, id) {
  return $axios.delete(url + `/${id}`)
}

export const findAllCompanies = function($axios, params = {}){
  return $axios.get(url, isEmpty(params) ? {} : { params: params })
}

export default {
  get: getCompany,
  create: createCompany,
  save: saveCompany,
  findAll: findAllCompanies,
  delete: deleteCompany
}
