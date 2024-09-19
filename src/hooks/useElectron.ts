import { ref, computed } from 'vue'
export const useElectron = () => {
  const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1
  const setStore = (key: string, value: any) => {
    if (isElectron) {
      window.util?.setStoreValue(key, value)
    }
  }
  const getStore = (key: string) => {
    if (isElectron) {
      window.util?.getStoreValue(key)
    }
  }
  const deleteStore = (key: string) => {
    if (isElectron) {
      window.util?.deleteStore(key)
    }
  }
  const showNotification = (message: string) => {
    if (isElectron) {
      window.util?.showNotification(message)
    }
  }
  const startFlash = (message: string) => {
    if (isElectron) {
      window.util?.startFlash(message)
    }
  }
  const endFlash = (message: string) => {
    if (isElectron) {
      window.util?.endFlash(message)
    }
  }
  return {
    isElectron,
    setStore,
    getStore,
    deleteStore,
    showNotification,
    startFlash,
    endFlash
  }
}
