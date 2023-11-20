import React from 'react'
import { Skeleton } from '../ui/skeleton'
import clsx from 'clsx'

interface Props {
  grouped: boolean
}

// const ProjectSkeleton: React.FC<Props> = ({ grouped }) => {
//   return (
//     <div className="px-6 lg:px-10">
//       <div className="flex justify-between items-center mt-0">
//         <div className="flex gap-2 items-center">
//           <div className="font-semibold ">
//             <Skeleton className="h-8 w-44 md:w-64 " />
//           </div>
//         </div>
//         {/* // FLEX END */}
//         <div>
//           <Skeleton className="w-[47px] h-[40px]" />
//         </div>
//       </div>
//
//       {/* // */}
//       <div className="mt-6">
//         <EnvironmentListSkeleton grouped={grouped} />
//       </div>
//     </div>
//   )
// }
//
const ProjectSkeleton: React.FC = () => {
  return (
    <>
      <div className="px-6 lg:px-10">
        <div className="flex justify-between items-center mt-0">
          <div className="flex gap-2 items-center">
            <div className="font-semibold ">
              <Skeleton className="h-8 w-44 md:w-72" />
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          ['flex flex-row gap-2 md:gap-5 border-b-[1px] pb-[0.9rem] lg:px-12  pl-[2rem] md:pl-0'],
          {
            'mt-8': true,
          }
        )}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            className={clsx(['h-6'], {
              'w-24': index == 0,
              'w-20': index !== 0,
            })}
          />
        ))}
      </div>
    </>
  )
}

const EnvironmentListSkeleton = ({ grouped }: { grouped: boolean }) => {
  return (
    <>
      {/* // TOOLBAR */}

      <div
        className={
          'w-full flex flex-col md:flex-row justify-between md:items-center gap-3.5 md:gap-0'
        }
      >
        <div className="pl-1">
          <Skeleton className="h-7 w-44" />
        </div>
        <div className="flex items-center justify-end md:justify-start gap-2 ">
          <Skeleton className="w-full md:w-[160px] md:h-10 h-9" />
          <Skeleton className="w-full md:w-[160px] md:h-10 h-9" />
          <Skeleton className="hidden md:block md:w-[105px] h-10" />
        </div>
        <Skeleton className="md:hidden block w-full h-9" />
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
export { EnvironmentListSkeleton }
export default ProjectSkeleton
