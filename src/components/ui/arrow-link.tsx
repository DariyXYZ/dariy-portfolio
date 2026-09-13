import { AnimatedIcon } from "./animated-icon";
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
      <AnimatedIcon name="external" size={16} />
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
