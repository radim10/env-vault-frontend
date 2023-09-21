interface Props {
  children: React.ReactNode
}
function TypographyH2({ children }: Props) {
  return (
    <h2 className="dark:text-gray-200 scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  )
}

export default TypographyH2
