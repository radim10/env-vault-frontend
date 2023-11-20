import { create } from 'zustand'
import { Project } from '@/types/projects'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type SelectedProject = Project

export interface SelectedProjectState {
  data: SelectedProject | null
}

interface SelectedProjectAction {
  set: (project: SelectedProject) => void
  update: (data: Partial<SelectedProject>) => void
  isAdminRole: () => boolean | null
  isEditorRole: () => boolean | null
  isViewerRole: () => boolean | null
  reset: () => void
}

// const useSelectedProjectStore = (selector) =>
//   useStore<SelectedProjectState & SelectedProjectAction>(selectedProjectStore, selector)
//
// export { useSelectedProjectStore }

export const useSelectedProjectStore = create(
  devtools(
    immer<SelectedProjectState & SelectedProjectAction>((set, get) => ({
      data: null,
      set: (project) => set({ data: project }),
      reset: () => set({ data: null }),
      update: (data) => {
        // TODO :???
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
    }))
  )
)
