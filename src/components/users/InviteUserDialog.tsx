'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useDebounce, useUpdateEffect } from 'react-use'
import UserRoleBadge from './UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { useUpdateWorkspaceUserRole } from '@/api/mutations/users'
import { usersErrorMsgFromCode } from '@/api/requests/users'
import DialogComponent from '../Dialog'
import { Icons } from '../icons'
import clsx from 'clsx'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface Props {
  opened: boolean
  workspaceId: string
  onClose: () => void
  onSuccess: (type: WorkspaceUserRole) => void
}

const tabs = [
  { text: 'Link', value: 'link', icon: Icons.link },
  { text: 'Email', value: 'email', icon: Icons.mail },
]

const InviteUserDialog: React.FC<Props> = ({ workspaceId, opened, onClose, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [tab, setTab] = useState<'link' | 'email'>('link')
  const [copied, setCopied] = useState(false)

  useDebounce(
    () => {
      if (copied) {
        setCopied(false)
      }
    },
    3000,
    [copied]
  )

  const handleCopy = () => {
    navigator.clipboard.writeText('link')
    setCopied(true)
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
        <div className="flex flex-col gap-6 pb-6 mt-2">
          <div className="flex flex-row gap-3 md:gap-4 items-center w-full justify-center">
            {tabs.map((item) => (
              <button
                key={item.text}
                onClick={() => setTab(item.value as 'link' | 'email')}
                className={clsx(
                  ['flex items-center gap-2 md:gap-2 pb-0.5 px-5 border-b-2 text-[1.06rem] '],
                  {
                    'border-primary text-primary': tab === item.value,
                    'text-muted-foreground hover:text-foreground': tab !== item.value,
                  }
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.text}
              </button>
            ))}
          </div>

          <>
            {tab === 'link' ? (
              <>
                <div className="flex items-center gap-2">
                  <Input readOnly value="https://google.com" placeholder="https://google.com" />
                  <Button variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <Icons.check className="h-4 w-4 text-green-500 dark:text-green-600" />
                    ) : (
                      <Icons.copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </>
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
                <RadioGroup defaultValue="option-one" className="flex flex-col gap-6">
                  {/* // */}

                  <div className="flex items-start gap-4">
                    <RadioGroupItem value="member" id="member" />
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

                  <div className="flex items-start gap-4">
                    <RadioGroupItem value="admin" id="admin" />
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
