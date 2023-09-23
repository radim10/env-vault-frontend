import { NewProject } from '@/types/projects'
import {
  CreateProjectError,
  CreateProjectResData,
  DeleteProjectError,
  DeleteProjectResData,
  createProject,
  deleteProject,
} from '../requests/projects'
import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'

// create
type CreateProjectVariables = {
  workspaceId: string
  data: NewProject
}

export const useCreateProject = (opt?: MutOpt<CreateProjectResData>) =>
  useMutation<CreateProjectResData, CreateProjectError, CreateProjectVariables>(createProject, opt)

// delete
type DeleteProjectVariables = {
  workspaceId: string
  name: string
}

export const useDeleteProject = (opt?: MutOpt<DeleteProjectResData>) =>
  useMutation<DeleteProjectResData, DeleteProjectError, DeleteProjectVariables>(deleteProject, opt)
