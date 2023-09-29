import React, { useState } from 'react'
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Input } from '../ui/input'
import { Icons } from '../icons'
import { useDebounce, useUpdateEffect } from 'react-use'
import { Alphabet, generateKey } from '@/utils/generateKey'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Props {
  index: number
  opened: boolean
  onClose: () => void
  onConfirm: (value: string) => void
}

const alpabetItems: Alphabet[] = [
  Alphabet.Alpahumeric,
  Alphabet.Hexadecimal,
  Alphabet.Base64,
  Alphabet.Base64Url,
]

enum UUIDVersion {
  v1 = 'v1',
  // v3 = 'v3',
  v4 = 'v4',
  // v5 = 'v5',
}

// const uuidItems: UUIDVersion[] = [UUIDVersion.v1, UUIDVersion.v3, UUIDVersion.v4, UUIDVersion.v5]
const uuidItems: UUIDVersion[] = [UUIDVersion.v1, UUIDVersion.v4]

const GenerateSecretDialog: React.FC<Props> = ({ opened, onClose, onConfirm }) => {
  const [type, setType] = useState<{
    random?: {
      alphabet: Alphabet
    }
    uuid?: {
      version: 1 | 4
      // version: 1 | 3 | 4 | 5
    }
  }>({
    random: {
      alphabet: alpabetItems[0],
    },
  })

  const [length, setLength] = useState(48)
  const [secret, setSecret] = useState('')
  const [hidden, setHidden] = useState(true)
  const [copied, setCopied] = useState(false)

  useDebounce(() => handleGenerateKey(type, length), 280, [length])

  useDebounce(
    () => {
      if (copied) {
        setCopied(false)
      }
    },
    3000,
    [copied]
  )

  useUpdateEffect(() => {
    if (opened) handleGenerateKey(type, length)
  }, [opened])

  const handleGenerateKey = (
    value: {
      random?: {
        alphabet: Alphabet
      }
      uuid?: {
        version: 1 | 4
      }
    },
    length: number
  ) => {
    if (value?.random) {
      const generated = generateKey(value.random.alphabet, length) as string
      setSecret(generated)
    } else if (value?.uuid) {
      if (value.uuid.version === 1) {
        const generated = uuidv1()
        setSecret(generated)
        // } else if (value.uuid.version === 3) {
        // const generated = uuidv3('NAME', 'DOMAIN')
        // setSecret(generated)
      } else if (value.uuid.version === 4) {
        const generated = uuidv4()
        setSecret(generated)
      } else if (value.uuid.version === 5) {
        // const generated = uuidv5('', '')
        // setSecret(generated)
      }
    }
  }

  const generateHiddenString = (length: number) => {
    let hiddenString = ''

    for (let i = 0; i < length; i++) {
      hiddenString += '•'
    }

    return hiddenString
  }

  const handleTypeChange = (value: 'Random value' | 'UUID') => {
    if (value === 'Random value') {
      const newType = { random: { alphabet: alpabetItems[0] } }
      setType(newType)
      handleGenerateKey(newType, length)
    } else if (value === 'UUID') {
      setType({ uuid: { version: 1 } })
      handleGenerateKey({ uuid: { version: 1 } }, length)
    }
  }

  const handleAlphabetChange = (e: string) => {
    let newType: { random?: { alphabet: Alphabet } } = {}
    if (e === 'Alpahumeric') {
      newType = { random: { alphabet: alpabetItems[0] } }
    } else if (e === 'Hexadecimal') {
      newType = { random: { alphabet: alpabetItems[1] } }
    } else if (e === 'Base64') {
      newType = { random: { alphabet: alpabetItems[2] } }
    } else if (e === 'Base64Url') {
      newType = { random: { alphabet: alpabetItems[3] } }
    }

    setType(newType)
    handleGenerateKey(newType, length)
  }

  const handleUuidVersionChange = (e: string) => {
    let newType: { uuid?: { version: 1 | 4 } } = {}

    if (e === 'v1') {
      newType = { uuid: { version: 1 } }
    } else if (e === 'v3') {
      // newType = { uuid: { version: 3 } }
    } else if (e === 'v4') {
      newType = { uuid: { version: 4 } }
    } else if (e === 'v5') {
      // newType = { uuid: { version: 5 } }
    }

    setType(newType)
    handleGenerateKey(newType, length)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
  }

  return (
    <div>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) onClose()
        }}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Generate secret</DialogTitle>
            <DialogDescription>New secure secret for your environment</DialogDescription>
          </DialogHeader>

          <div className="mt-2 mb-4">
            <div className="flex items-center gap-3 mb-6">
              <Select
                value={type?.random ? 'Random value' : 'UUID'}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Random value" onFocus={(e) => e.stopPropagation()}>
                    Random value
                  </SelectItem>
                  <SelectItem value="UUID" onFocus={(e) => e.stopPropagation()}>
                    UUID
                  </SelectItem>
                </SelectContent>
              </Select>

              {type?.random && (
                <Select
                  value={type.random?.alphabet}
                  onValueChange={(e) => handleAlphabetChange(e)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {alpabetItems.map((item) => (
                      <SelectItem value={item} onFocus={(e) => e.stopPropagation()}>
                        {item.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {type?.uuid && (
                <Select
                  value={`v${type.uuid?.version.toString()}`}
                  onValueChange={(e) => handleUuidVersionChange(e)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {uuidItems.map((item) => (
                      <SelectItem value={item} onFocus={(e) => e.stopPropagation()}>
                        {item.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {type?.random && (
              <>
                <div className="mb-1.5 text-[0.9rem]">
                  <span>Length: {length}</span>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <span className="text-sm">1</span>
                  <div className="w-full">
                    <Slider
                      defaultValue={[48]}
                      max={256}
                      min={1}
                      step={1}
                      value={[length]}
                      onValueChange={(val) => setLength(val?.[0])}
                    />
                  </div>
                  <span className="text-sm">256</span>
                  <div className="w-32">
                    <Input
                      type="number"
                      max={256}
                      min={1}
                      value={length}
                      onChange={(e) => setLength(parseInt(e?.target?.value))}
                    />
                  </div>
                </div>
              </>
            )}
            {/**/}
            <div className="mt-8">
              {type?.uuid && (
                <div className="mb-1.5 text-[0.9rem] pl-0.5">
                  <span>Length: 36</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-full flex justify-end items-center relative">
                  <Input
                    type="text"
                    value={hidden ? generateHiddenString(length) : secret}
                    placeholder="Empty value"
                    readOnly={true}
                    className="pr-12"
                  />
                  <div className="absolute mr-1.5 w-10 flex justify-center items-center">
                    <button onClick={() => setHidden(!hidden)}>
                      {hidden ? (
                        <Icons.eye className="opacity-60 h-[1.1rem] w-[1.1rem] hover:text-primary hover:opacity-100" />
                      ) : (
                        <Icons.eyeOff className="opacity-60 h-[1.1rem] w-[1.1rem] hover:text-primary hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </div>
                <Button variant="outline" onClick={() => handleCopy()}>
                  {copied ? (
                    <Icons.check className="h-4 w-4 text-green-500 dark:text-green-600" />
                  ) : (
                    <Icons.copy className="h-4 w-4" />
                  )}
                </Button>

                <Button variant="outline" onClick={() => handleGenerateKey(type, length)}>
                  <Icons.refresh className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={() => onConfirm(secret)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GenerateSecretDialog
