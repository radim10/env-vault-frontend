import React from 'react'
import TypographyH4 from '../typography/TypographyH4'
import { Icons } from '../icons'
import { ThemeToggle } from '../ui/theme-toggle'
import { Checkbox } from '../ui/checkbox'
import { LucideIcon } from 'lucide-react'
import PersonalSettingsLayout from './Layout'

interface Props {}

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

const PreferencesSettings: React.FC<Props> = ({}) => {
  return (
    <div className="flex flex-col gap-7 mt-6">
      <PersonalSettingsLayout
        description="Your app references"
        title="General"
        icon={Icons.squareAsterisk}
      >
        <>
          <div className="flex justify-between md:flex-row md:items-center gap-2 text-md md:justify-between px-0 md:px-4 md:h-8">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-semibold text-[0.96rem]">Theme</span>
            </div>
            <div>
              <ThemeToggle />
            </div>
          </div>
        </>
      </PersonalSettingsLayout>

      <PersonalSettingsLayout
        description="Get notified by and email"
        title="Emails"
        icon={Icons.mail}
      >
        <>
          <div>
            <div className=" flex flex-col gap-2.5 text-[0.96rem] ox-0 w-full md:px-4">
              {emailItems.map(({ label, icon: Icon }, index) => (
                <>
                  <div className="flex justify-between md:flex-row md:items-center gap-2 text-md md:justify-between ">
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
        </>
      </PersonalSettingsLayout>
    </div>
  )
}

export default PreferencesSettings
