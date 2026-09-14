"use client";

import { useEffect, useRef } from "react";

export function InvertedCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || !cursor.showPopover) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    const hide = () => {
      cancelAnimationFrame(frame);
      cursor.hidePopover();
      document.documentElement.classList.remove("custom-cursor");
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== "mouse") { hide(); return; }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${event.clientX - 7}px, ${event.clientY - 7}px)`;
        if (!cursor.matches(":popover-open")) cursor.showPopover();
        document.documentElement.classList.add("custom-cursor");
      });
    };
    // Keep the pointer above native dialogs without intercepting their events.
    const observer = new MutationObserver(() => {
      if (cursor.matches(":popover-open")) { cursor.hidePopover(); cursor.showPopover(); }
    });
    document.querySelectorAll("dialog").forEach(dialog => observer.observe(dialog, { attributes: true, attributeFilter: ["open"] }));
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    fine.addEventListener("change", hide);
    return () => {
      hide(); observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      fine.removeEventListener("change", hide);
    };
  }, []);
  return <div ref={ref} className="inverted-cursor" popover="manual" aria-hidden="true" />;
}
