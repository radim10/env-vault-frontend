interface Props {
  provider: 'google' | 'github'
}

const OauthRedirectLoader: React.FC<Props> = ({ provider }) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-x-hidden overflow-y-hidden">
      <div className="text-md animate-pulse">
        Redirecting to {provider === 'github' ? 'GitHub' : 'Google'}
      </div>
    </div>
  )
}

export default OauthRedirectLoader
