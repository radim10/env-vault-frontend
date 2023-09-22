import TypographyH2 from '@/components/typography/TypographyH2'

// TODO: load project SSR?

export default function ProjectPage({ params }: { params: { projectName: string } }) {
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <TypographyH2>Projects</TypographyH2>
        </div>
      </div>
    </>
  )
}
