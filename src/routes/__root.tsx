import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingCta } from "@/components/site/FloatingCta";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[var(--teal)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full bg-[var(--teal)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "iShiftCargo | Premium Cargo Shipping | Lagos ↔ Western Canada" },
      { name: "description", content: "Reliable air, sea and vehicle cargo shipping between Lagos, Nigeria and Calgary, Alberta. Transparent pricing, no hidden clearance fees, weekly departures." },
      { name: "author", content: "iShiftCargo" },
      { property: "og:title", content: "iShiftCargo | Premium Cargo Shipping | Lagos ↔ Western Canada" },
      { property: "og:description", content: "Reliable air, sea and vehicle cargo shipping between Lagos, Nigeria and Calgary, Alberta. Transparent pricing, no hidden clearance fees, weekly departures." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "iShiftCargo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "iShiftCargo | Premium Cargo Shipping | Lagos ↔ Western Canada" },
      { name: "twitter:description", content: "Reliable air, sea and vehicle cargo shipping between Lagos, Nigeria and Calgary, Alberta. Transparent pricing, no hidden clearance fees, weekly departures." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/88b6b3df-908f-4aee-abe3-746f3a2140e1/id-preview-889be48b--40e2ac48-22e5-4658-af71-1a5bd0c98561.lovable.app-1780836457073.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/88b6b3df-908f-4aee-abe3-746f3a2140e1/id-preview-889be48b--40e2ac48-22e5-4658-af71-1a5bd0c98561.lovable.app-1780836457073.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <FloatingCta />
    </QueryClientProvider>
  );
}
