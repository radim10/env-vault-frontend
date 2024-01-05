import { useState } from 'react'
import Drawer from '../Drawer'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '../ui/label'
import taxIds from '@/utils/taxIds'
import { Input } from '../ui/input'
import { useUpdateTaxId } from '@/api/mutations/subscription'

interface Props {
  workspaceId: string
  opened: boolean
  onClose: () => void
  onUpdated: (taxId: string) => void
}

const UpdateTaxIdDrawer: React.FC<Props> = ({ workspaceId, opened, onClose, onUpdated }) => {
  const [country, setCountry] = useState('Australia')
  const [value, setValue] = useState('')

  const { mutate: updateTaxId, isLoading } = useUpdateTaxId({
    onSuccess: () => onUpdated(value),
  })

  return (
    <>
      <Drawer
        title="Update tax id"
        opened={opened}
        onClose={onClose}
        className="max-w-[500px]"
        description="Tax id is shown on all invoices"
        submit={{
          text: 'Save',
          onSubmit: () =>
            updateTaxId({
              workspaceId,
              data: {
                taxId: value,
                country,
              },
            }),
          disabled: !value || !country || value?.trim().length === 0,
          loading: isLoading,
        }}
      >
        <div className="mt-4 flex flex-col gap-4">
          <div className="">
            <div className="ml-0.5 mb-1">
              <Label>Select country</Label>
            </div>
            <Select
              disabled={isLoading}
              value={country}
              onValueChange={(value) => {
                setCountry(value)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectGroup className="overflow-y-auto max-h-56">
                  {taxIds.map(({ country, enum: taxId }) => (
                    <SelectItem className="hover:bg-secondary cursor-pointer" value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* // */}
          <div>
            <div className="ml-0.5 mb-1">
              <Label>New tax id</Label>
            </div>
            <Input
              disabled={isLoading}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type here..."
            />
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default UpdateTaxIdDrawer
