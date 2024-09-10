// eslint-disable-next-line @typescript-eslint/no-require-imports
const { app, protocol, BrowserWindow, globalShortcut } = require('electron')
// 需在当前文件内开头引入 Node.js 的 'path' 模块
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

app.commandLine.appendSwitch('--ignore-certificate-errors', 'true')
// 应用程序准备就绪之前，必须注册方案
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const createWindow = async () => {
  const window = new BrowserWindow({
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
  window.setMenu(null)

  if (app.isPackaged) {
    window.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
  } else {
    window.loadURL('http://localhost:8888/')
    // window.loadURL('http://localhost:5173/')
    window.webContents.openDevTools()
  }
  //通过CommandOrControl+Shift+i打开控制台
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    window.webContents.openDevTools()
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
