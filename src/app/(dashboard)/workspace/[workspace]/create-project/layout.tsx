export default function EnvLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; projectName: string; env: string }
}) {
  return (
    <>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[800px] mt-2 2xl:mt-4 pb-16 lg:pb-16">
          <div className="mt-5">
            <div className="mt-4 px-6 lg:px-2">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}
