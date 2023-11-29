'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetGithubUrl, useGetGoogleUrl } from '@/api/queries/auth'

interface SignUpCardProps {
  onEmailSelect: () => void
}

const SignUpCard: React.FC<SignUpCardProps> = ({ onEmailSelect }) => {
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

  return (
    <div>
      <Card className="sm:w-[420px] w-[90vw]">
        <CardContent className="pt-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-row items-center justify-center gap-2 w-full opacity-80">
              Start managing your secrets for free
              <Icons.rocket className="w-4 h-4 mt-1" />
            </div>

            <Button
              size={'sm'}
              onClick={onEmailSelect}
              disabled={getGithubUrlLoading || getGoogleLinkLoading}
            >
              Sign up with email
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size={'sm'}
                variant="outline"
                type="button"
                disabled={getGithubUrlLoading || getGoogleLinkLoading}
                loading={getGithubUrlLoading}
                onClick={() => getGithubUrl()}
              >
                <Icons.github className="mr-2 h-4 w-4" />
                Github
              </Button>

              <Button
                disabled={getGoogleLinkLoading || getGithubUrlLoading}
                loading={getGoogleLinkLoading}
                onClick={() => getGoogleLink()}
                variant="outline"
                size={'sm'}
                type="button"
              >
                Google
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpCard
