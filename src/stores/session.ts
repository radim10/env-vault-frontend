import { UserSession } from '@/types/session'
import { create } from 'zustand'

export interface SessionState {
  data: UserSession | null
}

export interface SessionActions {
  set: (user: UserSession | null) => void
}

// export const useSession = create<UseSessionState & UseSessionActions>((set) => ({
//   data: null,
//   set: (user) => set({ data: user }),
// }))

import { createStore } from 'zustand/vanilla'

const sessionStore = createStore<SessionState & SessionActions>((set) => ({
  data: null,
  set: (user) => set({ data: user }),
}))
const { getState, setState, subscribe } = sessionStore

export default sessionStore
