import React from 'react'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { useEditedSecretsStore } from '@/stores/secrets'

interface Props {
  secretsCount: number
}

const SecretsToolbar: React.FC<Props> = ({ secretsCount }) => {
  const { search, setSearch } = useEditedSecretsStore((state) => {
    return {
      search: state.search,
      setSearch: state.setSearch,
    }
  })
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="pl-1 dark:text-gray-400 font-bold">
          <span>Active count: {secretsCount}</span>
        </div>
        {/* */}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Icons.search className="h-4 w-4 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" />

            <Input
              placeholder="Search secrets"
              className="pl-10 -mr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecretsToolbar
