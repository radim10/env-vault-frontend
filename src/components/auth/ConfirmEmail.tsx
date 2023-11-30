'use client'

import Link from 'next/link'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  error?: 'invalid_token' | 'token_expired' | 'email_already_confirmed' | 'unknown'
}

const ConfirmEmail: React.FC<Props> = ({ error }) => {
  const router = useRouter()

  const goToLogin = () => {
    router.replace('/login')
  }

  return (
    <div className="flex justify-center w-full h-screen items-center -mt-20">
      <Card className="sm:w-[400px] w-[90vw]">
        <CardContent className="pt-5">
          {error && (
            <>
              <div className="flex flex-row gap-2 items-center">
                <div className="font-semibold text-lg text-red-600">Email confirmation failed</div>
                <Icons.xCircle className="text-red-600 h-5 w-5" />
              </div>
              <div className="mt-3 text-[0.92rem] opacity-90">
                {error === 'invalid_token' && 'Invalid confirmation token'}
                {error === 'token_expired' && 'Confirmation token expired'}
                {error === 'email_already_confirmed' && 'Email already confirmed'}
                {error === 'unknown' && 'Something went wrong'}
              </div>
            </>
          )}

          {!error && (
            <>
              <div className="flex flex-row gap-2 items-center">
                <div className="font-semibold text-lg text-green-600">Email has been confirmed</div>
                <Icons.checkCircle2 className="text-green-600 h-5 w-5" />
              </div>
              <div className="mt-3 text-[0.92rem] opacity-90">
                Your email has been confirmed, you can login now
              </div>
            </>
          )}

          <div className="mt-8">
            <Button size={'sm'} className="w-full" onClick={goToLogin}>
              Go to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfirmEmail
