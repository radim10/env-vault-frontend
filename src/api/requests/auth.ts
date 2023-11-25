import sendRequest, { APIError } from '../instance'

type AuthErrorCode = 'user_not_found'
export type AuthError<T extends AuthErrorCode | void> = APIError<T>

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

// google
export type GetGoogleLinkError = AuthError<any>
export type GetGoogleLinkResData = {
  link: string
}

export async function getGoogleLink() {
  return await sendRequest<GetGoogleLinkResData>({
    method: 'GET',
    path: 'google',
    basePath: 'auth',
  })
}
