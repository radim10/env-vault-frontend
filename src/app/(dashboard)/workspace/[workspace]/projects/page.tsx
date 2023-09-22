import { Icons } from '@/components/icons'
import TypographyH2 from '@/components/typography/TypographyH2'
import TypographyH3 from '@/components/typography/TypographyH3'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageProps } from '../../../../../../.next/types/app/layout'
import ProjectList from '@/components/projects/ProjectList'

export default function Home({ params }: PageProps) {
  return (
    <div>
      {/* {Object.entries(params).map(([key, value]: any) => ( */}
      {/*   <TypographyH3 key={key}> */}
      {/*     {key}: {value} */}
      {/*   </TypographyH3> */}
      {/* ))} */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <TypographyH2>Projects</TypographyH2>
          <Button size={'icon'}>
            <Icons.plus />
          </Button>
        </div>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Updated">Updated</SelectItem>
            <SelectItem value="Created">Created</SelectItem>
            <SelectItem value="Name">Name</SelectItem>
            <SelectItem value="Folders">No of folders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-16">
        <ProjectList workspace={params?.workspace} />
      </div>
    </div>
  )
}
