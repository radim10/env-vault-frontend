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

const WorkspacePreferences = (props: {}) => {
  const currentUser = useCurrentUserStore((state) => state.data)
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)

  const { mutate: updateDefaultWorkspace, isLoading, error } = useUpdateDefaultWorkspace()

  const data = [
    {
      id: '123',
      name: 'This is name',
    },
    {
      id: '1234',
      name: `Radim's workspace`,
    },
  ]
  return (
    <div>
      <PersonalSettingsLayout title="Workspace" icon={Icons.boxes}>
        <div className="flex flex-col gap-4 justify-center w-full">
          <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
            <div className="md:w-[35%]">
              <Label>Default workspace</Label>
            </div>

            <Select
              value={
                selectedWorkspace ??
                currentUser?.workspaces?.find((val) => val?.selected === true)?.id ??
                ''
              }
              onValueChange={(e) => setSelectedWorkspace(e)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {currentUser?.workspaces.map(({ id, name }) => (
                  <SelectItem value={id} key={id} className="px-10">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-2 items-center xl:w-2/3">
            <Button
              disabled={!selectedWorkspace}
              onClick={() => {
                if (!selectedWorkspace) return
                updateDefaultWorkspace({ workspaceId: selectedWorkspace })
              }}
              variant="outline"
              className="ml-auto gap-3"
            >
              <Icons.penSquare className="h-4 w-4 opacity-80" />
              Edit
            </Button>
          </div>
        </div>
      </PersonalSettingsLayout>
    </div>
  )
}

export default WorkspacePreferences
