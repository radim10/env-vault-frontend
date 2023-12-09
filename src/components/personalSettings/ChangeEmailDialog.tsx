'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '../icons'
import { NewProject } from '@/types/projects'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateEffect } from 'react-use'
import { useImmer } from 'use-immer'
import clsx from 'clsx'
import DialogComponent from '../Dialog'
import { useChangeEmail } from '@/api/mutations/userAuth'
import { authRegex } from '@/utils/auth/auth'
import { changeEmailErrorMsgFromCode } from '@/api/requests/userAuth'

interface Props {
  opened: boolean
  onSuccess: (newEmail: string) => void
  onClose: () => void
}

const ChangeEmailDialog: React.FC<Props> = ({ opened, onSuccess, onClose }) => {
  const [email, setEmail] = useState('')

  const [password, setPassword] = useImmer<{
    value: string
    visible: boolean
  }>({
    value: '',
    visible: false,
  })

  const {
    isLoading,
    error,
    mutate: changeEmail,
  } = useChangeEmail({
    onSuccess: () => {
      onSuccess(email)
    },
  })

  return (
    <div>
      <DialogComponent
        title="Change email"
        descriptionComponent={
          <>
            <span>You can change your email only if you have password login method enabled.</span>
            <span className="text-red-600">
              You won't be able to use currently connected oauth methods
            </span>
          </>
        }
        opened={opened}
        loading={isLoading}
        onClose={onClose}
        error={error ? changeEmailErrorMsgFromCode(error?.code) : undefined}
        onSubmit={() => changeEmail({ newEmail: email, password: password.value })}
        submit={{
          text: 'Confirm',
          disabled: authRegex.email.test(email) === false || password.value.length < 10,
        }}
      >
        <div className="flex flex-col gap-4 pb-0 pt-0 text-lg">
          <div className="flex flex-col gap-1.5 items-start justify-center">
            <Label htmlFor="email" className="text-right pl-1">
              New email
            </Label>
            <Input
              className="mt-0.5"
              id="email"
              type="email"
              value={email}
              disabled={isLoading}
              placeholder="new@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* // */}
          <div className="flex flex-col gap-1.5 items-start justify-center">
            <Label htmlFor="password" className="text-right pl-1">
              Password
            </Label>
            <div className="w-full flex justify-end items-center relative">
              <Input
                disabled={isLoading}
                type={password.visible ? 'text' : 'password'}
                placeholder={'Confirm with your password'}
                className="pr-10"
                value={password.value}
                onChange={(e) =>
                  setPassword((draft) => {
                    draft.value = e.target.value
                  })
                }
              />
              <button
                disabled={password?.value?.length === 0}
                className={clsx(
                  [
                    'absolute ease duration-200 w-8 h-8 mr-2 flex justify-center items-center gap-2 md:gap-3.5',
                  ],
                  {
                    'opacity-50': password?.value?.length === 0,
                    'cursor-pointer hover:text-primary': password?.value?.length !== 0,
                  }
                )}
                onClick={() =>
                  setPassword((draft) => {
                    draft.visible = !draft.visible
                  })
                }
              >
                {password?.visible ? (
                  <Icons.eyeOff className="h-4 w-4 opacity-80" />
                ) : (
                  <Icons.eye className="h-4 w-4 opacity-80" />
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogComponent>
    </div>
  )
}

export default ChangeEmailDialog
