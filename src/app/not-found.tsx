import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/arrow-link";

export default function NotFound() {
  return (
    <Container>
      <div
        style={{
          minHeight: "62vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "var(--s-5)",
          paddingBlock: "var(--s-10)",
          maxWidth: "44ch",
        }}
      >
        <p className="label">Ошибка 404</p>
        <h1 className="h1" style={{ letterSpacing: "var(--ls-display)" }}>
          Такой страницы нет
        </h1>
        <p className="lead">
          Возможно, кейс ещё готовится или ссылка устарела. Начните со списка
          кейсов.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-3)", marginTop: "var(--s-2)" }}>
          <ButtonLink href="/work" variant="primary" size="lg">
            Смотреть кейсы
          </ButtonLink>
          <ArrowLink href="/">На главную</ArrowLink>
        </div>
      </div>
    </Container>
  );
}
