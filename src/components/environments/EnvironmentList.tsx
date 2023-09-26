import React from 'react'
import { Environment } from '@/types/environments'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { ListEnvironment } from '@/types/projects'
import clsx from 'clsx'
import EnvironmentListToolbar from './EnvironmentListToolbar'

interface Props {
  workspaceId: string
  values: ListEnvironment[]
  projectName: string
}

export const EnvironmentList: React.FC<Props> = ({ workspaceId, projectName, values }) => {
  return (
    <>
      <EnvironmentListToolbar environmentsCount={values.length} />

      <div className="flex flex-col gap-3 mt-6">
        {values.map(({ name, secretsCount }, index) => (
          <Link href={`/workspace/${workspaceId}/projects/${projectName}/env/${name}`} key={index}>
            <div className="py-2.5 md:py-1.5 pl-5 md:pl-6 pr-2 md:pr-4 cursor-pointer border-2 dark:border-gray-800 transition hover:dark:shadow-xl hover:dark:shadow-primary/20 rounded-md hover:dark:border-primary hover:border-primary hover:scale-[101%] ease duration-200">
              <div className="flex justify-between items-center">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 w-[90%] bg-red-700X">
                  <div className="w-[50%] bg-red-800X flex items-center gap-2 md:gap-4">
                    {/* // */}
                    <div
                      className={clsx(['h-3 w-3 rounded-full bg-primary'], {
                        'bg-red-600 dark:bg-red-800': index === 0,
                      })}
                    />
                    {/* {} */}
                    <div className="flex flex-row gap-3 items-center ">
                      <span className="font-semibold">{name}</span>
                      {index === 2 && (
                        <div>
                          <Icons.lock className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* // */}
                  <div className="w-[45%] bg-green-800X flex flex-row-reverse md:flex-row items-center gap-3 text-gray-300 text-[0.9rem]">
                    <div className="w-full">
                      <span>
                        {secretsCount ?? 'No'} {secretsCount === 1 ? 'secret' : 'secrets'}
                      </span>
                    </div>
                    {/* //  */}

                    {/* // badge */}
                    <div className="w-44 bg-green-800X">
                      {/* // Green = developnent, orange = staging, blue = Production ???  */}
                      {index !== 3 ? (
                        <Badge
                          variant="default"
                          className="bg-green-800 text-gray-200 text-[0.725rem]"
                        >
                          Developnent
                        </Badge>
                      ) : (
                        <Badge
                          variant="default"
                          className="bg-blue-800 text-gray-200 text-[0.725rem]"
                        >
                          Production
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Icons.moreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
