import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(app.getAppPath(), "build/icon.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html')
    win.loadFile(indexPath)
  }
}

app.whenReady().then(createWindow)