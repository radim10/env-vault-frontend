import axios from 'axios'

export type APIError<T> = {
  message: T
  status: number
}

export default async function sendRequest<ResponseType>(config: {
  returnStatus?: boolean
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  basePath: 'projects'
  path?: string | number
  body?: Record<string, unknown> | unknown
  params?: Record<string, string | number> | unknown
  accessToken?: string //ssr
  headers?: Record<string, string>
}): Promise<ResponseType> {
  // const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${config.basePath}`
  const baseURL = `http://localhost:8080/api/v1/${config.basePath}`

  try {
    const req = await axios.request<ResponseType>({
      url: config?.path ? `/${config?.path}` : '',
      method: config.method,
      baseURL,
      params: config.params ?? undefined,
      data: config?.body ?? undefined,
    })

    if (config.returnStatus) {
      return { status: req?.status, data: req?.data } as ResponseType
    } else {
      return req?.data
    }
  } catch (err: any) {
    console.log({ err })
    console.log(err?.response?.data)

    const errorMsg = err?.response?.data?.error

    if (errorMsg) {
      const error = new Error() as any
      error.message = errorMsg
      // Attach extra info to the error object.
      error.status = err?.response?.status
      throw error
    }
    throw err
  }
}
