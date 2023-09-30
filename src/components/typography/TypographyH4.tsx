import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
}

function TypographyH4({ children, className }: Props) {
  return (
    <h2
      className={cn(
        'dark:text-gray-300 scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0',
        className
      )}
    >
      {children}
    </h2>
  )
}

export default TypographyH4
