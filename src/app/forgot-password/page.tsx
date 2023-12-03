import Link from 'next/link'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import ForgotPasswordCard from '@/components/auth/ForgotPasswordCard'

const ForgotPasswordPage = (props: {}) => {
  return (
    <div
      className={clsx(['flex justify-center w-full bg-red-400X h-screen items-center'], {
        '-mt-10': true,
      })}
    >
      <div className="flex flex-col items-center gap-6">
        <>
          <div className="flex flex-col gap-1 items-center">
            <h1 className="dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
              Forgot password
            </h1>
            <div className="text-muted-foreground">
              Remember your password?
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
            <ForgotPasswordCard />
          </div>
        </>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
