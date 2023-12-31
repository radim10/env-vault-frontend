import React from 'react'
import { Skeleton } from '../ui/skeleton'
import clsx from 'clsx'

interface Props {
  isSecrets?: boolean
}

const EnvLayoutSkeleton: React.FC<Props> = ({ isSecrets }) => {
  return (
    <>
      <div className="hidden md:block ">
        <div className="flex justify-between items-center mt-0 px-6 lg:px-10">
          <div className="flex gap-2 items-center">
            <div className="">
              <Skeleton className="h-8 w-44 md:w-80 " />
            </div>
          </div>
          {/* // FLEX END */}
          {isSecrets && (
            <div className="opacity-0">
              <Skeleton className="w-[110px] h-[36px]" />
            </div>
          )}
        </div>

        {/* NOTE: Tabs */}
        <div
          className={clsx(['flex flex-row gap-2 md:gap-5 border-b-[1px] pb-[0.9rem] lg:px-12'], {
            'mt-7': isSecrets,
            'mt-8': !isSecrets,
          })}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              className={clsx(['h-6'], {
                'w-20': index == 0 || index === 3,
                'w-16': index === 1 || index === 2,
              })}
            />
          ))}
        </div>
      </div>

      <div className="block md:hidden mt-0">
        <div className="flex flex-col justify-between items-start mt-0 gap-2 px-6">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-6 w-44 md:w-80 " />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-6 w-56 md:w-80 " />
          </div>
          {/* <div className="flex gap-2 items-center"> */}
          {/*   <Skeleton className="h-6 w-32 md:w-80 " /> */}
          {/* </div> */}
          {/* // FLEX END */}
        </div>
        {/* {isSecrets && ( */}
        {/*   <div className="flex items-center justify-end w-full mt-1 pr-6 opacity-0"> */}
        {/*     <div> */}
        {/*       <Skeleton className="w-[117px] h-[36px]" /> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* )} */}
        {/**/}
        {/* NOTE: Tabs */}

        <div
          className={clsx(
            [
              'mt-7X MT-0 (secrets with save ) flex flex-row gap-2 md:gap-5 border-b-[1px] pb-[0.9rem] pl-[2rem]',
            ],
            {
              'mt-9': !isSecrets,
              'mt-12': isSecrets,
            }
          )}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="h-6 w-20" />
          ))}
        </div>
      </div>
    </>
  )
}

export default EnvLayoutSkeleton
