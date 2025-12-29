import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessMessageProps {
  message: string
  title?: string
  className?: string
}

export function SuccessMessage({ message, title = "Success", className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        "bg-green-500/10 border border-green-500 rounded-md p-4 flex gap-3",
        className
      )}
      role="alert"
    >
      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-green-700 dark:text-green-300">{title}</h3>
        <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">{message}</p>
      </div>
    </div>
  )
}

