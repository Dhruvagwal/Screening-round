import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Form Field Component with integrated error handling
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          id={fieldId}
          ref={ref}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {error && <FormError id={`${fieldId}-error`} message={error.message} />}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// Form Error Component
interface FormErrorProps {
  id?: string;
  message?: string;
}

export function FormError({ id, message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

// Global Error Display Component
interface GlobalErrorProps {
  error?: string | null;
  className?: string;
}

export function GlobalError({ error, className }: GlobalErrorProps) {
  if (!error) return null;

  return (
    <div
      className={cn(
        "p-3 bg-destructive/10 border border-destructive rounded-md",
        className
      )}
    >
      <FormError message={error} />
    </div>
  );
}

// Success Message Component
interface SuccessMessageProps {
  message?: string | null;
  className?: string;
}

export function SuccessMessage({ message, className }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "p-3 bg-green-50 border border-green-200 rounded-md",
        className
      )}
    >
      <p className="text-sm text-green-600" role="status">
        {message}
      </p>
    </div>
  );
}

// Form Divider Component
interface FormDividerProps {
  text?: string;
  className?: string;
}

export function FormDivider({ text = "Or", className }: FormDividerProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}

// Google OAuth Button Component
interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
  variant?: "signin" | "signup";
  className?: string;
}

export function GoogleButton({
  onClick,
  disabled = false,
  text,
  variant = "signin",
  className,
}: GoogleButtonProps) {
  const defaultText =
    variant === "signin" ? "Sign in with Google" : "Continue with Google";

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      <GoogleIcon className="mr-2 h-4 w-4" />
      {text || defaultText}
    </Button>
  );
}

// Google Icon SVG Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/google-icon.webp"
      alt="Google Icon"
      width={16}
      height={16}
      className={className}
    />
  );
}

// Form Container Component
interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function FormContainer({
  children,
  onSubmit,
  className,
}: FormContainerProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      {children}
    </form>
  );
}

// Submit Button Component
interface SubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export function SubmitButton({
  isLoading = false,
  disabled = false,
  loadingText = "Loading...",
  children,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        "w-full bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      disabled={isLoading || disabled}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
}
