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
}

interface SelectedEnvironmentActions {
  set: (env: SelectedEnvironment) => void
  updateLocked: (locked: boolean) => void
  reset: () => void
}

export const useSelectedEnvironmentStore = create(
  devtools(
    immer<SelectedEnvironmentState & SelectedEnvironmentActions>((set) => ({
      data: null,
      set: (env) => set({ data: env }),
      updateLocked: (locked) => {
        set((state) => {
          if (state.data) {
            state.data.locked = locked
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
