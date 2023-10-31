import { WorkspaceInvitation } from '@/types/users'
import { createStore } from 'zustand/vanilla'

export interface InvitationsState {
  newInvitation?: WorkspaceInvitation
  resendingIds: string[]
  resentIds: string[]
  errorIds: string[]
}

export interface InvitationsActions {
  setResendingIds: (resendingIds: string[]) => void
  setResentIds: (resendingIds: string[]) => void
}

// export const useInvitationsStore = create(
//   devtools(
//     immer<InvitationsState & InvitationsActions>((set) => ({
//       resendingIds: [],
//       setResendingIds: (resendingIds) => {
//         set((state) => {
//           state.resendingIds = resendingIds
//         })
//       },
//     }))
//   )
// )
//

const invitationsStore = createStore<InvitationsState & InvitationsActions>((set) => ({
  resendingIds: [],
  resentIds: [],
  errorIds: [],
  setResendingIds: (updated) => set((state) => updated as any),
  setResentIds: (updated) => set((state) => updated as any),
}))

const { getState, setState } = invitationsStore

export { invitationsStore, getState, setState }
