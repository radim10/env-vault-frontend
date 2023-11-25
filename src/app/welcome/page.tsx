'use server'

import Welcome from '@/components/setup/Welcome'
import { getSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

export default async function WelcomePage() {
  const session = await getSession()

  if (!session) {
    redirect('/workspace')
  }

  // TODO: check if already has default workspace

  return <Welcome />
}
