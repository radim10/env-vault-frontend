'use client'

import { saveSession } from '@/app/actions'
import { UserSession } from '@/types/session'
import { useRouter } from 'next/navigation'
import { useMount } from 'react-use'

interface Props {
  data: UserSession
  workspaceId: string | null
}

export const CookieAuth: React.FC<Props> = ({ data, workspaceId }) => {
  const router = useRouter()

  useMount(async () => {
    await saveSession(data)

    if (!workspaceId) {
      router.replace(`/welcome`)
    } else {
      router.replace(`/workspace/${workspaceId}/projects`, { scroll: false })
    }
  })

  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
      <div className="w-8 h-8 rounded-full animate-spin border-4 border border-solid border-primary border-t-transparent"></div>
    </div>
  )
}
