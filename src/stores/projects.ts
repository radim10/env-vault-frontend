import { ProjectSort } from '@/types/projects'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface ProjectsState {
  sort: ProjectSort
  search: string
  loaded: null | { empty: boolean }
}

interface ProjectsActions {
  setLoaded: (data: null | { empty: boolean }) => void
  setSort: (sort: ProjectSort) => void
  setSearch: (search: string) => void
}

export const useProjectsStore = create(
  devtools(
    persist(
      immer<ProjectsState & ProjectsActions>((set, _) => ({
        sort: ProjectSort.CreatedDesc,
        loaded: null,
        search: '',
        setSort: (sort) => {
          set((state) => {
            state.sort = sort
          })
        },
        setSearch: (search) => {
          set((state) => {
            state.search = search
          })
        },
        setLoaded: (loaded) => {
          set((state) => {
            state.loaded = loaded
          })
        },
      })),
      {
        name: 'projects',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !['search'].includes(key) && !['loaded'].includes(key)
            )
          ),
      }
    )
  )
)
