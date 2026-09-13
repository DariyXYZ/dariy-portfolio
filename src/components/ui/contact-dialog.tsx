"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { site } from "@/config/site";
import { typo } from "@/lib/typo";
import { Pill } from "./pill";
import { ButtonLink } from "./button";
import buttons from "./button.module.css";
import styles from "./contact-dialog.module.css";
import { AnimatedIcon } from "./animated-icon";

const ContactContext = createContext<() => void>(() => {});

export function ContactProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const overflow = useRef("");
  const show = () => {
    if (!dialog.current || dialog.current.open) return;
    overflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
  };
  return (
    <ContactContext.Provider value={show}>
      {children}
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="contact-title"
        onClose={() => { document.body.style.overflow = overflow.current; }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close();
        }}>
        <button type="button" className={styles.close} aria-label="Закрыть окно контактов" onClick={() => dialog.current?.close()}><AnimatedIcon name="close" size={24} /></button>
        <Pill tone="live">{typo(site.availability.label)}</Pill>
        <h2 id="contact-title" className={styles.title}>{typo("Расскажите о задаче.")}<br /><span className="dim">{typo("Отвечу за день")}</span></h2>
        <p className={styles.lead}>{typo("Ищу команду, где смогу отвечать за пользовательский сценарий от исследования до запуска и оценки результата.")}</p>
        <div className={styles.actions}>
          <ButtonLink href={"mailto:" + site.email} external>Написать на почту</ButtonLink>
          <ButtonLink href={site.telegram} variant="secondary" external>Telegram</ButtonLink>
        </div>
        <div className={styles.meta}>
          <a href={"mailto:" + site.email}>{site.email}</a>
          <a href={"tel:" + site.phone.replace(/[^+\d]/g, "")}>{site.phone}</a>
        </div>
      </dialog>
    </ContactContext.Provider>
  );
}

export function ContactTrigger({ badge = false, className, onOpen }: { badge?: boolean; className?: string; onOpen?: () => void }) {
  const show = useContext(ContactContext);
  return <button type="button" aria-haspopup="dialog" className={badge ? styles.badge : className || [buttons.root, buttons.secondary, buttons.md].join(" ")}
    onClick={() => { onOpen?.(); show(); }}>
    {badge ? <Pill tone="live">{typo(site.availability.label)}</Pill> : "Связаться"}
  </button>;
}
