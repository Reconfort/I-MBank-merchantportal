"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Popover/menu behaviour: closes on Escape, on outside pointer down and when
 * the viewport is resized, and restores focus to the trigger.
 */
export function useDismissable<
  TriggerElement extends HTMLElement,
  PanelElement extends HTMLElement,
>() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<TriggerElement>(null);
  const panelRef = useRef<PanelElement>(null);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onResize = () => setOpen(false);

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return { open, setOpen, close, triggerRef, panelRef };
}
