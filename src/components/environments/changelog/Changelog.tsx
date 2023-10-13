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
      <div className="mb-6">
        <TypographyH4>Today</TypographyH4>
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        {[
          {
            secretKey: 'KEY_1',
            newValue: 'new_value_1',
          },
          {
            secretKey: 'KEY_2',
            newValue: 'new_value_2',
            oldValue: 'old_value_2',
          },

          {
            secretKey: 'KEY_1',
            oldValue:
              'new_value_1 very long long kjkghdjkfgh gijfhjdkghdfkjugh hdfg;hdfjk;ghdjkf hkjghdjkfhg jkdfhgjk dfhkgj hdfjklghdfjklghldfkjghdfklh',
          },
        ]?.map((val, index) => (
          <>
            <ChangelogItem {...val} />
            {index !== 2 && <Separator />}
          </>
        ))}
      </div>
    </>
  )
}

export default Changelog
