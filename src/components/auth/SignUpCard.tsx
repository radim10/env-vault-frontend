'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetGithubUrl, useGetGoogleUrl } from '@/api/queries/auth'
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'
import clsx from 'clsx'
import GoogleIcon from './GoogleIcon'
import { WorkspaceUserRole } from '@/types/users'

interface SignUpCardProps {
  invitation?: {
    id: string
    workspace: string
    role: WorkspaceUserRole
  }
  onEmailSelect: () => void
}

const SignUpCard: React.FC<SignUpCardProps> = ({ invitation, onEmailSelect }) => {
  const [checked, setChecked] = useState(false)
  const [animateCheck, setAnimateCheck] = useState(false)

  const { refetch: getGoogleLink, isRefetching: getGoogleLinkLoading } = useGetGoogleUrl(null, {
    enabled: false,

    onSuccess: ({ url }) => {
      window.location.replace(url)
    },
  })

  const { refetch: getGithubUrl, isRefetching: getGithubUrlLoading } = useGetGithubUrl(null, {
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
      onEmailSelect()
    }
  }

  return (
    <div>
      <Card className="sm:w-[420px] w-[90vw]">
        <CardContent className="pt-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-row items-center justify-center gap-2 w-full opacity-80">
              Start managing your secrets for free
              <Icons.rocket className="w-4 h-4 mt-1" />
            </div>

            {/* <Button */}
            {/*   size={'default'} */}
            {/*   onClick={onEmailSelect} */}
            {/*   disabled={getGithubUrlLoading || getGoogleLinkLoading} */}
            {/* > */}
            {/*   Sign up with email */}
            {/* </Button> */}
            {/* <div className="relative"> */}
            {/*   <div className="absolute inset-0 flex items-center"> */}
            {/*     <span className="w-full border-t" /> */}
            {/*   </div> */}
            {/*   <div className="relative flex justify-center text-xs uppercase"> */}
            {/*     <span className="bg-background px-2 text-muted-foreground">Or continue with</span> */}
            {/*   </div> */}
            {/* </div> */}

            <div className="flex flex-col gap-2">
              <Button
                size={'default'}
                variant="outline"
                type="button"
                className="gap-3"
                disabled={getGithubUrlLoading || getGoogleLinkLoading}
                loading={getGithubUrlLoading}
                onClick={() => handleButtonClick('github')}
              >
                <Icons.github className="h-4 w-4 opacity-70" />
                Continue with Github
              </Button>

              <Button
                disabled={getGoogleLinkLoading || getGithubUrlLoading}
                loading={getGoogleLinkLoading}
                onClick={() => handleButtonClick('google')}
                variant="outline"
                size={'default'}
                type="button"
                className="gap-3"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
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
    </div>
  )
}

export default SignUpCard
