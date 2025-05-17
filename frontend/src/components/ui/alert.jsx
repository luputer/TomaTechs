import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"

const alertVariants = cva(
    "fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 z-50",
    {
        variants: {
            variant: {
                success: "bg-green-500 text-white",
                error: "bg-red-500 text-white",
            }
        },
        defaultVariants: {
            variant: "success"
        }
    }
)

const Alert = React.forwardRef(({ className, variant, message, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        >
            {variant === 'success' ? (
                <CheckCircle className="h-5 w-5" />
            ) : (
                <XCircle className="h-5 w-5" />
            )}
            {message}
        </div>
    )
})

Alert.displayName = "Alert"

export { Alert, alertVariants } 