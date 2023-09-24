import { Secret } from '@/types/secrets'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type StateSecret = Secret & {
  hidden: boolean
  action: SecretAction | null
  updatedKey?: boolean
  updatedValue?: boolean
}

export enum SecretAction {
  Created,
  Updated,
  Archived,
  Deleted,
}

export interface EditedSecretsState {
  loaded: boolean
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
    loaded: false,
    secrets: [],
    reset: () => {
      set((state) => {
        state.secrets = []
        state.loaded = false
      })
    },
    set: (secrets) => {
      set((state) => {
        state.secrets = secrets
        state.loaded = true
      })
    },
    add: () => {
      set((state) => {
        state.secrets.push({
          key: '',
          value: '',
          hidden: false,
          action: SecretAction.Created,
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

        if (item.action === SecretAction.Created) {
          state.secrets.splice(index, 1)
        } else {
          if (item.action === SecretAction.Deleted) {
            item.action = null
          } else {
            item.action = SecretAction.Deleted
          }
        }
      }),

    toggleArchived: (index) =>
      set((state) => {
        const item = state?.secrets?.[index]

        if (item.action === SecretAction.Created) {
          // no action
        } else {
          if (item.action === SecretAction.Archived) {
            item.action = null
          } else {
            item.action = SecretAction.Archived
          }
        }
      }),

    updateValue: ({ index, origValue, newValue }) => {
      set((state) => {
        const item = state?.secrets?.[index]
        item.value = newValue

        if (item?.action !== SecretAction.Created) {
          if (origValue !== newValue) {
            item.action = SecretAction.Updated
            item.updatedValue = true
          } else if (item?.value === origValue && item.action === SecretAction.Updated) {
            item.action = null
            item.updatedValue = false
          }
        }
      })
    },

    updateKey: ({ index, origKey, newKey }) => {
      set((state) => {
        const item = state?.secrets?.[index]
        item.key = newKey
          .replace(/[^a-zA-Z0-9 ]/g, '_')
          .replace(/ /g, '_')
          .toUpperCase()

        if (item?.action !== SecretAction.Created) {
          if (item?.key !== origKey) {
            item.action = SecretAction.Updated
            item.updatedKey = true
          } else if (item?.key === origKey && item.action === SecretAction.Updated) {
            item.action = null
            item.updatedKey = false
          }
        }
      })
    },
  }))
)
