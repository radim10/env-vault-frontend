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
import { useMount } from 'react-use'
import useCreditCardExpiredStore from '@/stores/cardExpired'

interface Props {
  workspaceId: string
}

const CreditCardExpiredRoot: React.FC<Props> = (props) => {
  const { opened, close, open } = useCreditCardExpiredStore()

  const handleClose = () => {
    close()
  }

  useMount(() => {
    open()
  })

  // const createTimeout = () => {
  //   setTimeout(() => {
  //     const showDialog = !window.location.href?.endsWith('/settings/subscription')
  //
  //     if (showDialog && !opened) {
  //       const openDiv = document.querySelector('div[data-state="open"]')
  //       const anotherDialogOpened = openDiv ? openDiv.hasAttribute('data-state') : false
  //
  //       if (anotherDialogOpened) {
  //         createTimeout()
  //       } else {
  //         // setOpened(true)
  //         open()
  //       }
  //     } else {
  //       createTimeout()
  //     }
  //     // 2 mins
  //   }, 120000)
  //   // }, 5000)
  // }
  //
  return <CreditCardExpiredDialog {...props} opened={opened} onClose={handleClose} />
}

const CreditCardExpiredDialog: React.FC<Props & { opened: boolean; onClose: () => void }> = ({
  workspaceId,
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

          <div className={clsx(['text-[0.94rem]'])}>
            <span>
              Your credit card used for subscription payment has expired. Please update the card or
              cancel your subscription.
            </span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={onClose} className="md:px-5">
                Close
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="default"
                onClick={() => {
                  router.push(`/workspace/${workspaceId}/settings/subscription`)
                  onClose()
                }}
              >
                Update card
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CreditCardExpiredRoot
