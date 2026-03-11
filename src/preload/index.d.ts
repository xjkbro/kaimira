import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      config: any
      updateWindowsConfig: any,
      takeScreenshot: () => Promise<string>
      sendPing: () => void
    }
  }
}
