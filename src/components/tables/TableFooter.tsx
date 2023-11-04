import TablePageSizeSelect, { TablePageSizeProps } from './TablePageSize'
import TablePagination, { TablePaginationProps } from './TablePagination'

interface Props {
  pagination: TablePaginationProps
  pageSize: TablePageSizeProps
  page: {
    current: number
    total: number
    hidden?: boolean
  }
}

const TableFooter: React.FC<Props> = ({ pagination, pageSize, page }) => {
  return (
    <div className="flex justify-end items-center gap-4 md:gap-6">
      {page && !page?.hidden && (
        <span className="flex items-center gap-1 text-sm text-muted-foreground ease duration-200">
          <div>Page</div>
          <span className="">
            {page?.current} of {page?.total}
          </span>
        </span>
      )}
      <TablePageSizeSelect {...pageSize} />
      <TablePagination {...pagination} />
    </div>
  )
}

export default TableFooter
