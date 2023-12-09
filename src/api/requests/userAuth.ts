import { ListSession } from '@/types/session'
import sendRequest, { APIError } from '../instance'
import { AuthType } from '@/types/auth'

type UserAuthErrorCode =
  | 'user_not_found'
  | 'email_not_confirmed'
  | 'invalid_password_format'
  | 'password_already_set'
  // update
  | 'invalid_new_password_format'
  | 'password_not_set'
  | AuthMethodErrorCode

type AuthMethodErrorCode =
  | 'auth_method_not_connected'
  | 'cannot_delete_only_auth_method'
  | 'password_confirmation_required'
  | 'invalid_password'

type ChangeEmailErrorCode =
  | 'user_not_found'
  | 'email_not_confirmed'
  | 'invalid_password'
  | 'password_not_set'
  | 'invalid_new_password_format'
  | 'email_not_available'

export type UserAuthError<
  T extends UserAuthErrorCode | AuthMethodErrorCode | ChangeEmailErrorCode | void
> = APIError<T>

export function userAuthErrorMsgFromCode(code?: UserAuthErrorCode): string {
  let msg = 'Something went wrong'

  switch (code) {
    case 'user_not_found':
      msg = 'User not found in current workspace'
      break
    case 'email_not_confirmed':
      msg = 'Email not confirmed'
      break
    case 'invalid_password_format':
      msg = 'Invalid password format'
      break
    case 'password_already_set':
      msg = 'Password already set'
      break
    case 'invalid_new_password_format':
      msg = 'Invalid new password format'
      break
    case 'password_not_set':
      msg = 'Password not set'
      break
    case 'auth_method_not_connected':
      msg = 'Auth method not connected'
      break

    case 'cannot_delete_only_auth_method':
      msg = 'Cannot delete only auth method'
      break

    case 'password_confirmation_required':
      msg = 'Password confirmation required'
      break

    case 'invalid_password':
      msg = 'Invalid password'
      break
  }

  return msg
}

export function changeEmailErrorMsgFromCode(code?: ChangeEmailErrorCode): string {
  let msg = 'Something went wrong'

  switch (code) {
    case 'user_not_found':
      msg = 'User not found in current workspace'
      break
    case 'email_not_confirmed':
      msg = 'Email not confirmed'
      break
    case 'invalid_password':
      msg = 'Invalid password'
      break
    case 'password_not_set':
      msg = 'Password not set'
      break
    case 'invalid_new_password_format':
      msg = 'Invalid new password format'
      break
    case 'email_not_available':
      msg = 'Email not available'
      break
  }

  return msg
}

export type GetAuthMethodsError = UserAuthError<'user_not_found'>
export type GetAuthMethodsResData = {
  methods: AuthType[]
}

export async function getAuthMethods() {
  return await sendRequest<GetAuthMethodsResData>({
    method: 'GET',
    basePath: `me`,
    path: `auth/methods`,
  })
}

// TODO: Error
export type RemoveAuthMethodError = UserAuthError<AuthMethodErrorCode>
export type RemoveAuthMethodResData = undefined
export type RemoveAuthMethodData = {
  method: AuthType
  password?: string
}

export async function removeAuthMethod(data: RemoveAuthMethodData) {
  return await sendRequest<RemoveAuthMethodResData>({
    method: 'POST',
    basePath: `me`,
    // path: `auth/methods/${data.method.toLowerCase()}`,
    path: `auth/methods/${data.method.toLowerCase()}/remove`,
    body: data,
  })
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

export type UpdateAccountPasswordError = UserAuthError<
  | 'user_not_found'
  | 'email_not_confirmed'
  | 'password_not_set'
  | 'invalid_password_format'
  | 'invalid_new_password_format'
>
export type UpdateAccountPasswordResData = undefined

export type UpdateAccountPasswordData = {
  password: string
  newPassword: string
}

export async function updateAccountPassword(data: UpdateAccountPasswordData) {
  return await sendRequest<UpdateAccountPasswordResData>({
    method: 'PATCH',
    basePath: `me`,
    path: `auth/password`,
    body: data,
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

// TODO :error codes
export type RevokeUserSessionError = UserAuthError<'user_not_found'>
export type RevokeUserSessionResData = undefined

export async function revokeUserSession(sessionId: string) {
  return await sendRequest<RevokeUserSessionResData>({
    method: 'DELETE',
    basePath: `me`,
    path: `auth/sessions/${sessionId}`,
  })
}

// change email

// TODO :error codes
export type ChangeEmailError = UserAuthError<
  'user_not_found' | 'email_not_confirmed' | 'password_not_set' | 'invalid_password'
>
export type ChangeEmailResData = undefined
export type ChangeEmailData = {
  password: string
  newEmail: string
}

export async function changeEmail(data: ChangeEmailData) {
  return await sendRequest<ChangeEmailResData>({
    method: 'PATCH',
    basePath: `me`,
    path: `auth/email`,
    body: data,
  })
}
