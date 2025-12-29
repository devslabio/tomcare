import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  title?: string
  className?: string
}

export function ErrorMessage({ message, title = "Error", className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3",
        className
      )}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-destructive">{title}</h3>
        <p className="text-sm text-destructive/80 mt-1">{message}</p>
      </div>
    </div>
  )
}

