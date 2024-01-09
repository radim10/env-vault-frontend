import { SubscriptionData, SubscriptionPayment } from '@/types/subscription'
import { Icons } from '../icons'
import SubscriptionLayout from './SubscriptionLayout'
import { useGetUpdatePaymentUrl } from '@/api/queries/subscription'
import { useState } from 'react'
import UpdateTaxIdDrawer from './UpdateTaxIdDrawer'
import { useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { useToast } from '../ui/use-toast'
import UpdateCustomerNameDialog from './UpdateCustomerNameDialog'
import clsx from 'clsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface Props {
  workspaceId: string
  paymentData: SubscriptionPayment
}

const PaymentDetails: React.FC<Props> = ({
  workspaceId,
  paymentData: { customerName, taxId, card },
}) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [updateTaxIdDrawerOpened, setUpdateTaxIdDrawerOpened] = useState<{
    opened: boolean
  } | null>(null)

  const [updateNameDialog, setUpdateNameDialog] = useState<{
    opened: boolean
  } | null>(null)

  const { refetch: getUpdatePaymentUrl, isFetching } = useGetUpdatePaymentUrl(
    {
      workspaceId,
    },
    {
      enabled: false,
      onSuccess: ({ url }) => {
        window.location.href = url
      },
    }
  )

  const handleCloseTaxDrawer = () => {
    setUpdateTaxIdDrawerOpened({ opened: false })

    setTimeout(() => {
      setUpdateTaxIdDrawerOpened(null)
    }, 150)
  }

  const updateSubsciptionState = (args: { taxId?: string | null; customerName?: string }) => {
    const { taxId, customerName } = args

    const data = queryClient.getQueryData<SubscriptionData>(['subscription', workspaceId])
    if (!data) return

    const updatedData = produce(data, (draft) => {
      if (draft.subscription.payment) {
        if (taxId !== undefined) {
          draft.subscription.payment.taxId = taxId
        }
        if (customerName !== undefined) {
          draft.subscription.payment.customerName = customerName
        }
      }
    })

    console.log(updatedData)

    queryClient.setQueryData(['subscription', workspaceId], updatedData)
  }

  const handleUpdatedTaxId = (taxId: string | null) => {
    updateSubsciptionState({ taxId })
    handleCloseTaxDrawer()

    toast({
      variant: 'success',
      title: 'Tax id updated',
    })
  }

  const handleCloseDialog = () => {
    setUpdateNameDialog({ opened: false })

    setTimeout(() => {
      setUpdateNameDialog(null)
    }, 150)
  }

  const handleUpdatedCustomerName = (customerName: string) => {
    updateSubsciptionState({ customerName })
    handleCloseDialog()

    toast({
      variant: 'success',
      title: 'Customer name updated',
    })
  }

  return (
    <>
      {updateTaxIdDrawerOpened && (
        <UpdateTaxIdDrawer
          currentTaxId={taxId}
          workspaceId={workspaceId}
          opened={updateTaxIdDrawerOpened.opened}
          onClose={handleCloseTaxDrawer}
          onUpdated={handleUpdatedTaxId}
        />
      )}
      {updateNameDialog && (
        <UpdateCustomerNameDialog
          currentName={customerName}
          workspaceId={workspaceId}
          opened={updateNameDialog.opened}
          onClose={handleCloseDialog}
          onSuccess={handleUpdatedCustomerName}
        />
      )}
      <SubscriptionLayout
        title="Payment details"
        icon={Icons.creditCard}
        button={{
          text: 'Edit',
          Icon: Icons.penSquare,
          loading: isFetching,
          onClick: () => getUpdatePaymentUrl(),
        }}
      >
        <div className="mt-0">
          <div className="flex flex-col md:flex-row gap-2 md:gap-16 xl:gap-20">
            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Name
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="flex flex-row gap-2.5 items-center">
                <div className="text-[0.96rem]">{customerName}</div>
                <button
                  className="hover:text-primary opacity-70 hover:opacity-100 transition ease duration-200"
                  onClick={() => setUpdateNameDialog({ opened: true })}
                >
                  <Icons.pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Tax Id
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="flex flex-row gap-2.5 items-center">
                <div className="text-[0.96rem]">{taxId ?? '----'}</div>
                <button
                  className="hover:text-primary opacity-70 hover:opacity-100 transition ease duration-200"
                  onClick={() => setUpdateTaxIdDrawerOpened({ opened: true })}
                >
                  <Icons.pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Card brand
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">{card.brand}</div>
            </div>
            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Card number
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div className="text-[0.96rem]">•••{card.last4}</div>
            </div>

            <div className="flex flex-row md:flex-col gap-0.5">
              <div className="font-semibold text-[0.96rem]">
                Expiry date
                <span className="inline md:hidden">{': '}</span>
              </div>
              <div
                className={clsx(['text-[0.96rem] flex flex-row gap-2 items-center'], {
                  'text-red-600 dark:text-red-700': card.expired,
                })}
              >
                <div>
                  {card.expiration?.month}/{card.expiration?.year}
                </div>
                {card?.expired && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Icons.alertCircle className="h-4 w-4 md:-mt-[1px]" />
                      </TooltipTrigger>
                      <TooltipContent>Card expired</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </SubscriptionLayout>
    </>
  )
}

export default PaymentDetails
