import AuthSettings from '@/components/personalSettings/AuthSettings'
import UserProfileSettings from '@/components/personalSettings/ProfileSettings'
import { validateServerSession } from '@/utils/auth/session'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create project',
}

const PersonalSettingsPage = async ({ params }: { params: { tab: string; workspace: string } }) => {
  await validateServerSession('/login')

  const tab = params?.tab
  if (tab !== 'general' && tab !== 'authentication' && tab !== 'preferences') {
    redirect(`/workspace/${params.workspace}/personal-settings/general`)
  }

  return (
    <>
      {tab === 'general' && <UserProfileSettings />}
      {tab === 'authentication' && <AuthSettings />}
    </>
  )
}

export default PersonalSettingsPage
