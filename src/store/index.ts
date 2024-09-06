import { acceptHMRUpdate, defineStore } from 'pinia'
export * from './modules'

export const main = defineStore('main', {
  state: () => ({
    counter: 12
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    }
  }
})

// 确保传递正确的 store 声明，本例中为 `useAuth` 11.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(main, import.meta.hot))
}
