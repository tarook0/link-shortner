import { UrlShortenerForm } from '@/components/UrlShortenerForm'
import { UrlList } from '@/components/UrlList'

function App() {
  return (
    <div className="min-h-screen relative isolate overflow-hidden bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 animate-gradient-rotate">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-background/70 to-background/90 dark:via-background/80 dark:to-background/95" />
      </div>

      {/* Portrait effect overlay */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-background/80 dark:to-background/90 mix-blend-multiply" />

      <div className="container mx-auto px-4 py-12 relative">
        <header className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent inline-block">
            URL Shortener
          </h1>
          <p className="text-xl text-muted-foreground/90 dark:text-muted-foreground/80 font-medium max-w-2xl mx-auto">
            Transform lengthy URLs into sleek, shareable links with modern privacy-first architecture
          </p>
        </header>
        
        <main className="flex flex-col items-center gap-12">
          <div className="w-full max-w-2xl backdrop-blur-lg bg-background/80 dark:bg-background/90 rounded-2xl border border-border/30 shadow-2xl p-8 animate-float-in">
            <UrlShortenerForm />
          </div>
          
          <div className="w-full max-w-4xl backdrop-blur-lg bg-background/80 dark:bg-background/90 rounded-2xl border border-border/30 shadow-2xl overflow-hidden animate-float-in-delayed">
            <UrlList />
          </div>
        </main>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-10" />
    </div>
  )
}

export default App