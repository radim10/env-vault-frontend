'use client'

import OauthError from '@/components/OAuthError'

export default function Error({
  error: _,
  reset: __,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // const [totalRetries, setTotalRetries] = useState(0)
  //
  // const retry = () => {
  //   setTotalRetries(totalRetries + 1)
  //   reset()
  // }
  //
  return (
    <div>
      <OauthError />
    </div>
  )
}
