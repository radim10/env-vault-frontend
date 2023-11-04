import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { WorkspaceUser } from '@/types/users'
import { immer } from 'zustand/middleware/immer'

export type SelectedUser = WorkspaceUser

export interface SelectedUserState {
  data: SelectedUser | null
}

interface SelectedUserActions {
  set: (user: SelectedUser) => void
  reset: () => void
}

export const useSelectedUserStore = create(
  devtools(
    immer<SelectedUserState & SelectedUserActions>((set) => ({
      data: null,
      set: (env) => set({ data: env }),
      reset: () => set({ data: null }),
    })),
    {
      store: 'SelectedUser',
    }
  )
)
