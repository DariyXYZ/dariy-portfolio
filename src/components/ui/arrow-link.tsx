import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./arrow-link.module.css";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
};

export function ArrowLink({ href, children, external }: ArrowLinkProps) {
  const content = (
    <>
      <span className={styles.text}>{children}</span>
      <svg
        className={styles.icon}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 11L11 3M11 3H5M11 3V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  if (external) {
    return (
      <a className={styles.root} href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link className={styles.root} href={href}>
      {content}
    </Link>
  );
}
