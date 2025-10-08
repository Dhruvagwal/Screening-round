import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authData } from "@/data/auth";
import { useSignup } from "../useSignup";
import {
  FormField,
  GlobalError,
  SuccessMessage,
  FormDivider,
  GoogleButton,
  FormContainer,
  SubmitButton,
} from "@/lib/form";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState,
    signupState,
    onSubmit,
    onGoogleSignIn,
  } = useSignup();

  return (
    <Card className="">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="font-serif text-2xl italic text-card-foreground">
          {authData.signup.formTitle}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {authData.signup.formDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          {/* Global Error Display */}
          <GlobalError error={signupState.error} />

          {/* Success Message */}
          {signupState.success && (
            <SuccessMessage message="Please check your email to confirm your account before logging in." />
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              type="text"
              placeholder="John"
              disabled={signupState.isLoading}
              error={formState.errors.firstName}
              {...register("firstName")}
            />

            <FormField
              label="Last Name"
              type="text"
              placeholder="Doe"
              disabled={signupState.isLoading}
              error={formState.errors.lastName}
              {...register("lastName")}
            />
          </div>

          {/* Email Field */}
          <FormField
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            disabled={signupState.isLoading}
            error={formState.errors.email}
            {...register("email")}
          />

          {/* Password Field */}
          <FormField
            label="Password"
            type="password"
            placeholder="Create a password"
            disabled={signupState.isLoading}
            error={formState.errors.password}
            helperText="Password must contain at least one uppercase letter, one lowercase letter, and one number"
            {...register("password")}
          />

          {/* Confirm Password Field */}
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            disabled={signupState.isLoading}
            error={formState.errors.confirmPassword}
            {...register("confirmPassword")}
          />

          {/* Submit Button */}
          <SubmitButton
            isLoading={signupState.isLoading}
            disabled={!formState.isValid}
            loadingText={authData.signup.loadingText}
          >
            {authData.signup.submitText}
          </SubmitButton>

          {/* Divider */}
          <FormDivider text="Or continue with" />

          {/* Google Sign Up Button */}
          <GoogleButton
            onClick={onGoogleSignIn}
            disabled={signupState.isLoading}
            variant="signup"
          />
        </FormContainer>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {authData.signup.loginPrompt}{" "}
            <Link
              href="/login"
              className="text-foreground hover:text-muted-foreground font-medium transition-colors"
            >
              {authData.signup.loginLink}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
