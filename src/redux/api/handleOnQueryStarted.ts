import { toast } from '@/hooks/use-toast';

const getUnknownErrorMessage = (error: unknown): string | undefined => {
  const defaultError = error as Error;
  if ('message' in defaultError && typeof defaultError.message === 'string') {
    return defaultError.message;
  }
  const nestedDefaultError = error as { error: Error };
  if (
    'error' in nestedDefaultError &&
    'message' in nestedDefaultError.error &&
    typeof nestedDefaultError.error.message === 'string'
  ) {
    return nestedDefaultError.error.message;
  }
  return undefined;
};

type OnQueryStartedOptions = {
  processFunction: () => Promise<unknown>;
  onError?: (error: unknown) => void;
  errorMessage?: string;
  ignoreErrors?: boolean;
};
export const handleOnQueryStarted = async ({
  processFunction,
  onError,
  errorMessage,
  ignoreErrors,
}: OnQueryStartedOptions) => {
  try {
    await processFunction();
  } catch (error) {
    onError?.(error);
    if (ignoreErrors) {
      return;
    }
    const message = getUnknownErrorMessage(error);
    toast({
      title:
        message || errorMessage || 'Something went wrong. Please try again.',
      variant: 'destructive',
    });
  }
};
