import React from 'react'
import TypographyH4 from '../typography/TypographyH4'
import { Icons } from '../icons'
import { ThemeToggle } from '../ui/theme-toggle'
import { Checkbox } from '../ui/checkbox'
import { LucideIcon } from 'lucide-react'

interface Props {
  workspaceId: string
}

const emailItems: Array<{
  label: string
  icon: LucideIcon
}> = [
  {
    icon: Icons.plus,
    label: 'New workspace users',
  },
  {
    icon: Icons.user,
    label: 'TODO',
  },
]

const PreferencesSettings: React.FC<Props> = ({ workspaceId }) => {
  return (
    <div className="flex flex-col gap-7">
      <div className="mt-2 gap-2 rounded-md border-2">
        <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
          <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
            <TypographyH4>General</TypographyH4>
            <Icons.settings2 className="h-5 w-5 opacity-80" />
          </div>
          {/* // */}
          <div className="text-[0.95rem] text-muted-foreground mt-2 md:mt-0 px-3 md:px-6 lg:px-6">
            Your app preferences
          </div>

          <div className="mt-7 flex flex-col gap-2.5 text-[0.96rem] ox-0">
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-2 text-md md:justify-between px-4 md:px-10 md:h-8">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="font-semibold text-[0.96rem]">Theme</span>
                </div>
                <div>
                  <ThemeToggle />
                </div>
              </div>
            </>
          </div>
        </div>
      </div>

      {/* //Email  */}
      <div className="mt-2 gap-2 rounded-md border-2">
        <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
          <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
            <TypographyH4>Emails</TypographyH4>
            {/* // TODO: mail icon */}
            <Icons.settings2 className="h-5 w-5 opacity-80" />
          </div>
          {/* // */}
          <div className="text-[0.95rem] text-muted-foreground mt-2 md:mt-0 px-3 md:px-6 lg:px-6">
            Get notified by an email
          </div>

          <div className="mt-7 flex flex-col gap-2.5 text-[0.96rem] ox-0">
            {emailItems.map(({ label, icon: Icon }, index) => (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-2 text-md md:justify-between px-4 md:px-10 md:h-8">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Icon className="h-4 w-4 opacity-80" />
                    <span className="font-semibold text-[0.96rem]">{label}</span>
                  </div>
                  <div>
                    <Checkbox />
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreferencesSettings
