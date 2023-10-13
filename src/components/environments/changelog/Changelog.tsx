import dayjs from 'dayjs'
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import TypographyH4 from '@/components/typography/TypographyH4'
import ChangelogItem from './ChangelogItem'
import { Separator } from '@/components/ui/separator'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const Changelog: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  return (
    <>
      <div className="mb-4">
        <TypographyH4>Today</TypographyH4>
      </div>

      <div className="flex flex-col gap-6 md:gap-7">
        {Array.from({ length: 2 })?.map((_, index) => (
          <>
            <ChangelogItem />
            {index === 0 && <Separator />}
          </>
        ))}
      </div>
    </>
  )
}

export default Changelog
