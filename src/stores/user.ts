import { User, WorkspaceUserRole } from '@/types/users'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// NOTE: in production
// type CurrentUser = User & {
//   role: WorkspaceUserRole
// }

// NOTE: for testing
type CurrentUser = {
  role: WorkspaceUserRole
}

export interface CurrentUserState {
  data: CurrentUser | null
}

interface CurrentUserActions {
  set: (user: CurrentUser | null) => void
}

export const useSelectedUserStore = create(
  devtools(
    immer<CurrentUserState & CurrentUserActions>((set) => ({
      data: null,
      set: (env) => set({ data: env }),
    })),
    {
      store: 'currentUser',
    }
  )
)
