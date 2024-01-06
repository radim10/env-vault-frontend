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
import { useDeleteTaxId, useUpdateTaxId } from '@/api/mutations/subscription'
import { Button } from '../ui/button'
import { useDebounce } from 'react-use'
import { Icons } from '../icons'
import { subscriptionErrorMsgFromCode } from '@/api/requests/subscription'

interface Props {
  workspaceId: string
  opened: boolean
  currentTaxId: string | null
  onClose: () => void
  onUpdated: (taxId: string | null) => void
}

const UpdateTaxIdDrawer: React.FC<Props> = ({
  workspaceId,
  opened,
  currentTaxId,
  onClose,
  onUpdated,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [country, setCountry] = useState('Australia')
  const [value, setValue] = useState('')

  const {
    mutate: updateTaxId,
    isLoading,
    error: updateError,
  } = useUpdateTaxId({
    onSuccess: () => onUpdated(value),
  })

  const {
    mutate: deleteteTaxId,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteTaxId({
    onSuccess: () => onUpdated(null),
  })

  useDebounce(
    () => {
      if (confirmDelete) {
        setConfirmDelete(false)
      }
    },
    3000,
    [confirmDelete]
  )

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
              disabled={isLoading || isDeleting}
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
              disabled={isLoading || isDeleting}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type here..."
            />
          </div>

          {(updateError || deleteError) && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mb-0">
              <Icons.xCircle className="h-4 w-4" />
              {subscriptionErrorMsgFromCode(updateError?.code ?? updateError?.code)}
            </div>
          )}

          {currentTaxId && (
            <Button
              className="mt-3"
              size="default"
              variant={'destructive'}
              disabled={isLoading}
              loading={isDeleting}
              onClick={() => {
                if (!confirmDelete) {
                  setConfirmDelete(true)
                } else {
                  deleteteTaxId({ workspaceId })
                }
              }}
            >
              {confirmDelete && !isDeleting && <Icons.alertCircle className="w-4 h-4 mr-2" />}
              {!isDeleting ? (confirmDelete ? 'Confirm delete' : 'Delete tax id') : 'Deleting...'}
            </Button>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default UpdateTaxIdDrawer
