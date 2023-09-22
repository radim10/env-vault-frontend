import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex md:flex-row flex-col">
        <div className="md:w-[280px] lg:w-[320px] md:sticky top-0 md:h-screen w-screen">
          <Sidebar />
        </div>
        <div className="h-full w-full flex-grow px-6 py-6 lg:px-10">
          <div className="md:block hidden">
            <Header />
          </div>
          <div className="py-8">{children}</div>
        </div>
      </div>
    </>
  )
}
