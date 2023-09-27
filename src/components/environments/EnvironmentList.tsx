import React from 'react'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { ListEnvironment, Project } from '@/types/projects'
import clsx from 'clsx'
import EnvironmentListToolbar from './EnvironmentListToolbar'
import { QueryClient } from '@tanstack/react-query'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'
import { useToast } from '../ui/use-toast'

interface Props {
  queryClient: QueryClient
  //
  workspaceId: string
  projectName: string

  //
  values: ListEnvironment[]
}

export const EnvironmentList: React.FC<Props> = ({
  queryClient,
  workspaceId,
  projectName,
  values,
}) => {
  const { toast } = useToast()

  const handleNewEnvironment = (name: string) => {
    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...data,
        environments: [{ name, secretsCount: 0 }, ...data?.environments],
      })
    }

    toast({
      title: 'Environment has been created',
      variant: 'success',
    })
  }

  if (!values?.length) {
    return (
      <div className="flex items-center justify-center mt-36">
        <div className="flex flex-col items-center gap-2">
          <div>
            <Icons.inbox className="h-20 w-20 opacity-30" />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold opacity-85">No environments here...</span>
            <div className="my-1">Add environments to your project</div>
            <div className="mt-5">
              <CreateEnvironmentDialog
                workspaceId={workspaceId}
                projectName={projectName}
                onSuccess={handleNewEnvironment}
                btnText="Add environment"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <EnvironmentListToolbar
        workspaceId={workspaceId}
        projectName={projectName}
        environmentsCount={values.length}
        onCreated={handleNewEnvironment}
      />

      <div className="flex flex-col gap-3 mt-6">
        {values.map(({ name, secretsCount, locked }, index) => (
          <Link href={`/workspace/${workspaceId}/projects/${projectName}/env/${name}`} key={index}>
            <div className="pb-3 md:pb-2.5 py-2.5 md:py-1.5 pl-5 md:pl-6 pr-2 md:pr-4 cursor-pointer border-2 dark:border-gray-800 transition hover:dark:shadow-xl hover:dark:shadow-primary/20 rounded-md hover:dark:border-primary hover:border-primary hover:scale-[101%] ease duration-200">
              <div className="flex justify-between items-center">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 w-[90%] bg-red-700X">
                  <div className="w-full md:w-[50%] bg-red-800X flex items-center gap-2 md:gap-4">
                    {/* // */}
                    <div
                      className={clsx(['h-3 w-3 rounded-full bg-primary'], {
                        'bg-red-600 dark:bg-red-800': index === 0,
                      })}
                    />
                    {/* {} */}
                    <div className="flex flex-row gap-2.5 items-center ">
                      <span className="font-semibold">{name}</span>
                      {locked === true && (
                        <div className="opacity-80">
                          <Icons.lock className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* // */}
                  <div className="w-full md:w-[45%] bg-green-800X flex flex-row-reverse md:flex-row items-center gap-0 md:gap-3 text-gray-300 text-[0.9rem]">
                    <div className="w-full">
                      <span>
                        {secretsCount !== 0 ? secretsCount : 'No'}{' '}
                        {secretsCount === 1 ? 'secret' : 'secrets'}
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
