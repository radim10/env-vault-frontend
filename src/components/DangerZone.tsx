import React from 'react'
import TypographyH4 from './typography/TypographyH4'
import { Button } from './ui/button'

interface Props {
  title: string
  description?: string
  btn: {
    onClick: () => void
    disabled?: boolean
    text?: string
  }
}

const DangerZone: React.FC<Props> = ({ title, description, btn }) => {
  return (
    <>
      <div className="gap-2 rounded-md border-2">
        <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
          <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
            <TypographyH4 className="text-red-600 dark:text-red-600">Danger zone</TypographyH4>
          </div>

          <div className="mt-4 flex items-center gap-2 text-md justify-between px-3 md:px-8">
            <div className="flex flex-col items-start gap-0 md:gap-0">
              <span className="font-semibold text-[1.01rem]">{title}</span>
              {description && (
                <span className="text-muted-foreground text-[0.95rem]">{description}</span>
              )}
            </div>
            <div className="flex items-center gap-6">
              <Button
                size={'sm'}
                variant={'destructive'}
                disabled={btn.disabled}
                className="px-5"
                onClick={btn.onClick}
              >
                {btn.text ?? 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DangerZone
