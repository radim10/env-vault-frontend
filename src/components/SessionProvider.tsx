'use client'

import { useGetCurrentUser } from '@/api/queries/currentUser'
import useSessionStore from '@/stores/session'
import useCurrentUserStore from '@/stores/user'
import { UserSession } from '@/types/session'
import { produce } from 'immer'
import { useParams, useRouter } from 'next/navigation'
import { useMount } from 'react-use'
import PageLoader from './PageLoader'

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
  const { set: setSession, loggingOut } = useSessionStore()

  // TODO: check if accessToken is expired and refresh

  // NOTE: or use server action but implment retry + error handling
  const { isLoading } = useGetCurrentUser(
    {
      // TODO: workspaceId???
      // workspaceId: '4ef8a291-024e-4ed8-924b-1cc90d01315e',
      workspaceId: params?.workspace as string,
      accessToken: session?.accessToken,
      workspaces: true,
    },

    {
      refetchOnMount: true,
      cacheTime: 5000,
      onSuccess: (user) => {
        const selectedWorkspaceId = user?.defaultWorkspace ?? params?.workspace
        const selectedWorkspace = user?.workspaces?.findIndex(
          (workspace) => workspace.id === selectedWorkspaceId
        )

        const updatedUser = produce(user, (draft) => {
          draft.workspaces[selectedWorkspace] = {
            ...draft.workspaces[selectedWorkspace],
            selected: true,
          }
        })

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
    setSession(session)
  })

  // TODO: get current user from database and set state
  if (isLoading || loggingOut) {
    return (
      <>
        <PageLoader />
      </>
    )
  }
  //
  return <>{children}</>
  // return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export default AuthProvider
