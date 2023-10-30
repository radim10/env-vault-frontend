'use client'

import { columns } from './table/Columns'
import UsersDataTable from './table/DataTable'
import { useQueryClient } from '@tanstack/react-query'
import InviteUserDialog from './InviteUserDialog'
import { useState } from 'react'

// const dummyData: WorkspaceUser[] = [
//   {
//     id: '915b7fa0-f194-47cb-8b47-479a4d88f0b4',
//     name: 'radim',
//     avatarUrl: 'https://avatars.githubusercontent.com/u/62602887?v=4',
//     role: WorkspaceUserRole.ADMIN,
//   },
//   {
//     id: '8afba311-8706-472d-836b-5d62a1eb8e32',
//     name: 'John Doe John Doe John Doe John Doe dasdsadasd',
//     avatarUrl: null,
//     role: WorkspaceUserRole.MEMBER,
//
//   },
// ]
//

interface Props {
  workspaceId: string
}

const WorkspaceUsers: React.FC<Props> = ({ workspaceId }) => {
  const queryClient = useQueryClient()
  // const searchParams = useSearchParams()
  // const pathname = usePathname()
  // const router = useRouter()
  //
  // // searchParams with a provided key/value pair
  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams)
  //     params.set(name, value)
  //
  //     return params.toString()
  //   },
  //   [searchParams]
  // )
  //
  const [inviteUserDialog, setInviteUserDialog] = useState(false)
  //
  // const handleTab = (value: 'all' | 'invitations') => {
  //   if (value === 'invitations') {
  //     router.push(pathname + '?' + createQueryString('tab', 'invitations'))
  //   }
  //
  //   if (value === 'all') {
  //     router.push(pathname)
  //   }
  // }
  //
  return (
    <div className="flex flex-col gap-6">
      <InviteUserDialog
        queryClient={queryClient}
        workspaceId={workspaceId}
        opened={inviteUserDialog}
        onClose={() => setInviteUserDialog(false)}
        onEmailInvite={() => { }}
      />
      {/**/}
      {/* <Tabs onValueChange={handleTab as any} value={tab}> */}
      {/*   <TabsList className="grid grid-cols-2 md:w-[400px] w-full -mt-1"> */}
      {/*     <TabsTrigger value="all" className="flex gap-2 items-center"> */}
      {/*       <Icons.users2 className="h-4 w-4" /> */}
      {/*       All users */}
      {/*     </TabsTrigger> */}
      {/*     <TabsTrigger value="invitations" className="flex gap-2 items-center"> */}
      {/*       <Icons.userPlus2 className="h-4 w-4" /> */}
      {/*       Invitations */}
      {/*     </TabsTrigger> */}
      {/*   </TabsList> */}
      {/*   <TabsContent value="all"> */}
      {/*     <div className="mt-4"> */}
      {/*       <UsersDataTable */}
      {/*         onInviteUser={() => setInviteUserDialog(true)} */}
      {/*         columns={columns as any} */}
      {/*         workspaceId={workspaceId} */}
      {/*         queryClient={queryClient} */}
      {/*       /> */}
      {/*     </div> */}
      {/*   </TabsContent> */}
      {/*   <TabsContent value="invitations"> */}
      {/*     <div className="mt-6"> */}
      {/*       <InvitationsTable */}
      {/*         workspaceId={workspaceId} */}
      {/*         columns={invitationsColumns as any} */}
      {/*         queryClient={queryClient} */}
      {/*         onInviteUser={() => { }} */}
      {/*       /> */}
      {/*     </div> */}
      {/*   </TabsContent> */}
      {/* </Tabs> */}

      {/**/}
      {/* <UsersDataTable columns={columns as any} data={dummyData} /> */}
      {/* <TableToolbar userCount={data?.totalCount ?? 0} /> */}
      <UsersDataTable
        onInviteUser={() => setInviteUserDialog(true)}
        columns={columns as any}
        workspaceId={workspaceId}
        queryClient={queryClient}
      />
      {/**/}
      {/* <InvitationsTable */}
      {/*   workspaceId={workspaceId} */}
      {/*   columns={invitationsColumns as any} */}
      {/*   queryClient={queryClient} */}
      {/*   onInviteUser={() => { }} */}
      {/* /> */}
    </div>
  )
}

export default WorkspaceUsers
