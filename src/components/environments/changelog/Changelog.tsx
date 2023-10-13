import React from 'react'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const Changelog: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  return <div>This is changelog list</div>
}

export default Changelog
