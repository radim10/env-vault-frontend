import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { validateServerSession } from '@/utils/auth/session'
import AuthSettings from '@/components/personalSettings/AuthSettings'
import GeneralSettings from '@/components/personalSettings/GeneralSettings'
import PreferencesSettings from '@/components/personalSettings/PreferencesSettings'

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
      {tab === 'general' && <GeneralSettings />}
      {tab === 'authentication' && <AuthSettings />}
      {tab === 'preferences' && <PreferencesSettings />}
    </>
  )
}

export default PersonalSettingsPage
