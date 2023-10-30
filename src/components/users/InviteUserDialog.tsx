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
import { useCheckWorkspaceUserEmail } from '@/api/queries/users'
import { useCreateWorkspaceInvitation } from '@/api/mutations/users'
import { usersErrorMsgFromCode } from '@/api/requests/users'

interface Props {
  queryClient: QueryClient
  opened: boolean
  workspaceId: string
  onClose: () => void
  onEmailInvite: (type: WorkspaceUserRole) => void
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const tabs = [
  { text: 'Link', value: 'link', icon: Icons.link },
  { text: 'Email', value: 'email', icon: Icons.mail },
]

const InviteUserDialog: React.FC<Props> = ({
  queryClient,
  workspaceId,
  opened,
  onClose,
  onEmailInvite,
}) => {
  const [email, setEmail] = useState('')
  const [tab, setTab] = useState<'link' | 'email'>('link')
  const [copied, setCopied] = useState(false)

  const [confirmGenerate, setConfirmGenerate] = useState(false)
  const [generated, setGenerated] = useState(false)

  const [loadingEmail, setLoadingEmail] = useState(false)
  const [invitationSent, setInvitationSent] = useState<string | null>(null)

  const [role, setRole] = useState<WorkspaceUserRole>(WorkspaceUserRole.MEMBER)

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

  useDebounce(
    () => {
      const valid = emailRegex.test(email)
      console.log('valid', valid)

      if (valid) {
        setLoadingEmail(true)
        removeCheckEmail()
        checkEmail()
      } else {
        setLoadingEmail(false)
        removeCheckEmail()
      }
    },
    500,
    [email]
  )

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => {
        resetState()
      }, 200)
    }
  }, [opened])

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

  const {
    data: checkEmailData,
    error: checkEmailError,
    refetch: checkEmail,
    remove: removeCheckEmail,
  } = useCheckWorkspaceUserEmail(
    {
      workspaceId,
      email,
    },
    {
      enabled: false,
      staleTime: 1,
      cacheTime: 1,
      onSuccess: () => setLoadingEmail(false),
      onError: () => setLoadingEmail(false),
    }
  )

  const {
    // TODO: invitations
    data: createWorkspaceInvitationData,
    error: createWorkspaceInvitationError,
    mutate: createWorkspaceInvitation,
    reset: resetCreateWorkspaceInvitation,
    isLoading: createWorkspaceInvitationLoading,
  } = useCreateWorkspaceInvitation({
    onSuccess: () => {
      setInvitationSent(email)
      setEmail('')
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

  const handleTypeChange = (type: WorkspaceUserRole) => setRole(type)

  const resetState = () => {
    setEmail('')
    setCopied(false)
    setConfirmGenerate(false)
    setLoadingEmail(false)
    setGenerated(false)
    setInvitationSent(null)
    resetGenereteMutation()
    setRole(WorkspaceUserRole.MEMBER)
    resetCreateWorkspaceInvitation()
    resetGenereteMutation()
    removeCheckEmail()
  }

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
              className: 'px-5',
              disabled:
                loadingEmail ||
                checkEmailError === undefined ||
                !emailRegex.test(email) ||
                checkEmailData?.exists === true,
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
        onSubmit={() => {
          createWorkspaceInvitation({ workspaceId, email, role })
        }}
        onClose={onClose}
        className="md:max-w-[500px]"
      >
        <div className="flex flex-col gap-6 pb-6 mt-1.5">
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
                            <div className="text-red-600 text-[0.90rem] py-2 flex items-center gap-2 mt-0">
                              <Icons.xCircle className="h-4 w-4" />
                              Something went wrong
                            </div>
                          </div>
                        </>
                      )}
                      {!getInvitationsError && (
                        <Input
                          autoFocus={false}
                          readOnly
                          value={
                            role === WorkspaceUserRole.MEMBER
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
                        role === WorkspaceUserRole.MEMBER
                          ? workspaceInvitations?.member
                          : workspaceInvitations?.admin

                      if (value) {
                        handleCopy(value)
                      }
                    }}
                    disabled={invitationLinksLoading || getInvitationsError != undefined}
                  >
                    {copied ? (
                      <Icons.check className="h-4 w-4 text-green-600 dark:text-green-600" />
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
                    'text-green-600 dark:text-green-600 hover:text-green-600 dark:hover:text-green-600 cursor-default hover:bg-transparent dark:hover:bg-transparent':
                      generated,
                  })}
                  onClick={() => {
                    if (generated) return

                    resetGenereteMutation()
                    if (!confirmGenerate && !generateLinkError) {
                      setConfirmGenerate(true)
                    } else handleGenerateLink(role)
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
                          <Icons.check className="h-4 w-4 text-green-600 dark:text-green-600" />
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
              <div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    {loadingEmail && (
                      <div className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-4">
                        <Icons.loader2 className="animate-spin h-4 w-4 text-primary" />
                      </div>
                    )}
                    {!loadingEmail && checkEmailData && checkEmailData?.exists !== true && (
                      <div className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-4">
                        <Icons.checkCircle2 className="h-4 w-4 text-green-600 dark:text-green-600" />
                      </div>
                    )}
                    <Input
                      autoFocus={false}
                      placeholder="Type user email"
                      className="pr-10"
                      value={email}
                      onChange={(e) => {
                        const value = e?.target?.value
                        setEmail(value)

                        if (emailRegex.test(value)) setLoadingEmail(true)
                        if (invitationSent) setInvitationSent(null)
                      }}
                    />
                  </div>
                </div>

                {/* // TODO: check if current user email -> show msg */}
                {checkEmailData && checkEmailData.exists && (
                  <>
                    <div className="text-orange-600 text-[0.90rem] pb-0 flex items-center gap-2 mt-2.5">
                      <Icons.user className="h-4 w-4" />
                      User with this email already in this workspace
                    </div>
                  </>
                )}

                {checkEmailError && (
                  <>
                    <div className="text-red-600 text-[0.90rem] pb-0 flex items-center gap-2 mt-2.5">
                      <Icons.xCircle className="h-4 w-4" />
                      Something went wrong
                    </div>
                  </>
                )}

                {createWorkspaceInvitationError && (
                  <>
                    <div className="text-red-600 text-[0.90rem] pb-0 flex items-center gap-2 mt-2.5">
                      <Icons.xCircle className="h-4 w-4" />
                      {createWorkspaceInvitationError?.code
                        ? usersErrorMsgFromCode(createWorkspaceInvitationError.code)
                        : 'Something went wrong'}
                    </div>
                  </>
                )}

                {invitationSent && (
                  <>
                    <div className="text-green-600 text-[0.90rem] pb-0 flex items-center gap-2 mt-2.5">
                      <Icons.check className="h-4 w-4 text-green-600 dark:text-green-600" />
                      Invitation sent ({invitationSent})
                    </div>
                  </>
                )}
              </div>
            )}

            <div>
              <div className="font-semibold mb-3 md:mb-4">Role</div>

              <div className="md:px-2">
                <RadioGroup
                  disabled={
                    (getInvitationsError != undefined && tab === 'link') ||
                    (tab === 'email' && createWorkspaceInvitationLoading)
                  }
                  defaultValue={'MEMBER'}
                  className="flex flex-col gap-6"
                  value={role}
                  onValueChange={(e) => handleTypeChange(e as WorkspaceUserRole)}
                >
                  {/* // */}

                  <div
                    className={clsx(['flex items-start gap-4'], {
                      'cursor-pointer': !(
                        (getInvitationsError != undefined && tab === 'link') ||
                        (invitationLinksLoading && tab === 'link') ||
                        (tab === 'email' && createWorkspaceInvitationLoading)
                      ),
                      'opacity-70':
                        (getInvitationsError != undefined && tab === 'link') ||
                        (invitationLinksLoading && tab === 'link') ||
                        (tab === 'email' && createWorkspaceInvitationLoading),
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
                      'cursor-pointer': !(
                        (getInvitationsError != undefined && tab === 'link') ||
                        (invitationLinksLoading && tab === 'link') ||
                        (tab === 'email' && createWorkspaceInvitationLoading)
                      ),
                      'opacity-70':
                        (getInvitationsError != undefined && tab === 'link') ||
                        (invitationLinksLoading && tab === 'link') ||
                        (tab === 'email' && createWorkspaceInvitationLoading),
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
