import { EnvironmentType } from '@/types/environments'
import { ProjectRole } from '@/types/projectAccess'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface SelectedEnvironment {
  workspaceId: string
  projectName: string
  //
  name: string
  createdAt: string
  locked: boolean
  type: EnvironmentType
  // inherited from project
  userRole: ProjectRole
}

export interface SelectedEnvironmentState {
  data: SelectedEnvironment | null
  changelogFilter: 'secrets' | null
}

interface SelectedEnvironmentActions {
  reset: () => void
  set: (env: SelectedEnvironment) => void
  update: (locked: Partial<{ name: string; locked: boolean; type: EnvironmentType }>) => void
  setChangelogFilter: (envChangelogFilter: 'secrets' | null) => void
  isOwnerRole: () => boolean | null
  isAdminRole: () => boolean | null
  isMemberRole: () => boolean | null
}

export const useSelectedEnvironmentStore = create(
  devtools(
    immer<SelectedEnvironmentState & SelectedEnvironmentActions>((set,get) => ({
      data: null,
      changelogFilter: null,
      set: (env) => set({ data: env }),
      reset: () => set({ data: null }),
      setChangelogFilter: (changelogFilter) => {
        set((state) => {
          state.changelogFilter = changelogFilter
        })
      },
      update: ({ name, locked, type }) => {
        set((state) => {
          if (state.data) {
            if (locked !== undefined) {
              state.data.locked = locked
            }
            if (name !== undefined) {
              state.data.name = name
            }
            if (type !== undefined) {
              state.data.type = type
            }
          }
        })
      },
      isMemberRole: () => {
        return get()?.data?.userRole === 'MEMBER' ?? null
      },
      isAdminRole: () => {
        return get()?.data?.userRole === 'ADMIN' ?? null
      },
      isOwnerRole: () => {
        return get()?.data?.userRole === 'OWNER' ?? null
      },
    })),
    {
      store: 'selectedEnv',
    }
  )
)
