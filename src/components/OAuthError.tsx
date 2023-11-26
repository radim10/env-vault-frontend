import Link from 'next/link'
import { Icons } from './icons'
import { Button } from './ui/button'

const OauthError = () => {
  return (
    <div className=" flex justify-center items-center h-[70vh] px-4">
      <div className="flex flex-col justify-center gap-6">
        <h1 className="text-center dark:text-gray-200 scroll-m-20 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
          Something went {'wrong '}
          <Icons.frown className="inline-block h-8 w-8" />
        </h1>

        <div className="flex flex-row w-full gap-3">
          <Link href="/login" className="w-full">
            <Button className="w-full gap-3" variant="outline">
              <Icons.chevronLeft className="inline-block h-5 w-5" />
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OauthError
