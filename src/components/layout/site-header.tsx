"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/config/navigation";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeSheet = () => setOpen(false);

  return (
    <header className={[styles.root, scrolled ? styles.scrolled : ""].join(" ")}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true" />
          <span>{site.name}</span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[styles.link, active ? styles.active : ""].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <a className={styles.resume} href={site.resumeFile} download>
            Резюме PDF
          </a>
          <ButtonLink href="#contact" variant="primary" size="md">
            Связаться
          </ButtonLink>
        </div>

        <button
          className={styles.burger}
          type="button"
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? styles.barTop : ""} />
          <span className={open ? styles.barBottom : ""} />
        </button>
      </div>

      {open ? (
        <div className={styles.sheet}>
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.sheetLink}
              onClick={closeSheet}
            >
              {item.label}
            </Link>
          ))}
          <a
            className={styles.sheetLink}
            href={site.resumeFile}
            download
            onClick={closeSheet}
          >
            Резюме PDF
          </a>
          <a className={styles.sheetLink} href="#contact" onClick={closeSheet}>
            Связаться
          </a>
        </div>
      ) : null}
    </header>
  );
}
