'use client'

import { useGetCurrentUser } from '@/api/queries/currentUser'
import useSessionStore from '@/stores/session'
import useCurrentUserStore from '@/stores/user'
import { UserSession } from '@/types/session'
import { produce } from 'immer'
import { useParams, useRouter } from 'next/navigation'
import { useMount } from 'react-use'
import PageLoader from './PageLoader'
import { Icons } from './icons'
import { Button } from './ui/button'
import { GetCurrentUserError } from '@/api/requests/currentUser'
import { WorkspaceUserRole } from '@/types/users'

// interface Props {
//   session: UserSession | null
//   children: React.ReactNode
// }
interface Props {
  session: UserSession
  // user: {
  //   email: string
  //   name: string
  // }
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ session, children }) => {
  const params = useParams()
  const router = useRouter()
  const { set } = useCurrentUserStore()
  const { set: setSession, loggingOut, setLoggingOut } = useSessionStore()

  // TODO: check if accessToken is expired and refresh

  // NOTE: or use server action but implment retry + error handling
  const { isLoading, isRefetching, error, refetch } = useGetCurrentUser(
    {
      // TODO: workspaceId???
      // workspaceId: '4ef8a291-024e-4ed8-924b-1cc90d01315e',
      workspaceId: params?.workspace as string,
      workspaces: true,
      session,
    },

    {
      refetchOnMount: true,
      cacheTime: 5000,
      onError: async (error: GetCurrentUserError) => {
        if (error?.code === 'user_not_found') {
          // NOTE: user deleted
          await fetch('/api/logout', { method: 'POST' })
          router.replace('/login', { scroll: false })
        }
      },
      onSuccess: (user) => {
        const selectedWorkspaceId = user?.defaultWorkspace ?? params?.workspace
        const selectedWorkspaceIndex = user?.workspaces?.findIndex(
          (workspace) => workspace.id === selectedWorkspaceId
        )

        const updatedUser = produce(user, (draft) => {
          if (selectedWorkspaceIndex === -1) {
          } else {
            // TODO: ROLE
            const workspace = {
              ...user?.workspaces?.[selectedWorkspaceIndex],
              role: WorkspaceUserRole.OWNER,
            }
            draft.selectedWorkspace = workspace
          }
        })
        console.log({ updatedUser })

        // const updatedUser = produce(user, (draft) => {
        //   draft.workspaces[selectedWorkspace] = {
        //     ...draft.workspaces[selectedWorkspace],
        //     selected: true,
        //   }
        // })

        set(updatedUser)

        if (user?.defaultWorkspace !== undefined) {
          if (user?.defaultWorkspace === null) {
            router.replace(`/welcome`)
          } else {
            router.replace(`/workspace/${user.defaultWorkspace}/projects`)
          }
        }
      },
    }
  )

  // useUpdateEffect(() => {
  //   alert(4)
  // }, [params?.workspace])

  useMount(() => {
    if (loggingOut) {
      setLoggingOut(false)
    }
    setSession(session)
  })

  // error?.code !==
  // TODO: get current user from database and set state
  if (isLoading || loggingOut || isRefetching) {
    return (
      <>
        <PageLoader />
      </>
    )
  }

  if (error && error?.code !== 'user_not_found') {
    return <AuthProviderFallback onRefetch={refetch} />
  }

  return <>{children}</>
}

//
interface AuthProviderFallbackProps {
  onRefetch: () => void
}

const AuthProviderFallback: React.FC<AuthProviderFallbackProps> = ({ onRefetch }) => {
  return (
    <>
      <div className=" flex justify-center items-center h-[100vh] px-4">
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-center dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
            Something went wrong
          </h1>

          <div className="flex flex-row w-full gap-3">
            <Button className="w-full gap-3" variant="outline" onClick={onRefetch}>
              <Icons.refresh className="inline-block h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthProvider
