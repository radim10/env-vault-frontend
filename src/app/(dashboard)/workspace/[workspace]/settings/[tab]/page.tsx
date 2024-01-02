import PreferencesSettings from '@/components/settings/PreferencesSettings'
import WorkspaceSettings from '@/components/settings/WorkspaceSettings'
import SubscriptionSettings from '@/components/subscription/SubscriptionSettings'
import { validateServerSession } from '@/utils/auth/session'
import { Metadata, ResolvingMetadata } from 'next'

export function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Metadata {
  const tab = params.tab

  return {
    title: `Settings / ${tab}`,
  }
}

export default async function Settings({
  params: { workspace, tab },
}: {
  params: { workspace: string; tab: string }
}) {
  await validateServerSession('/login')

  return (
    <>
      {tab === 'workspace' && <WorkspaceSettings workspaceId={workspace} />}
      {tab === 'subscription' && <SubscriptionSettings workspaceId={workspace} />}
    </>
  )
}
