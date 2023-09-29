import React from 'react'
import TypographyH2 from '../typography/TypographyH2'
import CreateProject from './CreateProjectDialog'
import ProjectsSortSelect from './ProjectsSortSelect'
import { ProjectSort } from '@/types/projects'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { useWindowScroll } from 'react-use'
import clsx from 'clsx'

interface Props {
  workspaceId: string

  disabled: boolean
  sort: ProjectSort
  search: string

  setSort: (sort: ProjectSort) => void
  setSearch: (search: string) => void
}

const ProjectsToolbar: React.FC<Props> = ({
  workspaceId,
  disabled,
  sort,
  search,
  setSearch,
  setSort,
}) => {
  const { y } = useWindowScroll()

  return (
    <div
      className={clsx(
        [
          'py-2 -mt-1 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 px-6 md:px-10 bg-transparent backdrop-blur-xl sticky top-0 z-10',
        ],
        {
          'border-b-2': y > 150,
        }
      )}
    >
      <div className="flex items-center gap-4">
        <TypographyH2>Projects</TypographyH2>
        <div className="md:hidden block">
          <CreateProject workspaceId={workspaceId} />
        </div>
      </div>
      <div className="flex items-center w-full justify-end gap-3">
        <div className="relative md:w-[12rem] lg:w-[16rem]">
          <Icons.search className="h-4 w-4 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" />
          {search?.length !== 0 && (
            <button
              className="absolute top-1/2 transform -translate-y-1/2 right-4 opacity-60 hover:opacity-100"
              onClick={() => setSearch('')}
            >
              <Icons.x className="h-4 w-4" />
            </button>
          )}

          <Input
            placeholder="Search"
            className="pl-10 pr-10 -mr-10"
            value={search}
            disabled={disabled}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ProjectsSortSelect sort={sort} setSort={setSort} disabled={disabled} />
        <div className="hidden md:block">
          <CreateProject workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  )
}

export default ProjectsToolbar
