import { Loader2, LucideIcon } from 'lucide-react'
import TypographyH4 from '../typography/TypographyH4'
import { Separator } from '../ui/separator'

interface Props {
  title: string
  icon?: LucideIcon
  description?: string
  children: React.ReactNode
  button?: {
    disabled?: boolean
    text: string
    Icon?: LucideIcon
    loading?: boolean
    onClick: () => void
  }
}

const SubscriptionLayout: React.FC<Props> = ({
  title,
  icon: Icon,
  description,
  button,
  children,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-7">
        <div className="rounded-md w-full border-2 px-3 py-3 md:px-5 md:py-4 md:pb-6">
          <div className="flex flex-row justify-between items-center">
            <div className="gap-3 flex items-center">
              <TypographyH4>{title}</TypographyH4>
              {Icon && <Icon className="h-5 w-5 opacity-80" />}
            </div>

            {button && (
              <button
                className="flex items-center gap-2.5 text-[0.96rem] hover:text-primary ease duration-100"
                onClick={button.onClick}
                disabled={button.disabled || button.loading}
              >
                {button.Icon && !button.loading && <button.Icon className="h-4 w-4 opacity-80" />}
                {button.loading && <Loader2 className={'h-4 w-4 animate-spin'} />}
                {button.text}
              </button>
            )}
          </div>
          {description && (
            <>
              <div className="text-[0.95rem] text-muted-foreground mt-1">{description}</div>
            </>
          )}
          <Separator className="mt-3" />

          <div className="flex flex-col mt-5 px-3 mb-2 md:mb-0">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionLayout
