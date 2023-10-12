import { Metadata, ResolvingMetadata } from 'next'

export function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Metadata {
  const tab = params.tab

  return {
    title: `Settings / ${tab}`,
  }
}

export default function Settings({ params }: { params: { workspace: string; tab: string } }) {
  return <></>
}
