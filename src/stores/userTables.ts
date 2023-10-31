import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export interface UserTablesPaginationState {
  workspacePageSize?: number
  invitationsPageSize?: number
}

export interface UserTablesPaginationActions {
  setWorkspacePageSize: (workspacePageSize: number) => void
  setInvitationsPageSize: (invitationsPageSize: number) => void
}


export const useUserTablesPaginationStore = create(
  devtools(
    immer<UserTablesPaginationState & UserTablesPaginationActions>((set) => ({
      invitationsPageSize: 5,
      workspacePageSize: 5,
      setWorkspacePageSize: (workspacePageSize) => set((state) => {
        state.workspacePageSize = workspacePageSize
      }),
      setInvitationsPageSize: (invitationsPageSize) => set((state) => {
        state.invitationsPageSize = invitationsPageSize
      }),
    })
    )
  )
)

export default useUserTablesPaginationStore
