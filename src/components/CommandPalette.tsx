'use client'

import { Icons } from './icons'
import { useEffect, useState } from 'react'
import useCurrentUserStore from '@/stores/user'
import { useParams, useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

const CommandPalette = () => {
  const router = useRouter()
  const params = useParams()
  const user = useCurrentUserStore()

  const [open, setOpen] = useState(false)

  const items = [
    {
      group: {
        heading: 'Projects',
        items: [
          {
            name: 'Projects',
            icon: Icons.folder,
            action: () => {
              router.push(`/workspace/${params?.workspace}/projects`)
            },
          },
          {
            name: 'Create project',
            icon: Icons.folderPlus,
            action: () => {
              router.push(`/workspace/${params?.workspace}/create-project`)
            },
          },
        ],
      },
    },
    {
      group: {
        heading: 'Tokens',
        items: [
          {
            name: 'CLI tokens',
            icon: Icons.terminalSquare,
            action: () => {
              router.push(`/workspace/${params?.workspace}/tokens/cli`)
            },
          },
          {
            name: 'Environment tokens',
            icon: Icons.squareAsterisk,

            action: () => {
              router.push(`/workspace/${params?.workspace}/tokens/environments`)
            },
          },
          {
            name: 'Workspace tokens',
            icon: Icons.layers,

            action: () => {
              router.push(`/workspace/${params?.workspace}/tokens/workspace`)
            },
          },
        ],
      },
    },

    {
      group: {
        heading: 'Users',
        items: [
          {
            name: 'Workspace users',
            icon: Icons.users,
            action: () => {
              router.push(`/workspace/${params?.workspace}/users/workspace`)
            },
          },
          {
            name: 'Invitations',
            icon: Icons.userPlus,
            action: () => {
              router.push(`/workspace/${params?.workspace}/users/invitations`)
            },
          },
          {
            name: 'Teams',
            icon: Icons.users2,
            action: () => {
              router.push(`/workspace/${params?.workspace}/users/teams`)
            },
          },
        ],
      },
    },

    {
      group: {
        heading: 'Settings',
        items: [
          {
            name: 'Worksapce settings',
            icon: Icons.settings,
            action: () => {
              router.push(`/workspace/${params?.workspace}/settings/workspace`)
            },
          },
          {
            name: 'Subscription',
            icon: Icons.scrollText,
            action: () => {
              router.push(`/workspace/${params?.workspace}/settings/subscription`)
            },
          },
        ],
      },
    },

    {
      group: {
        heading: 'Personal settings',
        items: [
          {
            name: 'General',
            icon: Icons.userCircle,
            action: () => {
              router.push(`/workspace/${params?.workspace}/personal-settings/general`)
            },
          },
          {
            name: 'Authentication',
            icon: Icons.bookKey,
            action: () => {
              router.push(`/workspace/${params?.workspace}/personal-settings/authentication`)
            },
          },
          {
            name: 'Preferences',
            icon: Icons.sliders,
            action: () => {
              router.push(`/workspace/${params?.workspace}/personal-settings/preferences`)
            },
          },
        ],
      },
    },
  ]

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!user?.data === null) {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }

        if (e.key === 'Escape') {
          setOpen(false)
        }
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." onBlur={() => setOpen(false)} />
        <CommandList className="h-72">
          <CommandEmpty>
            <div className="mt-5">No results found</div>
          </CommandEmpty>
          {items.map((item, index) => (
            <>
              <CommandGroup key={item.group.heading} heading={item.group.heading}>
                {item.group.items.map(({ name, icon: Icon, action }) => (
                  <CommandItem
                    key={name}
                    onSelect={() => {
                      action()
                      setOpen(false)
                    }}
                    disabled={name === 'Workspace tokens' && user?.isMemberRole() ? true : false}
                    className="px-4"
                  >
                    <Icon className="mr-3.5 h-1 w-1 bg-red-400X" />
                    <span className="text-[0.9rem]">{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {index !== items.length - 1 && <CommandSeparator />}
            </>
          ))}

          {/* <CommandGroup heading={''}> */}
          {/*   <CommandItem */}
          {/*     onSelect={() => {}} */}
          {/*     className="px-4 hover:text-red-500 text-red-500 dark:text-red-500 dark:hover:text-red-500'" */}
          {/*   > */}
          {/*     <Icons.logOut className="mr-3.5 h-1 w-1 bg-red-400X" /> */}
          {/*     <span className="text-[0.9rem]">Log out</span> */}
          {/*   </CommandItem> */}
          {/* </CommandGroup> */}
          {/* <CommandGroup heading="Suggestions"> */}
          {/*   <CommandItem> */}
          {/*     <Calendar className="mr-2 h-4 w-4" /> */}
          {/*     <span>Calendar</span> */}
          {/*   </CommandItem> */}
          {/*   <CommandItem> */}
          {/*     <Smile className="mr-2 h-4 w-4" /> */}
          {/*     <span>Search Emoji</span> */}
          {/*   </CommandItem> */}
          {/*   <CommandItem> */}
          {/*     <Calculator className="mr-2 h-4 w-4" /> */}
          {/*     <span>Calculator</span> */}
          {/*   </CommandItem> */}
          {/* </CommandGroup> */}
          {/* <CommandSeparator /> */}
          {/* <CommandGroup heading="Settings"> */}
          {/*   <CommandItem> */}
          {/*     <User className="mr-2 h-4 w-4" /> */}
          {/*     <span>Profile</span> */}
          {/*     <CommandShortcut>⌘P</CommandShortcut> */}
          {/*   </CommandItem> */}
          {/*   <CommandItem> */}
          {/*     <CreditCard className="mr-2 h-4 w-4" /> */}
          {/*     <span>Billing</span> */}
          {/*     <CommandShortcut>⌘B</CommandShortcut> */}
          {/*   </CommandItem> */}
          {/*   <CommandItem> */}
          {/*     <Settings className="mr-2 h-4 w-4" /> */}
          {/*     <span>Settings</span> */}
          {/*     <CommandShortcut>⌘S</CommandShortcut> */}
          {/*   </CommandItem> */}
          {/* </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default CommandPalette
