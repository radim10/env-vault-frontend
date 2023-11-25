import { saveSession } from '@/app/actions'
import sessionStore from '@/stores/session'
import useCurrentUserStore from '@/stores/user'
import { UserSession } from '@/types/session'
import axios from 'axios'
import dayjs from 'dayjs'

const refreshSessionRequest = async (currentSession: UserSession): Promise<string | undefined> => {
  try {
    const { data } = await axios.post<{
      accessToken: string
      accessTokenExpiresAt: number
      refreshToken: string
      refreshTokenExpiresAt: number
    }>('http://localhost:8080/api/v1/auth/refresh', {
      refreshToken: currentSession?.refreshToken ?? undefined,
    })
    if (data?.accessToken) {
      // const { accessToken: newAccessToken, accessTokenExpiresAt } = data
      // const newSessionData = {
      //   ...currentSession,
      //   accessToken: newAccessToken,
      //   accessTokenExpiresAt,
      // }
      //
      saveSession(data)
      sessionStore.setState({ data: data })

      return data?.accessToken
    }
  } catch (e) {
    // TODO: logout on known error
    console.log(e)
  }
}

export type APIError<T> = {
  code: T | 'workspace_not_found'
  status: number
}

export default async function sendRequest<ResponseType>(config: {
  returnStatus?: boolean
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  basePath: 'projects' | 'workspaces' | 'auth' | 'me'
  path?: string | number
  body?: Record<string, unknown> | unknown
  params?: Record<string, string | number> | unknown
  accessToken?: string //ssr
  headers?: Record<string, string>
}): Promise<ResponseType> {
  // const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${config.basePath}`
  // const baseURL = `http://localhost:8080/api/v1/${config.basePath}`
  const baseURL = `${process.env.API_URL}/${config.basePath}`

  const session = sessionStore.getState().data
  console.log(session)

  let accessToken = session?.accessToken

  if (
    session?.accessTokenExpiresAt &&
    dayjs.unix(session?.accessTokenExpiresAt).diff(dayjs(), 's') < 5 &&
    session?.refreshToken &&
    dayjs.unix(session?.accessTokenExpiresAt).diff(dayjs(), 's') < 5
  ) {
    console.log('refreshing session')
    const newAccessToken = await refreshSessionRequest(session)
    if (newAccessToken) accessToken = newAccessToken
  }

  try {
    const req = await axios.request<ResponseType>({
      url: config?.path ? `/${config?.path}` : '',
      method: config.method,
      baseURL,
      params: config.params ?? undefined,
      data: config?.body ?? undefined,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        // ...config.headers,
      },
    })

    if (config.returnStatus) {
      return { status: req?.status, data: req?.data } as ResponseType
    } else {
      return req?.data
    }
  } catch (err: any) {
    console.log({ err })
    console.log(err?.response?.data)

    const errorData = err?.response?.data?.error

    if (errorData && errorData?.code) {
      const error = new Error() as any
      error.message = errorData
      error.code = errorData?.code
      // Attach extra info to the error object.
      error.status = err?.response?.status
      throw error
    }
    console.error(err)
    // for now throw generic error
    const error = new Error()

    throw error
    // throw err
  }
}
