import { Project } from '@/types/projects'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type SelectedProject = Project

export interface SelectedProjectState {
  data: SelectedProject | null
}

interface SelectedProjectAction {
  set: (project: SelectedProject) => void
  update: (data: Partial<SelectedProject>) => void
  reset: () => void
}

export const useSelectedProjectStore = create(
  devtools(
    immer<SelectedProjectState & SelectedProjectAction>((set) => ({
      data: null,
      set: (project) => set({ data: project }),
      reset: () => set({ data: null }),
      update: (data) => {
        // TODO :???
      },
    }))
  )
)
