import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col ">
      <div className="w-[240px] sticky h-screen">
        <Sidebar />
      </div>
      <div>{children}</div>
    </div>
  )
}
