import { EnvironmentType } from '@/types/environments'
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
}

export interface SelectedEnvironmentState {
  data: SelectedEnvironment | null
  changelogFilter: 'secrets' | null
}

interface SelectedEnvironmentActions {
  set: (env: SelectedEnvironment) => void
  update: (locked: Partial<{ name: string; locked: boolean; type: EnvironmentType }>) => void
  setChangelogFilter: (envChangelogFilter: 'secrets' | null) => void
  reset: () => void
}

export const useSelectedEnvironmentStore = create(
  devtools(
    immer<SelectedEnvironmentState & SelectedEnvironmentActions>((set) => ({
      data: null,
      changelogFilter: null,
      set: (env) => set({ data: env }),
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
      reset: () => set({ data: null }),
    })),
    {
      store: 'selectedEnv',
    }
  )
)
