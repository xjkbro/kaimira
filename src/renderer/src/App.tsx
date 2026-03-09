import React, { useState } from 'react';
import Clock from './components/Clock';
import Notes from './components/Notes';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Rnd } from 'react-rnd';
import { cn } from './lib/utils';

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.api.sendPing()
  const [name, setName] = useState('Jason')
  const [locked, setLocked] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const createScreenshot = async (): Promise<void> => {
    try {
      await window.api.takeScreenshot()
    } catch (error) {
      console.error('Failed to take screenshot:', error)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">
        Welcome {name}
      </h1>
      <FreeformDesktop locked={locked} setLocked={setLocked} />
      <div className="flex">
        <button onClick={ipcHandle}>Send IPC Ping</button>
        <button onClick={createScreenshot}>Screenshot</button>
        <button onClick={() => setLocked(!locked)}>{locked ? 'Unlock' : 'Lock'}</button>
        <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </div>
    </div>
  )
}

const FreeformDesktop = ({ locked, setLocked }) => {
  // Component registry to avoid recreating elements
  const componentRegistry = {
    Clock: Clock,
    Notes: Notes,
    // Add more components here as needed
  };

  const [zCounter, setZCounter] = useState(3)

  // Your Config JSON state
  const [items, setItems] = useState([
    { id: 'win1', x: 50, y: 50, w: 300, h: 200, title: 'Browser', z: 1 },
    { id: 'win2', x: 400, y: 150, w: 350, h: 250, title: 'Notes', componentType: 'Notes', z: 2 },
    { id: 'win3', x: 500, y: 50, w: 250, h: 150, title: 'Clock', componentType: 'Clock', z: 3 },
  ]);

  const bringToFront = (id) => {
    const next = zCounter + 1
    setZCounter(next)
    setItems(items.map(item => item.id === id ? { ...item, z: next } : item))
  }

  const updateConfig = (id, data) => {
    const nextItems = items.map(item =>
      item.id === id ? { ...item, ...data } : item
    );
    setItems(nextItems);
    console.log("New Config JSON:", JSON.stringify(nextItems, null, 2));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {items.map((item) => (
        <Rnd
          key={item.id}
          style={{ zIndex: item.z }}
          size={{ width: item.w, height: item.h }}
          position={{ x: item.x, y: item.y }}
          disableDragging={locked}
          // enableResizing={!locked ? {
          //   top: true, bottom: true, left: true,
          //   topLeft: true, bottomLeft: true,
          //   right: true, topRight: true, bottomRight: true,
          // } : false}
          enableResizing={!locked}
          dragHandleClassName="drag-handle"
          // Update position on drag stop
          onDragStop={(e, d) => updateConfig(item.id, { x: d.x, y: d.y })}
          // Update size on resize stop
          onResizeStop={(e, direction, ref, delta, position) => {
            !locked &&
            updateConfig(item.id, {
              w: ref.offsetWidth,
              h: ref.offsetHeight,
              ...position,
            });
          }}
          bounds="parent"
        >

          <div className="relative w-full h-full bg-white/10 border border-white/20 rounded-lg shadow-2xl flex flex-col backdrop-blur-sm">
            {!locked && (
              <div className="absolute -right-10 flex flex-col gap-1.5 z-10">
                <div
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/40 border border-white/20 shadow-lg backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all"
                  title="Close"
                  onMouseDown={(e) => { e.stopPropagation(); removeItem(item.id); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </div>
                <div
                  className="drag-handle w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg backdrop-blur-sm flex items-center justify-center cursor-move transition-all"
                  title="Move"
                  onMouseDown={() => bringToFront(item.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 4h2v4.586l1.293-1.293 1.414 1.414L12 12.414l-3.707-3.707 1.414-1.414L11 8.586V4zM4 11v2h4.586l-1.293 1.293 1.414 1.414L12 11.586l-3.707-3.707-1.414 1.414L8.586 11H4zM13 20h-2v-4.586l-1.293 1.293-1.414-1.414L12 11.586l3.707 3.707-1.414 1.414L13 15.414V20zM20 13v-2h-4.586l1.293-1.293-1.414-1.414L11.586 12l3.707 3.707 1.414-1.414L15.414 13H20z"/>
                  </svg>
                </div>
                
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              {item.componentType && componentRegistry[item.componentType] ? (
                React.createElement(componentRegistry[item.componentType])
              ) : (
                <div className="p-4 text-white/80">
                  Component Content
                </div>
              )}
            </div>
          </div>

        </Rnd>
      ))}
    </div>
  );
};
export default App

