import { zodResolver } from "@hookform/resolvers/zod";
import { signupRequestSchema, type GatedResourceSlug } from "@coaching/shared";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CONTACT_EMAIL, TURNSTILE_SITE_KEY, mailto } from "~/lib/site";
import { useSignup } from "./useSignup";

const formSchema = z.object({
  email: signupRequestSchema.shape.email,
  consentEmail: z.boolean().refine((checked) => checked, {
    error: "Please confirm that we may email you the worksheet.",
  }),
  consentNewsletter: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function SignupForm({
  resource,
  emailSubject,
}: {
  resource: GatedResourceSlug;
  emailSubject: string;
}) {
  // Bumping the key remounts the widget, which fetches a fresh single-use token.
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaMessage, setCaptchaMessage] = useState<string | null>(null);
  const signup = useSignup();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", consentEmail: false, consentNewsletter: false },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    if (!turnstileToken) {
      setCaptchaMessage("Please wait for the bot check to finish, then try again.");
      return;
    }
    setCaptchaMessage(null);
    const result = await signup.mutateAsync({
      email: values.email,
      consentEmail: true,
      consentNewsletter: values.consentNewsletter,
      resource,
      turnstileToken,
    });
    if (!result.ok) {
      // Turnstile tokens are single-use: get a fresh one for the next attempt.
      setTurnstileToken(null);
      setTurnstileKey((key) => key + 1);
    }
  });

  if (signup.data?.ok) {
    return (
      <div className="lm-success" role="status">
        <h3>Check your inbox</h3>
        <p>
          I've sent you an email to confirm your address. Click the link inside and the worksheet
          will arrive straight after.
        </p>
        <p className="lm-success-note">Not there? Have a look in your spam folder.</p>
      </div>
    );
  }

  const failure = signup.data && !signup.data.ok ? signup.data : null;
  const submitting = form.formState.isSubmitting || signup.isPending;

  return (
    <>
      <form className="lm-form" noValidate onSubmit={onSubmit}>
        <div className="mb-4 flex flex-col gap-1.5">
          <Label htmlFor="lm-email">Email address</Label>
          <Input
            id="lm-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "lm-email-error" : undefined}
            {...form.register("email")}
          />
          {errors.email && (
            <p id="lm-email-error" className="m-0 text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <Controller
          control={form.control}
          name="consentEmail"
          render={({ field, fieldState }) => (
            <div className="lm-consent">
              <Checkbox
                id="lm-consent-email"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                aria-invalid={fieldState.error ? true : undefined}
              />
              <label htmlFor="lm-consent-email">
                Yes, email me the worksheet. <span className="lm-required">Required</span>
                {fieldState.error && (
                  <span className="mt-1 block text-sm text-destructive">
                    {fieldState.error.message}
                  </span>
                )}
              </label>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="consentNewsletter"
          render={({ field }) => (
            <div className="lm-consent">
              <Checkbox
                id="lm-consent-newsletter"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <label htmlFor="lm-consent-newsletter">
                Also send me the newsletter — new worksheets and tools, free resources, and
                occasional invitations to book a call or join a course.{" "}
                <span className="lm-optional">Optional</span>
              </label>
            </div>
          )}
        />

        <div className="mb-4">
          <Turnstile
            key={turnstileKey}
            siteKey={TURNSTILE_SITE_KEY}
            options={{ size: "flexible", appearance: "interaction-only" }}
            onSuccess={(token) => {
              setTurnstileToken(token);
              setCaptchaMessage(null);
            }}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
          {captchaMessage && <p className="m-0 text-sm text-destructive">{captchaMessage}</p>}
        </div>

        <Button type="submit" className="lm-submit w-full" size="lg" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitting ? "Sending…" : "Send me the worksheet"}
        </Button>
      </form>

      {failure && (
        <div className="lm-error-box" role="alert">
          <h3>That didn't go through</h3>
          <p>{failure.message}</p>
          <p className="lm-success-note">
            Or just email me at <a href={mailto(emailSubject)}>{CONTACT_EMAIL}</a> and I'll send the
            worksheet straight over.
          </p>
        </div>
      )}

      <p className="form-privacy">
        You'll receive one email to confirm your address, then the download link. No spam, and you
        can unsubscribe at any time. See the <Link to="/privacy/">privacy policy</Link> for how your
        data is handled.
      </p>
    </>
  );
}
