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

interface InvitationProps {
  id: string
  workspace: string
  role: WorkspaceUserRole
}

export const Invitation: React.FC<InvitationProps> = ({ id, workspace, role }) => {
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
      <div className="flex justify-center mt-[6%]  w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col gap-1 items-center">
            <h1 className="dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
              ZenEnv invitation
            </h1>
            <div className="text-muted-foreground">
              Already have an account?
              <span>
                <Link href="/login">
                  <Button variant="link" className="pl-0.5">
                    Login
                  </Button>
                </Link>
              </span>
            </div>
          </div>
          {/* // FORM */}
          <div>
            {emailSelected && (
              <EmailSignUp invitation={id} onCancel={() => setEmailSelected(false)} />
            )}
            {!emailSelected && (
              <Card className="sm:w-[420px] w-[90vw]">
                <CardContent className="pt-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-center gap-2 w-full opacity-80">
                      You have been invited to ZenEnv
                      <Icons.userPlus className="w-4 h-4" />
                    </div>

                    <Separator />
                    <div className="flex flex-col gap-1.5 mb-2">
                      <div className="flex flex-row gap-2 flex-wrap">
                        <div className="font-medium">Workspace:</div>
                        <div>{workspace}</div>
                      </div>

                      <div className="flex flex-row gap-2">
                        <div className="font-medium">User role:</div>
                        <div>
                          <UserRoleBadge role={role} />
                        </div>
                      </div>
                    </div>

                    {/* <Button disabled={getGithubUrlLoading || getGoogleLinkLoading} size={'sm'}> */}
                    {/*   Login with email */}
                    {/* </Button> */}
                    {/* <div className="relative"> */}
                    {/*   <div className="absolute inset-0 flex items-center"> */}
                    {/*     <span className="w-full border-t" /> */}
                    {/*   </div> */}
                    {/*   <div className="relative flex justify-center text-xs uppercase"> */}
                    {/*     <span className="bg-background px-2 text-muted-foreground"> */}
                    {/*       Or continue with */}
                    {/*     </span> */}
                    {/*   </div> */}
                    {/* </div> */}
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        size={'default'}
                        variant="outline"
                        className="gap-3"
                        disabled={getGithubUrlLoading || getGoogleLinkLoading}
                        loading={getGithubUrlLoading}
                        onClick={() => getGithubUrl()}
                      >
                        <Icons.github className="h-4 w-4 opacity-70" />
                        Continue with GitHub
                      </Button>

                      <Button
                        disabled={getGoogleLinkLoading || getGithubUrlLoading}
                        loading={getGoogleLinkLoading}
                        onClick={() => getGoogleLink()}
                        variant="outline"
                        className="gap-3"
                        type="button"
                        size={'sm'}
                      >
                        <GoogleIcon />
                        Continue with Google
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">OR</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size={'default'}
                      onClick={() => handleButtonClick('email')}
                      disabled={getGithubUrlLoading || getGoogleLinkLoading}
                      className="gap-3"
                    >
                      <Icons.mail className="h-4 w-4 opacity-70" />
                      Continue with email
                    </Button>

                    <div className={clsx(['flex items-center w-full justify-end  mt-2'], {})}>
                      <div
                        className={clsx(['flex space-x-3'], {
                          shake: animateCheck === true && checked === false,
                        })}
                      >
                        <label
                          htmlFor="terms"
                          className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Accept terms and conditions
                        </label>
                        <Checkbox
                          id="terms"
                          checked={checked}
                          onCheckedChange={() => setChecked(!checked)}
                          className={clsx(['dark:border-gray-600 border-gray-800'], {
                            'border-primary dark:border-primary': checked,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
