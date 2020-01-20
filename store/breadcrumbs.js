export const state = () => ({
  items: []
})

export const mutations = {
  set(state, items) {
    const length = state.items.length
    state.items.splice(0, length, ...items)
  },
  clear(state) {
    const length = state.items.length
    state.items.splice(0, length)
  },
  pushActive(state, title) {
    state.items.push({text: title})
  },
  pushNext(state, payloads) {
    const count = state.items.length
    state.items.push({text: payloads.title, to: state.items[count - 1].to + payloads.url})
  },
}
