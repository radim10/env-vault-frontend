import sendRequest, { APIError } from '../instance'

type UserAccountErrorCode =
  | 'user_not_found'
  | 'email_not_confirmed'
  | 'invalid_password_format'
  | 'password_already_set'

export type UserAccountError<T extends UserAccountErrorCode | void> = APIError<T>

export function userAccountErrorMsgFromCode(code: UserAccountErrorCode): string | null {
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
export type CreateAccountPasswordError = UserAccountError<
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
