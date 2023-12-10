'use client'

import DeleteAccount from './DeleteAccount'
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
        <div>
          <WorkspacePreferences />
        </div>
        {/* // */}
        <div>
          <DeleteAccount />
        </div>
      </div>
    </>
  )
}

export default GeneralSettings
