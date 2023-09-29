'use client'

import React from 'react'
import TypographyH2 from '@/components/typography/TypographyH2'
import ProjectList from '@/components/projects/ProjectList'
import CreateProject from '@/components/projects/CreateProjectDialog'
import ProjectsSortSelect from './ProjectsSortSelect'
import { useProjectsSortStore } from '@/stores/projects'

interface Props {
  workspaceId: string
}

const Projects: React.FC<Props> = ({ workspaceId }) => {
  const { sort, setSort } = useProjectsSortStore()
  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
          <div className="flex items-center gap-4">
            <TypographyH2>Projects</TypographyH2>
            <CreateProject workspaceId={workspaceId} />
          </div>
          <div className="flex items-end w-full justify-end">
            <ProjectsSortSelect sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="md:mt-16 mt-8">
          <ProjectList workspace={workspaceId} sort={sort} />
        </div>
      </div>
    </div>
  )
}

export default Projects
