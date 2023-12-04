'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import LoginCard from '@/components/auth/LoginCard'
import { useState } from 'react'
import EmailLoginCard from '@/components/auth/EmailLoginCard'
import clsx from 'clsx'
import AuthFooter from '@/components/auth/Footer'

const LoginPage = () => {
  const [emailLogin, setEmailLogin] = useState<boolean>(false)

  return (
    <div
      className={clsx(['flex justify-center w-full bg-red-400X h-screen items-center'], {
        // '-mt-10': !emailLogin || true,
      })}
    >
      <div className="flex flex-col items-center gap-6">
        {!emailLogin && (
          <>
            <div className="flex flex-col gap-1 items-center">
              <h1 className="dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
                Login to ZenEnv
              </h1>
              <div className="text-muted-foreground">
                Don't have an account?{' '}
                <span>
                  <Link href="/signup">
                    <Button variant="link" className="pl-0.5">
                      Sign up
                    </Button>
                  </Link>
                </span>
              </div>
            </div>
            {/* // FORM */}
            <div>
              <LoginCard onEmailSelect={() => setEmailLogin(true)} />
            </div>
          </>
        )}
        {emailLogin && <EmailLoginCard onCancel={() => setEmailLogin(false)} />}

        {!emailLogin && <AuthFooter />}
      </div>
    </div>
  )
}

export default LoginPage
