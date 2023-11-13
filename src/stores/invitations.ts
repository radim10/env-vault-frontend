import { WorkspaceInvitation } from '@/types/users'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface InvitationsState {
  newInvitation: WorkspaceInvitation | null
  resendingIds: string[]
  resentIds: string[]
  errorIds: string[]
}

export interface InvitationsActions {
  setResendingIds: (resendingIds: string[]) => void
  setResentIds: (resendingIds: string[]) => void
  setResentId: (resentId: string) => void
  setErrorId: (errorId: string) => void
  addResendingId: (id: string) => void
  addResentId: (id: string) => void
  setNewInvitation: (newInvitation: WorkspaceInvitation | null) => void
  reset: () => void
}

export const useInvitationsStore = create(
  devtools(
    immer<InvitationsState & InvitationsActions>((set) => ({
      resendingIds: [],
      resentIds: [],
      errorIds: [],
      newInvitation: null,
      setNewInvitation: (newInvitation) => {
        set((state) => {
          state.newInvitation = newInvitation
        })
      },
      setResendingIds: (resendingIds) => {
        set((state) => {
          state.resendingIds = resendingIds
        })
      },
      setResentIds: (resentids) => {
        set((state) => {
          state.resentIds = resentids
        })
      },

      setResentId: (resentId) => {
        set((state) => {
          state.resendingIds = state.resendingIds.filter((id) => id !== resentId)
          state.resentIds.push(resentId)
        })
      },

      setErrorId: (errorId) => {
        set((state) => {
          state.resendingIds = state.resendingIds.filter((id) => id !== errorId)
          state.errorIds.push(errorId)
        })
      },

      addResentId: (id) => {
        set((state) => {
          state.resentIds.push(id)
        })
      },

      addResendingId: (id) => {
        set((state) => {
          state.resendingIds.push(id)
        })
      },

      reset: () => {
        set((state) => {
          state.resendingIds = []
          state.resentIds = []
          state.errorIds = []
        })
      },
    }))
  )
)

// const invitationsStore = createStore<InvitationsState & InvitationsActions>((set) => ({
//   resendingIds: [],
//   resentIds: [],
//   errorIds: [],
//   setResendingIds: (updated) => set((state) => updated as any),
//   setResentIds: (updated) => set((state) => updated as any),
// }))
//
// const { getState, setState } = invitationsStore
//
// export { invitationsStore, getState, setState }
