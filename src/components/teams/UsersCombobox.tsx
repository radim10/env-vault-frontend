import React, { useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Label } from '../ui/label'
import clsx from 'clsx'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { useSearchWorkspaceUsers } from '@/api/queries/users'
import { User } from '@/types/users'
import { useDebounce, useUpdateEffect } from 'react-use'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { QueryClient } from '@tanstack/react-query'
import { Badge } from '../ui/badge'

interface Props {
  workspaceId: string
  queryClient: QueryClient
}

const UsersCombobox: React.FC<Props> = ({ workspaceId, queryClient }) => {
  const [inputValue, setInputValue] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<User[]>([])

  const { data: items, refetch } = useSearchWorkspaceUsers(
    {
      workspaceId,
      value: inputValue,
    },
    {
      enabled: false,
      cacheTime: 3600,
      onSettled: (e) => {
        setIsLoading(false)
      },
    }
  )

  const getExistingData = (search: string) => {
    const data = queryClient.getQueryData(['workspace', workspaceId, 'users-search', search])
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
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          if (newSelectedItems) {
            setSelectedItems(newSelectedItems)
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
      setIsOpened(val?.isOpen)
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
            // setSelectedItems([...selectedItems, books[highlightedIndex]])
            const id = newSelectedItem.id

            const index = selectedItems.findIndex((item) => item.id === id)

            if (index === -1) {
              setSelectedItems([...selectedItems, newSelectedItem])
            } else {
              setSelectedItems([...selectedItems].filter((item) => item.id !== id))
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
          Add users
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
              placeholder="Best book ever"
              className="w-full"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
          </div>
        </div>
      </div>

      <div className="relative bg-red-400 w-full">
        <ul
          // className={`absolute w-inherit bg-transparent mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          //   !(isOpen && items.length) && 'hidden'
          // }`}
          className={clsx(
            [
              'w-full absolute mt-2 shadow-md bg-background border rounded-md max-h-80 overflow-scroll overflow-x-hidden p-0 z-[500]',
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
                  No users found
                </div>
              )}

              {items &&
                items?.length > 0 &&
                items.map((item, index) => (
                  <li
                    className={clsx(
                      ['ease duration-200'],
                      highlightedIndex === index && 'bg-gray-100 dark:bg-gray-900',
                      selectedItem === item && 'font-bold',
                      'cursor-pointer py-2 pl-1 pr-3 md:pr-5 md:pl-4 flex flex-row justify-between items-center'
                    )}
                    key={`${item.id}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    <div className="flex gap-3 items-center">
                      <div>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={item.avatarUrl ?? undefined} />
                          <AvatarFallback className="bg-transparent border-2 text-sm">
                            CN
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col text-sm">
                        <span>{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.email}</span>
                      </div>
                    </div>
                    {selectedItems.findIndex((val) => item.id === val.id) !== -1 && (
                      <div>
                        <Icons.check className="h-4 w-4" />
                      </div>
                    )}
                  </li>
                ))}
            </>
          )}
        </ul>
      </div>
      {/* // Selected */}
      <div
        className={clsx(
          ['mt-3 bg-transparent inline-flex gap-2 items-center flex-wrap p-1.5 z-0'],
          {
            hidden: false,
          }
        )}
      >
        {selectedItems.map(function renderSelectedItem(selectedItemForRender, index) {
          return (
            <Badge variant="outline" className="pl-0.5">
              <div
                className="flex items-center gap-2 text-sm "
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                <Avatar className="w-7 h-7 opacity-90">
                  <AvatarImage src={selectedItemForRender.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-transparent border-2 text-sm">CN</AvatarFallback>
                </Avatar>

                <span className="text-muted-foregroundXXX">{selectedItemForRender.name}</span>
                <span
                  className="px-1 cursor-pointer text-opacity-50 hover:text-opacity-100 duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSelectedItem(selectedItemForRender)
                  }}
                >
                  &#10005;
                </span>
              </div>
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

export default UsersCombobox
