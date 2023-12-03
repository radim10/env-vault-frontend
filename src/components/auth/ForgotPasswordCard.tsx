'use client'

import { Input } from '../ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useForgotPassword } from '@/api/mutations/auth'
import { useState } from 'react'
import { Icons } from '../icons'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const ForgotPasswordCard = ({}) => {
  const [email, setEmail] = useState('')

  const { mutate, isLoading, error, status } = useForgotPassword({
    onSuccess: () => setEmail(''),
  })

  return (
    <div>
      <Card className="sm:w-[420px] w-[90vw]">
        <CardContent className="pt-5">
          <div className="flex flex-col gap-5">
            <div className="text-[0.92rem]">
              Enter your email and we will send you a link to reset your password
            </div>

            <Input
              type={'email'}
              className="pr-10"
              placeholder="Enter your email"
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {/* {emailLoginErrorMsgFromCode(error?.code) ?? 'Something went wrong'} */}
                Something went wrong
              </div>
            )}
            {status === 'success' && (
              <>
                <div className="text-green-600 text-[0.92rem] flex items-start gap-2 mt-0">
                  <div className="w-[5%] mt-1">
                    <Icons.checkCircle2 className="h-4 w-4" />
                  </div>
                  <div>If the email exists, password reset link has been sent</div>
                </div>
              </>
            )}

            <Button
              variant="default"
              size={'sm'}
              type="button"
              loading={isLoading}
              disabled={!emailRegex.test(email)}
              onClick={() => {
                if (!emailRegex.test(email)) return
                mutate({ email })
              }}
            >
              Reset password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordCard
