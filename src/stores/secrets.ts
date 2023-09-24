import { Secret } from '@/types/secrets'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type StateSecret = Secret & {
  hidden: boolean
  action: Action | null
  updatedKey?: boolean
  updatedValue?: boolean
}

enum Action {
  Created,
  Updated,
  Archived,
  Deleted,
}

export interface EditedSecretsState {
  secrets: StateSecret[]
}

export interface EditSecretsActions {
  reset: () => void
  set: (secrets: StateSecret[]) => void
  add: () => void
  undoChanges: (args: { index: number; origItem: Secret }) => void
  toggleVisibility: (index: number) => void
  toggleDeleted: (index: number) => void
  toggleArchived: (index: number) => void
  updateValue: (args: { index: number; origValue: string; newValue: string }) => void
  updateKey: (args: { index: number; origKey: string; newKey: string }) => void
}

export const useEditedSecretsStore = create(
  immer<EditedSecretsState & EditSecretsActions>((set) => ({
    secrets: [],
    reset: () => {
      set((state) => {
        state.secrets = []
      })
    },
    set: (secrets) => {
      set((state) => {
        state.secrets = secrets
      })
    },
    add: () => {
      set((state) => {
        state.secrets.push({
          key: '',
          value: '',
          hidden: false,
          action: Action.Created,
        })
      })
    },
    undoChanges: ({ index, origItem }) => {
      set((state) => {
        state.secrets[index] = {
          ...origItem,
          action: null,
          hidden: state?.secrets?.[index]?.hidden,
        }
      })
    },
    toggleVisibility: (index) => {
      set((state) => {
        state.secrets[index].hidden = !state.secrets[index].hidden
      })
    },

    toggleDeleted: (index) =>
      set((state) => {
        const item = state.secrets?.[index]

        if (item.action === Action.Created) {
          state.secrets.splice(index, 1)
        } else {
          if (item.action === Action.Deleted) {
            item.action = null
          } else {
            item.action = Action.Deleted
          }
        }
      }),

    toggleArchived: (index) =>
      set((state) => {
        const item = state?.secrets?.[index]

        if (item.action === Action.Created) {
          // no action
        } else {
          if (item.action === Action.Archived) {
            item.action = null
          } else {
            item.action = Action.Archived
          }
        }
      }),

    updateValue: ({ index, origValue, newValue }) => {
      set((state) => {
        const item = state?.secrets?.[index]
        item.value = newValue

        if (item?.action !== Action.Created) {
          if (origValue !== newValue) {
            item.action = Action.Updated
            item.updatedValue = true
          } else if (item?.value === origValue && item.action === Action.Updated) {
            item.action = null
            item.updatedValue = false
          }
        }
      })
    },

    updateKey: ({ index, origKey, newKey }) => {
      set((state) => {
        const item = state?.secrets?.[index]
        item.key = newKey.replace(/ /g, '_')

        if (item?.action !== Action.Created) {
          if (item?.key !== origKey) {
            item.action = Action.Updated
            item.updatedKey = true
          } else if (item?.key === origKey && item.action === Action.Updated) {
            item.action = null
            item.updatedKey = false
          }
        }
      })
    },
  }))
)
