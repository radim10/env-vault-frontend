import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { ProjectSort } from '@/types/projects'
import { Icons } from '../icons'
import { LucideIcon } from 'lucide-react'

const sortOptions: Array<{ value: ProjectSort; label: string; icon: LucideIcon }> = [
  {
    label: 'Created',
    value: ProjectSort.CreatedDesc,
    icon: Icons.arrowDownWideNarrow,
  },
  {
    label: 'Created',
    value: ProjectSort.CreatedAsc,
    icon: Icons.arrowUpWideNarrow,
  },
  {
    label: 'Alphabet',
    icon: Icons.arrowUpWideNarrow,
    value: ProjectSort.AlphabeticalAsc,
  },
  {
    label: 'Alphabet',
    value: ProjectSort.AlphabeticalDesc,
    icon: Icons.arrowDownWideNarrow,
  },
  {
    label: 'Environments',
    value: ProjectSort.EnvCountDesc,
    icon: Icons.arrowDownWideNarrow,
  },
  {
    label: 'Environments',
    value: ProjectSort.EnvCountAsc,
    icon: Icons.arrowUpWideNarrow,
  },
]

interface Props {
  sort: ProjectSort
  setSort: (sort: ProjectSort) => void
}

const ProjectsSortSelect: React.FC<Props> = ({ sort, setSort }) => {
  return (
    <div>
      <Select value={sort} onValueChange={(value) => setSort(value as ProjectSort)}>
        <SelectTrigger className="w-[180px]">
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
  )
}

export default ProjectsSortSelect
