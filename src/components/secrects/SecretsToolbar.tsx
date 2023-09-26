import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { useEditedSecretsStore } from '@/stores/secrets'

interface Props {
  secretsCount: number
}

const SecretsToolbar: React.FC<Props> = ({ secretsCount }) => {
  const { secrets, search, setSearch, toggleVisibilityAll, toggleDescriptionAll } =
    useEditedSecretsStore((state) => {
      return {
        secrets: state.secrets,
        search: state.search,
        setSearch: state.setSearch,
        toggleVisibilityAll: state.toggleVisibilityAll,
        toggleDescriptionAll: state.toggleDescriptionAll,
      }
    })
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div className="pl-1 dark:text-gray-400 font-bold">
          <span>Active count: {secretsCount}</span>
        </div>
        {/* */}
        <div className="flex gap-3 items-center mt-3 md:mt-0">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {secrets
                    ?.filter(
                      (val) =>
                        val?.description || (val?.newDescription && val?.newDescription?.length > 0)
                    )
                    .every((val) => val?.showDescription === true) ? (
                    <Button variant={'outline'} onClick={() => toggleDescriptionAll(true)}>
                      <Icons.fileX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant={'outline'} onClick={() => toggleDescriptionAll(false)}>
                      <Icons.fileText className="h-4 w-4" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {secrets
                    ?.filter(
                      (val) =>
                        val?.description || (val?.newDescription && val?.newDescription?.length > 0)
                    )
                    .every((val) => val?.showDescription === true) ? (
                    <p>Hide all descriptions</p>
                  ) : (
                    <p>Show all descriptions</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {!secrets?.every((val) => val?.hidden === false) && (
                    <Button variant="outline" onClick={() => toggleVisibilityAll(false)}>
                      <Icons.eye className="h-4 w-4" />
                    </Button>
                  )}

                  {secrets?.every((val) => val?.hidden === false) && (
                    <Button variant="outline" onClick={() => toggleVisibilityAll(true)}>
                      <Icons.eyeOff className="h-4 w-4" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {!secrets?.every((val) => val?.hidden === false) ? (
                    <p>Reveal all secrets</p>
                  ) : (
                    <p>Hide all secrets</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="relative md:w-[20rem]">
            <Icons.search className="h-4 w-4 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" />
            {search?.length > 0 && (
              <button
                className="absolute top-1/2 transform -translate-y-1/2 right-4 opacity-60 hover:opacity-100"
                onClick={() => setSearch('')}
              >
                <Icons.x className="h-4 w-4" />
              </button>
            )}

            <Input
              placeholder="Search secrets"
              className="pl-10 pr-10 -mr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecretsToolbar
