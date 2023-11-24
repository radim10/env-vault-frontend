'use client'

import { getCurrentUserData } from '@/app/actions'
import sessionStore from '@/stores/session'
import useCurrentUserStore from '@/stores/user'
import { UserSession } from '@/types/session'
import { WorkspaceUserRole } from '@/types/users'
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
  const { set, data } = useCurrentUserStore()
  const [user, setUser] = useState<{ email: string; name: string }>()

  useMount(async () => {
    const user = await getCurrentUserData()
    console.log(user)
    set({
      email: user?.email,
      role: WorkspaceUserRole.ADMIN,
      name: user?.name,
    })
    sessionStore.setState({ data: session })
  })

  // TODO: get current user from database and set state
  if (data === null) {
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
