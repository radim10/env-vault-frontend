'use client'

import { Icons } from '@/components/icons'

export default function WorkspcePageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className=" flex justify-center items-center h-[100vh] px-4">
      <div className="flex flex-col justify-center gap-6">
        <h1 className="text-center dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
          <span>Something went wrong</span>
          <Icons.frown className="inline-block h-8 w-8 ml-2" />
        </h1>

        {/*   <div className="flex flex-row w-full gap-3"> */}
        {/*     <Button className="w-full gap-3" variant="outline" onClick={reset}> */}
        {/*       <Icons.refresh className="inline-block h-5 w-5" /> */}
        {/*       <span>Try again</span> */}
        {/*     </Button> */}
        {/*   </div> */}
      </div>
    </div>
  )
}
