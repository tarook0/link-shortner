import { ThemeToggle } from "@/components/theme-toggle";
import { UrlShortenerForm } from "./components/UrlShortenerForm"; // Ensure path is correct
import { UrlList } from "./components/UrlList"; // Ensure path is correct

export default function Home() {
  return (
    // Apply theme background and ensure min height
    <div className="min-h-screen relative bg-gradient-to-br from-[hsl(var(--page-bg-gradient-start))] to-[hsl(var(--page-bg-gradient-end))] overflow-hidden opacity-95">

    {/* Animated background elements: Use theme-aware blob color variables */}
    <div className="absolute inset-0 -z-10">
      {/* Removed dark: prefixes for blob background colors */}
      {/* Applied opacity directly as a separate Tailwind class */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-[hsl(var(--blob-color-1))] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-[hsl(var(--blob-color-2))] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[hsl(var(--blob-color-3))] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-8 right-20 w-72 h-72 bg-[hsl(var(--blob-color-4))] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
    </div>

      {/* Grid overlay (uses dark: prefix, which is correct) */}
      <div className="absolute inset-0 -z-5 bg-grid-pattern opacity-95 dark:opacity-95"></div>

      {/* Main container */}
      <div className="container mx-auto px-4 py-12 relative">
        <header className="flex justify-between items-center mb-16">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight animate-title">
              {/* Make title gradient theme-aware using CSS variables */}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--gradient-card-1-start))] to-[hsl(var(--gradient-card-2-end))]">
                Link
                {/* Use theme-aware foreground color for the second part */}
                <span className="text-[hsl(var(--foreground))]">Pulse</span>
              </span>
            </h1>
            {/* muted-foreground is already theme-aware */}
            <p className="mt-4 text-lg text-muted-foreground animate-fade-up animation-delay-200">
              Transform lengthy URLs into sleek, shareable links
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />{" "}
            {/* Ensure this component correctly toggles 'dark' class on <html> */}
          </div>
        </header>

        <main className="flex flex-col items-center gap-16">
          {/* Form Card */}
          <div className="w-full max-w-2xl animate-fade-up animation-delay-400">
            <div className="relative group">
              {/* Make gradient border theme-aware using CSS variables */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(var(--gradient-card-1-start))] to-[hsl(var(--gradient-card-1-end))] rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              {/* Inner card uses theme-aware bg-background */}
              <div className="relative bg-[hsl(var(--background))] rounded-lg shadow-xl p-8">
                <UrlShortenerForm />
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl animate-fade-up animation-delay-600">
            <div className="relative group">
              {" "}
              {/* Establishes stacking context */}
              {/* 1. Gradient Border Div (Positioned absolutely, behind the card) */}
              {/* This uses theme-aware gradient variables */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(var(--gradient-card-2-start))] to-[hsl(var(--gradient-card-2-end))] rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x -z-10"></div>{" "}
              {/* Added -z-10 to explicitly place behind */}
              {/* 2. The Actual Card Div (Positioned relatively, on top of the gradient) */}
              {/* This uses bg-card for the white/dark background */}
              <div className="relative bg-[hsl(var(--background))] text-card-foreground z-20 rounded-lg shadow-xl overflow-hidden">
                {/* Optional: Padding inside the card */}
                <div className="p-4 md:p-6">
                  {" "}
                  {/* Adjust padding as needed */}
                  <UrlList />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating elements (use dark: prefix, which is correct) */}
        <div className="absolute top-1/4 left-10 w-6 h-6 rounded-full bg-purple-500/30 dark:bg-purple-500/50 animate-float"></div>
        <div className="absolute top-1/3 right-10 w-4 h-4 rounded-full bg-blue-500/30 dark:bg-blue-500/50 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-8 h-8 rounded-full bg-pink-500/30 dark:bg-pink-500/50 animate-float animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-5 h-5 rounded-full bg-yellow-500/30 dark:bg-yellow-500/50 animate-float animation-delay-6000"></div>
      </div>
    </div>
  );
}
