'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function GlobalQueryClientProvider({ children }: any) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          return error.status !== 400 && failureCount <= 3 ? true : false
        },
      },
    },
  })
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        {children}
      </QueryClientProvider>
    </>
  )
}
