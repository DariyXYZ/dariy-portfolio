"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/config/navigation";
import { site } from "@/config/site";
import { ContactTrigger } from "@/components/ui/contact-dialog";
import styles from "./site-header.module.css";
import { AnimatedIcon } from "@/components/ui/animated-icon";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef("");
  const menuLocked = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeSheet = () => {
    menu.current?.close();
    if (menuLocked.current) {
      document.body.style.overflow = previousOverflow.current;
      menuLocked.current = false;
    }
    setOpen(false);
  };
  const openSheet = () => {
    if (!menu.current || menu.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    menuLocked.current = true;
    document.body.style.overflow = "hidden";
    menu.current.showModal();
    setOpen(true);
  };

  useEffect(() => {
    const desktop = matchMedia("(min-width: 861px)");
    const resize = () => { if (desktop.matches) menu.current?.close(); };
    desktop.addEventListener("change", resize);
    return () => desktop.removeEventListener("change", resize);
  }, []);

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
          aria-haspopup="dialog"
          aria-controls="mobile-navigation"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={openSheet}
        >
          <AnimatedIcon name="menu" size={22} />
        </button>
      </div>

        <dialog ref={menu} id="mobile-navigation" className={styles.sheet} aria-label="Навигация" onClose={closeSheet}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.clientY > rect.bottom || event.clientY < rect.top || event.clientX < rect.left || event.clientX > rect.right) closeSheet();
          }}>
          <div className={styles.inner}>
            <Link href="/" className={styles.brand} onClick={(event) => {
              closeSheet();
              if (pathname === "/") {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
              }
            }}>
              <img className={styles.mark} src={site.logoFile} alt="" aria-hidden="true" />
              <span>{site.name}</span>
            </Link>
            <button type="button" className={styles.burger} aria-label="Закрыть меню" onClick={closeSheet}><AnimatedIcon name="close" size={22} /></button>
          </div>
          <nav className={styles.sheetLinks} aria-label="Мобильная навигация">
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
          </nav>
        </dialog>
    </header>
  );
}
