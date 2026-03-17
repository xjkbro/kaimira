import React, { useEffect, useRef, useState } from 'react'

function playAlarm() {
  const ctx = new AudioContext()
  const beeps = 5
  const beepDuration = 0.18
  const gapDuration = 0.1
  for (let i = 0; i < beeps; i++) {
    const start = ctx.currentTime + i * (beepDuration + gapDuration)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = i % 2 === 0 ? 880 : 1100
    gain.gain.setValueAtTime(0.8, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + beepDuration)
    osc.start(start)
    osc.stop(start + beepDuration)
  }
}

function Pomodoro() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isOnbreak, setIsOnBreak] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [breakTimeLeft, setBreakTimeLeft] = useState(0)
  const [timePattern] = useState('50/10')
  const endTimeRef = useRef(0)

  function handlePlay() {
    const [workTime] = timePattern.split('/').map(Number)
    if (isOnbreak && isPaused) {
      endTimeRef.current = Date.now() + breakTimeLeft * 1000
    } else if (isPaused) {
      endTimeRef.current = Date.now() + timeLeft * 1000
    } else {
      endTimeRef.current = Date.now() + workTime * 60 * 1000
    }
    setIsPaused(false)
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
    setIsPaused(true)
  }

  function handleStop() {
    setIsRunning(false)
    setIsPaused(false)
    setIsOnBreak(false)
    setTimeLeft(0)
    setBreakTimeLeft(0)
  }

  useEffect(() => {
    if (!isRunning) return
    const timer = setInterval(() => {
      const remaining = endTimeRef.current - Date.now()
      if (remaining <= 0) {
        clearInterval(timer)
        if (isOnbreak) {
          setIsRunning(false)
          setIsOnBreak(false)
          setBreakTimeLeft(0)
          playAlarm()
        } else {
          setTimeLeft(0)
          playAlarm()
          const [, breakTime] = timePattern.split('/').map(Number)
          endTimeRef.current = Date.now() + breakTime * 60 * 1000
          setIsOnBreak(true)
        }
      } else {
        if (isOnbreak) {
          setBreakTimeLeft(Math.ceil(remaining / 1000))
        } else {
          setTimeLeft(Math.ceil(remaining / 1000))
        }
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, isOnbreak, timePattern])

  const active = isRunning || isPaused || isOnbreak

  return (
    <>
      <div className="rounded-lg hover:bg-white/10 w-full h-full flex flex-col items-center justify-center dark:text-white/80">
        <p className="mb-2 flex flex-col items-center justify-center">
          <span className="text-xs" onClick={()=>playAlarm()}>Your Time Pattern is {timePattern}</span>
          <span className="text-xs">{isOnbreak ? 'Break' : 'Work'}</span>
        </p>
        <div className="text-4xl font-mono mb-4">
          {isOnbreak ? breakTimeLeft : timeLeft}s
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePlay}
            disabled={isRunning}
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            title="Play"
          >
            ▶
          </button>
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            title="Pause"
          >
            ⏸
          </button>
          <button
            onClick={handleStop}
            disabled={!active}
            className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            title="Stop"
          >
            ⏹
          </button>
        </div>
      </div>
    </>
  )
}

export default Pomodoro
