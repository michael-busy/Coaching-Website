import { zodResolver } from "@hookform/resolvers/zod";
import { signupRequestSchema } from "@coaching/shared";
import { Turnstile } from "@marsidev/react-turnstile";
import { useMutation } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { postSignup } from "~/lib/api";
import type { ResourceContent } from "~/lib/resources";
import { CONTACT_EMAIL, TURNSTILE_SITE_KEY, mailto } from "~/lib/site";

const formSchema = z.object({
  email: signupRequestSchema.shape.email,
  consentOffers: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Wording of the optional offers consent. It is stored as evidence under OFFERS_CONSENT_VERSION
 * (@coaching/shared): bump that version whenever this text changes.
 */
const OFFERS_CONSENT_TEXT =
  "Yes, send me offers, new resources and occasional invitations to book a call or join a course by email. I can unsubscribe at any time.";

export function SignupForm({
  resource,
}: {
  resource: Pick<ResourceContent, "slug" | "title" | "kind">;
}) {
  // Bumping the key remounts the widget, which fetches a fresh single-use token.
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaMessage, setCaptchaMessage] = useState<string | null>(null);
  const signup = useMutation({ mutationFn: postSignup });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", consentOffers: false },
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
      consentOffers: values.consentOffers,
      resource: resource.slug,
      turnstileToken,
    });
    if (result.ok) {
      // The response is a file attachment, so the browser downloads it and stays on this page.
      window.location.assign(result.downloadUrl);
    } else {
      // Turnstile tokens are single-use: get a fresh one for the next attempt.
      setTurnstileToken(null);
      setTurnstileKey((key) => key + 1);
    }
  });

  if (signup.data?.ok) {
    return (
      <div className="lm-success" role="status">
        <h3>Your download is ready</h3>
        <p>
          The {resource.kind} should be downloading now. If it didn't start, use the button below.
        </p>
        <Button asChild size="lg" className="mb-4 w-full">
          <a href={signup.data.downloadUrl} download>
            <Download aria-hidden="true" />
            Download {resource.title}
          </a>
        </Button>
        {signup.variables?.consentOffers && (
          <p className="lm-success-note">
            Check your inbox: please confirm your email address to start receiving offers.
          </p>
        )}
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
          name="consentOffers"
          render={({ field }) => (
            <div className="lm-consent">
              <Checkbox
                id="lm-consent-offers"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <label htmlFor="lm-consent-offers">
                {OFFERS_CONSENT_TEXT} <span className="lm-optional">Optional</span>
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
          {submitting ? "Preparing your download…" : `Download the ${resource.kind}`}
        </Button>
      </form>

      {failure && (
        <div className="lm-error-box" role="alert">
          <h3>That didn't go through</h3>
          <p>{failure.message}</p>
          <p className="lm-success-note">
            Or just email me at <a href={mailto(resource.title)}>{CONTACT_EMAIL}</a> and I'll send
            the {resource.kind} straight over.
          </p>
        </div>
      )}

      <p className="form-privacy">
        Your email address is stored so I can provide the download. You'll only receive offers if
        you tick the box above and confirm your address. See the{" "}
        <Link to="/privacy/">privacy policy</Link> for how your data is handled.
      </p>
    </>
  );
}
