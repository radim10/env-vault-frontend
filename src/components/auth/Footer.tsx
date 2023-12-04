const items = ['Privacy policy', 'Terms and conditions', 'Help']

const AuthFooter = () => {
  return (
    <div className="flex flex-row gap-2 md:gap-3 text-[0.83rem] text-muted-foreground items-center">
      {items.map((item, index) => (
        <>
          <div className="opacity-90">{item}</div>
          {index !== items.length - 1 && (
            <div className="h-1.5 w-1.5 rounded-full mt-0.5 bg-muted-foreground opacity-30" />
          )}
        </>
      ))}
    </div>
  )
}

export default AuthFooter
