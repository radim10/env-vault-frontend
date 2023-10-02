import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  CreateWorkspaceTokenArgs,
  CreateWorkspaceTokenError,
  CreateWorkspaceTokenResData,
  RevokeWorkspaceTokenArgs,
  RevokeWorkspaceTokenError,
  RevokeWorkspaceTokenResData,
  createWorkspaceToken,
  revokeWorkspaceToken,
} from '../requests/tokens'

// create
type CreateWorkspaceTokenVariables = CreateWorkspaceTokenArgs

export const useCreateWorkspaceToken = (opt?: MutOpt<CreateWorkspaceTokenResData>) =>
  useMutation<
    CreateWorkspaceTokenResData,
    CreateWorkspaceTokenError,
    CreateWorkspaceTokenVariables
  >(createWorkspaceToken, opt)

// revoke (delete)
type RevokeWorkspaceTokenVariables = RevokeWorkspaceTokenArgs

export const useRevokeWorkspaceToken = (opt?: MutOpt<RevokeWorkspaceTokenResData>) =>
  useMutation<undefined, RevokeWorkspaceTokenError, RevokeWorkspaceTokenVariables>(
    revokeWorkspaceToken,
    opt
  )
