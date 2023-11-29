'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import LoginCard from '@/components/auth/LoginCard'

const LoginPage = () => {
  return (
    <div className="flex justify-center mt-[10%]  w-full">
      <div className="flex flex-col items-center gap-6">
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
          <LoginCard />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
