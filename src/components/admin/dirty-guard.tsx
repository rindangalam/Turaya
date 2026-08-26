"use client";

import { useEffect, useRef } from "react";

/**
 * Warns when the surrounding form has unsaved changes and the user is about
 * to leave the page (reload/close). Marked clean again on submit.
 */
export function DirtyGuard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;

    const serialize = () =>
      Array.from(new FormData(form), ([key, value]) =>
        value instanceof File
          ? `${key}=${value.name}:${value.size}`
          : `${key}=${value}`,
      )
        .sort()
        .join("&");

    const initial = serialize();
    let dirty = false;

    const check = () => {
      dirty = serialize() !== initial;
    };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const onSubmit = () => {
      dirty = false;
    };

    form.addEventListener("input", check, { passive: true });
    form.addEventListener("submit", onSubmit);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      form.removeEventListener("input", check);
      form.removeEventListener("submit", onSubmit);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  return <div ref={ref} hidden aria-hidden="true" />;
}
