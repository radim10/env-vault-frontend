import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GlobalQueryClientProvider } from '@/components/QueryClient'
import { Toaster } from '@/components/ui/toaster'
import { getSession } from '@/utils/auth/session'
import AuthProvider from '@/components/SessionProvider'
import { redirect } from 'next/navigation'
import { UserSession } from '@/types/session'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const getCurrentUserData = async () => {
  // TODO: route???
  const res = await fetch(`http://localhost:8080/api/v1/workspaces/3434/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  console.log(res.status)
  if (!res.ok) return undefined
  let body = res.json()
  return body
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // const session = await getSession()
  // // const session = {}
  // console.log('layout running')
  //
  // let userEmail: string | null = ''
  // let name: string | null = ''
  //
  // // FIX: running if layout loaded
  // if (false) {
  //   // const currentUser = (await getCurrentUserData()) as { email: string; name: string }
  //   // console.log(currentUser)
  //   // if (currentUser) {
  //   //   userEmail = currentUser.email
  //   //   name = currentUser.name
  //   // }
  //   //
  //   // if (!userEmail) redirect('/auth/login')
  // }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <GlobalQueryClientProvider>
            <Toaster />
            <main className="flex w-full items-center justify-center">
              <div className="max-w-[1800px] w-full">{children}</div>
            </main>
          </GlobalQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
