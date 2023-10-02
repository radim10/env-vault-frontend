import AccessTable from '@/components/environments/access/AccessTable'
import EnvTokens from '@/components/tokens/EnvTokens'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tokens',
}

export default function TokensPage({ params }: { params: { workspace: string; type: string } }) {
  return <>{params?.type === 'environments' && <EnvTokens workspaceId={params?.workspace} />}</>
}
