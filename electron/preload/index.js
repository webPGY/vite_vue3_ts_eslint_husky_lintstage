// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer, ipcMain } = require('electron')
// const Store = require('electron-store')
// const store = new Store()
// const { electronAPI } = require('@electron-toolkit/preload')

// Custom Util APIs for renderer
const util = {
  // 暴露给浏览器的工具方法，向node主进程发起通信
  ipc: ipcMain,
  showNotification: (message) => ipcRenderer.invoke('showNotification', message),
  startFlash: (message) => ipcRenderer.invoke('startFlash', message),
  endFlash: (message) => ipcRenderer.invoke('endFlash', message),
  // setStoreValue: (key, value) => store.set(key, value),
  // getStoreValue: (key) => store.get(key),
  // deleteStore: (key) => store.delete(key),
  openWindow: ({ pageName, parentName, params, options }) =>
    ipcRenderer.invoke('openWindow', { pageName, parentName, params, options }),
  closeWindow: (pageName, params) => ipcRenderer.invoke('closeWindow', pageName, params),
  maximizeWindow: (pageName, params) => ipcRenderer.invoke('maximizeWindow', pageName, params),
  unmaximizeWindow: (pageName, params) => ipcRenderer.invoke('unmaximizeWindow', pageName, params),
  minimizeWindow: (pageName, params) => ipcRenderer.invoke('minimizeWindow', pageName, params),
  noticeWindow: (pageName) => ipcRenderer.invoke('noticeWindow', pageName),
  fetchData: (urlMethod, data, ...args) =>
    ipcRenderer.invoke('fetchData', urlMethod, data, ...args),
  noticeLogin: (params) => ipcRenderer.invoke('noticeLogin', params),
  noticeLogout: () => ipcRenderer.invoke('noticeLogout'),
  getDeviceId: () => ipcRenderer.invoke('getDeviceId')
  // getDirname: () => ipcRenderer.invoke('getDirname'),
}

const listener = {
  // 暴露给浏览器的监听方法，接收node主进程的通信
  onUnmaximize: (callback) => ipcRenderer.on('unmaximize', callback),
  onUpdateData: (callback) => ipcRenderer.on('updateData', callback),
  onLogout: (callback) => ipcRenderer.on('logout', callback),
  onReportFromCpp: (callback) => ipcRenderer.on('reportFromCpp', callback)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('util', util)
    contextBridge.exposeInMainWorld('listener', listener)
    // 除函数之外，我们也可以暴露变量
  } catch (error) {
    console.error(error)
  }
} else {
  // window.electron = electronAPI
  window.util = util
  window.listener = listener
}

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
