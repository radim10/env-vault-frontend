import sendRequest, { APIError } from '../instance'

export type GetProjectsError = APIError<'Collection not found'>
export type GetProjectsData = Awaited<ReturnType<typeof getProjects>>

export async function getProjects(args: { workspaceId: string }) {
  const response = sendRequest<Array<{
    id: string,
    name: string
    description: string | null
  }>>({
    method: 'GET',
    basePath: 'projects',
    path: args.workspaceId,
  })
  return await response
}
