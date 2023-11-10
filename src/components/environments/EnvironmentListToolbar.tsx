import React from 'react'
import clsx from 'clsx'
import { useWindowScroll } from 'react-use'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'
import { EnvironmentType, EnvGroupBy, EnvSortOption } from '@/types/environments'
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
import { useEnvironmentListStore } from '@/stores/environments'

const sortOptions: Array<{ value: EnvSortOption; label: string; icon: LucideIcon }> = [
  {
    label: 'Created',
    value: EnvSortOption.CreatedDesc,
    icon: Icons.arrowDownWideNarrow,
  },
  {
    label: 'Created',
    value: EnvSortOption.CreatedAsc,
    icon: Icons.arrowUpWideNarrow,
  },
  {
    label: 'Secrets',
    value: EnvSortOption.SecretsCountDesc,
    icon: Icons.arrowDownWideNarrow,
  },
  {
    label: 'Secrets',
    value: EnvSortOption.SecretsCountAsc,
    icon: Icons.arrowUpWideNarrow,
  },
  {
    label: 'Alphabet',
    icon: Icons.arrowUpWideNarrow,
    value: EnvSortOption.AlphabeticalAsc,
  },
  {
    label: 'Alphabet',
    value: EnvSortOption.AlphabeticalDesc,
    icon: Icons.arrowDownWideNarrow,
  },
]

const groupByOptions: Array<{ value: EnvGroupBy; icon: LucideIcon }> = [
  {
    value: EnvGroupBy.Lock,
    icon: Icons.lock,
  },
  {
    value: EnvGroupBy.Type,
    icon: Icons.group,
  },
]

interface Props {
  workspaceId: string
  projectName: string
  //
  environmentsCount: number
  onCreated?: (args: { name: string; type: EnvironmentType }) => void
}

const EnvironmentListToolbar: React.FC<Props> = ({
  workspaceId,
  projectName,
  environmentsCount,
  onCreated,
}) => {
  const { y } = useWindowScroll()
  const { sort, setSort, groupBy, setGroupBy, unGroup } = useEnvironmentListStore()

  return (
    <div
      className={clsx(
        [
          'px-6 py-6 lg:px-10 backdrop-blur-xl w-full flex flex-col md:flex-row justify-between md:items-center sticky top-0 bg-transparent z-50 pb-2 pt-2 gap-3 md:gap-0',
        ],
        {
          'border-b-2': y > 160,
        }
      )}
    >
      <div className="pl-1 dark:text-gray-400 text-gray-700 font-bold">
        <span>Total environments: {environmentsCount}</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-end md:justify-start gap-3.5 md:gap-2">
        <div className="flex items-center gap-2 w-full">
          <div className="w-1/2">
            <Select
              value={groupBy ?? 'No groups'}
              onValueChange={(value) => {
                if (value === 'No groups') {
                  unGroup()
                } else {
                  setGroupBy(value as EnvGroupBy)
                }
              }}
            >
              <SelectTrigger className="md:w-[160px] w-full">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'No groups'}>No groups</SelectItem>
                {groupByOptions.map(({ value, icon: Icon }) => (
                  <SelectItem value={value}>
                    <div className="flex items-center gap-2">
                      <div className="">{value.toString()}</div>
                      <div>
                        <Icon className="h-4 w-4 opacity-80" />
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value as EnvSortOption)
              }}
            >
              <SelectTrigger className="md:w-[160px] w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(({ value, label, icon: Icon }, index) => (
                  <>
                    {(index === 2 || index === 4) && <SelectSeparator />}
                    <SelectItem value={value}>
                      <div className="flex items-center gap-2">
                        <div className="">{label}</div>
                        <div>
                          <Icon className="ml-1 h-4 w-4 opacity-80" />
                        </div>
                      </div>
                    </SelectItem>
                  </>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {onCreated && (
          <CreateEnvironmentDialog
            workspaceId={workspaceId}
            projectName={projectName}
            onSuccess={onCreated}
            fullBtn
          />
        )}
      </div>
    </div>
  )
}

export default EnvironmentListToolbar
