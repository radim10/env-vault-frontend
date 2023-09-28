import React from 'react'
import { Skeleton } from '../ui/skeleton'

const EnvLayoutSkeleton = (props: {}) => {
  return (
    <>
      <div className="hidden md:block">
        <div className="flex justify-between items-center mt-0">
          <div className="flex gap-2 items-center">
            <div className="">
              <Skeleton className="h-8 w-44 md:w-80 " />
            </div>
          </div>
          {/* // FLEX END */}
          <div>
            <Skeleton className="w-[47px] h-[40px]" />
          </div>
        </div>

        {/* NOTE: Tabs */}
        <div className="mt-6 flex flex-row gap-2 md:gap-5 border-b-[1px] pb-[0.9rem] lg:px-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="h-6 w-20" />
          ))}
        </div>
      </div>

      <div className="block md:hidden mt-3">
        <div className="flex flex-col justify-between items-start mt-0 gap-3">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-6 w-44 md:w-80 " />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-6 w-44 md:w-80 " />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-6 w-20 rounded-lg" />
          </div>
          {/* // FLEX END */}
        </div>
        <div className="flex items-center justify-end w-full -mt-0">
          <Skeleton className="w-[50px] h-[36px]" />
        </div>

        {/* NOTE: Tabs */}

        <div className="mt-7 flex flex-row gap-2 md:gap-5 border-b-[1px] pb-[0.9rem] lg:px-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="h-6 w-20" />
          ))}
        </div>
      </div>
    </>
  )
}

export default EnvLayoutSkeleton
