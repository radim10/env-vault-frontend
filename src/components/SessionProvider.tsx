'use client'

import { useGetCurrentUser } from '@/api/queries/currentUser'
import sessionStore from '@/stores/session'
import useCurrentUserStore from '@/stores/user'
import { UserSession } from '@/types/session'
import { produce } from 'immer'
import { useParams, useRouter } from 'next/navigation'
import { createContext, useState } from 'react'
import { useMount } from 'react-use'

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

export const AuthContext = createContext<{ email: string; name: string } | null>(null)

const AuthProvider: React.FC<Props> = ({ session, children }) => {
  const params = useParams()
  const router = useRouter()
  const { set } = useCurrentUserStore()

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
    sessionStore.setState({ data: session })
  })

  // TODO: get current user from database and set state
  if (isLoading) {
    return (
      <>
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="w-8 h-8 rounded-full animate-spin border-4 border border-solid border-primary border-t-transparent"></div>
        </div>
      </>
    )
  }
  //
  return <>{children}</>
  // return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export default AuthProvider
