import { SubscriptionPlan } from '@/types/subscription'
import { useState } from 'react'
import { Icons } from './icons'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from './ui/button'

interface Props {
  workspaceId: string
  subscriptionPlan: SubscriptionPlan
  //
  canManageUsers: boolean
  count: number
}

const UsersExceededRoot: React.FC<Props> = (props) => {
  const [opened, setOpened] = useState(true)

  const close = () => {
    setOpened(false)
    createTimeout()
  }

  const createTimeout = () => {
    setTimeout(() => {
      const openDiv = document.querySelector('div[data-state="open"]')
      const anotherDialogOpened = openDiv ? openDiv.hasAttribute('data-state') : false

      if (anotherDialogOpened) {
        createTimeout()
      } else {
        setOpened(true)
      }
      // 2 mins
    }, 120000)
  }

  return <UsersExceededModal {...props} opened={opened} onClose={close} />
}

const UsersExceededModal: React.FC<Props & { opened: boolean; onClose: () => void }> = ({
  subscriptionPlan,
  canManageUsers,
  workspaceId,
  count,
  opened,
  onClose,
}) => {
  const router = useRouter()

  return (
    <div>
      <AlertDialog open={opened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex gap-2 md:gap-2.5 items-center">
                <div>Action required</div>
                <Icons.alertCircle className="h-5 w-5 text-red-600" />
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div
            className={clsx(['text-[0.93rem]'], {
              'mb-0': canManageUsers,
            })}
          >
            <span>
              This workspace has limit of{' '}
              <b>{subscriptionPlan === SubscriptionPlan.FREE ? '5' : '50'}</b> users. Currently,
              there are <b>{subscriptionPlan === SubscriptionPlan.FREE ? count + 5 : count + 50}</b>{' '}
              users in this workspace.{' '}
            </span>
            {canManageUsers ? (
              <span>
                Please remove
                {count === 1 ? ' 1 user' : ` ${count} users`} or upgrade your workspace plan.
              </span>
            ) : (
              <span>Ask one of the workspace owner or any of the admins to take action.</span>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={onClose} className="md:px-5">
                Close
              </Button>
            </AlertDialogCancel>
            {canManageUsers && (
              <AlertDialogAction asChild>
                <Button
                  variant="default"
                  onClick={() => {
                    router.push(`/workspace/${workspaceId}/users/workspace`)
                    onClose()
                  }}
                >
                  Show users
                </Button>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UsersExceededRoot
