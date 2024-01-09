import { SubscriptionPlan } from '@/types/subscription'
import DialogComponent from './Dialog'
import { useState } from 'react'
import { Icons } from './icons'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

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
    }, 5000)
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
      <DialogComponent
        titleComponent={
          <div className="flex gap-2 md:gap-2.5 items-center">
            <div>Action required</div>
            <Icons.alertCircle className="h-5 w-5 text-red-600" />
          </div>
        }
        className="md:w-[550px]"
        opened={opened}
        onClose={onClose}
        submit={
          !canManageUsers
            ? {
                wFull: true,
                text: 'Remove users',
                variant: 'default',
              }
            : undefined
        }
        onSubmit={() => router.push(`/workspace/${workspaceId}/users/workspace`)}
      >
        <div
          className={clsx(['text-[0.93rem]'], {
            'mb-2': canManageUsers,
          })}
        >
          <span>
            This workspace has limit of{' '}
            <b>{subscriptionPlan === SubscriptionPlan.FREE ? '5' : '50'}</b> users. Currently, there
            are <b>{subscriptionPlan === SubscriptionPlan.FREE ? count + 5 : count + 50}</b> users
            in this workspace.
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
      </DialogComponent>
    </div>
  )
}

export default UsersExceededRoot
