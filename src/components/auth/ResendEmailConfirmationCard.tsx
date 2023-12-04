import { useResendEmailConfirmation } from '@/api/mutations/auth'
import { Icons } from '../icons'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { resendEmailConfirmationErrorMsgFromCode } from '@/api/requests/auth'

interface Props {
  email: string
  password: string
  //
  remainingResends?: number
  onGoBack: () => void
}

const ResendEmailConfirmationCard: React.FC<Props> = ({
  remainingResends,
  email,
  password,
  onGoBack,
}) => {
  const {
    error: resendError,
    isLoading: resendLoading,
    mutate: resendEmailConfirmation,
    status: resendStatus,
  } = useResendEmailConfirmation()

  return (
    <>
      <Card className="sm:w-[460px] w-[90vw]">
        <CardContent className="pt-5 md:px-8">
          <>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2 items-center">
                <div className="font-semibold text-lg text-orange-600">Email not confirmed</div>
                <Icons.alertCircle className="text-orange-600 h-5 w-5" />
              </div>

              <div className="md:-mt-2 -mt-1 text-[1rem] opacity-90">
                Please check your inbox and confirm your email
              </div>
              <>
                <div className="opacity-90">
                  Confirmation emails are valid for 24 hours. It might take a few minutes to arrive.
                  {remainingResends && "Didn't receive a confirmation email?"}
                </div>

                {resendStatus !== 'success' && (
                  <div className="mt-1 text-muted-foreground text-[0.98rem]">
                    {remainingResends ? (
                      <>Reamainig resends: {remainingResends}</>
                    ) : (
                      <>Max resend limit reached</>
                    )}
                  </div>
                )}

                {resendError && (
                  <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                    <Icons.xCircle className="h-4 w-4" />
                    {resendEmailConfirmationErrorMsgFromCode(resendError?.code)}
                  </div>
                )}

                {resendStatus === 'success' && (
                  <div className="text-green-600 text-[0.92rem] flex items-center gap-2 mt-0">
                    <Icons.checkCircle2 className="h-4 w-4" />
                    Confirmation email sent
                  </div>
                )}

                {remainingResends && resendStatus !== 'success' && (
                  <Button
                    loading={resendLoading}
                    className="gap-2 mt-0"
                    onClick={() =>
                      resendEmailConfirmation({
                        email,
                        password,
                      })
                    }
                  >
                    <span>Resend</span>
                    <Icons.sendHorizontal className="h-4 w-4" />
                  </Button>
                )}

                {(!remainingResends || resendStatus === 'success') && (
                  <Button
                    className="gap-2 mt-0 w-full"
                    variant="outline"
                    onClick={() => onGoBack()}
                  >
                    <span>Back to login</span>
                  </Button>
                )}
              </>
            </div>
          </>
        </CardContent>
      </Card>
    </>
  )
}

export default ResendEmailConfirmationCard
