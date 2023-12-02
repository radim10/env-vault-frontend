'use client'

import SessionsSection from './SessionsSection'
import { useQueryClient } from '@tanstack/react-query'
import useCurrentUserStore from '@/stores/user'
import { CurrentUser } from '@/types/users'
import AuthMethodsPassword from './AuthMethodsPassword'

const AuthSettings = () => {
  const queryClient = useQueryClient()
  const currentUser = useCurrentUserStore((state) => state.data)

  return (
    <>
      <div className="flex flex-col gap-7 mt-6">
        <AuthMethodsPassword currentUser={currentUser as CurrentUser} queryClient={queryClient} />
        {/* // */}
        <SessionsSection queryClient={queryClient} />
      </div>
    </>
  )
}

export default AuthSettings
