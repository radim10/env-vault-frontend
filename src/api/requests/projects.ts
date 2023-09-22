import { ListProject } from '@/types/projects'
import sendRequest, { APIError } from '../instance'

export type GetProjectsError = APIError<'Collection not found'>
export type GetProjectsData = Awaited<ReturnType<typeof getProjects>>

export async function getProjects(args: { workspaceId: string }) {
  const { workspaceId } = args

  const response = sendRequest<Array<ListProject>>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects`,
  })
  return await response
}
