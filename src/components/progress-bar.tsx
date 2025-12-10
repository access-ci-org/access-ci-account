import { useRouterState } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  Stepper,
  StepperItem,
  StepperNav,
  StepperTrigger,
  StepperSeparator,
  StepperIndicator,
  StepperTitle,
} from "@/components/ui/stepper";

const registrationSteps = [
  { title: "Verify Email", path: "/register" },
  { title: "Required Registration Information", path: "/register/complete" },
  { title: "Agree to Acceptable Use Policy", path: "/register/aup" }, // future AUP step
  { title: "Your ACCESS ID", path: "/register/success" }, // future success step
];

function getStepIndex(path: string): number {
  if (path === "/register" || path === "/register/verify") return 0;
  if (path === "/register/complete") return 1;
  if (path === "/register/aup") return 2;
  if (path === "/register/success") return 3;
  return 0; // default
}

export default function ProgressBar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const currentIndex = getStepIndex(currentPath);

  return (
    <Card className="w-full max-w-lg my-5 shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <Stepper
          value={currentIndex + 1}
          orientation="vertical"
          className="flex flex-col items-start gap-4"
        >
          <StepperNav>
            {registrationSteps.map((step, index) => {
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <StepperItem
                  key={index}
                  step={index + 1}
                  className="relative items-start"
                >
                  <StepperTrigger className="items-start pb-12 last:pb-0 gap-2.5">
                    <StepperIndicator
                      className={`
                        border-2 rounded-full w-6 h-6 flex items-center justify-center 
                        ${isCompleted || isActive ? "border-[var(--teal-700)]" : "border-[var(--teal-700)]/40"}
                      `}
                    >
                      {/* COMPLETED: full fill */}
                      {isCompleted && (
                        <div
                          className="absolute inset-0 rounded-full bg-[var(--teal-700)]"
                        />
                      )}

                      {/* ACTIVE: pulsing dot */}
                      {isActive && !isCompleted && (
                        <div
                          className="rounded-full bg-[var(--teal-700)] w-2 h-2"
                        />
                      )}
                    </StepperIndicator>  

                    <StepperTitle
                      className={`
                        font-medium text-left text-md
                        ${isActive ? "text-[var(--teal-700)] font-bold" : "text-[var(--teal-700)]"}
                      `}
                    >
                      {step.title}
                    </StepperTitle>
                  </StepperTrigger>

                  {index < registrationSteps.length - 1 && (
                    <StepperSeparator
                      className={`
                        absolute inset-y-0 top-6 left-3 -order-1 m-0 -translate-x-1/2
                        ${isCompleted ? "bg-[var(--teal-700)]" : "bg-[var(--teal-700)]/40"}
                      `}
                    />
                  )}
                </StepperItem>
              );
            })}
          </StepperNav>
        </Stepper>
      </CardContent>
    </Card>
  );
}
