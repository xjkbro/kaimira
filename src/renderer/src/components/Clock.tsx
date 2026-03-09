import React from 'react'

function Clock() {
  const now = new Date()
  const getTodaysDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[now.getDay()]
  }
  const getMonthName = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[now.getMonth()]
  }
  return (
    <>
      <div className="rounded-lg hover:bg-white/10 w-full h-full flex flex-col items-center justify-center  text-white/80">
        <p className="mb-2 flex flex-col items-center justify-center text-lg">
            <span className="text-xs">Today is</span>{getTodaysDay()} {getMonthName()} {now.getDate()}, {now.getFullYear()}
        </p>
        <div className="text-4xl font-mono">{now.toLocaleTimeString()}</div>
      </div>
    </>
  )
}

export default Clock
