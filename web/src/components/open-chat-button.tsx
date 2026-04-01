"use client";

import type { ReactNode } from "react";

type OpenChatButtonProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function OpenChatButton({
  children,
  className = "",
  ariaLabel = "Открыть чат-помощник",
}: OpenChatButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("azursystech:open-chat"));
  };

  return (
    <button type="button" aria-label={ariaLabel} onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
