import { signupResponseSchema, type SignupRequest, type SignupResponse } from "@coaching/shared";

/** POST /api/signup. Always resolves to a SignupResponse; network failures become an error result. */
export async function postSignup(request: SignupRequest): Promise<SignupResponse> {
  let response: Response;
  try {
    response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    return {
      ok: false,
      error: "upstream_error",
      message:
        "Your browser could not reach the signup service. An ad blocker or privacy extension can cause this — pause it for this page and try again.",
    };
  }

  const parsed = signupResponseSchema.safeParse(await response.json().catch(() => null));
  if (parsed.success) return parsed.data;
  return {
    ok: false,
    error: "upstream_error",
    message: "Something went wrong on our side. Please try again later.",
  };
}
