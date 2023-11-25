'use client'

import { useGetGoogleLink } from '@/api/queries/auth'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const LoginPage = (props: {}) => {
  const githubRedirect = () => {
    window.location.replace(process.env.NEXT_PUBLIC_GITHUB_URL as string)
  }

  const { refetch: getGoogleLink, isRefetching: getGoogleLinkLoading } = useGetGoogleLink({
    enabled: false,

    onSuccess: ({ link }) => {
      window.location.replace(link)
    },
  })

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
          <Card className="sm:w-[420px] w-[90vw]">
            <CardContent className="pt-5">
              <div className="flex flex-col gap-5">
                <div className="flex flex-row items-center justify-center gap-2 w-full opacity-80">
                  Continue building amazing apps
                  <Icons.rocket className="w-4 h-4 mt-1" />
                </div>

                {/* <form onSubmit={() => {}}> */}
                {/*   <div className="grid gap-4"> */}
                {/*     <div className="grid gap-1"> */}
                {/*       <Label className="sr-only" htmlFor="email"> */}
                {/*         Email */}
                {/*       </Label> */}
                {/*       <Input */}
                {/*         id="email" */}
                {/*         placeholder="name@example.com" */}
                {/*         type="email" */}
                {/*         autoCapitalize="none" */}
                {/*         autoComplete="email" */}
                {/*         autoCorrect="off" */}
                {/*         disabled={false} */}
                {/*       /> */}
                {/*     </div> */}
                {/*     <Button disabled={false} size={'sm'}> */}
                {/*       Login with email */}
                {/*     </Button> */}
                {/*   </div> */}
                {/* </form> */}
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
  )
}

export default LoginPage
