export function debounceFn<T>(func: () => Promise<T>, delayMs: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    return new Promise<T>((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const result = await func();
        resolve(result);
      }, delayMs || 500);
    });
  };
}
