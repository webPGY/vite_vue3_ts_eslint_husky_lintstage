const { app, protocol, BrowserWindow, globalShortcut, ipcMain, Notification } = require('electron')
// 需在当前文件内开头引入 Node.js 的 'path' 模块
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

app.commandLine.appendSwitch('--ignore-certificate-errors', 'true')
// 应用程序准备就绪之前，必须注册方案
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

var win = null

var timer = null

const windowInstanceMap = {}

const createWindow = async () => {
  if (windowInstanceMap['mainElectron']) return
  win = new BrowserWindow({
    width: 1456,
    height: 800,
    minHeight: 800,
    minWidth: 1456,
    fullscreenable: true,
    fullscreen: false,
    center: true, //窗口是否在屏幕居中. 默认值为 false
    frame: true, //设置为 false 时可以创建一个无边框窗口 默认值为 true。
    show: true, //窗口是否在创建时显示。 默认值为 true。
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, './preload/index.js'),
      webSecurity: false
    }
  })
  win.setMenu(null)

  if (app.isPackaged) {
    win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
  } else {
    win.loadURL('http://localhost:8888/')
    // win.loadURL('http://localhost:5173/')
    win.webContents.openDevTools()
  }
  //通过CommandOrControl+Shift+i打开控制台
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    win.webContents.openDevTools()
  })

  windowInstanceMap['mainElectron'] = win

  // 监听窗口打开事件
  win.on('show', () => {
    console.log('show-electron')
    clearInterval(timer)
    win.flashFrame(false)
  })
  win.on('hide', () => {
    console.log('hide-electron')
    clearInterval(timer)
    win.flashFrame(false)
  })
}

function showNotification(message) {
  const notification = new Notification({ title: 'Notification', body: message })
  notification.show()
}

function startFlash(message) {
  clearInterval(timer)
  // 设置一个定时器来触发闪烁效果
  timer = setInterval(() => {
    win.flashFrame(true)
    setTimeout(() => {
      win.flashFrame(false)
    }, 1000) // 闪烁1秒钟
  }, 3000) // 每3秒钟闪烁一次
}

function endFlash(message) {
  clearInterval(timer)
  win.flashFrame(false)
}

const util = {
  showNotification: (message) => showNotification(message),
  startFlash: (message) => startFlash(message),
  endFlash: (message) => endFlash(message)
}

app.whenReady().then(() => {
  Object.keys(util).forEach((name) => {
    ipcMain.handle(name, (_, ...args) => {
      return util[name](...args)
    })
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    console.log('actived---')
  })
})
app.on('win-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 监听渲染进程发送的事件
ipcMain.on('showNotification', (event, message) => {
  const notification = new Notification({ title: 'Notification', body: message })
  notification.show()
})

ipcMain.on('startFlash', (event, message) => {
  clearInterval(timer)
  // 设置一个定时器来触发闪烁效果
  timer = setInterval(() => {
    win.flashFrame(true)
    setTimeout(() => {
      win.flashFrame(false)
    }, 1000) // 闪烁1秒钟
  }, 3000) // 每3秒钟闪烁一次
})

ipcMain.on('endFlash', (event, message) => {
  clearInterval(timer)
  win.flashFrame(false)
})
