'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Separator } from './ui/separator'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import UserRoleBadge from './users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { Card, CardContent } from '@/components/ui/card'
import { useGetGithubUrl, useGetGoogleUrl } from '@/api/queries/auth'
import clsx from 'clsx'
import { Checkbox } from './ui/checkbox'
import EmailSignUp from './auth/EmailSignUp'
import GoogleIcon from './auth/GoogleIcon'
import SignUpCard from './auth/SignUpCard'
import LoginCard from './auth/LoginCard'
import EmailLoginCard from './auth/EmailLoginCard'

interface InvitationProps {
  type: 'login' | 'signup'
  id: string
  workspace: string
  role: WorkspaceUserRole
}

export const Invitation: React.FC<InvitationProps> = ({ type, id, workspace, role }) => {
  const [emailSelected, setEmailSelected] = useState(false)
  const [checked, setChecked] = useState(false)
  const [animateCheck, setAnimateCheck] = useState(false)

  const { refetch: getGoogleLink, isRefetching: getGoogleLinkLoading } = useGetGoogleUrl(id, {
    enabled: false,
    onSuccess: ({ url }) => {
      window.location.replace(url)
    },
  })

  const { refetch: getGithubUrl, isRefetching: getGithubUrlLoading } = useGetGithubUrl(id, {
    enabled: false,
    onSuccess: ({ url }) => {
      window.location.replace(url)
    },
  })

  const handleButtonClick = (type: 'github' | 'google' | 'email') => {
    if (!checked) {
      setAnimateCheck(true)
      setTimeout(() => {
        setAnimateCheck(false)
      }, 400)

      return
    }

    if (type === 'github') {
      getGithubUrl()
    } else if (type === 'google') {
      getGoogleLink()
    } else if (type === 'email') {
      // TODO:
      // onEmailSelect()
    }
  }

  return (
    <div>
      {!emailSelected && (
        <div className="absolute left-10 top-10">
          <Link href={`/login`}>
            <Button className="flex items-center gap-2 " variant="outline">
              <Icons.arrowLeft className="w-4 h-4" />
              <span>Login</span>
            </Button>
          </Link>
        </div>
      )}
      <div
        className={clsx(['flex justify-center mt-[25%] md:mt-[10%]   w-full'], {
          'lg:mt-[8%]': !emailSelected,
          'lg:mt-[7%]': !emailSelected,
        })}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-1 items-center">
            {!emailSelected && (
              <h1 className="dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
                ZenEnv invitation
              </h1>
            )}

            {/* {emailSelected && ( */}
            {/*   <h1 className="dark:text-gray-200 scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0"> */}
            {/*     ZenEnv invitation */}
            {/*   </h1> */}
            {/* )} */}

            {type !== 'login' && !emailSelected && (
              <div className="text-muted-foreground">
                Already have an account?
                <span>
                  <Link href={`/invitation/${id}/login`}>
                    <Button variant="link" className="pl-0.5">
                      Login
                    </Button>
                  </Link>
                </span>
              </div>
            )}

            {type === 'login' && !emailSelected && (
              <div className="text-muted-foreground">
                Do not have an account?
                <span>
                  <Link href={`/invitation/${id}/signup`}>
                    <Button variant="link" className="pl-0.5">
                      Sign up
                    </Button>
                  </Link>
                </span>
              </div>
            )}
          </div>
          {/* // FORM */}
          {type === 'login' && (
            <>
              {emailSelected && (
                <EmailLoginCard invitation={{ id }} onCancel={() => setEmailSelected(false)} />
              )}
              {!emailSelected && (
                <LoginCard
                  invitation={{ id, workspace, role }}
                  onEmailSelect={() => setEmailSelected(true)}
                />
              )}
            </>
          )}

          {type === 'signup' && (
            <>
              {emailSelected && (
                <EmailSignUp invitation={id} onCancel={() => setEmailSelected(false)} />
              )}
              {!emailSelected && (
                <SignUpCard
                  invitation={{ id, workspace, role }}
                  onEmailSelect={() => setEmailSelected(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
