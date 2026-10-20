import { useSearchParams } from "react-router";
import { useHydrated } from "~/hooks/use-hydrated";

/** Shown when /api/downloads redirects back here with ?link=expired|invalid. */
export function LinkStatusNotice() {
  const hydrated = useHydrated();
  const [params] = useSearchParams();
  const status = params.get("link");
  // The page is prerendered without query params, so only render this after hydration.
  if (!hydrated || (status !== "expired" && status !== "invalid")) return null;

  return (
    <div className="lm-error-box" role="status">
      <h3>
        {status === "expired"
          ? "That download link has expired"
          : "That download link is not valid"}
      </h3>
      <p>Enter your email below and I'll send you a fresh link.</p>
    </div>
  );
}
