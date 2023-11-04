import clsx from 'clsx'

export interface TablePageSizeProps {
  value: number
  lowOpacity?: boolean
  disabled?: boolean
  onChange: (pageSize: number) => void
}

const TablePageSizeSelect: React.FC<TablePageSizeProps> = ({
  value: pageSize,
  disabled,
  onChange,
}) => {
  return (
    <div
      className={clsx(
        [
          'hidden md:flex gap-0 items-center text-sm mt-0 text-muted-foreground rounded-md border-2',
        ],
        {
          'opacity-70': disabled,
        }
      )}
    >
      <div>
        {[5, 10].map((val, _) => (
          <button
            disabled={disabled}
            onClick={() => onChange(val)}
            className={clsx(['w-10 text-center py-1 ease duration-200 rounded-l-sm rounded-r-sm'], {
              'bg-secondary text-primary': pageSize === val,
              'opacity-50': pageSize !== val,
              'hover:opacity-100': pageSize !== val && !disabled,
            })}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TablePageSizeSelect
