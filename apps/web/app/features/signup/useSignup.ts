import { useMutation } from "@tanstack/react-query";
import { postSignup } from "~/lib/api";

export function useSignup() {
  return useMutation({ mutationFn: postSignup });
}
