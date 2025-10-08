import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authData } from "@/data/auth";
import { useLogin } from "../useLogin";
import {
  FormField,
  GlobalError,
  FormDivider,
  GoogleButton,
  FormContainer,
  SubmitButton,
} from "@/lib/form";
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState,
    loginState,
    onSubmit,
    onGoogleSignIn,
  } = useLogin();

  return (
    <Card className="">
      <CardHeader className="space-y-1 px-0">
        <CardTitle className="font-serif text-2xl italic text-card-foreground">
          {authData.login.formTitle}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {authData.login.formDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          {/* Global Error Display */}
          <GlobalError error={loginState.error} />

          {/* Email Field */}
          <FormField
            label="Email"
            type="email"
            placeholder="Enter your email"
            disabled={loginState.isLoading}
            error={formState.errors.email}
            {...register("email")}
          />

          {/* Password Field */}
          <FormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            disabled={loginState.isLoading}
            error={formState.errors.password}
            {...register("password")}
          />

          {/* Forgot Password */}
          <div className="flex items-center justify-between">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {authData.login.forgotPassword}
            </Link>
          </div>

          {/* Submit Button */}
          <SubmitButton
            isLoading={loginState.isLoading}
            disabled={!formState.isValid}
            loadingText={authData.login.loadingText}
          >
            {authData.login.submitText}
          </SubmitButton>
        </FormContainer>

        {/* Divider */}
        <FormDivider text="Or continue with" className="my-6" />

        {/* Google OAuth Button */}
        <GoogleButton
          onClick={onGoogleSignIn}
          disabled={loginState.isLoading}
          text={loginState.isLoading ? "Signing in..." : "Continue with Google"}
          className="border-border"
        />

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {authData.login.signupPrompt}{" "}
            <Link
              href="/signup"
              className="text-foreground hover:text-muted-foreground font-medium transition-colors"
            >
              {authData.login.signupLink}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
