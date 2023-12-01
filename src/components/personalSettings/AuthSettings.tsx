'use client'

import clsx from 'clsx'
import { Icons } from '../icons'
import PersonalSettingsLayout from './Layout'
import PasswordSection from './PasswordSection'
import SessionsSection from './SessionsSection'
import { useGetAuthMethods } from '@/api/queries/userAuth'
import { Skeleton } from '../ui/skeleton'
import { AuthType } from '@/types/auth'
import { Button } from '../ui/button'
import { useState } from 'react'
import RemoveAuthMethodDialog from './RemoveAuthMethodDialog'
import { useQueryClient } from '@tanstack/react-query'
import { GetAuthMethodsResData } from '@/api/requests/userAuth'
import { useToast } from '../ui/use-toast'
import useCurrentUserStore from '@/stores/user'

const loginMethods: {
  text: string
  type: AuthType
  icon: React.ReactNode
}[] = [
  {
    type: AuthType.GOOGLE,
    text: 'Google auth',
    icon: <span className="font-bold ml-0.5 opacity-100">G</span>,
  },
  {
    type: AuthType.GITHUB,
    text: 'Github auth',
    icon: <Icons.github className="h-4 w-4 opacity-100" />,
  },

  {
    type: AuthType.EMAIL,
    text: 'Email',
    icon: <Icons.mail className="h-4 w-4 opacity-100" />,
  },
]

const AuthSettings = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const currentUser = useCurrentUserStore((state) => state.data)

  const [removeDialog, setRemoveDialog] = useState<{
    opened: boolean
    method: AuthType
  } | null>(null)

  const { data, isLoading, error, refetch } = useGetAuthMethods(currentUser?.id ?? '')

  const handleCloseDialog = () => {
    if (!removeDialog) return
    setRemoveDialog({ method: removeDialog?.method, opened: false })

    setTimeout(() => {
      setRemoveDialog(null)
    }, 200)
  }

  const handleRemovedAuthMethod = (type: AuthType) => {
    handleCloseDialog()

    const data = queryClient.getQueryData<GetAuthMethodsResData>([currentUser?.id, 'auth-methods'])

    if (data) {
      const newData = data.methods.filter((m) => m !== type)

      queryClient.setQueryData<GetAuthMethodsResData>([currentUser?.id, 'auth-methods'], {
        methods: newData,
      })
    }

    toast({
      title: 'Session has been revoked',
      variant: 'success',
    })
  }
  return (
    <>
      {removeDialog?.method && (
        <RemoveAuthMethodDialog
          opened={removeDialog?.opened === true}
          method={removeDialog?.method}
          onClose={handleCloseDialog}
          onSuccess={() => handleRemovedAuthMethod(removeDialog?.method)}
        />
      )}
      <div className="flex flex-col gap-7 mt-6">
        <PersonalSettingsLayout title="Avaliable methods" icon={Icons.bookKey}>
          <div className="flex flex-col gap-4 justify-center w-full">
            {/* // */}

            {error && (
              <div className="h-28 flex flex-row items-center">
                <div className="flex flex-col gap-2 w-full items-center">
                  <div className="text-red-600 text-[0.92rem]">Something went wrong</div>
                  <div>
                    <Button size={'sm'} variant="outline" onClick={() => refetch()}>
                      Try again
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {!error &&
              loginMethods.map(({ text, type, icon }) => (
                <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                  <div className="flex items-center gap-3 md:w-[23%]">
                    <span>{icon}</span>
                    <div className="font-semibold text-[0.98rem] text-muted-foreground">{text}</div>
                  </div>
                  <div className="flex flex-row gap-7 items-center">
                    <div
                      className={clsx(['text-[0.98rem]'], {
                        'opacity-90': !data || !data?.methods.find((t) => t === type),
                        'text-primary': data?.methods.find((t) => t === type),
                      })}
                    >
                      {/* {value === 'password' ? 'Not avaliable' : 'Available'} */}
                      {isLoading && <Skeleton className="w-36 h-5" />}
                      {!isLoading && data && (
                        <>{data?.methods.find((t) => t === type) ? 'Enabled' : 'Disabled'}</>
                      )}
                    </div>
                    {data && data.methods.find((t) => t === type) && data?.methods?.length > 1 && (
                      <button
                        className="text-red-600 opacity-90 hover:opacity-100 ease duration-200 flex items-center gap-3 text-[0.93rem]"
                        onClick={() =>
                          setRemoveDialog({
                            method: type,
                            opened: true,
                          })
                        }
                      >
                        {type === AuthType.EMAIL ? <span>Disable</span> : <span>Unlink</span>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </PersonalSettingsLayout>
        {/* // */}
        <PasswordSection />

        {/* // */}
        <SessionsSection />
      </div>
    </>
  )
}

export default AuthSettings
