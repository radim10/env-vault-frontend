import { UserSession } from '@/types/session'
import { create } from 'zustand'

export interface UseSessionState {
  data: UserSession | null
}

export interface UseSessionActions {
  set: (user: UserSession | null) => void
}

export const useSession = create<UseSessionState & UseSessionActions>((set) => ({
  data: null,
  set: (user) => set({ data: user }),
}))
