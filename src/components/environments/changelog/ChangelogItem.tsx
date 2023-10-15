import React from 'react'
import ChangelogLayout from './ChangelogLayout'
import { EnvChange } from '@/types/envChangelog'
import EnvTypeBadge from '../EnvTypeBadge'
import { Icons } from '@/components/icons'

interface Props {
  change: EnvChange
  createdAt: string
  onRollback: () => void
}

const ChangelogItem: React.FC<Props> = ({ createdAt, change, onRollback }) => {
  return (
    <div>
      <ChangelogLayout
        createdAt={createdAt}
        rollbackBtn={{
          disabled: false,
          onClick: onRollback,
        }}
        titleComponent={
          <>
            {change?.action === 'renamed' && (
              <div className="flex gap-2 items-center flex-wrap">
                <div>
                  <span>{`Renamed environment from `}</span>
                  <span className="font-semiboldX text-primary">{change?.old}</span> to{' '}
                  <span className="font-semiboldX text-primary">{change?.new}</span>
                </div>
                <Icons.pencil className="hidden md:block w-4 h-4 text-foregroundX opacity-80X" />
              </div>
            )}

            {change?.action === 'lock' && (
              <div className="flex gap-2 items-center">
                {change?.locked === true ? 'Locked environment' : 'Unlocked environment'}

                {change?.locked ? (
                  <Icons.lock className="hidden md:block w-4 h-4 text-foreground opacity-80 -mt-0.5" />
                ) : (
                  <Icons.unlock className="hidden md:block w-4 h-4 text-foreground opacity-80 -mt-0.5" />
                )}
              </div>
            )}

            {change?.action === 'type' && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>{`Changed environment type from `}</span>
                <div className="flex items-center gap-1.5">
                  <span className="">
                    <EnvTypeBadge type={change?.old} className="" />
                  </span>{' '}
                  to{' '}
                  <span className="">
                    <EnvTypeBadge type={change?.new} />
                  </span>
                </div>
              </div>
            )}
          </>
        }
      />
    </div>
  )
}

export default ChangelogItem
