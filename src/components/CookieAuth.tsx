'use client'

import { saveSession } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { useMount } from 'react-use'

interface Props {
  token: string
}

export const CookieAuth: React.FC<Props> = ({ token }) => {
  const router = useRouter()
  console.log(token)

  useMount(async () => {
    await saveSession(token)
    router.replace('/workspace/4ef8a291-024e-4ed8-924b-1cc90d01315e/projects', { scroll: false })
  })

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-8 h-8 rounded-full animate-spin border-4 border border-solid border-primary border-t-transparent"></div>
    </div>
  )
}
