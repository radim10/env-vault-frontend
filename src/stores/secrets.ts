import { Secret } from '@/types/secrets'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type StateSecret = Secret & {
  hidden: boolean
  showDescription?: boolean
  action: SecretAction | null
  // updatedKey?: boolean
  // updatedValue?: boolean
  newKey?: string
  newValue?: string
  newDescription?: string
}

export enum SecretAction {
  Created,
  Updated,
  Archived,
  Deleted,
}

export interface EditedSecretsState {
  search: string
  loaded: boolean
  secrets: StateSecret[]
}

export interface EditSecretsActions {
  setSearch: (search: string) => void
  reset: () => void
  set: (secrets: StateSecret[]) => void
  add: () => void
  undoChanges: (args: { index: number; origItem: Secret }) => void
  toggleVisibility: (index: number) => void
  toggleDescription: (index: number) => void
  toggleDescriptionAll: (hidden: boolean) => void
  toggleDeleted: (index: number) => void
  toggleArchived: (index: number) => void
  toggleVisibilityAll: (hidden: boolean) => void
  updateValue: (args: { index: number; origValue: string; newValue: string }) => void
  updateKey: (args: { index: number; origKey: string; newKey: string }) => void
  updateDescription: (args: {
    index: number
    origDescription?: string
    newDescription: string
  }) => void
}

export const useEditedSecretsStore = create(
  immer<EditedSecretsState & EditSecretsActions>((set) => ({
    search: '',
    loaded: false,
    secrets: [],
    setSearch: (search) => {
      set((state) => {
        state.search = search
      })
    },
    reset: () => {
      set((state) => {
        state.secrets = []
        state.loaded = false
        state.search = ''
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
          showDescription: state?.secrets?.[index]?.showDescription,
        }
      })
    },
    toggleVisibility: (index) => {
      set((state) => {
        state.secrets[index].hidden = !state.secrets[index].hidden
      })
    },

    toggleVisibilityAll: (hidden) => {
      set((state) => {
        for (const item of state.secrets) {
          item.hidden = hidden
        }
      })
    },

    toggleDescriptionAll: (hidden) => {
      set((state) => {
        for (const item of state.secrets) {
          if (
            item.description ||
            (item.newDescription !== undefined && item.newDescription?.length > 0)
          ) {
            item.showDescription = !hidden
          }
        }
      })
    },

    toggleDescription: (index) => {
      set((state) => {
        state.secrets[index].showDescription = !state.secrets[index].showDescription
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

        if (item.action === SecretAction.Created) {
          item.newValue = newValue
        } else {
          if (origValue !== newValue) {
            item.action = SecretAction.Updated
            item.newValue = newValue
          } else if (item?.value === origValue && item.action === SecretAction.Updated) {
            item.action = null
            item.newValue = undefined
          }
        }
      })
    },

    updateKey: ({ index, origKey, newKey }) => {
      set((state) => {
        const item = state?.secrets?.[index]
        const k = newKey
          .replace(/[^a-zA-Z0-9 ]/g, '_')
          .replace(/ /g, '_')
          .toUpperCase()

        if (item.action === SecretAction.Created) {
          item.newKey = k
        } else {
          if (newKey !== origKey) {
            item.action = SecretAction.Updated
            item.newKey = k
          } else if (item?.key === origKey && item.action === SecretAction.Updated) {
            item.action = null
            item.newKey = undefined
          }
        }
      })
    },

    updateDescription: ({ index, origDescription, newDescription }) => {
      set((state) => {
        const item = state?.secrets?.[index]

        if (item.action === SecretAction.Created) {
          item.newDescription = newDescription
        } else {
          if (newDescription !== origDescription) {
            item.newDescription = newDescription
          } else if (item?.description === newDescription) {
            item.newDescription = undefined
          }
        }
      })
    },
  }))
)
