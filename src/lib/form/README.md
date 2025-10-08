# Form Utilities Documentation

A comprehensive set of reusable form components and utilities for consistent form handling across the application.

## Components

### FormField
A complete form field component with integrated label, input, and error handling.

```tsx
<FormField
  label="Email"
  type="email"
  placeholder="Enter your email"
  disabled={isLoading}
  error={formState.errors.email}
  helperText="We'll never share your email"
  {...register("email")}
/>
```

**Props:**
- `label` (string): Field label text
- `error` (FieldError): React Hook Form error object
- `helperText` (string): Optional helper text shown when no error
- All standard HTML input props supported

### GlobalError
Displays global form errors in a styled container.

```tsx
<GlobalError error={loginState.error} />
```

### SuccessMessage
Displays success messages in a styled container.

```tsx
<SuccessMessage message="Account created successfully!" />
```

### FormDivider
A styled divider with text, commonly used between form sections.

```tsx
<FormDivider text="Or continue with" />
```

### GoogleButton
Pre-styled Google OAuth button with integrated Google icon.

```tsx
<GoogleButton
  onClick={onGoogleSignIn}
  disabled={isLoading}
  variant="signin" // or "signup"
  text="Custom text" // optional
/>
```

### FormContainer
A wrapper component for forms with proper spacing and structure.

```tsx
<FormContainer onSubmit={handleSubmit(onSubmit)}>
  {/* Form fields here */}
</FormContainer>
```

### SubmitButton
A styled submit button with loading state support.

```tsx
<SubmitButton
  isLoading={isLoading}
  disabled={!formState.isValid}
  loadingText="Signing in..."
>
  Sign In
</SubmitButton>
```

## Usage Examples

### Complete Login Form
```tsx
import {
  FormField,
  GlobalError,
  FormDivider,
  GoogleButton,
  FormContainer,
  SubmitButton,
} from "@/lib/form";

export function LoginForm() {
  const { register, handleSubmit, formState, loginState, onSubmit, onGoogleSignIn } = useLogin();

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <GlobalError error={loginState.error} />
      
      <FormField
        label="Email"
        type="email"
        error={formState.errors.email}
        {...register("email")}
      />
      
      <FormField
        label="Password"
        type="password"
        error={formState.errors.password}
        {...register("password")}
      />
      
      <SubmitButton isLoading={loginState.isLoading}>
        Sign In
      </SubmitButton>
      
      <FormDivider text="Or continue with" />
      
      <GoogleButton onClick={onGoogleSignIn} />
    </FormContainer>
  );
}
```

## Features

- **Consistent Styling**: All components follow the design system
- **Accessibility**: Proper ARIA labels, error announcements, and keyboard navigation
- **Type Safety**: Full TypeScript support with proper interfaces
- **React Hook Form Integration**: Seamless integration with form validation
- **Error Handling**: Comprehensive error display and management
- **Loading States**: Built-in loading state handling
- **Responsive Design**: Mobile-first responsive components

## Benefits

1. **Reduced Code Duplication**: Reusable components across all forms
2. **Consistent UX**: Standardized form behavior and styling
3. **Maintainability**: Centralized form logic and styling
4. **Accessibility**: Built-in accessibility best practices
5. **Type Safety**: Full TypeScript support prevents runtime errors
6. **Performance**: Optimized components with proper React patterns