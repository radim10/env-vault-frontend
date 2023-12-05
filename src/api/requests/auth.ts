import { UserSession } from '@/types/session'
import sendRequest, { APIError } from '../instance'

type AuthErrorCode = 'user_not_found'

type EmailSignUpErrorCode = 'invalid_password_format' | 'email_not_available'
type EmailLoginErrorCode =
  | 'user_banned'
  | 'invalid_password_format'
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'method_not_available'

type ResetPasswordErrorCode =
  // | 'user_banned'
  'invalid_token' | 'token_expired' | 'invalid_password_format'

type ResendEmailConfirmationErrorCode =
  | 'invalid_password_format'
  | 'invalid_credentials'
  | 'email_already_confirmed'
  | 'max_resend_count_reached'

export type AuthError<
  T extends
    | AuthErrorCode
    | EmailLoginErrorCode
    | ResetPasswordErrorCode
    | EmailSignUpErrorCode
    | void,
  D extends Record<string, any> | undefined = undefined
> = APIError<T, D>

// logout
export type LogoutError = AuthError<any>
export type LogoutResData = undefined

export const emailLoginErrorMsgFromCode = (code: string) => {
  switch (code) {
    case 'user_banned':
      return 'User is banned'
    case 'invalid_password_format':
      return 'Invalid password format'
    case 'invalid_credentials':
      return 'Invalid email or password'
    // TODO: navigate user to email confirmation send
    case 'email_not_confirmed':
      return 'Email not confirmed'
    //
    case 'method_not_available':
      return 'Password login is not available'
    default:
      return 'Something went wrong'
  }
}

export const emailSignUpErrorMsgFromCode = (code: string) => {
  switch (code) {
    case 'invalid_password_format':
      return 'Invalid password format'
    case 'email_not_available':
      return 'Email not available'
    default:
      return 'Something went wrong'
  }
}

export const resetPasswordErrorMsgFromCode = (code: string) => {
  switch (code) {
    // case 'user_banned':
    //   return 'User is banned'
    case 'invalid_token':
      return 'Invalid token'
    case 'token_expired':
      return 'Token expired'
    case 'invalid_password_format':
      return 'Invalid password format'
    default:
      return 'Something went wrong'
  }
}

export const resendEmailConfirmationErrorMsgFromCode = (
  code?: ResendEmailConfirmationErrorCode
) => {
  switch (code) {
    case 'invalid_password_format':
      return 'Invalid password format'
    case 'invalid_credentials':
      return 'Invalid email or password'
    case 'email_already_confirmed':
      return 'Email already confirmed'
    case 'max_resend_count_reached':
      return 'Max resend count reached'
    default:
      return 'Something went wrong'
  }
}

export async function logout() {
  return await sendRequest<LogoutResData>({
    method: 'POST',
    path: 'logout',
    basePath: 'auth',
  })
}

// email login
// export type EmailLoginError = AuthError<EmailLoginErrorCode, { canResend?: boolean }>
export type EmailLoginError =
  | APIError<EmailLoginErrorCode>
  | APIError<'email_not_confirmed', { remainingResends?: number } | undefined>

export type EmailLoginResData = UserSession

// export function isEmailNotConfirmedError(
//   obj: any
// ): obj is { error: 'email_not_confirmed'; canResend: boolean } {
//   return typeof obj === 'object' && obj !== null && 'error' in obj && 'canResend' in obj
// }
//
export type EmailLoginData = {
  email: string
  password: string
}

export async function emailLogin(data: EmailLoginData) {
  return await sendRequest<EmailLoginResData>({
    method: 'POST',
    basePath: 'auth',
    path: 'email/login',
    body: data,
  })
}

// resend email confirmation
export type ResendEmailConfirmationError = APIError<ResendEmailConfirmationErrorCode>
export type ResendEmailConfirmationResData = undefined

export type ResendEmailConfirmationData = {
  email: string
  password: string
}

export async function resendEmailConfirmation(data: ResendEmailConfirmationData) {
  return await sendRequest<ResendEmailConfirmationResData>({
    method: 'POST',
    basePath: 'auth',
    path: 'email/resend-confirmation',
    body: data,
  })
}

// google
export type GetGoogleUrlError = AuthError<any>
export type GetGoogleUrlResData = {
  url: string
}

export async function getGoogleUrl(invitationId: string | null) {
  return await sendRequest<GetGoogleUrlResData>({
    method: 'GET',
    path: 'google',
    basePath: 'auth',
    params: invitationId
      ? {
          invitation: invitationId,
        }
      : undefined,
  })
}

// github
export type GetGithubUrlError = GetGoogleUrlError
export type GetGithubUrlResData = GetGoogleUrlResData

export async function getGithubUrl(invitationId: string | null) {
  return await sendRequest<GetGithubUrlResData>({
    method: 'GET',
    basePath: 'auth',
    path: 'github',
    params: invitationId
      ? {
          invitation: invitationId,
        }
      : undefined,
  })
}

// email
// TODO: error
export type EmailSignUpError = AuthError<EmailSignUpErrorCode>
export type EmailSignUpResData = undefined
export type EmailSignUpData = {
  name: string
  email: string
  password: string
  invitation?: string
}

export async function emailSignUp(data: EmailSignUpData) {
  return await sendRequest<EmailSignUpResData>({
    method: 'POST',
    basePath: 'auth',
    path: 'email/signup',
    body: data,
  })
}

// forgot password
export type ForgotPasswordError = AuthError<any>
export type ForgotPasswordResData = undefined
export type ForgotPasswordData = {
  email: string
}

export async function forgotPassword(data: ForgotPasswordData) {
  return await sendRequest<ForgotPasswordResData>({
    method: 'POST',
    basePath: 'auth',
    // TODO: path without email???
    path: 'forgot-password',
    body: data,
  })
}

export type ResetPasswordError = AuthError<ResetPasswordErrorCode>
export type ResetPasswordResData = undefined
export type ResetPasswordData = {
  token: string
  password: string
}

export async function resetPassword(data: ResetPasswordData) {
  return await sendRequest<ResetPasswordResData>({
    method: 'POST',
    basePath: 'auth',
    path: 'reset-password',
    body: data,
  })
}
