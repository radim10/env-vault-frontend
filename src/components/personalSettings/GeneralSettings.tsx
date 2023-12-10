'use client'

import DangerZone from '../DangerZone'
import ProfileSection from './ProfileSection'
import WorkspacePreferences from './WorkspacePreferences'

const GeneralSettings = () => {
  return (
    <>
      <div className="flex flex-col gap-7 mt-6">
        <div>
          <ProfileSection />
        </div>
        {/* // */}
        <WorkspacePreferences />
        {/* // */}
        <DangerZone
          btn={{
            onClick: () => {},
            disabled: false,
          }}
          title="Delete my account"
          description="Permanently delete this account, cannot be undone"
        />
      </div>
    </>
  )
}

export default GeneralSettings
