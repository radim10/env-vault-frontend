import { useMutation } from '@tanstack/react-query'
import {
  EmailLoginData,
  EmailLoginResData,
  EmailSignUpData,
  EmailSignUpError,
  EmailSignUpResData,
  LogoutError,
  LogoutResData,
  emailLogin,
  emailSignUp,
  logout,
} from '../requests/auth'
import { MutOpt } from './mutOpt'

export const useLogout = (opt?: MutOpt<LogoutResData>) =>
  useMutation<LogoutResData, LogoutError, { id: true }>(logout, opt)

export const useEmaiLSignUp = (opt?: MutOpt<EmailSignUpResData>) =>
  useMutation<EmailSignUpResData, EmailSignUpError, EmailSignUpData>(emailSignUp, opt)

export const useEmailLogin = (opt?: MutOpt<EmailLoginResData>) =>
  useMutation<EmailLoginResData, EmailLoginData, EmailLoginData>(emailLogin, opt)
