import { UserSession } from '@/types/session'
import { create } from 'zustand'

export interface SessionState {
  data: UserSession | null
}

export interface SessionActions {
  set: (user: UserSession | null) => void
}

const useSessionStore = create<SessionState & SessionActions>((set) => ({
  data: null,
  set: (user) => set({ data: user }),
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
