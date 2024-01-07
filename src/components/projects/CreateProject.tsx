'use client'

import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useDebounce } from 'react-use'
import { useCheckProjectName } from '@/api/queries/projects/root'
import { Icons } from '@/components/icons'
import { useImmer } from 'use-immer'
import { EnvironmentType } from '@/types/environments'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EnvTypeBadge from '@/components/environments/EnvTypeBadge'
import { useCreateProject } from '@/api/mutations/projects'
import { ListProject, NewProject } from '@/types/projects'
import { projectErrorMsgFromCode } from '@/api/requests/projects/root'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import useCurrentUserStore from '@/stores/user'

interface Props {
  workspaceId: string
}

const envTypes: EnvironmentType[] = [
  EnvironmentType.DEVELOPMENT,
  EnvironmentType.TESTING,
  EnvironmentType.STAGING,
  EnvironmentType.PRODUCTION,
]

const CreateProjectRoot: React.FC<Props> = (props) => {
  const { isMemberRole } = useCurrentUserStore()

  const view = {
    enable: <CreateProject {...props} />,
    disable: (
      <div>
        <h3 className="text-2xl font-bold dark:text-gray-300">Create new project</h3>
        <div className="flex items-center justify-center mt-28">
          <div className="flex flex-col items-center gap-2">
            <div>
              <Icons.ban className="h-20 w-20 opacity-30" />
            </div>
            <div className="text-center">
              <span className="text-lg font-bold opacity-85">Missing permission</span>
              <div className="my-1 text-muted-foreground">
                Yout must be admin/owner in order to create new project
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  }[isMemberRole() === true ? 'disable' : 'enable']

  return <>{view}</>
}

const CreateProject: React.FC<Props> = ({ workspaceId }) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { toast } = useToast()
  // const [selectedUseres, setSelectedUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [environments, setEnvironments] = useImmer<
    Array<{
      name: string
      type: EnvironmentType
      description?: string
    }>
  >([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const {
    mutate: createProject,
    isLoading: createProjectLoading,
    error: createProjectError,
  } = useCreateProject({
    onSuccess: () => {
      const newProject: ListProject = {
        name,
        createdAt: new Date().toString(),
        description: description?.trim()?.length > 0 ? description : null,
        environmentCount: 0,
      }

      const deletedProjectCache = queryClient.getQueryData(['project', workspaceId, name])

      if (deletedProjectCache === null) {
        // set query data to undefined not working?
        queryClient.removeQueries(['project', workspaceId, name], { exact: true })
      }

      queryClient.setQueryData<ListProject[]>(
        ['projects', workspaceId],
        (oldData: ListProject[] | undefined) => {
          if (oldData) {
            return [newProject, ...oldData]
          } else {
            return [newProject]
          }
        }
      )

      toast({
        title: 'Project created',
        variant: 'success',
      })

      router.push(`/workspace/${workspaceId}/projects/${name}/environments`)
    },
  })

  const {
    data: collectionNameData,
    error: checkCollectionNameError,
    refetch: checkProjectName,
  } = useCheckProjectName(
    {
      workspaceId,
      name,
    },
    {
      onSettled: () => setIsLoading(false),
      enabled: false,
    }
  )

  useDebounce(
    () => {
      if (name?.trim()?.length >= 2) {
        setIsLoading(true)
        checkProjectName()
      }
    },
    550,
    [name]
  )

  const handleCreateProject = () => {
    const hasDuplicate = hasDuplicateNames(environments)

    if (hasDuplicate) {
      toast({
        title: 'Found duplicate environment names',
        description: 'Environment names must be unique',
        variant: 'destructive',
      })
      return
    }
    // check if duplicate env???
    const newProject: NewProject = {
      name,
      description: description?.trim()?.length > 0 ? description : undefined,
      environments: environments && environments?.length > 0 ? environments : undefined,
    }

    createProject({
      workspaceId,
      data: newProject,
    })
  }

  function hasDuplicateNames(objects: Array<{ name: string; type: EnvironmentType }>): boolean {
    const encounteredNames: Set<string> = new Set()

    for (const obj of objects) {
      if (encounteredNames.has(obj.name)) {
        // Duplicate name found
        return true
      }
      encounteredNames.add(obj.name)
    }

    // No duplicate names found
    return false
  }

  return (
    <>
      <h3 className="text-2xl font-bold dark:text-gray-300">Create new project</h3>

      <div className="mt-2">
        <p className="text-muted-foreground text-[0.925rem]">
          A project is a container for environments and their secrets.
        </p>
      </div>
      <Separator className="my-2" />
      <p className="text-sm">Required fields are marked with an asterisk *</p>

      <div className="mt-6 flex flex-col gap-4 lg:gap-6">
        <div>
          <Label className="">Name *</Label>
          <Input
            className="mt-2"
            placeholder="Enter project name"
            value={name}
            disabled={createProjectLoading}
            onChange={(e) => {
              setName(e.target.value?.replace(/[\/\s?]/g, '-'))
              if (e.target.value.trim().length === 0) {
                if (isLoading) {
                  setIsLoading(false)
                }
              } else {
                if (!isLoading) {
                  setIsLoading(true)
                }
              }
            }}
          />

          <div
            className={clsx({
              hidden: !(
                (collectionNameData || isLoading || checkCollectionNameError) &&
                name?.trim().length > 0
              ),
              'ml-1 flex gap-2 items-center mt-2 text-[0.88rem]':
                (collectionNameData || isLoading || checkCollectionNameError) &&
                name?.trim().length > 0,
              'dark:text-orange-500 text-orange-500': isLoading,
              'dark:text-green-500 text-green-600':
                collectionNameData?.exists === false && !isLoading,
              'dark:text-red-500 text-red-600':
                collectionNameData?.exists === true || (checkCollectionNameError && !isLoading),
            })}
          >
            {isLoading && (
              <>
                <Icons.alertTriangle className=" h-4 w-4" />
                <span>Checking availability</span>
              </>
            )}

            {checkCollectionNameError && !isLoading && (
              <>
                <Icons.alertCircle className=" h-4 w-4" />
                <span>Error checking availability</span>
              </>
            )}

            {!isLoading && collectionNameData?.exists === false && (
              <>
                <Icons.checkCircle2 className=" h-4 w-4" />
                <span>Name avaliable</span>
              </>
            )}

            {!isLoading && collectionNameData?.exists && (
              <>
                <Icons.xCircle className=" h-4 w-4" />
                <span>Collection with this name already exists</span>
              </>
            )}
          </div>
        </div>

        <div className="">
          <div className="flex justify-between items-center">
            <Label className="">Description</Label>
            <span
              className={clsx(['text-[0.88rem]'], {
                'opacity-0': description?.trim()?.length === 0,
                'dark:text-red-500 text-red-600': description?.length >= 300,
                'text-muted-foreground': description?.length < 300,
              })}
            >
              {`${description?.length}/300`}
            </span>
          </div>
          <Textarea
            className="mt-2"
            placeholder="Description (optional)"
            value={description}
            disabled={createProjectLoading}
            onChange={(e) => {
              if (e?.target?.value?.length > 300) {
                setDescription(e.target.value.slice(0, 300))
              } else {
                setDescription(e.target.value)
              }
            }}
          />
        </div>
        {/* /// */}
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-bold dark:text-gray-300">Environments</h4>
        <div className="mt-0">
          <p className="text-muted-foreground text-[0.925rem]">
            Create environments for this project
          </p>
        </div>

        <div className="mt-4">
          <div
            className={clsx({ 'flex flex-col gap-6 md:gap-3 mb-6': environments?.length !== 0 })}
          >
            {environments?.map((val, index) => (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <Input
                  className=" w-full md:w-2/3"
                  placeholder="Environment name"
                  value={val.name}
                  disabled={createProjectLoading}
                  onChange={(e) => {
                    setEnvironments((draft) => {
                      draft[index].name = e.target.value?.replace(/[\/\s?]/g, '-')
                    })
                  }}
                />
                <div className="md:w-1/3">
                  <Select
                    disabled={createProjectLoading}
                    value={val?.type}
                    onValueChange={(value) => {
                      setEnvironments((draft) => {
                        draft[index].type = value as EnvironmentType
                      })
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {envTypes.map((type) => (
                        <SelectItem value={type} key={type} onFocus={(e) => e.stopPropagation()}>
                          <EnvTypeBadge type={type} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  disabled={createProjectLoading}
                  onClick={() =>
                    setEnvironments((draft) => {
                      draft.splice(index, 1)
                    })
                  }
                >
                  <Icons.x className=" h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setEnvironments((draft) => {
                draft.push({
                  name: '',
                  type: EnvironmentType.DEVELOPMENT,
                })
              })
            }}
            className="flex justify-center items-center border-2 border-dashed text-muted-foreground w-full py-3 rounded-md hover:text-primary hover:border-primary ease duration-200 text-[0.9rem]"
          >
            <Icons.plus className="mr-2 h-4 w-4" />
            Add environment
          </button>
        </div>
      </div>

      {/* <div className="mt-8"> */}
      {/*   <h4 className="text-lg font-bold dark:text-gray-300">Access</h4> */}
      {/**/}
      {/*   <div className="mt-0"> */}
      {/*     <p className="text-muted-foreground text-[0.925rem]"> */}
      {/*       Grant access to individual users or teams */}
      {/*     </p> */}
      {/*   </div> */}
      {/**/}
      {/*   <div */}
      {/*     className={clsx(['mt-4'], { */}
      {/*       'mb-5': selectedUseres?.length > 0, */}
      {/*     })} */}
      {/*   > */}
      {/*     <UsersCombobox */}
      {/*       workspaceId={params.workspace} */}
      {/*       selectedUsers={selectedUseres} */}
      {/*       onSelect={setSelectedUsers} */}
      {/*       queryClient={queryClient} */}
      {/*     /> */}
      {/*   </div> */}
      {/**/}
      {/*   <div className="relative"> */}
      {/*     <div className="absolute inset-0 flex items-center"> */}
      {/*       <span className="w-full border-t" /> */}
      {/*     </div> */}
      {/*     <div className="relative flex justify-center text-xs uppercase"> */}
      {/*       <span className="bg-background px-2 text-muted-foreground">Or add teams</span> */}
      {/*     </div> */}
      {/*   </div> */}
      {/**/}
      {/*   <div className="mt-4"> */}
      {/*     <TeamsSearchCombobox */}
      {/*       workspaceId={params.workspace} */}
      {/*       selectedTeams={[]} */}
      {/*       onSelect={(e) => {}} */}
      {/*       queryClient={queryClient} */}
      {/*     /> */}
      {/*   </div> */}
      {/* </div> */}

      {createProjectError && (
        <div className="dark:text-red-500 text-red-600 text-[0.92rem] flex items-center gap-2 mt-5">
          <Icons.xCircle className="h-4 w-4" />
          {projectErrorMsgFromCode(createProjectError?.code)}
        </div>
      )}

      {/* // REGEX */}
      <div className="flex justify-end mt-8 md:mt-12">
        <Button
          loading={createProjectLoading}
          onClick={() => {
            handleCreateProject()
          }}
          disabled={
            name?.trim().length < 2 ||
            isLoading ||
            checkCollectionNameError !== null ||
            environments?.some((env) => env?.name?.trim()?.length < 2) === true
          }
        >
          Create project
        </Button>
      </div>
    </>
  )
}

export default CreateProjectRoot
