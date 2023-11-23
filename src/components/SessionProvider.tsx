'use client'

import sessionStore from '@/stores/session'
import useCurrentUserStore from '@/stores/user'
import { UserSession } from '@/types/session'
import { WorkspaceUserRole } from '@/types/users'
import { createContext } from 'react'
import { useMount } from 'react-use'

// interface Props {
//   session: UserSession | null
//   children: React.ReactNode
// }
interface Props {
  session: UserSession
  user: {
    email: string
    name: string
  }
  children: React.ReactNode
}

export const AuthContext = createContext<{ email: string; name: string } | null>(null)

const AuthProvider: React.FC<Props> = ({ user, session, children }) => {
  const { set } = useCurrentUserStore()

  useMount(() => {
    set({
      email: user?.email,
      role: WorkspaceUserRole.ADMIN,
      name: user?.name,
    })
    sessionStore.setState({ data: session })
  })

  // TODO: get current user from database and set state
  // if (true) {
  //   return <>Loading</>
  // }
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export default AuthProvider
