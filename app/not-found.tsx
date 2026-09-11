import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="bg-surface pt-[var(--header-h)] outline-none"
      >
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand-teal-700">
            Error 404
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight text-ink lg:text-5xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            The page you are looking for may have moved or no longer exists.
          </p>
          <ButtonLink href="/" size="lg" className="mt-10">
            Back to home
          </ButtonLink>
        </Container>
      </main>
      <Footer />
    </>
  );
}
