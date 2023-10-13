import React, { ReactNode } from 'react'
import TypographyH4 from './typography/TypographyH4'
import { Icons } from './icons'
import { LucideIcon } from 'lucide-react'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import clsx from 'clsx'

interface Item {
  label: String
  icon: LucideIcon
  component?: ReactNode
  value?: String
  editBtn?: {
    disabled?: boolean
    onClick: () => void
  }
}

interface Props {
  // children: ReactNode
  title?: String
  description?: String
  icon?: LucideIcon
  items: Item[]
}

const SettingsList: React.FC<Props> = ({ title, description, icon: Icon, items }) => {
  return (
    <>
      <div className="mt-2 gap-2 rounded-md border-2">
        <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
          <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
            {title && <TypographyH4>{title}</TypographyH4>}
            {Icon && <Icon className="h-5 w-5 opacity-80" />}
          </div>
          {/* // */}
          {description && (
            <div className="text-[0.95rem] text-muted-foreground mt-2 md:mt-0 px-3 md:px-6 lg:px-6">
              {description}
            </div>
          )}

          <div className="mt-7 flex flex-col gap-2.5 text-[0.96rem]">
            {items.map(({ label, icon: Icon, value, component, editBtn }, index) => (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-2 text-md md:justify-between px-4 md:px-10 md:h-8">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Icon className="h-4 w-4 opacity-80" />
                    <span className="font-semibold text-[0.96rem]">{label}</span>
                  </div>
                  <div>
                    {value && <div>{value}</div>}
                    {component && (
                      <div
                        className={clsx(['flex justify-between md:justify-start items-center'], {
                          'gap-3 md:gap-6': editBtn,
                        })}
                      >
                        <div>{component}</div>
                        <div>
                          {editBtn && (
                            <Button
                              size={'sm'}
                              variant={'outline'}
                              disabled={editBtn?.disabled}
                              onClick={() => editBtn.onClick()}
                            >
                              <Icons.pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {index !== items.length - 1 && <Separator />}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsList
