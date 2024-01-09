import { create } from 'zustand'

export interface UserExceedDialogState {
  opened: boolean
  open: () => void
  close: () => void
}

const userExceedDialogStore = create<UserExceedDialogState>((set, _) => ({
  opened: false,
  open: () => {
    set({ opened: true })
  },
  close: () => {
    set({ opened: false })
  },
}))

export default userExceedDialogStore
