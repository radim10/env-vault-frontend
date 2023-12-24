import { EnvironmentType } from '@/types/environments'
import { ProjectRole } from '@/types/projectAccess'
import { User } from '@/types/users'
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
  createdBy?: Pick<User, 'name' | 'avatarUrl'>
  // inherited from project
  userRole: ProjectRole
  //
  secretsLoaded: boolean
}

export interface SelectedEnvironmentState {
  data: SelectedEnvironment | null
  changelogFilter: 'secrets' | null
}

interface SelectedEnvironmentActions {
  reset: () => void
  set: (env: SelectedEnvironment) => void
  update: (
    locked: Partial<{
      name: string
      locked: boolean
      type: EnvironmentType
      secretsLoaded: boolean
    }>
  ) => void
  setChangelogFilter: (envChangelogFilter: 'secrets' | null) => void
  isAdminRole: () => boolean | null
  isEditorRole: () => boolean | null
  isViewerRole: () => boolean | null
}

export const useSelectedEnvironmentStore = create(
  devtools(
    immer<SelectedEnvironmentState & SelectedEnvironmentActions>((set, get) => ({
      data: null,
      changelogFilter: null,
      set: (env) => set({ data: env }),
      reset: () => set({ data: null }),
      setChangelogFilter: (changelogFilter) => {
        set((state) => {
          state.changelogFilter = changelogFilter
        })
      },
      update: ({ name, locked, type, secretsLoaded }) => {
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
            if (secretsLoaded !== undefined) {
              state.data.secretsLoaded = secretsLoaded
            }
          }
        })
      },
      isViewerRole: () => {
        return get()?.data?.userRole === 'VIEWER' ?? null
      },
      isEditorRole: () => {
        return get()?.data?.userRole === 'EDITOR' ?? null
      },
      isAdminRole: () => {
        return get()?.data?.userRole === 'ADMIN' ?? null
      },
    })),
    {
      store: 'selectedEnv',
    }
  )
)
