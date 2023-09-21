import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-row ">
        <div className="w-[280px] lg:w-[320px] sticky h-screen">
          <Sidebar />
        </div>
        <div className="h-full w-full flex-grow px-6 py-6 lg:px-10">
          <Header />
          <div className="py-8">{children}</div>
        </div>
      </div>
    </>
  )
}
