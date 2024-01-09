import { Icons } from './icons'

interface Props {
  type: 'card' | 'users'
  onClick: () => void
}

const ActionRequiredBadge: React.FC<Props> = ({ type, onClick: open }) => {
  return (
    <>
      <button className="mt-4 md:mt-3 text-sm w-full" onClick={open}>
        <div className="flex flex-row items-center gap-2 rounded-md px-3 lg:px-4 py-1.5  bg-red-600/90 dark:bg-red-800/50 text-white dark:text-gray-200">
          {/* <div className="">{type === 'card' ? 'Credit card expired' : 'Action required'}</div> */}
          <div className="">
            <Icons.alertCircle className="h-4 w-4" />
          </div>
          <div className="">{type === 'card' ? 'Credit card expired' : 'User limit exceeded'}</div>
        </div>
      </button>
    </>
  )
}

export default ActionRequiredBadge
