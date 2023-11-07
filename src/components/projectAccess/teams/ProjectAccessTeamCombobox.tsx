import clsx from 'clsx'
import { useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Label } from '../../ui/label'
import { Icons } from '../../icons'
import { Input } from '../../ui/input'
import { useDebounce, useUpdateEffect } from 'react-use'
import { QueryClient } from '@tanstack/react-query'
import { ScrollArea } from '../../ui/scroll-area'
import { ListTeam } from '@/types/teams'
import { useSearchSelectProjectAccessTeams } from '@/api/queries/projectAccess'
import { ProjectAccessTeam, ProjectRole } from '@/types/projectAccess'

interface Props {
  workspaceId: string
  project: string
  queryClient: QueryClient
  disabled?: boolean

  selectedTeams: ProjectAccessTeam[]
  onSelect: (users: ListTeam[]) => void
}

const ProjectAccessTeamCombobox: React.FC<Props> = ({
  workspaceId,
  project,
  queryClient,
  disabled,
  selectedTeams,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { data: items, refetch } = useSearchSelectProjectAccessTeams(
    {
      workspaceId,
      search: inputValue,
      projectName: project,
    },
    {
      enabled: false,
      cacheTime: 3600,
      onSettled: (e) => {
        setIsLoading(false)
      },
    }
  )

  // TODO:
  const getExistingData = (search: string) => {
    const data = queryClient.getQueryData(['workspace', workspaceId, search, 'project', project])
    return data
  }

  useDebounce(
    () => {
      if (isLoading) {
        refetch()
      }
    },
    500,
    [isLoading]
  )

  useUpdateEffect(() => {
    const existingData = getExistingData(inputValue)

    if (inputValue?.length > 1) {
      if (!existingData) {
        setIsLoading(true)
      }
    } else setIsLoading(false)
  }, [inputValue])

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } = useMultipleSelection({
    selectedItems: selectedTeams,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          if (newSelectedItems) {
            onSelect(newSelectedItems)
          }
          break
        default:
          break
      }
    },
  })
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: items ?? [],
    itemToString(item) {
      return item ? item.id : ''
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    inputValue,
    onIsOpenChange: (val) => {
      if (val?.isOpen === undefined) return
    },
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            // highlightedIndex: 0, // with the first option highlighted.
            highlightedIndex: state.highlightedIndex,
          }
        default:
          return changes
      }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            // TODO:
            if (newSelectedItem?.projectAccess === true) return

            const id = newSelectedItem.id

            const index = selectedTeams.findIndex((item) => item.id === id)

            if (index === -1) {
              onSelect([...selectedTeams, newSelectedItem])
            } else {
              onSelect([...selectedTeams].filter((item) => item.id !== id))
            }

            // setInputValue('')
          }
          break

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue as string)

          break
        default:
          break
      }
    },
  })

  return (
    <div className="">
      <div className="flex flex-col gap-1">
        <Label className="w-fit" {...getLabelProps()}>
          Add teams
        </Label>

        <div className="flex  w-full mt-2">
          <div className="relative w-full">
            <div
              className={clsx(['h-full w-10 absolute  right-1 flex justify-normal items-center'], {
                'opacity-60': !isOpen,
                'hover:opacity-100': true,
              })}
            >
              <button
                aria-label="toggle menu"
                className="w-full flex justify-center items-center h-full bg-blue-400X"
                type="button"
                {...getToggleButtonProps()}
              >
                <Icons.chevronUpDown className="h-4 w-4" />
              </button>
            </div>
            <Input
              placeholder="Search teams"
              className="w-full"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen, disabled }))}
            />
          </div>
        </div>
      </div>

      <div className="relative bg-red-400 w-full">
        <div
          className={clsx(
            [
              'w-full absolute mt-2 shadow-md bg-background border rounded-md z-50',
              // ' max-h-80 overflow-scroll overflow-x-hidden p-0 z-[500]',
            ],
            {
              hidden: !isOpen,
            }
          )}
          {...getMenuProps()}
        >
          {isOpen && (
            <>
              {isLoading && !items && (
                <div className="w-full flex gap-3 items-center justify-center h-20 text-sm">
                  <Icons.loader2 className="h-4 w-4 animate-spin text-primary" />
                  <div>Searching...</div>
                </div>
              )}

              {!isLoading && inputValue?.length <= 1 && (
                <div className="w-full flex gap-3 items-center justify-center h-20 text-sm">
                  Type 2 or more characters
                </div>
              )}

              {!isLoading && inputValue?.length > 1 && !isLoading && items?.length === 0 && (
                <div className="w-full flex gap-3 items-center justify-center h-20 text-sm">
                  No teams found
                </div>
              )}

              <ul>
                {items && items?.length > 0 && (
                  <ScrollArea
                    className={clsx({
                      'h-fit': items?.length <= 5,
                      'h-80': items?.length > 5,
                    })}
                  >
                    {items.map((item, index) => (
                      <li
                        className={clsx(
                          [
                            'ease duration-200 py-2 pl-2.5 pr-3 md:pr-5 md:pl-4 flex flex-row justify-between items-center',
                          ],
                          {
                            'opacity-100 cursor-not-allowed': item.projectAccess === true,
                            'bg-gray-100 dark:bg-gray-900':
                              highlightedIndex === index && !item.projectAccess,

                            'text-blue-600 dark:text-blue-500':
                              selectedTeams.find((val) => item.id === val.id)?.role ===
                              ProjectRole.MEMBER,

                            'text-green-600 dark:text-green-600':
                              selectedTeams.find((val) => item.id === val.id)?.role ===
                              ProjectRole.ADMIN,

                            'text-red-600 dark:text-red-600':
                              selectedTeams.find((val) => item.id === val.id)?.role ===
                              ProjectRole.OWNER,

                            'font-bold': selectedItem === item,
                            'cursor-pointer': item.projectAccess !== true,
                          }
                        )}
                        key={`${item.id}${index}`}
                        {...getItemProps({ item, index })}
                      >
                        <div
                          className={clsx(['flex gap-3 items-center max-w-[90%]  pr-3'], {
                            'opacity-[75%] cursor-not-allowed': item.projectAccess === true,
                          })}
                        >
                          <div className="flex flex-col text-sm">
                            <span>{item.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.membersCount === 0
                                ? 'No members'
                                : `${item.membersCount} members`}
                            </span>
                          </div>
                        </div>
                        {selectedTeams.findIndex((val) => item.id === val.id) !== -1 && (
                          <div>
                            <div
                              className={clsx({
                                'cursor-not-allowed w-full': item.projectAccess === true,
                                'text-blue-600 dark:text-blue-600':
                                  selectedTeams.find((val) => item.id === val.id)?.role ===
                                  ProjectRole.MEMBER,
                                'text-green-600 dark:text-green-700':
                                  selectedTeams.find((val) => item.id === val.id)?.role ===
                                  ProjectRole.ADMIN,
                                'text-red-600 dark:text-red-700':
                                  selectedTeams.find((val) => item.id === val.id)?.role ===
                                  ProjectRole.OWNER,
                              })}
                            >
                              <Icons.check className="h-4 w-4" />
                            </div>
                          </div>
                        )}

                        {/* // TODO: */}
                        {item.projectAccess === true && (
                          <div>
                            {/* <Icons.userCheck2 className="h-4 w-4" /> */}
                            <div className="flex gap-0 items-center">
                              <Icons.user2 className="h-[0.8rem] w-[0.8rem]" />
                              <Icons.userCheck2 className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ScrollArea>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
      {/* // Selected */}
    </div>
  )
}

export default ProjectAccessTeamCombobox
