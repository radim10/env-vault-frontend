import { Icons } from '../icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { Label } from '../ui/label'
import PersonalSettingsLayout from './Layout'
import { Button } from '../ui/button'
import useCurrentUserStore from '@/stores/user'
import { useUpdateDefaultWorkspace } from '@/api/mutations/currentUser'
import { useListUserWorkspaces } from '@/api/queries/currentUser'
import { Skeleton } from '../ui/skeleton'
import { useToast } from '../ui/use-toast'
import { currentUserErrorMsgFromCode } from '@/api/requests/currentUser'
import { ScrollArea } from '../ui/scroll-area'
import clsx from 'clsx'
import { produce } from 'immer'
import { useQueryClient } from '@tanstack/react-query'

const WorkspacePreferences = (props: {}) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const currentUser = useCurrentUserStore((state) => state.data)
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)

  const {
    mutate: updateDefaultWorkspace,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateDefaultWorkspace({
    onSuccess: () => {
      const queryData = queryClient.getQueryData<
        Array<{ id: string; name: string; default?: true }>
      >([currentUser?.id, 'user-workspaces'])

      if (queryData) {
        const prevDefaultIndex = queryData.findIndex((val) => val?.default === true)
        const newDefaultIndex = queryData.findIndex((val) => val?.id === selectedWorkspace)

        const updated = produce(queryData, (draft) => {
          if (prevDefaultIndex !== -1) {
            draft[prevDefaultIndex].default = undefined
          }

          if (newDefaultIndex !== -1) {
            draft[newDefaultIndex].default = true
          }
        })

        queryClient.setQueryData([currentUser?.id, 'user-workspaces'], updated)
      }
      toast({
        title: 'Default workspace updated',
        variant: 'success',
      })
    },
  })

  const { data, isLoading, error, refetch } = useListUserWorkspaces(
    { userId: currentUser?.id ?? '' },
    {
      onSuccess: (data) => {
        const defaultWorkspace = data.find((val) => val?.default === true)
        setSelectedWorkspace(defaultWorkspace?.id ?? '')
      },
    }
  )

  return (
    <div>
      <PersonalSettingsLayout title="Workspaces" icon={Icons.boxes}>
        {error && (
          <div className="h-44 flex flex-row items-center">
            <div className="flex flex-col gap-2 w-full items-center">
              <div className="text-red-600 text-[0.92rem]">Something went wrong</div>
              <div>
                <Button size={'sm'} variant="outline" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            </div>
          </div>
        )}

        {!error && (
          <div className="flex flex-col gap-4 justify-center w-full">
            <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
              <div className="md:w-[35%]">
                <Label>Default workspace</Label>
              </div>

              {isLoading && <Skeleton className="h-10 w-full rounded-md" />}

              {!isLoading && !error && (
                <div className=" w-full">
                  <Select
                    disabled={isUpdating}
                    value={selectedWorkspace ?? ''}
                    onValueChange={(e) => setSelectedWorkspace(e)}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select workspace" className="line-clamp-1" />
                    </SelectTrigger>
                    <SelectContent className="md:max-w-[600px] max-w-[300px]">
                      <ScrollArea
                        className={clsx({
                          'h-fit': data?.length <= 5,
                          'h-48': data?.length > 5,
                        })}
                      >
                        {data.map(({ id, name }) => (
                          <SelectItem
                            value={id}
                            key={id}
                            className="px-10 cursor-pointer line-clamp-1"
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {updateError && (
              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0 md:ml-[28%]">
                  <Icons.xCircle className="h-4 w-4" />
                  {currentUserErrorMsgFromCode(updateError?.code) ?? 'Something went wrong'}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-2 items-center xl:w-2/3">
              <Button
                disabled={
                  isLoading ||
                  isUpdating ||
                  selectedWorkspace === null ||
                  selectedWorkspace === data?.find((val) => val?.default === true)?.id
                }
                loading={isUpdating}
                onClick={() => {
                  if (!selectedWorkspace) return
                  updateDefaultWorkspace({ workspaceId: selectedWorkspace })
                }}
                size={'default'}
                variant="default"
                className={clsx(['ml-auto'], {
                  'gap-2': !isUpdating,
                })}
              >
                {!isUpdating && <Icons.save className="h-4 w-4 opacity-80" />}
                Save
              </Button>
            </div>
          </div>
        )}
      </PersonalSettingsLayout>
    </div>
  )
}

export default WorkspacePreferences
