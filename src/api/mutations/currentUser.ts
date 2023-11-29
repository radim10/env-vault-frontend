import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  UpdateDefaultWorkspaceData,
  UpdateDefaultWorkspaceError,
  UpdateDefaultWorkspaceResData,
  updateDefaultWorkspace,
} from '../requests/currentUser'

export const useUpdateDefaultWorkspace = (opt?: MutOpt<UpdateDefaultWorkspaceResData>) =>
  useMutation<
    UpdateDefaultWorkspaceResData,
    UpdateDefaultWorkspaceError,
    UpdateDefaultWorkspaceData
  >(updateDefaultWorkspace, opt)
