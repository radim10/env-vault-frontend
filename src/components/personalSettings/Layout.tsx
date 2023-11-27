import { LucideIcon } from 'lucide-react'
import TypographyH4 from '../typography/TypographyH4'
import { Separator } from '../ui/separator'

interface Props {
  title: string
  icon: LucideIcon
  description?: string
  children: React.ReactNode
}

const PersonalSettingsLayout: React.FC<Props> = ({ title, icon: Icon, description, children }) => {
  return (
    <div>
      <div className="flex flex-col gap-7">
        <div className="rounded-md w-full border-2 px-3 py-3 md:px-5 md:py-4 md:pb-6">
          <div className="gap-3 flex items-center">
            <TypographyH4>{title}</TypographyH4>
            <Icon className="h-5 w-5 opacity-80" />
          </div>
          {description && (
            <>
              <div className="text-[0.95rem] text-muted-foreground mt-1">{description}</div>
            </>
          )}
          <Separator className="mt-3" />

          <div className="flex flex-col mt-5 px-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default PersonalSettingsLayout
