import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users',
}

export default function UsersPage({ params }: { params: { workspace: string } }) {
  return <>Users page</>
}
