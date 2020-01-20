const url = `/admin/reports`

export const create = function(reports){

  return this.$axios.post(url, reports)
    .then(result =>
    {
      return result
    })

}

export default {
  create: create
}

