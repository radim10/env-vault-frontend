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
import { CurrentUser, WorkspaceUserRole } from '@/types/users'
import { SubscriptionPlan } from '@/types/subscription'
import UsersExceededRoot from './UserExceededModal'
import CreditCardExpiredRoot from './CreditCardExpiredDialog'

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
  const { data: currentUser, set } = useCurrentUserStore()
  const { set: setSession, loggingOut, setLoggingOut } = useSessionStore()

  // TODO: check if accessToken is expired and refresh

  // NOTE: or use server action but implment retry + error handling
  const { data, isLoading, isRefetching, error, refetch } = useGetCurrentUser(
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
      onSuccess: (data) => {
        if (data?.defaultWorkspace !== undefined && !data?.user) {
          if (data?.defaultWorkspace === null) {
            router.replace(`/welcome`)
            return
          } else {
            router.replace(`/workspace/${data.defaultWorkspace}/projects`)
            return
          }
        }

        const selectedWorkspaceId = data?.defaultWorkspace ?? params?.workspace
        const selectedWorkspaceIndex = data?.workspaces?.findIndex(
          (workspace) => workspace.id === selectedWorkspaceId
        )

        // const updatedUser = produce(user, (draft) => {
        //   if (selectedWorkspaceIndex === -1 || selectedWorkspaceIndex === undefined) {
        //   } else {
        //     const role = user?.selectedWorkspace?.role
        //     const plan = user?.selectedWorkspace?.plan as SubscriptionPlan
        //
        //     if (role) {
        //       const workspace = {
        //         ...user?.workspaces?.[selectedWorkspaceIndex],
        //         role,
        //         plan
        //       }
        //       draft.selectedWorkspace = workspace
        //     }
        //   }
        // })
        // console.log({ updatedUser })
        //
        const updatedWorkspaces = produce(data.workspaces, (draft) => {
          if (draft) {
            if (selectedWorkspaceIndex === -1 || selectedWorkspaceIndex === undefined) {
            } else {
              draft[selectedWorkspaceIndex].selected = true
            }
          }
        })
        console.log({ updatedWorkspaces })

        const selectedWorkspace = {
          id: params?.workspace as string,
          name: data?.workspaces?.[selectedWorkspaceIndex as number].name as string,
          role: data?.selectedWorkspace?.role as WorkspaceUserRole,
          plan: data?.selectedWorkspace?.plan as SubscriptionPlan,
          exceedingUserCount: data?.selectedWorkspace?.exceedingUserCount ?? undefined,
          creditCardExpired: data?.selectedWorkspace?.creditCardExpired ?? undefined,
        }

        const currentUser: CurrentUser = {
          id: data?.user?.id,
          name: data?.user?.name,
          avatarUrl: data?.user?.avatarUrl,
          email: data?.user?.email,
          selectedWorkspace,
          workspaces: updatedWorkspaces as any,
        }

        console.log({ currentUser })
        set(currentUser)
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
  if (isLoading || loggingOut || isRefetching || currentUser === null) {
    return (
      <>
        <PageLoader />
      </>
    )
  }

  if (error && error?.code !== 'user_not_found') {
    return <AuthProviderFallback onRefetch={refetch} />
  }

  if (
    data?.selectedWorkspace?.creditCardExpired === true ||
    data?.selectedWorkspace?.exceedingUserCount
  ) {
    return (
      <>
        {data?.selectedWorkspace?.exceedingUserCount && (
          <UsersExceededRoot
            workspaceId={params?.workspace as string}
            subscriptionPlan={data?.selectedWorkspace?.plan as SubscriptionPlan}
            canManageUsers={data?.selectedWorkspace?.role !== WorkspaceUserRole.MEMBER}
            count={data?.selectedWorkspace?.exceedingUserCount}
          />
        )}
        {data?.selectedWorkspace?.creditCardExpired && (
          <CreditCardExpiredRoot workspaceId={params?.workspace as string} />
        )}
        {children}
      </>
    )
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
