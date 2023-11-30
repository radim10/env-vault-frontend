'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useState } from 'react'
import { useCreateWorkspace } from '@/api/mutations/workspaces'
import Link from 'next/link'
import { UserSession } from '@/types/session'
import { useMount } from 'react-use'
import useSessionStore from '@/stores/session'

const nextItems = [
  {
    text: 'Invite your team members',
    icon: Icons.userPlus,
  },
  {
    text: 'Create your first project',
    icon: Icons.plusCircle,
  },
  {
    text: 'Start managing environments',
    icon: Icons.userPlus,
  },
  {
    text: 'Securely store your secrets',
    icon: Icons.asterisk,
  },
  {
    text: 'Connect CLI for local development',
    icon: Icons.terminal,
  },
  {
    text: 'And much more',
    icon: Icons.moreHorizontal,
  },
]

interface Props {
  session: UserSession
}

const Welcome: React.FC<Props> = ({ session }) => {
  const setSession = useSessionStore((state) => state.set)
  const [workspaceName, setWorkspaceName] = useState('')
  const { data, isLoading, error, mutate: createWorkspace } = useCreateWorkspace()

  useMount(() => setSession(session))

  return (
    <div>
      <div className="flex justify-center mt-[10%]  w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col gap-1 items-center">
            <h1 className="dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
              <span className="hidden sm:inline">Welcome to ZenEnv! {'😎'}</span>
              <span className="sm:hidden ">Welcome to ZenEnv!</span>
            </h1>
            <div className="text-muted-foreground">Your workspace is waiting for you</div>
          </div>
          {/* // FORM */}
          <div>
            <Card className="sm:w-[420px] w-[90vw]">
              <CardContent className="pt-5">
                {data && (
                  <>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-row items-center justify-center gap-2 w-full opacity-80">
                        What's next?
                      </div>

                      <div className="flex flex-col gap-3 mt-1 md:mx-2">
                        {nextItems?.map(({ text, icon: Icon }) => (
                          <div className="flex flex-row gap-4 items-center">
                            <Icon className="w-4 h-4 text-primary" />
                            <div className="text-[1.03rem]">{text}</div>
                          </div>
                        ))}
                      </div>

                      <Link href={`/workspace/${data?.id}/projects`} className="mt-2">
                        <Button className="w-full" size={'sm'}>
                          I'm ready
                        </Button>
                      </Link>
                    </div>
                  </>
                )}

                {!data && (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-row items-center justify-center gap-2 w-full opacity-80">
                      Let's start by creating your workspace
                      <Icons.blocks className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col gap-2 mt-1">
                      <div>
                        <Label>Workspace name</Label>
                      </div>
                      <div>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter your workspace name"
                          value={workspaceName}
                          onChange={(e) => setWorkspaceName(e.target.value)}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-2 mb-2">
                        <Icons.xCircle className="h-4 w-4" />
                        <div>Something went wrong</div>
                      </div>
                    )}
                    <Button
                      className=""
                      size={'sm'}
                      loading={isLoading}
                      disabled={workspaceName?.trim()?.length === 0}
                      onClick={() => createWorkspace({ name: workspaceName })}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
