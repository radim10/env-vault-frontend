import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User details',
}

const UserPage = ({
  params: { workspace, id: profileId },
}: {
  params: { workspace: string; id: string }
}) => {
  return <div>Profile page</div>
}

export default UserPage
