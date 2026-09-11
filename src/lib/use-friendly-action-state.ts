"use client";

import { useCallback } from "react";
import { useActionState } from "react";
import {
  getUserFacingErrorMessage,
  isNextRedirectError,
  isStaleClientBundleError,
} from "@/lib/user-facing-errors";
import { reloadOnceForStaleClient } from "@/lib/reload-for-stale-client";

type FormStateWithError = {
  error?: string;
};

/**
 * Like useActionState, but maps thrown errors (e.g. stale server actions after deploy)
 * into state.error instead of crashing the route error boundary.
 */
export function useFriendlyActionState<State extends FormStateWithError>(
  action: (prev: State, formData: FormData) => Promise<State>,
  initialState: State,
  fallbackMessage = "Something went wrong. Please try again."
) {
  const safeAction = useCallback(
    async (prev: State, formData: FormData): Promise<State> => {
      try {
        return await action(prev, formData);
      } catch (err) {
        if (isNextRedirectError(err)) throw err;
        if (isStaleClientBundleError(err) && reloadOnceForStaleClient("server-action")) {
          return prev;
        }
        return {
          ...prev,
          error: getUserFacingErrorMessage(err, fallbackMessage),
        };
      }
    },
    [action, fallbackMessage]
  );

  return useActionState<State, FormData>(
    safeAction,
    initialState as Awaited<State>
  );
}
