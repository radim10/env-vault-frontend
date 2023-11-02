import { Team } from '@/types/teams'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type SelectedTeam = Team & { workspaceId: string }

export interface SelectedTeamState {
  data: SelectedTeam | null
}

interface SelectedTeamActions {
  set: (team: SelectedTeam) => void
  update: (data: Partial<Pick<Team, 'name' | 'description'>>) => void
  reset: () => void
}

export const useSelectedTeamStore = create(
  devtools(
    immer<SelectedTeamState & SelectedTeamActions>((set) => ({
      data: null,
      set: (env) => set({ data: env }),
      update: ({ name, description }) => {
        set((state) => {
          if (state.data) {
            if (name !== undefined) {
              state.data.name = name
            }
            if (description !== undefined) {
              state.data.description = description
            }
          }
        })
      },
      reset: () => set({ data: null }),
    })),
    {
      store: 'selectedTeam',
    }
  )
)
