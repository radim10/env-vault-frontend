import React from 'react'
import { Skeleton } from '../ui/skeleton'

interface Props {
  grouped: boolean
}

const ProjectSkeleton: React.FC<Props> = ({ grouped }) => {
  return (
    <div>
      <div className="flex justify-between items-center mt-0">
        <div className="flex gap-2 items-center">
          <div className="font-semibold ">
            <Skeleton className="h-8 w-44 md:w-64 " />
          </div>
        </div>
        {/* // FLEX END */}
        <div>
          <Skeleton className="w-[47px] h-[40px]" />
        </div>
      </div>

      {/* // */}
      <div className="mt-7">
        <EnvironmentListSkeleton grouped={grouped} />
      </div>
    </div>
  )
}

const EnvironmentListSkeleton = ({ grouped }: { grouped: boolean }) => {
  return (
    <>
      {/* // TOOLBAR */}

      <div
        className={
          'w-full flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-0'
        }
      >
        <div className="pl-1">
          <Skeleton className="h-7 w-44" />
        </div>
        <div className="flex items-center justify-end md:justify-start gap-2 ">
          <Skeleton className="w-[160px] h-10" />
          <Skeleton className="w-[160px] h-10" />
          <Skeleton className="w-[105px] h-10" />
        </div>
      </div>

      {/* // LIST */}
      <div className="mt-6 flex flex-col gap-3">
        {grouped && <Skeleton className="h-8 w-32" />}
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="h-[82px] md:h-[51px]" />
        ))}
      </div>
    </>
  )
}

export default ProjectSkeleton
