import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tokens',
}

export default function TokensPage({ params }: { params: { workspace: string; type: string } }) {
  return <>"Tokens page"</>
}
