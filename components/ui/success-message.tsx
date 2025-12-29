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
        "bg-success/10 border border-success rounded-md p-4 flex gap-3",
        className
      )}
      role="alert"
    >
      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-success">{title}</h3>
        <p className="text-sm text-success/80 mt-1">{message}</p>
      </div>
    </div>
  )
}

