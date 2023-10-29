'use client'

import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'

interface Props {
  userCount: number | null
  isSearchCount?: boolean
  loading: boolean
  search: string
  onSearch: (search: string) => void
  onInviteUser: () => void
}

const TableToolbar: React.FC<Props> = ({
  userCount,
  search,
  isSearchCount,
  loading,
  onSearch,
  onInviteUser,
}) => {
  return (
    <div>
      <div className="flex md:items-center justify-between mb-3 md:flex-row flex-col gap-3 md:gap-0">
        <div className="">
          {userCount === null ? (
            <>
              <Skeleton className="h-6 w-32" />
            </>
          ) : (
            <div className="text-muted-foreground font-medium">
              {!isSearchCount ? 'Total users' : 'Found users'}: {userCount}
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
              placeholder="Search by name or email"
              className="pl-10 pr-10 -mr-10"
              value={search ?? undefined}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <Button size={'sm'} onClick={onInviteUser}>
            <Icons.plus />
            <span className="md:block hidden">Add user</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TableToolbar
