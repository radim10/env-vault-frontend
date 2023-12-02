import { QueryClient } from '@tanstack/react-query'
import PasswordSection from './PasswordSection'
import { CurrentUser } from '@/types/users'
import AuthMethodsSection from './AuthMethodsSection'
import { useGetAuthMethods } from '@/api/queries/userAuth'

interface Props {
  currentUser: CurrentUser
  queryClient: QueryClient
}

const AuthMethodsPassword: React.FC<Props> = ({ currentUser, queryClient }) => {
  const authMethods = useGetAuthMethods(currentUser?.id)

  return (
    <>
      <AuthMethodsSection
        currentUser={currentUser as CurrentUser}
        queryClient={queryClient}
        authMethods={authMethods}
      />
      {/* // */}
      <PasswordSection
        currentUser={currentUser as CurrentUser}
        queryClient={queryClient}
        authMethods={authMethods}
      />
    </>
  )
}

export default AuthMethodsPassword
