'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import clsx from 'clsx'
import AuthFooter from '@/components/auth/Footer'
import SignUpCard from './SignUpCard'
import EmailSignUp from './EmailSignUp'
import OauthRedirectLoader from '../OauthRedirectLoader'

const SignUp = () => {
  const [emailSignUp, setEmailSignUp] = useState<boolean>(false)
  const [redirecting, setRedirecting] = useState<'google' | 'github'>()

  const handleRedirect = (args: { url: string; provider: 'google' | 'github' }) => {
    const { url, provider } = args

    window.location.replace(url)
    setRedirecting(provider)
  }

  if (redirecting !== undefined) {
    return <OauthRedirectLoader provider="github" />
  }

  return (
    <div
      className={clsx(
        ['flex flex-col gap-4 justify-center w-full bg-red-400X h-screen items-center'],
        {
          // '-mt-10': !emailSignUp,
        }
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {!emailSignUp && (
          <>
            <div className="flex flex-col gap-1 items-center">
              <h1 className="dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
                Sign Up to ZenEnv
              </h1>
              <div className="text-muted-foreground">
                Already have an account?
                <span>
                  <Link href="/login">
                    <Button variant="link" className="pl-1.5">
                      Login
                    </Button>
                  </Link>
                </span>
              </div>
            </div>
            {/* // FORM */}
            <div>
              <SignUpCard onEmailSelect={() => setEmailSignUp(true)} onRedirect={handleRedirect} />
            </div>
          </>
        )}
        {emailSignUp && <EmailSignUp onCancel={() => setEmailSignUp(false)} />}
      </div>
      {/* // */}
      {!emailSignUp && <AuthFooter />}
    </div>
  )
}

export default SignUp
