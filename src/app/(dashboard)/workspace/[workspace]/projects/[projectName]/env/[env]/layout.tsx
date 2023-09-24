'use client'

import EnvTabs from '@/components/environments/EnvTabs'
import { Icons } from '@/components/icons'
import SaveSecretsToolbar from '@/components/secrects/SaveToolbar'
import clsx from 'clsx'
import Link from 'next/link'
import { useWindowScroll } from 'react-use'

// TODO: check if env exists
export default function EnvLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; projectName: string; env: string }
}) {
  const { y } = useWindowScroll()

  return (
    <>
      <div
        className={clsx(
          ['flex justify-between items-center -mt-1 sticky top-0 bg-background py-2 w-full z-10'],
          {
            'border-b-2': y > 120,
          }
        )}
      >
        <div className="flex gap-2 items-center">
          <Link
            href={`/workspace/${params?.workspace}/projects/${params?.projectName}`}
            className="text-primary hover:text-primary hover:underline underline-offset-4"
          >
            <div className="font-semibold text-2xl">{params?.projectName}</div>
          </Link>
          {/* // */}
          <div className="dark:text-gray-400">
            <Icons.chevronRight className="mt-1" />
          </div>
          <div className="font-semibold text-2xl ">{params?.env}</div>
        </div>
        <div>
          <SaveSecretsToolbar />
        </div>
      </div>
      {/**/}
      <div className="mt-6">
        <EnvTabs
          envName={params.env}
          workspaceId={params?.workspace}
          projectName={params?.projectName}
        />
        <div className="mt-4">{children}</div>
      </div>
    </>
  )
}
