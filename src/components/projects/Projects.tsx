'use client'

import React from 'react'
import ProjectList from '@/components/projects/ProjectList'
import { useProjectsStore } from '@/stores/projects'
import ProjectsToolbar from './ProjectsToolbar'
import { useMount } from 'react-use'

interface Props {
  workspaceId: string
}

const Projects: React.FC<Props> = ({ workspaceId }) => {
  const { sort, setSort, search, setSearch, loaded, setLoaded } = useProjectsStore()

  useMount(() => {
    if (search?.length) setSearch('')
  })

  return (
    <div>
      <div>
        <ProjectsToolbar
          workspaceId={workspaceId}
          disabled={loaded === false}
          sort={sort}
          setSort={setSort}
          search={search}
          setSearch={setSearch}
        />

        <div className="md:mt-16 mt-8">
          <ProjectList
            workspace={workspaceId}
            sort={sort}
            search={search?.length > 0 ? search : undefined}
            setLoaded={setLoaded}
          />
        </div>
      </div>
    </div>
  )
}

export default Projects
