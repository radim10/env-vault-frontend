import { NewProject, UpdateProjectData } from '@/types/projects'
import {
  CreateProjectError,
  CreateProjectResData,
  DeleteProjectError,
  DeleteProjectResData,
  UpdateProjectError,
  UpdateProjectResData,
  createProject,
  deleteProject,
  updateProject,
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

// update
type UpdateProjectVariables = {
  workspaceId: string
  name: string
  data: UpdateProjectData
}

export const useUpdateProject = (opt?: MutOpt<UpdateProjectResData>) =>
  useMutation<UpdateProjectResData, UpdateProjectError, UpdateProjectVariables>(updateProject, opt)

// delete
type DeleteProjectVariables = {
  workspaceId: string
  name: string
}

export const useDeleteProject = (opt?: MutOpt<DeleteProjectResData>) =>
  useMutation<DeleteProjectResData, DeleteProjectError, DeleteProjectVariables>(deleteProject, opt)
