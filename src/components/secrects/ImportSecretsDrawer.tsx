'use client'

import React, { ChangeEvent, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useUpdateEffect } from 'react-use'
import Drawer from '../Drawer'

interface Props {
  opened: boolean
  onClose: () => void
  onConfirm: (secrets: Array<{ key: string; value: string }>) => void
}

const ImportSecretsDrawer: React.FC<Props> = ({ opened, onClose, onConfirm }) => {
  const [value, setValue] = useState('')

  useUpdateEffect(() => {
    if (value !== '' && opened) setValue('')
  }, [opened])

  const handleConfirm = (value: string) => {
    const lines = value.trim().split('\n')

    const envArray = []

    for (const line of lines) {
      if (!line.startsWith('#') && line?.trim() !== '') {
        const [key, value] = line.split('=')
        // envArray.push({ key, value: value || '' }) // Use an empty string if there's no value

        const formattedKey = key
          .replace(/[^a-zA-Z0-9 ]/g, '_')
          .replace(/ /g, '_')
          .toUpperCase()

        envArray.push({ key: formattedKey, value: value || '' }) // Use an empty string if there's no value
      }
    }

    onConfirm(envArray)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      console.log(selectedFile)

      const reader = new FileReader()

      reader.readAsText(selectedFile)

      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setValue(e.target?.result as string)
        }
      }
    }
  }

  return (
    <>
      <Drawer
        opened={opened}
        className="w-screen sm:w-[500px] md:w-[650px] lg:w-[940px] h-full md:px-8 md:py-4 py-3 px-4"
        title="Import secrets"
        description="Paste secrets in .env format"
        onClose={() => {
          onClose()
        }}
      >
        <div className="-mt-3">
          <div className="mb-3 flex flex-col md:flex-row items-center justify-end gap-2 md:gap-4">
            <Input
              id="file"
              type="file"
              // accept="text/plain, .env, .json"
              accept="text/plain, .env"
              className="w-full md:w-[40%]"
              onChange={handleFileChange}
            />
            <Button
              className="w-full md:w-fit gap-2"
              disabled={value.trim().length === 0}
              onClick={() => handleConfirm(value)}
            >
              Confirm import
            </Button>
          </div>
          <Textarea
            placeholder="MY_SECRET=MY_SECRET_VALUE"
            className="h-[70vh] resize-none text-[0.95rem]"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </Drawer>
    </>
  )
}

export default ImportSecretsDrawer
