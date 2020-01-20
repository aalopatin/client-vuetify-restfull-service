import {isEmpty} from "../modules/utils";

const url = `/admin/groupsparameters`

export const findAllGroupsParameters = function($axios, params = {}){
  return $axios.get(url, isEmpty(params) ? {} : { params: params })
}

export const createGroupParameter = function ($axios, groupParameter) {
  return $axios.post(url, groupParameter)
}

export const saveGroupParameter = function ($axios, groupParameter) {
  return $axios.put(url + `/${groupParameter.id}`, groupParameter)
}

export const deleteGroupParameter = function ($axios, id) {
  return $axios.delete(url + `/${id}`)
}

export default {
  findAll: findAllGroupsParameters,
  create: createGroupParameter,
  save: saveGroupParameter,
  delete: deleteGroupParameter
}
