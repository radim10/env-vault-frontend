import sendRequest, { APIError } from '@/api/instance'

// TODO: error
export type RenameEnvironmentError = APIError<
  | 'Workspace not found'
  | 'Project not found'
  | 'Environment not found'
  | 'Environment already exists'
>
export type RenameEnvironmentResData = undefined

export async function renameEnvironment(args: {
  workspaceId: string
  projectName: string
  envName: string
  data: {
    name: string
  }
}) {
  const { workspaceId, projectName, envName, data } = args

  const response = sendRequest<RenameEnvironmentResData>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/environments/${envName}/rename`,
    body: data,
  })
  return await response
}
