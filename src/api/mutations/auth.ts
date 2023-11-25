import { useMutation } from '@tanstack/react-query'
import { LogoutError, LogoutResData, logout } from '../requests/auth'
import { MutOpt } from './mutOpt'

export const useLogout = (opt?: MutOpt<LogoutResData>) =>
  useMutation<LogoutResData, LogoutError, { id: true }>(logout, opt)
