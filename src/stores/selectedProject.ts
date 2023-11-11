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
  isOwnerRole: () => boolean | null
  isAdminRole: () => boolean | null
  isMemberRole: () => boolean | null
  reset: () => void
}

export const useSelectedProjectStore = create(
  devtools(
    immer<SelectedProjectState & SelectedProjectAction>((set, get) => ({
      data: null,
      set: (project) => set({ data: project }),
      reset: () => set({ data: null }),
      update: (data) => {
        // TODO :???
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
    }))
  )
)
