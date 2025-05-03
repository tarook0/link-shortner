import { UrlShortenerForm } from '@/components/UrlShortenerForm'
import { UrlList } from '@/components/UrlList'


function App() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">URL Shortener</h1>
          <p className="text-muted-foreground mt-2">
            Shorten your long URLs into compact links
          </p>
        </header>
        
        <main className="flex flex-col items-center">
          <UrlShortenerForm />
          <UrlList />
        </main>
        
        {/* <Toaster /> */}
      </div>
    </div>
  )
}

export default App