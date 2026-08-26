export async function writeClipboardWithTimeout(
  writeText: (text: string) => Promise<void>,
  text: string,
  timeoutMs = 5000,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      writeText(text),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Clipboard write timed out")), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
