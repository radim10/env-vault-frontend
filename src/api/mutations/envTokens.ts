import { useMutation } from '@tanstack/react-query'
import {
  CreateEnvironmentTokenArgs,
  CreateEnvironmentTokenError,
  CreateEnvironmentTokenResData,
  createEnvironmentToken,
} from '../requests/projects/environments/tokens'
import { MutOpt } from './mutOpt'

// create
type CreateEnvironmentTokenVariables = CreateEnvironmentTokenArgs

export const useCreateEnvironmentToken = (opt?: MutOpt<CreateEnvironmentTokenResData>) =>
  useMutation<
    CreateEnvironmentTokenResData,
    CreateEnvironmentTokenError,
    CreateEnvironmentTokenVariables
  >(createEnvironmentToken, opt)
