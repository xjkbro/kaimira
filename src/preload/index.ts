import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import dataConfig from '../../resources/config.json'

// Custom APIs for renderer
const api = {
  config: async () => {
    try {
      const config = await ipcRenderer.invoke('get-config')
      console.log("Extracted Config:", config)
      return config
    } catch (error) {
      console.error("Failed to extract config:", error)
      return dataConfig
    }
  },
  updateWindowsConfig: (newWindowsConfig) => {
    // Here you would typically write the new config to a file or database
    console.log("Updated Config:", JSON.stringify(newWindowsConfig, null, 2))
    const newDataConfig = { ...dataConfig, windows: newWindowsConfig }
    ipcRenderer.invoke('update-config', newDataConfig) // Optionally send to main process
  },
  toggleFullScreen: () => ipcRenderer.invoke('toggle-full-screen'),
  takeScreenshot: () => ipcRenderer.invoke('take-screenshot'),
  sendPing: () => ipcRenderer.send('ping')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

