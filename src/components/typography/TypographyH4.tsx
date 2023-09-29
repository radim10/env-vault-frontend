interface Props {
  children: React.ReactNode
}
function TypographyH4({ children }: Props) {
  return (
    <h2 className="dark:text-gray-300 scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  )
}

export default TypographyH4
