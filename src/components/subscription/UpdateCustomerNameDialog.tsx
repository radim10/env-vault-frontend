import { useUpdateCustomerName } from '@/api/mutations/subscription'
import DialogComponent from '../Dialog'
import { useState } from 'react'
import { Input } from '../ui/input'

interface Props {
  opened: boolean
  workspaceId: string
  currentName: string
  onClose: () => void
  onSuccess: (newName: string) => void
}

const UpdateCustomerNameDialog: React.FC<Props> = ({
  opened,
  workspaceId,
  currentName,
  onSuccess,
  onClose,
}) => {
  const [newName, setNewName] = useState('')

  const { mutate: updateCustomerName, isLoading } = useUpdateCustomerName({
    onSuccess: () => onSuccess(newName),
  })
  return (
    <>
      <DialogComponent
        opened={opened}
        title={'Change customer name'}
        submit={{
          text: 'Save',
          disabled: currentName === newName || (newName?.trim().length ?? 0) === 0,
          wFull: true,
        }}
        loading={isLoading}
        onClose={onClose}
        onSubmit={() => updateCustomerName({ workspaceId, data: { name: newName } })}
        descriptionComponent={
          <div className="text-[0.92rem] text-foreground">
            Type your name or your business name if you are a business. This name will be on all
            upcoming invoices.
          </div>
        }
      >
        <div className="mt-4">
          <Input
            value={newName}
            disabled={isLoading}
            placeholder="Name"
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
      </DialogComponent>
    </>
  )
}

export default UpdateCustomerNameDialog
