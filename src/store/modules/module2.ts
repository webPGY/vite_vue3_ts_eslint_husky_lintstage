import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const moudule2Store = defineStore('moudule2Store', () => {
  const _primary = ref('module2 composingStore')
  return {
    _primary
  }
})
// 确保传递正确的 store 声明
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(moudule2Store, import.meta.hot))
}
