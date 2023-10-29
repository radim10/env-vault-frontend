'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useDebounce, useUpdateEffect } from 'react-use'
import UserRoleBadge from './UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import DialogComponent from '../Dialog'
import { Icons } from '../icons'
import clsx from 'clsx'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useGetWorkspaceInvitationLinks } from '@/api/queries/workspaces'
import { Skeleton } from '../ui/skeleton'
import { useGenerateWorkspaceInvitationLink } from '@/api/mutations/workspaces'
import { QueryClient } from '@tanstack/react-query'
import { WorkspaceInvitationLinks } from '@/types/workspaces'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

interface Props {
  queryClient: QueryClient
  opened: boolean
  workspaceId: string
  onClose: () => void
  onSuccess: (type: WorkspaceUserRole) => void
}

const tabs = [
  { text: 'Link', value: 'link', icon: Icons.link },
  { text: 'Email', value: 'email', icon: Icons.mail },
]

const InviteUserDialog: React.FC<Props> = ({
  queryClient,
  workspaceId,
  opened,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('')
  const [tab, setTab] = useState<'link' | 'email'>('link')
  const [copied, setCopied] = useState(false)

  const [confirmGenerate, setConfirmGenerate] = useState(false)
  const [generated, setGenerated] = useState(false)

  const [linkType, setLinkType] = useState<WorkspaceUserRole>(WorkspaceUserRole.MEMBER)

  useDebounce(
    () => {
      if (copied) {
        setCopied(false)
      }
    },
    3000,
    [copied]
  )

  useDebounce(
    () => {
      if (confirmGenerate) {
        setConfirmGenerate(false)
      }
    },
    3000,
    [confirmGenerate]
  )

  useDebounce(
    () => {
      if (generated) {
        setGenerated(false)
      }
    },
    3000,
    [generated]
  )

  const {
    data: workspaceInvitations,
    isLoading: invitationLinksLoading,
    error: getInvitationsError,
  } = useGetWorkspaceInvitationLinks(workspaceId)

  const {
    mutate: generateLink,
    isLoading: generatingLink,
    error: generateLinkError,
    reset: resetGenereteMutation,
  } = useGenerateWorkspaceInvitationLink({
    onSuccess: (data) => {
      setGenerated(true)

      const currentData = queryClient.getQueryData<WorkspaceInvitationLinks>([
        'workspace-invitation',
        workspaceId,
      ])

      if (currentData) {
        queryClient.setQueryData<WorkspaceInvitationLinks>(['workspace-invitation', workspaceId], {
          ...currentData,
          ...data,
        })
      }
    },
  })

  const handleGenerateLink = (type: WorkspaceUserRole) => {
    generateLink({
      workspaceId,
      type: type.toLowerCase() as 'member' | 'admin',
    })
  }

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(true)
  }

  const handleTypeChange = (type: WorkspaceUserRole) => setLinkType(type)

  // const {
  //   mutate: updateUserRole,
  //   isLoading,
  //   error,
  //   reset,
  // } = useUpdateWorkspaceUserRole({
  //   onSuccess: () => {
  //     onSuccess(selectedRole)
  //   },
  // })
  //
  // useUpdateEffect(() => {
  //   if (!opened && error) {
  //     setTimeout(() => reset(), 150)
  //   }
  // }, [opened])

  return (
    <>
      <DialogComponent
        opened={opened}
        title={'Invite users'}
        submit={
          tab === 'email'
            ? {
              text: 'Send',
              variant: 'default',
              icon: Icons.sendHorizontal,
              disabled: false,
            }
            : undefined
        }
        // error={
        //   error
        //     ? error?.code
        //       ? usersErrorMsgFromCode(error.code)
        //       : 'Something went wrong'
        //     : undefined
        // }
        // loading={isLoading}
        onSubmit={() => { }}
        onClose={onClose}
        className="md:max-w-[500px]"
      >
        <div className="flex flex-col gap-6 pb-6 mt-0">
          {/* <div className="flex flex-row gap-3 md:gap-4 items-center w-full justify-center"> */}
          {/*   {tabs.map((item) => ( */}
          {/*     <button */}
          {/*       key={item.text} */}
          {/*       onClick={() => setTab(item.value as 'link' | 'email')} */}
          {/*       className={clsx( */}
          {/*         ['flex items-center gap-2 md:gap-2 pb-0.5 px-5 border-b-2 text-[1.06rem] '], */}
          {/*         { */}
          {/*           'border-primary text-primary': tab === item.value, */}
          {/*           'text-muted-foreground hover:text-foreground': tab !== item.value, */}
          {/*         } */}
          {/*       )} */}
          {/*     > */}
          {/*       <item.icon className="w-4 h-4" /> */}
          {/*       {item.text} */}
          {/*     </button> */}
          {/*   ))} */}
          {/* </div> */}
          <div className="flex flex-row gap-3 md:gap-4 items-center w-full justify-center">
            <Tabs defaultValue={tab} onValueChange={(value) => setTab(value as 'link' | 'email')}>
              <TabsList>
                {tabs.map((item) => (
                  <TabsTrigger value={item.value} className="w-36 flex items-center gap-2 md:gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.text}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <>
            {tab === 'link' ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {invitationLinksLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <>
                      {getInvitationsError && (
                        <>
                          {/* // TODO: error */}
                          <div className="w-full h-10 flex justify-start items-center">
                            <div className="text-red-600 text-[0.92rem] py-2 flex items-center gap-2 mt-0">
                              <Icons.xCircle className="h-4 w-4" />
                              Something went wrong
                            </div>
                          </div>
                        </>
                      )}
                      {!getInvitationsError && (
                        <Input
                          readOnly
                          value={
                            linkType === WorkspaceUserRole.MEMBER
                              ? workspaceInvitations?.member
                              : workspaceInvitations?.admin
                          }
                        />
                      )}
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const value =
                        linkType === WorkspaceUserRole.MEMBER
                          ? workspaceInvitations?.member
                          : workspaceInvitations?.admin

                      if (value) {
                        handleCopy(value)
                      }
                    }}
                    disabled={invitationLinksLoading || getInvitationsError != undefined}
                  >
                    {copied ? (
                      <Icons.check className="h-4 w-4 text-green-500 dark:text-green-600" />
                    ) : (
                      <Icons.copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  disabled={invitationLinksLoading || getInvitationsError != undefined}
                  loading={generatingLink}
                  className={clsx(['w-full gap-2'], {
                    'text-orange-600 dark:text-orange-600 hover:text-orange-600 dark:hover:text-orange-600':
                      confirmGenerate && !generated,
                    'text-red-600 dark:text-red-600 hover:text-red-600 dark:hover:text-red-600':
                      generateLinkError && !generated,
                    'text-green-500 dark:text-green-600 hover:text-green-500 dark:hover:text-green-600 cursor-default hover:bg-transparent dark:hover:bg-transparent':
                      generated,
                  })}
                  onClick={() => {
                    if (generated) return

                    resetGenereteMutation()
                    if (!confirmGenerate && !generateLinkError) {
                      setConfirmGenerate(true)
                    } else handleGenerateLink(linkType)
                  }}
                >
                  {generateLinkError && (
                    <>
                      <Icons.alertCircle className="h-4 w-4" />
                      Something went wrong :(
                    </>
                  )}

                  {!generateLinkError && (
                    <>
                      {generated ? (
                        <>
                          <Icons.check className="h-4 w-4 text-green-500 dark:text-green-600" />
                          New link generated
                        </>
                      ) : (
                        <>
                          {generatingLink ? (
                            <span>Generating link</span>
                          ) : (
                            <>
                              {confirmGenerate ? (
                                <>
                                  <Icons.alertCircle className="h-4 w-4" />
                                  Confirm generate
                                </>
                              ) : (
                                <>
                                  <Icons.refresh className="h-4 w-4" />
                                  Generate
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <Icons.search className="h-4 w-4 pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-4" />
                    <Input
                      placeholder="Type user email"
                      className="pr-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="font-semibold mb-3 md:mb-4">Role</div>

              <div className="md:px-2">
                <RadioGroup
                  disabled={getInvitationsError != undefined && tab === 'link'}
                  defaultValue={'MEMBER'}
                  className="flex flex-col gap-6"
                  value={linkType}
                  onValueChange={(e) => handleTypeChange(e as WorkspaceUserRole)}
                >
                  {/* // */}

                  <div
                    className={clsx(['flex items-start gap-4'], {
                      'opacity-70':
                        (getInvitationsError != undefined && tab === 'link') ||
                        (invitationLinksLoading && tab === 'link'),
                    })}
                  >
                    <RadioGroupItem value="MEMBER" id="member" />
                    <Label
                      htmlFor="member"
                      className="font-normal h-fit w-fit text-md -mt-1.5 block"
                    >
                      <div className="flex flex-col gap-2">
                        <div>
                          <UserRoleBadge role={WorkspaceUserRole.MEMBER} />
                        </div>
                        <div className="text-muted-foreground text-[0.89rem] leading-5">
                          Members can view and interact with projects and environments they have
                          access tok. Cannot promote/delete users.
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={clsx(['flex items-start gap-4'], {
                      'opacity-70':
                        (getInvitationsError != undefined && tab === 'link') ||
                        (invitationLinksLoading && tab === 'link'),
                    })}
                  >
                    <RadioGroupItem value="ADMIN" id="admin" />
                    <Label
                      htmlFor="admin"
                      className="font-normal h-fit w-fit text-md -mt-1.5 block"
                    >
                      <div className="flex flex-col gap-2">
                        <div>
                          <UserRoleBadge role={WorkspaceUserRole.ADMIN} />
                        </div>
                        <div className="text-muted-foreground text-[0.89rem] leading-5">
                          Admins have full access to all projects and environments and can promote
                          and delete users.
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </>
        </div>
      </DialogComponent>
    </>
  )
}

export default InviteUserDialog
