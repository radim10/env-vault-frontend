import dayjs from 'dayjs'
import axios, { AxiosError } from 'axios'
import sessionStore from '@/stores/session'
import { UserSession } from '@/types/session'
import { deleteSession, saveSession } from '@/app/actions'

export type APIError<
  T,
  D extends Record<string, unknown> | undefined = undefined,
  W extends true | void = void
> = {
  // code: T | 'workspace_not_found'
  code: W extends true ? T | 'workspace_not_found' : T
  status: number
  details: D
}

export const apiClient = axios.create()

apiClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error: AxiosError) {
    const status = error?.response?.status

    if (status === 401) {
      deleteSession()
      window.location.replace('/login')
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

const refreshSessionRequest = async (
  apiUrl: string,
  currentSession: UserSession
): Promise<string | undefined> => {
  try {
    const { data } = await axios.post<{
      accessToken: string
      accessTokenExpiresAt: number
      refreshToken: string
      refreshTokenExpiresAt: number
    }>(`${apiUrl}/auth/refresh`, {
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
    console.log(e)

    if (e instanceof AxiosError) {
      const status = e?.response?.status

      if (status === 401 || status === 400) {
        deleteSession()
        window.location.replace('/login')
      }
    }
  }
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
  const apiUrl = process.env.API_URL
  const baseURL = `${apiUrl}/${config.basePath}`

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
    const newAccessToken = await refreshSessionRequest(apiUrl as string, session)
    if (newAccessToken) accessToken = newAccessToken
  }

  try {
    const req = await apiClient.request<ResponseType>({
      url: config?.path ? `/${config?.path}` : '',
      method: config.method,
      baseURL,
      params: config.params ?? undefined,
      data: config?.body ?? undefined,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        ...config.headers,
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

      if (errorData?.details) {
        error.details = errorData?.details
      }
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
