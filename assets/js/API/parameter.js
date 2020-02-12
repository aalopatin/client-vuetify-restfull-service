import {isEmpty} from "../modules/utils";

const url = `/parameters`

export const findAllParameters = function($axios, params = {}){
  return $axios.get(url, isEmpty(params) ? {} : { params: params })
}

export const createParameter = function ($axios, parameter) {
  return $axios.post(url, parameter)
}

export const saveParameter = function ($axios, parameter) {
  return $axios.put(url + `/${parameter.id}`, parameter)
}

export const deleteParameter = function ($axios, id) {
  return $axios.delete(url + `/${id}`)
}

export default {
  create: createParameter,
  save: saveParameter,
  findAll: findAllParameters,
  delete: deleteParameter
}

