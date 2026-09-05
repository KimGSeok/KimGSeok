import { useLayoutEffect, useRef, useState } from "react";
import type { ToastContract } from "./contracts";

/** Each notification owns its pending work; a replaced or closed one cannot dismiss its successor. */
export function useToastAction({ open, action, onOpenChange }: ToastContract) {
  const [pending, setPending] = useState(false);
  const session = useRef({ version: 0, active: false, locked: false });
  useLayoutEffect(() => {
    session.current = {
      version: session.current.version + 1,
      active: open,
      locked: false,
    };
    setPending(false);
    return () => {
      session.current.active = false;
      session.current.version += 1;
    };
  }, [open]);

  const runAction = async () => {
    if (!action || !session.current.active || session.current.locked) return;
    const version = session.current.version;
    const isCurrent = () =>
      session.current.active && session.current.version === version;
    session.current.locked = true;
    setPending(true);
    try {
      await action.onAction();
      if (isCurrent()) onOpenChange(false);
    } catch (error) {
      if (isCurrent()) {
        try {
          action.onError(error);
        } catch {
          /* Caller owns the durable error surface. */
        }
      }
    } finally {
      if (isCurrent()) {
        session.current.locked = false;
        setPending(false);
      }
    }
  };
  return { pending, runAction };
}

export function toastKey(toast: ToastContract) {
  return toast.id === undefined
    ? JSON.stringify(["content", toast.message, toast.action?.label])
    : JSON.stringify(["id", toast.id]);
}
