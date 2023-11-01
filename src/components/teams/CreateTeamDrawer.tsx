import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useCombobox, useMultipleSelection } from 'downshift'
import clsx from 'clsx'
import { Icons } from '../icons'
import { Label } from '../ui/label'

interface Props {
  opened: boolean
  onClose: () => void
}

const CreateTeamDrawer: React.FC<Props> = ({ opened, onClose }) => {
  const [name, setName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  return (
    <div>
      <Sheet
        open={opened}
        onOpenChange={(e) => {
          if (!e) onClose()
        }}
      >
        <SheetContent
          className="w-screen sm:w-[500px] md:w-[700px] lg:w-[700px] h-full md:px-8 md:py-4 py-3 px-4"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault()
          }}
        >
          <SheetHeader>
            <SheetTitle className="text-[1.1rem]">Create new team</SheetTitle>
            <SheetDescription className="text-[0.95rem]">
              Teams are a way to better organize workspace users and their access.
            </SheetDescription>

            <div className="bg-red-400X h-full flex flex-col gap-3">
              <div className="mt-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Team name"
                />
              </div>
              <div>
                <Textarea placeholder="Team description (optional)" />
              </div>
              <div>{/* <ComboBox /> */}</div>
              <MultipleComboBoxExample />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function MultipleComboBoxExample() {
  const books = [
    { id: 'book-1', author: 'Harper Lee', title: 'To Kill a Mockingbird' },
    { id: 'book-2', author: 'Lev Tolstoy', title: 'War and Peace' },
    { id: 'book-3', author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
    { id: 'book-4', author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
    { id: 'book-5', author: 'George Orwell', title: '1984' },
    { id: 'book-6', author: 'Jane Austen', title: 'Pride and Prejudice' },
    { id: 'book-7', author: 'Marcus Aurelius', title: 'Meditations' },
    {
      id: 'book-8',
      author: 'Fyodor Dostoevsky',
      title: 'The Brothers Karamazov',
    },
    { id: 'book-9', author: 'Lev Tolstoy', title: 'Anna Karenina' },
    { id: 'book-10', author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
  ]
  const initialSelectedItems = [books[0], books[1]]

  function getFilteredBooks(selectedItems, inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase()

    return books.filter(function filterBook(book) {
      return (
        // !selectedItems.includes(book) &&
        book.title.toLowerCase().includes(lowerCasedInputValue) ||
        book.author.toLowerCase().includes(lowerCasedInputValue)
      )
    })
  }

  function MultipleComboBox() {
    const [inputValue, setInputValue] = React.useState('')
    const [selectedItems, setSelectedItems] = React.useState(initialSelectedItems)
    const items = React.useMemo(() => getFilteredBooks([], inputValue), [inputValue])
    const { getSelectedItemProps, getDropdownProps, removeSelectedItem } = useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems)
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
      items,
      itemToString(item) {
        return item ? item.title : ''
      },
      defaultHighlightedIndex: 0, // after selection, highlight the first item.
      selectedItem: null,
      inputValue,
      stateReducer(state, actionAndChanges) {
        const { changes, type, highlightedIndex } = actionAndChanges

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
      onStateChange({
        inputValue: newInputValue,
        type,
        selectedItem: newSelectedItem,
        highlightedIndex,
      }) {
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
          case useCombobox.stateChangeTypes.InputBlur:
            if (newSelectedItem) {
              // setSelectedItems([...selectedItems, books[highlightedIndex]])
              const title = newSelectedItem.title

              const index = selectedItems.findIndex((item) => item.title === title)

              if (index === -1) {
                setSelectedItems([...selectedItems, newSelectedItem])
              } else {
                setSelectedItems([...selectedItems].filter((item) => item.title !== title))
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
                className={clsx(
                  ['h-full w-10 absolute  right-1 flex justify-normal items-center'],
                  {
                    'opacity-60': !isOpen,
                    'hover:opacity-100': true,
                  }
                )}
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
                'w-full absolute mt-2 shadow-md bg-background border rounded-md max-h-80 overflow-scroll p-0 z-[500]',
              ],
              {
                hidden: !isOpen,
              }
            )}
            {...getMenuProps()}
          >
            {isOpen &&
              items.map((item, index) => (
                <li
                  className={clsx(
                    highlightedIndex === index && 'bg-gray-900',
                    selectedItem === item && 'font-bold',
                    'cursor-pointer py-2 px-3 md:px-5 flex flex-row justify-between items-center'
                  )}
                  key={`${item.id}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-sm text-muted-foreground">{item.author}</span>
                  </div>

                  {selectedItems.findIndex((val) => item.title === val.title) !== -1 && (
                    <div>
                      <Icons.check className="h-4 w-4" />
                    </div>
                  )}
                </li>
              ))}
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
              <span
                className="bg-gray-800 rounded-md px-1 focus:text-primary"
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                {selectedItemForRender.title}
                <span
                  className="px-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSelectedItem(selectedItemForRender)
                  }}
                >
                  &#10005;
                </span>
              </span>
            )
          })}
        </div>
      </div>
    )
  }
  return <MultipleComboBox />
}

// const ComboBox: React.FC = () => {
//   const [value, setValue] = useState('')
//   const [selectedValues, setSelectedValues] = useState<string[]>([])
//
//   const items = [
//     {
//       name: 'Radim',
//       value: 'id',
//       email: 'email@gmail.com',
//       avatarUrl:
//         'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1162.jpg',
//     },
//   ]
//
//   return (
//     <>
//       <Downshift
//         onChange={(selection) => {
//           console.log(selection ? `You selected ${selection.value}` : 'Selection Cleared')
//
//           if (selection) {
//             const itemAlreadySelected = selectedValues.findIndex(
//               (item) => item === selection?.value
//             )
//             if (itemAlreadySelected === -1) {
//               setSelectedValues([...selectedValues, selection.value])
//             } else {
//               setSelectedValues(selectedValues.filter((item) => item !== selection.value))
//             }
//           }
//         }}
//         itemToString={(item) => (item ? item.value : '')}
//       >
//         {({
//           getInputProps,
//           getItemProps,
//           getLabelProps,
//           getMenuProps,
//           isOpen,
//           inputValue,
//           highlightedIndex,
//           selectedItem,
//         }) => (
//           <div className="w-full">
//             <Input {...getInputProps()} placeholder="Searach for users" />
//             {isOpen && (
//               <div
//                 {...getMenuProps()}
//                 className="mt-2 shadow-lg border rounded-md text-sm flex flex-col gap-0 "
//               >
//                 {isOpen
//                   ? items
//                       .filter((item) => !inputValue || item.value.includes(inputValue))
//                       .map((item, index) => (
//                         <div
//                           className={clsx(['flex justify-between items-center gap-3 px-3 py-2'], {
//                             'text-primary font-boldX bg-gray-900 rounded-md':
//                               highlightedIndex === index,
//                             'text-primary':
//                               selectedValues.findIndex((val) => item?.value === val) !== -1,
//                           })}
//                           {...getItemProps({
//                             key: item.value,
//                             index,
//                             item,
//                           })}
//                         >
//                           <div className="flex gap-3">
//                             <Avatar className="w-10 h-10">
//                               <AvatarImage src={item.email} />
//                               <AvatarFallback className="bg-transparent border-2">
//                                 CN
//                               </AvatarFallback>
//                             </Avatar>
//                             <div className="flex flex-col gap-0">
//                               <div>{item.name}</div>
//                               <div className="-mt-1 text-muted-foreground">{item.email}</div>
//                             </div>
//                           </div>
//
//                           {selectedValues.findIndex((val) => item?.value === val) !== -1 && (
//                             <div>
//                               <Icons.check className="h-4 w-4" />
//                             </div>
//                           )}
//                         </div>
//                       ))
//                   : null}
//               </div>
//             )}
//           </div>
//         )}
//       </Downshift>
//
//       <div className="absolute">
//         {selectedValues.map((item) => (
//           <>{item}</>
//         ))}
//       </div>
//     </>
//   )
// }
//
export default CreateTeamDrawer
