import { NewProject } from '@/types/projects'
import { CreateProjectError, CreateProjectResData, createProject } from '../requests/projects'
import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'

type CreateProjectVariables = {
  workspaceId: string
  data: NewProject
}

export const useCreateProject = (opt?: MutOpt<CreateProjectResData>) =>
  useMutation<CreateProjectResData, CreateProjectError, CreateProjectVariables>(createProject, opt)
