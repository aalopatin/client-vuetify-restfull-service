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

export const uploadLogo = function ($axios, id, logo) {
  let formData = new FormData()
  formData.append("logo", logo)
  return $axios.post(url+ `/${id}/logo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}

export default {
  get: getCompany,
  create: createCompany,
  save: saveCompany,
  findAll: findAllCompanies,
  delete: deleteCompany
}
