import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  UpdateDefaultWorkspaceData,
  UpdateDefaultWorkspaceError,
  UpdateDefaultWorkspaceResData,
  UpdateUserProfileData,
  UpdateUserProfileError,
  UpdateUserProfileResData,
  updateDefaultWorkspace,
  updateUserProfile,
} from '../requests/currentUser'

export const useUpdateDefaultWorkspace = (opt?: MutOpt<UpdateDefaultWorkspaceResData>) =>
  useMutation<
    UpdateDefaultWorkspaceResData,
    UpdateDefaultWorkspaceError,
    UpdateDefaultWorkspaceData
  >(updateDefaultWorkspace, opt)

// update profile
export const useUpdateUserProfile = (opt?: MutOpt<UpdateUserProfileResData>) =>
  useMutation<UpdateUserProfileResData, UpdateUserProfileError, UpdateUserProfileData>(
    updateUserProfile,
    opt
  )
