import { create } from 'zustand'

export interface SelectedEnvironment {
  workspaceId: string
  projectName: string
  envName: string
}

export interface SelectedEnvironmentState {
  data: SelectedEnvironment | null
}

interface SelectedEnvironmentActions {
  set: (env: SelectedEnvironment) => void
  reset: () => void
}

export const useSelectedEnvironmentStore = create<
  SelectedEnvironmentState & SelectedEnvironmentActions
>((set) => ({
  data: null,
  set: (env) => set({ data: env }),
  reset: () => set({ data: null }),
}))
