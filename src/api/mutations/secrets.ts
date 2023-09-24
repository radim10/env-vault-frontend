import { NewProject, UpdatedProjectData } from '@/types/projects'
import {} from '@/api/requests/projects/root'
import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'
import { UpdatedSecretsBody } from '@/types/secrets'
import {
  UpdateSecretsError,
  UpdateSecretsResData,
  updateSecrets,
} from '../requests/projects/environments/secrets'

// update
type UpdateSecretsProjectVariables = {
  workspaceId: string
  projectName: string
  envName: string
  data: UpdatedSecretsBody
}

export const useUpdateSecrets = (opt?: MutOpt<UpdateSecretsResData>) =>
  useMutation<UpdateSecretsResData, UpdateSecretsError, UpdateSecretsProjectVariables>(
    ['secrets-update'],
    updateSecrets,
    opt
  )
