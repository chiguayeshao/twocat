"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "group fixed top-4 left-1/2 -translate-x-1/2",
              "min-w-[280px] max-w-[380px]",
              "bg-[#1a1a1a] border border-discord-divider rounded-lg",
              "shadow-lg shadow-black/10",
              "data-[state=open]:animate-in",
              "data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0",
              "data-[state=open]:fade-in-0",
              "data-[state=closed]:slide-out-to-top-2",
              "data-[state=open]:slide-in-from-top-full",
              "data-[state=open]:duration-300",
              "data-[state=closed]:duration-200",
              {
                "border-emerald-800/50": props.variant === "success",
                "border-red-800/50": props.variant === "destructive",
                "border-discord-divider": props.variant === "default",
              },
              props.className
            )}
          >
            <div className="grid gap-1.5 p-3">
              {title && (
                <ToastTitle className={cn(
                  "text-xs font-medium",
                  "text-white",
                  {
                    "text-emerald-400": props.variant === "success",
                    "text-red-400": props.variant === "destructive",
                  }
                )}>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-xs text-gray-400">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="absolute right-1.5 top-1.5 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-50 group-hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </ToastClose>
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4" />
    </ToastProvider>
  )
}
