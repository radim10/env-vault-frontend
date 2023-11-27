'use client'

import clsx from 'clsx'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import PersonalSettingsLayout from './Layout'
import PasswordSection from './PasswordSection'

const loginMethods: {
  text: string
  value: 'google' | 'github' | 'password'
  icon: React.ReactNode
}[] = [
  {
    text: 'Google auth',
    value: 'google',
    icon: <span className="font-bold ml-0.5 opacity-100">G</span>,
  },
  {
    text: 'Github auth',
    value: 'github',
    icon: <Icons.github className="h-4 w-4 opacity-100" />,
  },

  {
    text: 'Password',
    value: 'password',
    icon: <Icons.key className="h-4 w-4 opacity-100" />,
  },
]

const AuthSettings = (props: {}) => {
  return (
    <div className="flex flex-col gap-7 mt-6">
      <PersonalSettingsLayout title="Avaliable methods" icon={Icons.bookKey}>
        <div className="flex flex-col gap-4 justify-center w-full">
          {/* // */}
          {loginMethods.map(({ text, value, icon }) => (
            <div className="flex flex-col md:flex-row gap-2 md:items-center lg:w-2/3">
              <div className="flex items-center gap-3 md:w-[23%]">
                <span>{icon}</span>
                <div className="font-semibold text-[0.98rem] text-muted-foreground">{text}</div>
              </div>
              <div
                className={clsx(['text-[0.98rem]'], {
                  'opacity-90': value === 'password',
                  'text-primary': value !== 'password',
                })}
              >
                {value === 'password' ? 'Not avaliable' : 'Available'}
              </div>
            </div>
          ))}
        </div>
      </PersonalSettingsLayout>
      {/* // */}
      <PasswordSection />
    </div>
  )
}

export default AuthSettings
