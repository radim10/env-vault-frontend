import { Icons } from './icons'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface Props {
  className?: string
  text?: string
  description?: string
  actionBtn?: {
    onClick: () => void
    className?: string
    loading?: boolean
    text: string
  }
}

const TableError: React.FC<Props> = ({ className, actionBtn, description, text }) => {
  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div>
            <Icons.serverCrash className="h-20 w-20 opacity-30" />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold opacity-85">{text ?? 'Something went wrong'}</span>
            {description && <div className="my-1">{description}</div>}
          </div>
          {actionBtn && (
            <Button
              variant="outline"
              className={cn('mt-1', actionBtn.className)}
              onClick={actionBtn.onClick}
              loading={actionBtn.loading}
              disabled={actionBtn?.loading}
            >
              <Icons.refresh className="mr-2 h-4 w-4" />
              {actionBtn.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TableError
