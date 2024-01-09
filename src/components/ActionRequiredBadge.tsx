import { Icons } from './icons'

interface Props {
  onClick: () => void
}

const ActionRequiredBadge: React.FC<Props> = ({ onClick: open }) => {
  return (
    <>
      <button className="mt-4 md:mt-3 text-sm w-full" onClick={open}>
        <div className="flex flex-row items-center gap-2 rounded-md px-3 lg:px-4 py-1.5  bg-red-600/90 dark:bg-red-800/50 text-white dark:text-gray-200">
          <div className="">Action required</div>
          <div className="">
            <Icons.alertCircle className="h-4 w-4" />
          </div>
        </div>
      </button>
    </>
  )
}

export default ActionRequiredBadge
