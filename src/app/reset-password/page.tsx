import clsx from 'clsx'
import ResetPasswordCard from '@/components/auth/ResetPasswordCard'
import { redirectIfServerSession } from '@/utils/auth/session'
import { redirect } from 'next/navigation'

// NOTE: remove???
// const validateToken = async (token: string): Promise<boolean> => {
//   try {
//     const res = await fetch(`http://localhost:8080/api/v1/auth/reset-password/validate`, {
//       method: 'POST',
//       body: JSON.stringify({ token }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       cache: 'no-store',
//     })
//     if (!res.ok) return false
//     let body = (await res.json()) as { valid: boolean }
//
//     if (body.valid) {
//       return true
//     }
//     return false
//   } catch (e) {
//     console.log(e)
//     return false
//   }
// }

const ResetPasswordPage = async ({ searchParams }: { searchParams: { token?: string } }) => {
  await redirectIfServerSession()

  // const tokenValid = await validateToken(token)
  const token = searchParams?.token

  if (token?.length !== 43) {
    redirect('/login')
  }

  return (
    <div>
      <div
        className={clsx(['flex justify-center w-full bg-red-400X h-screen items-center'], {
          '-mt-10': true,
        })}
      >
        <ResetPasswordCard token={token} />
      </div>
    </div>
  )
}

export default ResetPasswordPage
