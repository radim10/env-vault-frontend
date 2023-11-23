'use client'

import { useSession } from '@/stores/session'
import { UserSession } from '@/types/session'
import { createContext } from 'react'
import { useMount } from 'react-use'

interface Props {
  session: UserSession | null
  children: React.ReactNode
}

export const AuthContext = createContext<UserSession | null>(null)

const SessionProvider: React.FC<Props> = ({ session, children }) => {
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
}

export default SessionProvider
