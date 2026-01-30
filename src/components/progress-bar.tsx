import * as React from "react"
import { useRouterState } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import {
  Stepper,
  StepperItem,
  StepperNav,
  StepperTrigger,
  StepperSeparator,
  StepperIndicator,
  StepperTitle,
} from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

const registrationSteps = [
  { title: "Verify Email", path: "/register" },
  { title: "Required Registration Information", path: "/register/complete" },
  { title: "Agree to Acceptable Use Policy", path: "/register/aup" },
  { title: "Your ACCESS ID", path: "/register/success" },
]

function getStepIndex(path: string): number {
  if (path === "/register" || path === "/register/verify") return 0
  if (path === "/register/complete") return 1
  if (path === "/register/aup") return 2
  if (path === "/register/success") return 3
  return 0
}

export default function ProgressBar() {
  const router = useRouterState()
  const currentPath = router.location.pathname
  const currentIndex = getStepIndex(currentPath)

  return (
    <Card className="w-full max-w-[280px] shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <Stepper value={currentIndex + 1} orientation="vertical" className="w-full">
          <StepperNav className="w-full items-start">
            {registrationSteps.map((step, index) => {
              const isActive = index === currentIndex
              const isCompleted = index < currentIndex

              return (
                <React.Fragment key={step.path}>
                  <StepperItem step={index + 1} className="items-start justify-start">
                    <StepperTrigger className="w-full items-start justify-start gap-3 py-0.5">
                      <StepperIndicator
                        className={cn(
                          "border-2",
                          isCompleted || isActive
                            ? "border-[var(--teal-700)]"
                            : "border-[var(--teal-700)]/40"
                        )}
                      >
                        {isCompleted && (
                          <div className="absolute inset-0 rounded-full bg-[var(--teal-700)]" />
                        )}

                        {isActive && !isCompleted && (
                          <div className="h-2 w-2 rounded-full bg-[var(--teal-700)]" />
                        )}
                      </StepperIndicator>

                      <StepperTitle
                        className={cn(
                          "text-left text-sm leading-snug",
                          isActive ? "text-[var(--teal-700)] font-semibold" : "text-[var(--teal-700)]"
                        )}
                      >
                        {step.title}
                      </StepperTitle>
                    </StepperTrigger>
                  </StepperItem>

                  {index < registrationSteps.length - 1 && (
                    <StepperSeparator
                      className={cn(
                        isCompleted ? "bg-[var(--teal-700)]" : "bg-[var(--teal-700)]/40",
                        // centers the line under the 24px indicator
                        "ml-[12px] -translate-x-1/2 -mt-[1px] -mb-[1px]"
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </StepperNav>
        </Stepper>
      </CardContent>
    </Card>
  )
}
