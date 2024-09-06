import { acceptHMRUpdate, defineStore } from 'pinia'

export const moudule1Store = defineStore('moudule1Store', {
  state: () => ({
    primary: 'module1 commonStore'
  }),
  actions: {}
})

// 确保传递正确的 store 声明，本例中为 `useAuth` 11.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(moudule1Store, import.meta.hot))
}
