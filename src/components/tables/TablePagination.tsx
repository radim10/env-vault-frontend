import { Icons } from '../icons'
import { Button } from '../ui/button'

export interface TablePaginationProps {
  toStart: {
    onClick: () => void
    disabled: boolean
  }
  toEnd: {
    onClick: () => void
    disabled: boolean
  }
  prev: {
    onClick: () => void
    disabled: boolean
  }
  next: {
    onClick: () => void
    disabled: boolean
  }
}

const TablePagination: React.FC<TablePaginationProps> = ({ toStart, toEnd, prev, next }) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toStart?.onClick()}
        disabled={toStart?.disabled}
      >
        <Icons.chevronsLeft className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={() => prev.onClick()} disabled={prev.disabled}>
        <Icons.chevronLeft className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={() => next.onClick()} disabled={next.disabled}>
        <Icons.chevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => toEnd?.onClick()}
        disabled={toEnd?.disabled}
      >
        <Icons.chevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default TablePagination
