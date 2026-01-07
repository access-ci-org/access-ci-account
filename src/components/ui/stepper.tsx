'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Types
type StepperOrientation = 'horizontal' | 'vertical';
type StepState = 'active' | 'completed' | 'inactive' | 'loading';


interface StepperContextValue {
  activeStep: number;
  stepsCount: number;
  orientation: StepperOrientation;
}

interface StepItemContextValue {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
}

const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('useStepper must be used within a Stepper');
  return ctx;
}

function useStepItem() {
  const ctx = useContext(StepItemContext);
  if (!ctx) throw new Error('useStepItem must be used within a StepperItem');
  return ctx;
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: StepperOrientation;
}

function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: StepperProps) {
  const [activeStep] = React.useState(defaultValue);

  const currentStep = value ?? activeStep;


  // Context value
  const contextValue = React.useMemo<StepperContextValue>(
    () => ({
      activeStep: currentStep,
      stepsCount: React.Children.count(children),
      orientation,
    }),
    [currentStep, children, orientation],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        role="tablist"
        aria-orientation={orientation}
        data-slot="stepper"
        className={cn('w-full', className)}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  const state: StepState = completed || step < activeStep ? 'completed' : activeStep === step ? 'active' : 'inactive';

  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
      <div
        data-slot="stepper-item"
        className={cn(
          "group/step flex items-center justify-center",
          "group-data-[orientation=horizontal]/stepper-nav:flex-row",
          "group-data-[orientation=vertical]/stepper-nav:flex-col",
          "group-data-[orientation=horizontal]/stepper-nav:not-last:flex-1",
          className,
        )}
        data-state={state}
        {...(isLoading ? { 'data-loading': true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function StepperTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state, isLoading } = useStepItem();

  return (
    <div
      data-slot="stepper-trigger"
      data-state={state}
      data-loading={isLoading}
      className={cn(
        'flex items-start gap-2.5 select-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function StepperIndicator({ children, className }: React.ComponentProps<'div'>) {
  const { state } = useStepItem();

  return (
    <div
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        'relative flex items-center justify-center size-6 shrink-0 rounded-full',
        className,
      )}
    >
      {children}
    </div>
  );
}

function StepperSeparator({ className }: React.ComponentProps<'div'>) {
  //const { state } = useStepItem();

  return (
    <div
      data-slot="stepper-separator"
      //data-state={state}
      className={cn(
        'bg-muted group-data-[orientation=vertical]/stepper-nav:h-4 group-data-[orientation=vertical]/stepper-nav:w-0.5 group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1',
        className,
      )}
    />
  );
}

function StepperTitle({ children, className }: React.ComponentProps<'h3'>) {
  const { state } = useStepItem();

  return (
    <h3 data-slot="stepper-title" data-state={state} className={cn('text-sm font-medium leading-none', className)}>
      {children}
    </h3>
  );
}

function StepperDescription({ children, className }: React.ComponentProps<'div'>) {
  const { state } = useStepItem();

  return (
    <div data-slot="stepper-description" data-state={state} className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </div>
  );
}

function StepperNav({ children, className }: React.ComponentProps<'nav'>) {
  const { activeStep, orientation } = useStepper();

  return (
    <nav
      data-slot="stepper-nav"
      data-state={activeStep}
      data-orientation={orientation}
      className={cn(
        'group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
        className,
      )}
    >
      {children}
    </nav>
  );
}

function StepperPanel({ children, className }: React.ComponentProps<'div'>) {
  const { activeStep } = useStepper();

  return (
    <div data-slot="stepper-panel" data-state={activeStep} className={cn('w-full', className)}>
      {children}
    </div>
  );
}

interface StepperContentProps extends React.ComponentProps<'div'> {
  value: number;
  forceMount?: boolean;
}

function StepperContent({ value, forceMount, children, className }: StepperContentProps) {
  const { activeStep } = useStepper();
  const isActive = value === activeStep;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <div
      data-slot="stepper-content"
      data-state={activeStep}
      className={cn('w-full', className, !isActive && forceMount && 'hidden')}
      hidden={!isActive && forceMount}
    >
      {children}
    </div>
  );
}

export {
  useStepper,
  useStepItem,
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperPanel,
  StepperContent,
  StepperNav,
  type StepperProps,
  type StepperItemProps,
  type StepperTriggerProps,
  type StepperContentProps,
};
