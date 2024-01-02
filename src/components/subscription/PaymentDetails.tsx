import { Icons } from '../icons'
import SubscriptionLayout from './SubscriptionLayout'

const PaymentDetails = () => {
  return (
    <SubscriptionLayout
      title="Payment details"
      icon={Icons.creditCard}
      button={{ text: 'Edit', Icon: Icons.penSquare, onClick: () => {} }}
    >
      <div className="mt-0">
        <div className="flex flex-col md:flex-row gap-2 md:gap-16 xl:gap-20">
          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Name
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">Radim Hofer</div>
          </div>

          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Tax Id
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">Tax id 123</div>
          </div>

          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Card brand
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">Visa</div>
          </div>
          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Card number
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">123</div>
          </div>

          <div className="flex flex-row md:flex-col gap-0.5">
            <div className="font-semibold text-[0.96rem]">
              Expiry date
              <span className="inline md:hidden">{': '}</span>
            </div>
            <div className="text-[0.96rem]">2025-01-01</div>
          </div>
        </div>
      </div>
    </SubscriptionLayout>
  )
}

export default PaymentDetails
