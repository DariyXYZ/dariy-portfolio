import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./button.module.css";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
  external?: boolean;
  download?: boolean;
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  external,
  download,
  className,
}: ButtonAsLink) {
  const cn = [styles.root, styles[variant], styles[size], className].filter(Boolean).join(" ");

  if (external || download) {
    return (
      <a
        className={cn}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={cn} href={href}>
      {children}
    </Link>
  );
}
