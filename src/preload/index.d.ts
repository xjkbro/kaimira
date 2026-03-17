import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      toggleFullScreen(): void
      config: any
      updateWindowsConfig: any,
      takeScreenshot: () => Promise<string>
      sendPing: () => void
    }
  }
}
