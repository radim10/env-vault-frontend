import { UserSession } from '@/types/session'
import { create } from 'zustand'

export interface SessionState {
  data: UserSession | null
  loggingOut: boolean
}

export interface SessionActions {
  set: (user: UserSession | null) => void
  setLoggingOut: (loggingOut: boolean) => void
}

const useSessionStore = create<SessionState & SessionActions>((set) => ({
  data: null,
  loggingOut: false,
  set: (user) => set({ data: user }),
  setLoggingOut: (loggingOut) => set({ loggingOut }),
}))

export default useSessionStore

// import { createStore } from 'zustand/vanilla'
//
// const sessionStore = createStore<SessionState & SessionActions>((set) => ({
//   data: null,
//   set: (user) => set({ data: user }),
// }))
// const { getState, setState, subscribe } = sessionStore

// export default sessionStore
