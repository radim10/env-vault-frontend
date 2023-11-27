'use client'

import clsx from 'clsx'
import { useWindowScroll } from 'react-use'
import Tabs from '@/components/personalSettings/Tabs'
import TypographyH2 from '@/components/typography/TypographyH2'

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string }
}) {
  const { y } = useWindowScroll()

  return (
    <>
      <div
        className={clsx(
          [
            'px-6 lg:px-10  backdrop-blur-xl flex md:flex-row flex-col justify-between md:items-center gap-0 md:gap-0 -mt-2 sticky top-0 bg-transparent pb-2 pt-3 w-full z-10',
          ],
          {
            'border-b-2': y > 104,
          }
        )}
      >
        <div className="flex md:flex-row flex-col gap-2 md:items-center ">
          <TypographyH2>Personal settings</TypographyH2>
        </div>
        {/* // */}
      </div>
      <div className="mt-5">
        <Tabs workspaceId={params?.workspace} />
        <div className="mt-4 px-6 lg:px-10">{children}</div>
      </div>
    </>
  )
}
