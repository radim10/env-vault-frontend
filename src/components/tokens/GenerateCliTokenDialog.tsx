import React, { useState } from 'react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useCreateCliToken } from '@/api/mutations/tokens/cli'
import { Input } from '../ui/input'
import { useUpdateEffect } from 'react-use'
import { cliTokensErrorMsgFromCode } from '@/api/requests/tokens/cli'
import { CliToken } from '@/types/tokens/cli'
import DialogComponent from '../Dialog'

interface Props {
  opened: boolean
  workspaceId: string

  onClose: () => void
  onSuccess: (data: CliToken) => void
}

const CreateCliTokenDialog: React.FC<Props> = ({ workspaceId, opened, onClose, onSuccess }) => {
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')

  const {
    data: tokenData,
    mutate: createToken,
    isLoading,
    error,
    reset,
  } = useCreateCliToken({
    onSuccess: (data) =>
      onSuccess({
        id: data?.id,
        lastUsedAt: null,
        createdAt: new Date().toString(),
        last5: data?.token?.slice(-5),
        name,
      }),
  })

  useUpdateEffect(() => {
    if (opened && name !== '') setName('')
    if (opened && copied) setCopied(false)
  }, [opened])

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  const handleClose = () => {
    if (isLoading) return
    onClose()
  }

  return (
    <div>
      <DialogComponent
        title="Generate cli token"
        opened={opened}
        onClose={handleClose}
        error={error ? cliTokensErrorMsgFromCode(error?.code) : undefined}
        description={
          !tokenData
            ? 'With cli token you can run commands on behalf of tou account against your workspace from the cli.'
            : undefined
        }
        descriptionComponent={
          tokenData && (
            <div className="text-red-600 dark:text-red-700">
              Please copy this token and store it safely, due to security reasons you will not be
              able to see it again.
            </div>
          )
        }
        loading={isLoading}
        submit={
          !tokenData
            ? {
                wFull: true,
                text: !isLoading ? 'Generate' : 'Generating...',
                disabled: isLoading || name?.trim().length === 0 || tokenData !== undefined,
              }
            : undefined
        }
        onSubmit={() => createToken({ workspaceId, name })}
      >
        {!tokenData && (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Token name"
            disabled={isLoading}
            className="mt-0"
          />
        )}
        {tokenData && (
          <div className="mt-0 -mb-5 flex flex-col gap-2">
            <div className="text-green-600 text-[0.93rem]">Token successfully created</div>
            <div className="flex items-center gap-2">
              <Input autoFocus={false} readOnly value={tokenData?.token} />

              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(tokenData?.token)
                  setCopied(true)
                }}
              >
                {copied ? (
                  <Icons.check className="h-4 w-4 text-green-600 dark:text-green-600" />
                ) : (
                  <Icons.copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogComponent>

      {/* <Dialog */}
      {/*   open={opened} */}
      {/*   onOpenChange={(e) => { */}
      {/*     if (!e) handleClose() */}
      {/*   }} */}
      {/* > */}
      {/*   <DialogContent className="sm:max-w-[425px]"> */}
      {/*     <DialogHeader> */}
      {/*       <DialogTitle>Generate new token</DialogTitle> */}
      {/*       {/* <DialogDescription> */}
      {/*       {/*   With cli token you can run commands against your workspace from the cli. */}
      {/*       {/* </DialogDescription> */}
      {/**/}
      {/*       <DialogDescription> */}
      {/*         <div> */}
      {/*           Please copy this token, you will <b>not be able</b> to see it again. */}
      {/*         </div> */}
      {/*       </DialogDescription> */}
      {/*     </DialogHeader> */}
      {/**/}
      {/*     {!tokenData && ( */}
      {/*       <Input */}
      {/*         value={name} */}
      {/*         onChange={(e) => setName(e.target.value)} */}
      {/*         placeholder="Token name" */}
      {/*         disabled={isLoading} */}
      {/*         className="mt-0" */}
      {/*       /> */}
      {/*     )} */}
      {/**/}
      {/*     {tokenData && ( */}
      {/*       <div className="mt-0 mb-0 flex flex-col gap-2"> */}
      {/*         <div className="text-green-600 text-[0.93rem]">Token successfully created</div> */}
      {/*         <div className="flex items-center gap-2"> */}
      {/*           <Input autoFocus={false} readOnly value={tokenData?.token} /> */}
      {/**/}
      {/*           <Button */}
      {/*             variant="outline" */}
      {/*             onClick={() => { */}
      {/*               navigator.clipboard.writeText(tokenData?.token) */}
      {/*               setCopied(true) */}
      {/*             }} */}
      {/*           > */}
      {/*             {copied ? ( */}
      {/*               <Icons.check className="h-4 w-4 text-green-600 dark:text-green-600" /> */}
      {/*             ) : ( */}
      {/*               <Icons.copy className="h-4 w-4" /> */}
      {/*             )} */}
      {/*           </Button> */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     )} */}
      {/**/}
      {/*     {error && ( */}
      {/*       <div className="flex flex-col gap-4 mt-3 pb-1"> */}
      {/*         <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0"> */}
      {/*           <Icons.xCircle className="h-4 w-4" /> */}
      {/*           {cliTokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'} */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     )} */}
      {/*     {!tokenData && ( */}
      {/*       <DialogFooter className="mt-2"> */}
      {/*         <Button */}
      {/*           type="submit" */}
      {/*           variant="default" */}
      {/*           className="w-full gap-2" */}
      {/*           loading={isLoading} */}
      {/*           disabled={isLoading || name?.trim().length === 0 || tokenData !== undefined} */}
      {/*           onClick={() => { */}
      {/*             createToken({ workspaceId, name }) */}
      {/*           }} */}
      {/*         > */}
      {/*           <span>Generate</span> */}
      {/*         </Button> */}
      {/*       </DialogFooter> */}
      {/*     )} */}
      {/*   </DialogContent> */}
      {/* </Dialog> */}
    </div>
  )
}

export default CreateCliTokenDialog
