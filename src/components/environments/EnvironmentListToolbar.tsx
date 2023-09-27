import React from 'react'
import clsx from 'clsx'
import { useWindowScroll } from 'react-use'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'
import { EnvironmentType } from '@/types/environments'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icons } from '../icons'
import { LucideIcon } from 'lucide-react'

interface Props {
  workspaceId: string
  projectName: string
  //
  environmentsCount: number
  onCreated: (args: { name: string; type: EnvironmentType }) => void
}

export enum SortOption {
  CreatedDesc = 'Created desc',
  CreatedAsc = 'Created asc',
  SecretsCountDesc = 'Secrets count desc',
  SecretsCountAsc = 'Secrets count asc',
}

const sortOptions: Array<{ value: SortOption; label: string; icon: LucideIcon }> = [
  {
    label: 'Created',
    value: SortOption.CreatedDesc,
    icon: Icons.arrowDownWideNarrow,
  },
  {
    label: 'Created',
    value: SortOption.CreatedAsc,
    icon: Icons.arrowUpWideNarrow,
  },
  {
    label: 'Secrets',
    value: SortOption.SecretsCountDesc,
    icon: Icons.arrowDownWideNarrow,
  },
  {
    label: 'Secrets',
    value: SortOption.SecretsCountAsc,
    icon: Icons.arrowUpWideNarrow,
  },
]

export enum GroupBy {
  Lock = 'Lock',
  Type = 'Type',
}

const groupByOptions: Array<{ value: GroupBy; icon: LucideIcon }> = [
  {
    value: GroupBy.Lock,
    icon: Icons.lock,
  },
  {
    value: GroupBy.Type,
    icon: Icons.lock,
  },
]

const EnvironmentListToolbar: React.FC<Props> = ({
  workspaceId,
  projectName,
  environmentsCount,
  onCreated,
}) => {
  const { y } = useWindowScroll()

  return (
    <div
      className={clsx(
        [
          'flex flex-col md:flex-row justify-between md:items-center sticky top-0 bg-background z-50 pb-2 pt-3',
        ],
        {
          'border-b-2': y > 160,
        }
      )}
    >
      <div className="pl-1 dark:text-gray-400 font-bold">
        <span>Total environments: {environmentsCount}</span>
      </div>

      <div className="flex items-center gap-2">
        <div>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectSeparator />
              {groupByOptions.map(({ value }) => (
                <SelectItem value={value}>
                  <div className="flex items-center gap-2">
                    <div className="">{value.toString()}</div>
                    {/*   <div> */}
                    {/*     <Icon className="h-4 w-4 opacity-80" /> */}
                    {/*   </div> */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectSeparator />
              {sortOptions.map(({ value, label, icon: Icon }) => (
                <SelectItem value={value}>
                  <div className="flex items-center gap-2">
                    <div className="">{label}</div>
                    <div>
                      <Icon className="ml-1 h-4 w-4 opacity-80" />
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CreateEnvironmentDialog
          workspaceId={workspaceId}
          projectName={projectName}
          onSuccess={onCreated}
        />
      </div>
    </div>
  )
}

export default EnvironmentListToolbar
