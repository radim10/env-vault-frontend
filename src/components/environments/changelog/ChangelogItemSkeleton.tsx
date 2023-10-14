import { Skeleton } from '@/components/ui/skeleton'
import clsx from 'clsx'
import React from 'react'

interface Props {
  count?: number
}

const ChangelogItemSkeleton: React.FC<Props> = ({ count = 1 }) => {
  return (
    <>
      <div>
        <div className="w-full flex justify-between items-center gap-3">
          <div className="flex flex-row gap-5 items-center">
            <Skeleton className="w-10 h-10 rounded-full" />

            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>
        </div>
        {/* // Secrets changes */}
        <div className="md:ml-[3.75rem] bg-red-400x mt-4 md:mt-2.5">
          <Skeleton className="rounded-md borderX border-inputX flex flex-col gap-0">
            {Array.from({ length: count })?.map((index) => (
              <>
                <div
                  className={clsx(['w-full bg-red-400X text-sm h-fit py-2 md:py-0 md:h-11'], {
                    'border-b border-input': index === 1,
                  })}
                >
                  <div className="flex flex-col w-full md:flex-row gap-0 md:gap-2 md:items-center h-full">
                    <div
                      className={clsx(['w-full h-9 md:h-full flex gap-3.5 px-3.5 items-center'], {
                        'md:w-1/2': true,
                      })}
                    />

                    <div
                      className={clsx(['w-full h-10 md:h-full pr-2 flex gap-3.5 items-center'], {
                        'md:w-1/2': true,
                      })}
                    />
                  </div>
                </div>
              </>
            ))}
          </Skeleton>

          <div className="mt-3">
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangelogItemSkeleton
