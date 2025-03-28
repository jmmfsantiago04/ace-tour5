'use client';

import { useCallback, useState, useTransition } from 'react';

type ActionState = {
  message?: string | null;
  errors?: Record<string, string[]> | null;
};

type UseActionStateOptions = {
  onSuccess?: (data: ActionState) => void;
  onError?: (data: ActionState) => void;
};

export function useActionState(
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>,
  options?: UseActionStateOptions
) {
  const [state, setState] = useState<ActionState>({});
  const [isPending, startTransition] = useTransition();

  const formAction = useCallback(
    async (formData: FormData) => {
      startTransition(async () => {
        const result = await action(state, formData);
        setState(result);

        if (result.errors) {
          options?.onError?.(result);
        } else {
          options?.onSuccess?.(result);
        }
      });
    },
    [action, options, state]
  );

  return [state, formAction, isPending] as const;
} 