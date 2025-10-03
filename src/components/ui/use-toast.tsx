// components/ui/use-toast.ts
"use client"

import * as React from "react"

type ToastT = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
  open?: boolean
}

type ToasterToast = ToastT

type ToastActionElement = React.ReactElement

const TOAST_REMOVE_DELAY = 1000

const listeners: Array<(toast: ToasterToast) => void> = []
const toasts = new Map<string, ToasterToast>()

function dispatch(toast: ToasterToast) {
  toasts.set(toast.id, toast)
  listeners.forEach((l) => l(toast))
}

export function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>([])

  React.useEffect(() => {
    const listener = (toast: ToasterToast) => {
      setState(Array.from(toasts.values()))
      if (toast.open === false) {
        setTimeout(() => {
          toasts.delete(toast.id)
          setState(Array.from(toasts.values()))
        }, TOAST_REMOVE_DELAY)
      }
    }
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  }, [])

  return {
    toasts: state,
    toast: (props: Omit<ToastT, "id" | "open">) => {
      const id = Math.random().toString(36).slice(2)
      dispatch({ id, open: true, ...props })
      return {
        id,
        dismiss: () => dispatch({ id, open: false }),
      }
    },
    dismiss: (id?: string) => {
      if (id) dispatch({ id, open: false })
      else toasts.forEach((t) => dispatch({ id: t.id, open: false }))
    },
  }
}

export type { ToasterToast, ToastActionElement }
