'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { AlertCircle, CheckCircleIcon } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-center gap-4">
              {variant && variant === 'success' && (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              )}
              {variant && variant === 'destructive' && (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action && action}
            <ToastClose />
          </Toast>
        )

        // return (
        //
        //   <Toast key={id} {...props}>
        //     <div className="grid gap-1">
        //       {title && <ToastTitle>{title}</ToastTitle>}
        //       {description && <ToastDescription>{description}</ToastDescription>}
        //     </div>
        //     {action}
        //     <ToastClose />
        //   </Toast>
        // )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
