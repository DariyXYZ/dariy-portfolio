"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/config/navigation";
import { site } from "@/config/site";
import { ContactTrigger } from "@/components/ui/contact-dialog";
import styles from "./site-header.module.css";
import { AnimatedIcon } from "@/components/ui/animated-icon";

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
        <Link href="/" className={styles.brand} onClick={(event) => {
          closeSheet();
          if (pathname === "/" && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
          }
        }}>
          <img className={styles.mark} src={site.logoFile} alt="" aria-hidden="true" />
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
            <AnimatedIcon name="download" size={16} />
          </a>
          <ContactTrigger />
        </div>

        <button
          className={styles.burger}
          type="button"
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          <AnimatedIcon name="menu" size={22} />
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
          <ContactTrigger className={styles.sheetLink} onOpen={closeSheet} />
        </div>
      ) : null}
    </header>
  );
}
