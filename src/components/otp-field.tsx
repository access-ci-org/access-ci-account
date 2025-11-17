import * as React from "react"
import { useFieldContext } from "@/hooks/form-context"
import { FieldLabel, FieldError } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"

export default function OTPField({
  label,
  length = 6,
  placeholder,
}: {
  name: string
  label?: React.ReactNode
  length?: number
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const [otpValue, setOtpValue] = React.useState(field.state.value ?? "")

  // keep in sync with form
  React.useEffect(() => {
    field.setValue(otpValue)
  }, [otpValue])

  // update digits only
  const handleChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, length)
    setOtpValue(cleaned)
  }

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const form = e.currentTarget.form
    if (!form) return

    if (/^[0-9]$/.test(e.key)) {
      const next = form.querySelector<HTMLInputElement>(
        `input[data-otp-index="${index + 1}"]`
      )
      next?.focus()
    } else if (e.key === "Backspace") {
      const prev = form.querySelector<HTMLInputElement>(
        `input[data-otp-index="${index - 1}"]`
      )
      prev?.focus()
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {label && (
        <FieldLabel className={`mb-3 ${isInvalid ? "text-red-600" : ""}`}>
          {label}
        </FieldLabel>
      )}

      <InputOTP
        maxLength={length}
        value={otpValue}
        onChange={handleChange}
        aria-invalid={isInvalid}
        containerClassName="w-full flex justify-center overflow-hidden"
      >
        <InputOTPGroup
          className = "w-full flex justify-center"
        >
            {Array.from({ length }).map((_, i) => (
                <React.Fragment key={i}>
                    <InputOTPSlot 
                        index={i} 
                        className="relative h-12 w-12 text-lg border border-gray-300 rounded-md flex items-center justify-center bg-white shadow-xs data-[active=true]:border-blue-500 data-[active=true]:ring-2 data-[active=true]:ring-blue-100"
                    >
                        <input
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otpValue[i] ?? ""}
                        data-otp-index={i}
                        onKeyUp={(e) => handleKeyUp(e, i)}
                        onChange={(e) => {
                            const val = e.target.value
                            const chars = otpValue.split("")
                            if (/^[0-9]$/.test(val)) {
                            chars[i] = val
                            handleChange(chars.join(""))
                            } else if (val === "") {
                            chars[i] = ""
                            handleChange(chars.join(""))
                            }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </InputOTPSlot>

                    {(i + 1) % 3 === 0 && i !== length - 1 && (
                        <InputOTPSeparator className="mx-1.5 text-gray-300" />
                    )}
                </React.Fragment>
            ))}
            </InputOTPGroup>
      </InputOTP>

      {placeholder && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {placeholder}
        </p>
      )}

      {isInvalid && (
        <FieldError
          errors={field.state.meta.errors}
          className="mt-3 text-red-600"
        />
      )}
    </div>
  )
}
