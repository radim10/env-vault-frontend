import { Icons } from './icons'
import { Button } from './ui/button'

interface Props {
  totalCount: number
  selectedCount: number
  onCancel: () => void
  onDelete: () => void
}

const ActionTableToolbar: React.FC<Props> = ({ totalCount, selectedCount, onDelete, onCancel }) => {
  return (
    <div className="flex md:items-center justify-between mb-3 md:flex-row flex-col gap-3 md:gap-0">
      <div className="font-medium text-muted-foreground">
        {selectedCount} of {totalCount} row(s) selected
      </div>

      <div className="flex items-center w-full md:w-fit justify-end gap-3">
        <Button size={'sm'} onClick={onCancel} className="flex gap-1.5" variant="outline">
          <Icons.x className="h-4 w-4 -mt-[0.5px]" />
        </Button>

        <Button size={'sm'} onClick={onDelete} className="flex gap-1.5" variant="destructive">
          <Icons.trash className="h-4 w-4 -mt-[0.5px]" />
          <span className="md:block hidden">Delete</span>
        </Button>
      </div>
    </div>
  )
}

export default ActionTableToolbar
