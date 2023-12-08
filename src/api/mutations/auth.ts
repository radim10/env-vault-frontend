import { useMutation } from '@tanstack/react-query'
import {
  EmailLoginData,
  EmailLoginError,
  EmailLoginResData,
  EmailSignUpData,
  EmailSignUpError,
  EmailSignUpResData,
  ForgotPasswordData,
  ForgotPasswordError,
  ForgotPasswordResData,
  LogoutError,
  LogoutResData,
  ResendEmailConfirmationData,
  ResendEmailConfirmationError,
  ResendEmailConfirmationResData,
  ResetPasswordData,
  ResetPasswordError,
  ResetPasswordResData,
  emailLogin,
  emailSignUp,
  forgotPassword,
  logout,
  resendEmailConfirmation,
  resetPassword,
} from '../requests/auth'
import { MutOpt } from './mutOpt'

export const useLogout = (opt?: MutOpt<LogoutResData>) =>
  useMutation<LogoutResData, LogoutError, null>(logout, opt)

export const useEmaiLSignUp = (opt?: MutOpt<EmailSignUpResData>) =>
  useMutation<EmailSignUpResData, EmailSignUpError, EmailSignUpData>(emailSignUp, opt)

export const useEmailLogin = (opt?: MutOpt<EmailLoginResData>) =>
  useMutation<EmailLoginResData, EmailLoginError, EmailLoginData>(emailLogin, opt)

export const useForgotPassword = (opt?: MutOpt<ForgotPasswordResData>) =>
  useMutation<ForgotPasswordResData, ForgotPasswordError, ForgotPasswordData>(forgotPassword, opt)

export const useResetPassword = (opt?: MutOpt<ResetPasswordResData>) =>
  useMutation<ResetPasswordResData, ResetPasswordError, ResetPasswordData>(resetPassword, opt)

export const useResendEmailConfirmation = (opt?: MutOpt<ResendEmailConfirmationResData>) =>
  useMutation<
    ResendEmailConfirmationResData,
    ResendEmailConfirmationError,
    ResendEmailConfirmationData
  >(resendEmailConfirmation, opt)
