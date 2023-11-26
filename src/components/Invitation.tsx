'use client'

import Link from 'next/link'
import { Separator } from './ui/separator'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import UserRoleBadge from './users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { Card, CardContent } from '@/components/ui/card'
import { useGetGoogleLink } from '@/api/queries/auth'

interface InvitationProps {
  id: string
  workspace: string
  role: WorkspaceUserRole
}

export const Invitation: React.FC<InvitationProps> = ({ id, workspace, role }) => {
  const githubRedirect = () => {
    window.location.replace(process.env.NEXT_PUBLIC_GITHUB_URL as string)
  }

  const { refetch: getGoogleLink, isRefetching: getGoogleLinkLoading } = useGetGoogleLink(id, {
    enabled: false,
    onSuccess: ({ link }) => {
      window.location.replace(link)
    },
  })

  return (
    <div>
      <div className="flex justify-center mt-[6%]  w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col gap-1 items-center">
            <h1 className="dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
              ZenEnv invitation
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
            <Card className="sm:w-[420px] w-[90vw]">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-5">
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

                  <Button disabled={false} size={'sm'}>
                    Login with email
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size={'sm'}
                      type="button"
                      disabled={false}
                      onClick={githubRedirect}
                    >
                      <Icons.github className="mr-2 h-4 w-4" />
                      Github
                    </Button>

                    <Button
                      disabled={getGoogleLinkLoading}
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
        </div>
      </div>
    </div>
  )
}
