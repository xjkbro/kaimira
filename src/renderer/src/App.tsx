import React, { useState } from 'react';
import { cn } from './lib/utils';
import useDarkMode from './lib/hooks';
import { FreeformView } from './components/FreeformView';
import Controls from './components/Controls';

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.api.sendPing()
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const createScreenshot = async (): Promise<void> => {
    try {
      await window.api.takeScreenshot()
    } catch (error) {
      console.error('Failed to take screenshot:', error)
    }
  }


  return (
    <main className={cn("flex flex-col items-center justify-center h-screen gap-4", isDarkMode && "dark")}>

      <FreeformView />
      <Controls />
      {/* <div className="flex">
        <button onClick={ipcHandle}>Send IPC Ping</button>
        <button onClick={createScreenshot}>Screenshot</button>
        <button onClick={() => setLocked(!locked)}>{locked ? 'Unlock' : 'Lock'}</button>
        <button onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </div> */}
    </main>
  )
}

export default App

