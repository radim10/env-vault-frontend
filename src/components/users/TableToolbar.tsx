'use client'

import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface Props {
  userCount: number
  search: string
  onSearch: (search: string) => void
}

const TableToolbar: React.FC<Props> = ({ userCount, search, onSearch }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="">
          <div className="text-muted-foreground font-medium">Total users: {userCount}</div>
        </div>

        <div className="flex items-center w-fit justify-end gap-3">
          <div className="relative md:w-[12rem] lg:w-[16rem]">
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
              placeholder="Search by name or email"
              className="pl-10 pr-10 -mr-10"
              value={search ?? undefined}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <Button size={'sm'}>
            <Icons.plus />
            Add user
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TableToolbar
