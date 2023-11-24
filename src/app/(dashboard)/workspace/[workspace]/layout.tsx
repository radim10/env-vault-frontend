import Header from '@/components/Header'
import ScrollToTopButton from '@/components/ScrollToTopBtn'
import AuthProvider from '@/components/SessionProvider'
import Sidebar from '@/components/Sidebar'
import { UserSession } from '@/types/session'
import { getSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  console.log('dashboard layout running')
  const session = await getSession()
  console.log(session)

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <AuthProvider
        // user={{ email: userEmail as string, name: name as string }}
        session={session as UserSession}
      >
        <div className="flex md:flex-row flex-col">
          <div className="md:w-[280px] lg:w-[320px] md:sticky top-0 md:h-screen w-screen">
            <Sidebar />
          </div>
          {/* <div className="h-full w-full flex-grow px-6 py-6 lg:px-10"> */}
          <div className="h-full w-full flex-grow">
            <div className="md:block hidden px-6 pt-6 lg:px-10">
              <Header />
            </div>
            <div className="md:pt-8 pt-5 pb-20">{children}</div>
          </div>
        </div>
        <ScrollToTopButton />
      </AuthProvider>
    </>
  )
}
