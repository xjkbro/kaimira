import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import sudo from 'sudo-prompt'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))


  // Get config handler
  ipcMain.handle('get-config', async () => {
    const configPath = join(app.getPath('userData'), 'config.json')
    console.log("Config Path:", configPath)
    const fs = require('fs')
    try {
      const configData = await fs.promises.readFile(configPath, 'utf-8')
      const config = JSON.parse(configData)
      console.log("Config Data:", config)
      return config
    } catch (error) {
      console.error("Failed to read config:", error)
      return { windows: [] } // Return default config if reading fails
    }
  })
  // Listen for config updates from renderer
  ipcMain.handle('update-config', async (event, newWindowsConfig) => {
    console.log("Received new config from renderer:", JSON.stringify(newWindowsConfig, null, 2))
    const configPath = join(app.getPath('userData'), 'config.json')
    console.log(configPath)
    const fs = require('fs')
    await fs.writeFileSync(configPath, JSON.stringify(newWindowsConfig , null, 2))
  })

  // Screenshot handler
  ipcMain.handle('take-screenshot', async () => {
    console.log('Taking screenshot...')
    const { exec } = require('child_process')
    return new Promise((resolve, reject) => {
      exec('gnome-screenshot', (error, stdout, stderr) => {
        if (error) {
          console.error('Screenshot error:', error)
          reject(error)
          return
        }
        resolve('Screenshot taken successfully')
      })
    })
  })

  ipcMain.handle('toggle-full-screen', async (event) => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      const isFullScreen = window.isFullScreen()
      window.setFullScreen(!isFullScreen)
    }
  })

  ipcMain.handle('run-system-command', async (event, action) => {
    const options = {
      name: 'My Govee Desktop App'
      // icns: '/path/to/icon.icns', // Optional: path to an icon for the prompt
    }
    return new Promise((resolve, reject) => {
      // Define allowed commands here (NEVER trust raw strings from the UI)
      const commands = {
        'espanso-restart': 'pwd',
        'update-system': 'apt update'
      }

      const command = commands[action];

      if (!command) {
        return reject(new Error('Unauthorized command attempt.'))
      }

      // Use sudo.exec instead of child_process.exec
      sudo.exec(command, options, (error, stdout, stderr) => {
        if (error) {
          console.error('Sudo Error:', error)
          reject(error)
          return
        }

        // Return the output back to React
        resolve(stdout || stderr)
      })
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
