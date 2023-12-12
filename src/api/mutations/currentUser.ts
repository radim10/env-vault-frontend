import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  DeleteAccountData,
  DeleteAccountError,
  DeleteAccountResData,
  UpdateDefaultWorkspaceData,
  UpdateDefaultWorkspaceError,
  UpdateDefaultWorkspaceResData,
  UpdateUserProfileData,
  UpdateUserProfileError,
  UpdateUserProfileResData,
  deleteAccount,
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

// delete user account
export const useDeleteAccount = (opt?: MutOpt<DeleteAccountResData>) =>
  useMutation<DeleteAccountResData, DeleteAccountError, DeleteAccountData>(deleteAccount, opt)
