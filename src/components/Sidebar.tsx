'use client'

import clsx from 'clsx'
import React, { useState } from 'react'
import Link from 'next/link'
import { Icons } from './icons'
import { Separator } from './ui/separator'
import WorkspaceSelect from './WorkspaceSelect'
import { usePathname, useParams, useRouter } from 'next/navigation'
import { useLockBodyScroll, useToggle, useUpdateEffect } from 'react-use'
import useCurrentUserStore from '@/stores/user'
import CreateWorkspaceDialog from './CreateWorkspaceDialog'
import { useToast } from './ui/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useLogout } from '@/api/mutations/auth'
import { LogoutError } from '@/api/requests/auth'
import useSessionStore from '@/stores/session'
import { SubscriptionPlan } from '@/types/subscription'
import ActionRequiredBadge from './ActionRequiredBadge'
import userExceedDialogStore from '@/stores/userExceed'
import useCreditCardExpiredStore from '@/stores/cardExpired'

const navItems = [
  { label: 'Projects', href: 'projects', icon: Icons.folder },
  { label: 'Activity', href: 'activity', icon: Icons.ganntChart },
  { label: 'Tokens', href: 'tokens/cli', icon: Icons.keyRound },
  { label: 'Users', href: 'users/workspace', icon: Icons.users },
  // { label: 'Account', href: 'personal-settings/general', icon: Icons.user },
  { label: 'Settings', href: 'settings/workspace', icon: Icons.settings },
]

const helpNavItems = [
  { label: 'Docs', href: 'docs', icon: Icons.book },
  { label: 'SDKs', href: 'docs', icon: Icons.code },
  { label: 'Community', href: 'Community', icon: Icons.mic2 },
]

