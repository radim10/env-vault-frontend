export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-8 h-8 rounded-full animate-spin border-4 border border-solid border-primary border-t-transparent"></div>
    </div>
  )
}
