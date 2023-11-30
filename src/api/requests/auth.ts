import { UserSession } from '@/types/session'
import sendRequest, { APIError } from '../instance'

type AuthErrorCode = 'user_not_found'

type EmailLoginErrorCode =
  | 'user_banned'
  | 'invalid_password_format'
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'method_not_available'

export type AuthError<T extends AuthErrorCode | EmailLoginErrorCode | void> = APIError<T>

// logout
export type LogoutError = AuthError<any>
export type LogoutResData = undefined

export async function logout() {
  return await sendRequest<LogoutResData>({
    method: 'POST',
    path: 'logout',
    basePath: 'auth',
  })
}

// email login
export type EmailLoginError = AuthError<EmailLoginErrorCode>
export type EmailLoginResData = UserSession

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
export type EmailSignUpError = AuthError<any>
export type EmailSignUpResData = undefined
export type EmailSignUpData = {
  email: string
  password: string
}

export async function emailSignUp(data: EmailSignUpData) {
  return await sendRequest<EmailSignUpResData>({
    method: 'POST',
    basePath: 'auth',
    path: 'email/signup',
    body: data,
  })
}
