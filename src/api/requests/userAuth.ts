import { ListSession } from '@/types/session'
import sendRequest, { APIError } from '../instance'

type UserAuthErrorCode =
  | 'user_not_found'
  | 'email_not_confirmed'
  | 'invalid_password_format'
  | 'password_already_set'

export type UserAuthError<T extends UserAuthErrorCode | void> = APIError<T>

export function userAuthErrorMsgFromCode(code: UserAuthErrorCode): string | null {
  let msg = null

  if (code === 'user_not_found') {
    msg = 'User not found in current workspace'
  }

  if (code === 'email_not_confirmed') {
    msg = 'Email not confirmed'
  }

  if (code === 'invalid_password_format') {
    msg = 'Invalid password format'
  }

  if (code === 'password_already_set') {
    msg = 'Password already set'
  }

  return msg
}

// auth
export type CreateAccountPasswordError = UserAuthError<
  'user_not_found' | 'email_not_confirmed' | 'password_already_set' | 'invalid_password_format'
>
export type CreateAccountPasswordResData = undefined

export type CreateAccountPasswordData = {
  password: string
}

export async function createAccountPassword(args: CreateAccountPasswordData) {
  return await sendRequest<CreateAccountPasswordResData>({
    method: 'POST',
    basePath: `me`,
    path: `auth/password`,
    body: args,
  })
}

// sessions
export type ListUserSessionsError = UserAuthError<'user_not_found'>
export type ListUserSessionsData = ListSession[]

export async function listUserSessions() {
  return await sendRequest<ListUserSessionsData>({
    method: 'GET',
    basePath: `me`,
    path: `auth/sessions`,
  })
}
