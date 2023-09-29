import React from 'react'
import { Icons } from '@/components/icons'
import TypographyH2 from '@/components/typography/TypographyH2'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ProjectList from '@/components/projects/ProjectList'
import CreateProject from '@/components/projects/CreateProjectDialog'

interface Props {
  workspaceId: string
}

const Projects: React.FC<Props> = ({ workspaceId }) => {
  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TypographyH2>Projects</TypographyH2>

            <CreateProject workspaceId={workspaceId} />
          </div>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Updated">Updated</SelectItem>
              <SelectItem value="Created">Created</SelectItem>
              <SelectItem value="Name">Name</SelectItem>
              <SelectItem value="Folders">No of folders</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-16">
          <ProjectList workspace={workspaceId} />
        </div>
      </div>
    </div>
  )
}

export default Projects
