'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import EnvTabs from '@/components/environments/EnvTabs'
import { Icons } from '@/components/icons'
import Link from 'next/link'

// TODO: check if env exists
export default function EnvLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; projectName: string; env: string }
}) {
  return (
    <>
      <div className="flex justify-between items-center mt-1">
        <div className="flex gap-2 items-center">
          <Link
            href={`/workspace/s/projects`}
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
      </div>
      {/**/}
      <div className="mt-8">
        <EnvTabs
          envName={params.env}
          workspaceId={params?.workspace}
          projectName={params?.projectName}
        />
        <div className="mt-12">{children}</div>
      </div>
    </>
  )
}
