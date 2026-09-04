import Link from "next/link";
import { footerNav } from "@/config/navigation";
import { site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { ArrowLink } from "@/components/ui/arrow-link";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.root}>
      <Container>
        <div className={styles.grid}>
          <div>
            <p className={styles.name}>{site.name}</p>
            <p className={styles.role}>{site.role}</p>
            <p className={styles.place}>
              {site.location} · {site.timezone}
            </p>
          </div>

          <nav className={styles.col} aria-label="Разделы сайта">
            <p className="label">Разделы</p>
            <ul className={styles.list}>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link className={styles.link} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a className={styles.link} href={site.resumeFile} download>
                  Резюме PDF
                </a>
              </li>
            </ul>
          </nav>

          <div className={styles.col}>
            <p className="label">Связаться</p>
            <ul className={styles.list}>
              <li>
                <ArrowLink href={"mailto:" + site.email} external>
                  {site.email}
                </ArrowLink>
              </li>
              <li>
                <ArrowLink href={site.telegram} external>
                  Telegram
                </ArrowLink>
              </li>
              <li>
                <ArrowLink href={site.instagram} external>
                  Instagram
                </ArrowLink>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className={styles.copy}>Собрано на Next.js</p>
        </div>
      </Container>
    </footer>
  );
}
