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
  update: (data: Partial<CurrentUser>) => void
}

export const useCurrentUserStore = create(
  devtools(
    immer<CurrentUserState & CurrentUserActions>((set, get) => ({
      // data: { role: WorkspaceUserRole.OWNER },
      // data: { role: WorkspaceUserRole.OWNER, email:  },
      // data: null,
      data: {
        name: '',
        email: '',
        role: WorkspaceUserRole.OWNER,
        id: 'ds',
        avatarUrl: null,
        workspaces: [{ name: 'ds', id: 'ds', selected: true }],
        selectedWorkspace: { name: 'ds', id: 'ds', role: WorkspaceUserRole.OWNER },
      },
      set: (data) => set({ data }),
      update: (data) => {
        set((state) => {
          if (state.data) {
            state.data = { ...state.data, ...data }
          }
        })
      },
      isMemberRole: () => {
        return get()?.data?.selectedWorkspace?.role === 'MEMBER' ?? null
      },
      isAdminRole: () => {
        return get()?.data?.selectedWorkspace?.role === 'ADMIN' ?? null
      },
      isOwnerRole: () => {
        return get()?.data?.selectedWorkspace?.role === 'OWNER' ?? null
      },
    })),
    {
      store: 'currentUser',
    }
  )
)

export default useCurrentUserStore
