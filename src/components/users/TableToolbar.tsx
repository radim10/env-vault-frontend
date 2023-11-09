'use client'

import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'

interface Props {
  entity: 'users' | 'teams' | 'invitations' | 'user-access'
  count: number | null
  isSearchCount?: boolean
  submitText?: string
  hideSubmit?: boolean
  loading: boolean
  disabledSearch?: boolean
  search: string
  onSearch: (search: string) => void
  onInviteUser?: () => void
}

const TableToolbar: React.FC<Props> = ({
  entity,
  count: userCount,
  search,
  isSearchCount,
  submitText,
  hideSubmit,
  loading,
  disabledSearch,
  onSearch,
  onInviteUser,
}) => {
  return (
    <div>
      <div className="flex md:items-center justify-between mb-3 md:flex-row flex-col gap-3 md:gap-0">
        <div className="">
          {userCount === null || loading ? (
            <>
              <Skeleton className="h-6 w-32" />
            </>
          ) : (
            <div className="text-muted-foreground font-medium">
              {entity === 'users' && (
                <>
                  {!isSearchCount ? 'Total users' : 'Found users'}: {userCount}
                </>
              )}

              {entity === 'user-access' && (
                <>
                  {!isSearchCount ? 'Total projects' : 'Found projects'}: {userCount}
                </>
              )}

              {entity === 'invitations' && (
                <>
                  {!isSearchCount ? 'Total invitations' : 'Found invitations'}: {userCount}
                </>
              )}

              {entity === 'teams' && (
                <>
                  {!isSearchCount ? 'Total members' : 'Found members'}: {userCount}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center w-full md:w-fit justify-end gap-3">
          <div className="relative w-full md:w-[12rem] lg:w-[16rem]">
            <Icons.search className="h-4 w-4 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" />
            {search?.length > 0 && (
              <button
                className="absolute top-1/2 transform -translate-y-1/2 right-4 opacity-60 hover:opacity-100"
                onClick={() => onSearch('')}
              >
                <Icons.x className="h-4 w-4" />
              </button>
            )}

            <Input
              // readOnly={loading}
              disabled={disabledSearch}
              placeholder={
                entity === 'invitations'
                  ? 'Search by email'
                  : entity === 'user-access'
                  ? 'Search projects'
                  : 'Search by name or email'
              }
              className="pl-10 pr-10 -mr-10"
              value={search ?? undefined}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {!hideSubmit && (
            <Button size={'sm'} onClick={onInviteUser} className="flex gap-1.5">
              {entity !== 'teams' && (
                <>
                  <Icons.plus className="h-5 w-5" />
                  <span className="md:block hidden">{submitText ?? 'Invite users'}</span>
                </>
              )}

              {entity === 'teams' && (
                <>
                  <Icons.plus className="h-5 w-5" />
                  <span className="md:block hidden">{submitText ?? 'Add members'}</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TableToolbar
