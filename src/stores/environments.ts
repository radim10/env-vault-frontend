import { EnvGroupBy, EnvSortOption, EnvironmentType } from '@/types/environments'
import { ListEnvironment } from '@/types/projects'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

export interface EnvironmentListState {
  environments: ListEnvironment[]
  groupedEnvironments: { [key: string]: ListEnvironment[] } | null

  sort: EnvSortOption
  groupBy: EnvGroupBy | null
}

interface EnvironmentListActions {
  setEnvironments: (environments: ListEnvironment[]) => void
  setGroupedEnvironments: (environments: ListEnvironment[] | null) => void
  isGroupedEmpty: () => boolean
  setSort: (sort: EnvSortOption) => void
  setGroupBy: (groupBy: EnvGroupBy | null) => void
  unGroup: () => void
}

const groupOrder = [
  EnvironmentType.DEVELOPMENT,
  EnvironmentType.TESTING,
  EnvironmentType.STAGING,
  EnvironmentType.PRODUCTION,
]

export const useEnvironmentListStore = create(
  persist(
    immer<EnvironmentListState & EnvironmentListActions>((set, get) => ({
      environments: [],
      groupedEnvironments: null,
      sort: EnvSortOption.CreatedDesc,
      groupBy: null,
      setEnvironments: (environments) => {
        set((state) => {
          state.environments = environments
          state.groupedEnvironments = null
        })
        get().setSort(get().sort)
      },
      setGroupedEnvironments: (environments) => {
        if (environments === null) {
          set((state) => {
            state.groupedEnvironments = null
          })
        } else {
          const groupedByType: { [key: string]: ListEnvironment[] } = {}

          const sorted = [...environments].sort((a, b) => {
            const typeA = a.type
            const typeB = b.type

            // Get the index of typeA and typeB in the custom order array
            const indexA = groupOrder.indexOf(typeA)
            const indexB = groupOrder.indexOf(typeB)

            // Compare the indices to determine the sorting order
            return indexA - indexB
          })

          sorted.forEach((obj) => {
            const { type, locked } = obj

            if (get().groupBy === EnvGroupBy.Lock) {
              if (!groupedByType[locked.toString()]) {
                groupedByType[locked.toString()] = []
              }
              groupedByType[locked.toString()].push(obj)
            } else {
              if (!groupedByType[type]) {
                groupedByType[type] = []
              }
              groupedByType[type].push(obj)
            }
          })

          //  sort
          Object.keys(groupedByType).forEach((key) => {
            groupedByType[key] = handleSort(groupedByType[key], get().sort)
          })

          set((state) => {
            state.groupedEnvironments = groupedByType
          })
        }
        // get().setSort(get().sort)
        // get().setGroupBy(get().groupBy)
      },
      unGroup: () => {
        set((state) => {
          if (state.groupedEnvironments) {
            const resultArray = Object.values(state.groupedEnvironments).flat()

            state.groupBy = null
            state.environments = resultArray
            state.groupedEnvironments = null
          }
        })
      },
      isGroupedEmpty: () => {
        if (!get().groupedEnvironments) {
          return true
        }
        return areAllArraysEmpty(get().groupedEnvironments ?? {})
      },
      setSort: (sort) => {
        set((state) => {
          if (!state.groupBy) {
            const sorted = handleSort(state.environments, sort)

            state.environments = sorted
            state.sort = sort
          } else {
            for (const key in state.groupedEnvironments) {
              state.groupedEnvironments[key] = handleSort(state.groupedEnvironments[key], sort)
              state.sort = sort
            }
          }
        })
      },
      setGroupBy: (groupBy) => {
        const groupedByType: { [key: string]: ListEnvironment[] } = {}

        let arr = !get().groupBy
          ? get().environments
          : Object.values(get().groupedEnvironments ?? {}).flat()

        if (groupBy === EnvGroupBy.Type) {
          arr = [...arr].sort((a, b) => {
            const typeA = a.type
            const typeB = b.type

            // Get the index of typeA and typeB in the custom order array
            const indexA = groupOrder.indexOf(typeA)
            const indexB = groupOrder.indexOf(typeB)

            // Compare the indices to determine the sorting order
            return indexA - indexB
          })
        }

        arr.forEach((obj) => {
          const { type, locked } = obj

          if (groupBy === EnvGroupBy.Lock) {
            const l = locked ? 'Locked' : 'Unlocked'
            if (!groupedByType[l]) {
              groupedByType[l] = []
            }
            groupedByType[l].push(obj)
          } else {
            if (!groupedByType[type]) {
              groupedByType[type] = []
            }
            groupedByType[type].push(obj)
          }
        })

        set((state) => {
          state.environments = []
          state.groupedEnvironments = groupedByType
          state.groupBy = groupBy
        })
      },
    })),
    {
      name: 'env-list-options',
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['environments'].includes(key) && !['groupedEnvironments'].includes(key)
          )
        ),
    }
  )
)

const handleSort = (arr: ListEnvironment[], sort: EnvSortOption | null): ListEnvironment[] => {
  let sorted = arr

  if (sort === EnvSortOption.CreatedDesc) {
    sorted = arr.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      if (dateA > dateB) {
        return -1 // Return a negative number to place "a" before "b"
      } else if (dateA < dateB) {
        return 1 // Return a positive number to place "b" before "a"
      } else {
        return 0 // Dates are equal, no change in order
      }
    })
  } else if (sort === EnvSortOption.CreatedAsc) {
    sorted = arr.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      if (dateA < dateB) {
        return -1 // Return a negative number to place "a" before "b"
      } else if (dateA > dateB) {
        return 1 // Return a positive number to place "b" before "a"
      } else {
        return 0 // Dates are equal, no change in order
      }
    })
  } else if (sort === EnvSortOption.SecretsCountDesc) {
    sorted = arr.sort((a, b) => b.secretsCount - a.secretsCount)
  } else if (sort === EnvSortOption.SecretsCountAsc) {
    sorted = arr.sort((a, b) => a.secretsCount - b.secretsCount)
  } else if (sort === EnvSortOption.AlphabeticalAsc) {
    sorted = arr.sort((a, b) => {
      const nameA = a.name.toLowerCase() // Convert names to lowercase for case-insensitive sorting
      const nameB = b.name.toLowerCase()

      if (nameA < nameB) {
        return -1 // a should come before b in the sorted order
      }
      if (nameA > nameB) {
        return 1 // a should come after b in the sorted order
      }
      return 0 // a and b are equal in terms of sorting
    })
  } else if (sort === EnvSortOption.AlphabeticalDesc) {
    sorted = arr.sort((a, b) => {
      const nameA = a.name.toLowerCase() // Convert names to lowercase for case-insensitive sorting
      const nameB = b.name.toLowerCase()

      if (nameA > nameB) {
        return -1 // a should come before b in the sorted order
      }
      if (nameA < nameB) {
        return 1 // a should come after b in the sorted order
      }
      return 0 // a and b are equal in terms of sorting
    })
  }

  return sorted
}

export function areAllArraysEmpty(obj: Record<string, any>): boolean {
  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length > 0) {
      return false // Found a non-empty array, return false
    }
  }
  return true // All arrays are empty
}
