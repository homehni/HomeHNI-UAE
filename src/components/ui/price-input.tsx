import * as React from "react"
import { cn } from "@/lib/utils"
import { formatExactPriceDisplay } from "@/utils/priceFormatter"

export interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number | string
  onChange?: (value: number | undefined) => void
  showFormatted?: boolean
}

const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  ({ className, value, onChange, showFormatted = true, onKeyDown: userOnKeyDown, onPaste: userOnPaste, ...props }, ref) => {
    const displayValue = typeof value === 'number' ? value.toString() : value || ''
    const formattedPrice = showFormatted ? formatExactPriceDisplay(value || 0) : ''

    const blockInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
        e.preventDefault()
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text')
      const digits = text.replace(/[^0-9]/g, '')
      if (digits !== text) {
        e.preventDefault()
        const numericValue = digits ? Math.max(1, parseInt(digits)) : undefined
        onChange?.(numericValue)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^0-9]/g, '')
      const numericValue = inputValue ? Math.max(1, parseInt(inputValue)) : undefined
      onChange?.(numericValue)
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">₹</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-8 pr-16",
            className
          )}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={(e) => { blockInvalidChars(e); userOnKeyDown?.(e); }}
          onPaste={(e) => { handlePaste(e); userOnPaste?.(e); }}
          ref={ref}
          {...props}
        />
        {showFormatted && formattedPrice && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-medium">
            {formattedPrice.replace('₹ ', '')}
          </div>
        )}
      </div>
    )
  }
)
PriceInput.displayName = "PriceInput"

export { PriceInput }