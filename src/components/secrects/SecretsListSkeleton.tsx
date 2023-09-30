import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SecretsListSkeleton = () => {
  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-0">
          <div className="p0-1 dark:text-gray-400 font-bold flex justify-between items-center">
            <Skeleton className="h-7 w-24" />

            <div className="flex items-center gap-2 md:hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="w-[3.05rem] h-10" key={index} />
              ))}
            </div>
          </div>
          {/* */}

          <div className="flex gap-3 items-center">
            <div className="hidden items-center gap-2 md:flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="w-[3.05rem] h-10" key={index} />
              ))}
            </div>
            <div className="relative w-full">
              <Skeleton className="w-full md:w-[20rem] h-10" />
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="mt-4 w-full flex flex-col gap-7 md:gap-3 justify-center items-start">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-2 lg:gap-3.5 w-full">
            <div className="md:w-[35%] flex items-center gap-2 md:block">
              <Skeleton className="w-full h-10" />
              <Skeleton className="h-10 w-[55px] block md:hidden" />
            </div>

            <div className="flex-grow flex items-center gap-3">
              <Skeleton className="w-full h-10" />
              <Skeleton className="h-10 w-[55px] hidden md:block" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="mt-5 h-10 w-[7.53rem]" />
    </>
  )
}

export default SecretsListSkeleton
