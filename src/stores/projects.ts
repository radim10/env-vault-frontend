import { ProjectSort } from '@/types/projects'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface ProjectsSortState {
  sort: ProjectSort
  setSort: (sort: ProjectSort) => void
}

export const useProjectsSortStore = create(
  devtools(
    persist<ProjectsSortState>(
      (set, _) => ({
        sort: ProjectSort.CreatedDesc,
        setSort: (sort) => set({ sort }),
      }),
      {
        name: 'projectsSort',
      }
    )
  )
)
