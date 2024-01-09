import { create } from 'zustand'

export interface CreditCardExpiredDialogState {
  opened: boolean
  open: () => void
  close: () => void
}

const useCreditCardExpiredStore = create<CreditCardExpiredDialogState>((set, _) => ({
  opened: false,
  open: () => {
    set({ opened: true })
  },
  close: () => {
    set({ opened: false })
  },
}))

export default useCreditCardExpiredStore
