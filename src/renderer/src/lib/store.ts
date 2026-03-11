import { create } from 'zustand'

interface WindowItem {
  id: string
  x: number
  y: number
  w: number
  h: number
  z: number
  componentType?: string
  [key: string]: any
}

interface ConfigStore {
  items: WindowItem[]
  zCounter: number
  initialized: boolean
  loadConfig: () => Promise<void>
  setItems: (items: WindowItem[]) => void
  updateItem: (id: string, data: Partial<WindowItem>) => void
  removeItem: (id: string) => void
  bringToFront: (id: string) => void
  saveConfig: () => Promise<void>
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  items: [],
  zCounter: 3,
  initialized: false,

  loadConfig: async () => {
    const config = await window.api.config()
    set({ items: config.windows || [], initialized: true })
  },

  setItems: (items) => set({ items }),

  updateItem: (id, data) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...data } : item)),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  bringToFront: (id) =>
    set((state) => {
      const next = state.zCounter + 1
      return {
        zCounter: next,
        items: state.items.map((item) => (item.id === id ? { ...item, z: next } : item)),
      }
    }),

  saveConfig: async () => {
    const { items } = get()
    await window.api.updateWindowsConfig(items)
  },
}))