const Sidebar = () => {
  const { toast } = useToast()
  const router = useRouter()
  const session = useSessionStore()
  const currentUser = useCurrentUserStore((state) => state.data)
  const { open: openExceedDialog } = userExceedDialogStore()
  const { open: openCreditCardExpiredDialog } = useCreditCardExpiredStore()

  const [opened, setOpened] = useState(false)
  const [scrollLocked, setSrcollLocked] = useToggle(false)

  const [createWorkspaceDialog, setCreateWorkspaceDialog] = useState<{ opened: boolean } | null>(
    null
  )

  const pathname = usePathname()
  const params = useParams()

  useUpdateEffect(() => {}, [opened])

  const toggle = () => {
    setSrcollLocked(!opened)
    setOpened(!opened)
  }

  useLockBodyScroll(scrollLocked)

  const handleCloseDialog = () => {
    setCreateWorkspaceDialog({ opened: false })
    setTimeout(() => {
      setCreateWorkspaceDialog(null)
    }, 200)
  }

  const handleNewWorkspace = (data: { id: string; name: string }) => {
    handleCloseDialog()

    toast({
      variant: 'success',
      title: 'Workspace created',
      description: 'Your workspace has been created',
    })

    router.push(`/workspace/${data.id}/projects`)
  }

  const { mutate: logout } = useLogout({
    onSuccess: async () => {
      await fetch('/api/logout', { method: 'POST' })
      // deleteSession()
      router.replace('/login', { scroll: false })
    },
    onError: async (err) => {
      // deleteSession()
      console.log(err)
      const error = err as LogoutError
      if (error.code) {
        await fetch('/api/logout', { method: 'POST' })
        router.replace('/login', { scroll: false })
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong.',
          variant: 'destructive',
        })
      }
    },
  })

  const handleLogout = () => {
    session.setLoggingOut(true)
    logout(null)
  }

  return (
    <>
      {createWorkspaceDialog !== null && (
        <CreateWorkspaceDialog
          opened={createWorkspaceDialog?.opened === true}
          onSuccess={handleNewWorkspace}
          onClose={handleCloseDialog}
        />
      )}
      <div className="h-full md:border-r-[1.2px]  border-b-[1.2px] dark:border-gray-800 bg-background z-50">
        <div className="md:pt-10 pt-4 pb-4 md:pb-0 md:px-9 px-6 flex justify-between items-center">
          <div className="">LOGO</div>
          <button className="block md:hidden" onClick={toggle}>
            {opened ? <Icons.x /> : <Icons.menu />}
          </button>
        </div>
        {opened && <div className="h-[1.2px] w-full bg-gray-200 dark:bg-gray-800"></div>}
        <div
          className={clsx(
            [
              'shadow-lg dark:shadow-gray-900 md:shadow-none w-screen md:w-auto fixed md:relative pt-6 md:pt-10 lg:pt-16 bg-background z-[1000] border-b-[1.2px] dark:border-gray-800 md:border-0 rounded-b-lg md:rounded-b-none',
            ],
            {
              hidden: !opened,
              block: opened,
              'md:block': true,
            }
          )}
        >
          <div className="-ml-1 pr-4">
            <div className="md:hidden ">
              <div className="mb-6 pl-7 pr-3 flex justify-between items-center">
                <Link
                  href={`/workspace/${params?.workspace}/personal-settings/general`}
                  onClick={() => {
                    if (opened) setOpened(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser?.avatarUrl ?? ''} />
                        <AvatarFallback>
                          {currentUser?.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-[0.9rem] font-medium trucnate max-w-[60vw]">
                        {currentUser?.name}
                      </div>
                      <div className="text-sm truncate max-w-[60vw]">{currentUser?.email}</div>
                    </div>
                  </div>
                </Link>
                <button className="text-red-600 opacity-80" onClick={handleLogout}>
                  <Icons.logOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="pl-6 pr-1">
              <WorkspaceSelect
                currentWorkspace={
                  // currentUser?.workspaces?.find((val) => val?.selected === true) as any
                  {
                    id: currentUser?.selectedWorkspace?.id as string,
                    name: currentUser?.selectedWorkspace?.name as string,
                    plan: currentUser?.selectedWorkspace?.plan as SubscriptionPlan,
                  }
                }
                allWorkspaces={currentUser?.workspaces as any}
                onCreate={() => {
                  if (opened) {
                    setOpened(false)
                    setTimeout(() => {
                      setCreateWorkspaceDialog({ opened: true })
                    }, 100)
                  } else {
                    setCreateWorkspaceDialog({ opened: true })
                  }
                }}
              />

              {currentUser?.selectedWorkspace?.exceedingUserCount && (
                <ActionRequiredBadge
                  type="users"
                  onClick={() => {
                    if (opened) setOpened(false)
                    openExceedDialog()
                  }}
                />
              )}

              {currentUser?.selectedWorkspace?.creditCardExpired && (
                <div
                  className={clsx({
                    '-mt-1': currentUser?.selectedWorkspace?.exceedingUserCount,
                  })}
                >
                  <ActionRequiredBadge
                    type="card"
                    onClick={() => {
                      if (opened) setOpened(false)
                      openCreditCardExpiredDialog()
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div
            className={clsx(['py-5 pl-9 pr-6'], {
              'mt-2 md:mt-5':
                !currentUser?.selectedWorkspace?.exceedingUserCount &&
                !currentUser?.selectedWorkspace?.creditCardExpired,
              'mt-1 md:mt-1':
                currentUser?.selectedWorkspace?.exceedingUserCount &&
                !currentUser?.selectedWorkspace?.creditCardExpired,
            })}
          >
            <div className="bg-red-40 flex flex-col gap-3">
              {navItems.map((item, index) => (
                <>
                  <Link
                    onClick={() => {
                      if (opened) setOpened(false)
                    }}
                    href={`/workspace/${params.workspace}/${item.href}`}
                    className={clsx(
                      [
                        'flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150',
                      ],
                      {
                        // 'text-primary dark:text-primary': pathname === item.href,
                        'text-primary dark:text-primary':
                          pathname?.split('/')?.[3] === item.href ||
                          (pathname?.split('/')?.[3] === item.href?.split('/')[0] && index === 3) ||
                          (pathname?.split('/')?.[3] === item.href?.split('/')[0] && index === 2) ||
                          (pathname?.split('/')?.[3] === item.href?.split('/')[0] && index === 4) ||
                          (pathname?.split('/')?.[3] === 'teams' && index === 2) ||
                          (pathname?.split('/')?.[3] === 'user' && index === 2) ||
                          (pathname?.split('/')?.[3] === 'create-project' && index === 0),
                      }
                    )}
                  >
                    {/* {pathname === item.href} */}
                    <item.icon className=" h-5 w-5 opacity-70" />
                    <div className="text-[1.14rem]">{item.label}</div>
                  </Link>

                  {/* {pathname.split('/')?.[3] == 'teams' && index === 2 && ( */}
                  {/*   <div className=" ml-5 flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150"> */}
                  {/*     <Icons.users2 className="h-4 w-4 opacity-70" /> */}
                  {/*     <div className="text-[1.1rem]">Teams</div> */}
                  {/*   </div> */}
                  {/* )} */}
                </>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="bg-red-40 flex flex-col gap-3">
              {helpNavItems.map((item) => (
                <a
                  href={item.href}
                  className="flex gap-4 items-center dark:hover:text-primary dark:text-gray-300 ease duration-150"
                >
                  <item.icon className=" h-5 w-5 opacity-70" />
                  <div className="text-[1.14rem]">{item.label}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Sidebar
