import { UserSession } from '@/types/session'
import { CurrentUser, User, WorkspaceUserRole } from '@/types/users'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// NOTE: in production
// type CurrentUser = User & {
//   role: WorkspaceUserRole
// }

export interface CurrentUserState {
  data: CurrentUser | null
  isMemberRole: () => boolean | null
  isAdminRole: () => boolean | null
  isOwnerRole: () => boolean | null
}

interface CurrentUserActions {
  set: (user: CurrentUser | null) => void
}

export const useCurrentUserStore = create(
  devtools(
    immer<CurrentUserState & CurrentUserActions>((set, get) => ({
      // data: { role: WorkspaceUserRole.OWNER },
      // data: { role: WorkspaceUserRole.OWNER, email:  },
      data: null,
      set: (env) => set({ data: env }),
      isMemberRole: () => {
        return get()?.data?.role === 'MEMBER' ?? null
      },
      isAdminRole: () => {
        return get()?.data?.role === 'ADMIN' ?? null
      },
      isOwnerRole: () => {
        return get()?.data?.role === 'OWNER' ?? null
      },
    })),
    {
      store: 'currentUser',
    }
  )
)

export default useCurrentUserStore
