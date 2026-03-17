import { useConfigStore } from '@renderer/lib/store'
import { LockIcon, LockOpenIcon, Maximize, MoonIcon, SunIcon } from 'lucide-react'

function Controls() {
  const { locked, setLocked, darkMode, setDarkMode } = useConfigStore()
  const btnClass =
    'w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-black/10 hover:bg-black/20 dark:bg-white/10 hover:dark:bg-white/20'
  const iconClass = 'w-4 h-4 text-black/70 dark:text-white/70'

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-10 hover:opacity-100 transition-opacity duration-300">
      <button className={btnClass} title="Toggle Fullscreen" onClick={() => window.api.toggleFullScreen()}>
        <Maximize className={iconClass} />
      </button>
      <button className={btnClass} onClick={() => setLocked(!locked)}>
        <span key={String(locked)} className="animate-toggle flex items-center justify-center">
          {locked ? <LockOpenIcon className={iconClass} /> : <LockIcon className={iconClass} />}
        </span>
      </button>
      <button className={btnClass} onClick={() => setDarkMode(!darkMode)}>
        <span key={String(darkMode)} className="animate-toggle flex items-center justify-center">
          {darkMode ? <SunIcon className={iconClass} /> : <MoonIcon className={iconClass} />}
        </span>
      </button>
    </div>
  )
}

export default Controls
