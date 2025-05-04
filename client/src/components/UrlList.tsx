import { useState } from "react"
import { useGetUrlList } from "@/lib/api"
import { getFullShortUrl } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, ExternalLink, BarChart2, LinkIcon } from "lucide-react"

export function UrlList() {
  const { data, isLoading, isError } = useGetUrlList()
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)

    toast({
      title: "Copied to clipboard!",
      description: "The shortened URL has been copied to your clipboard.",
      className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none",
    })

    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Links
          </h2>
          <div className="h-8 w-24">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-border/50">
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">Failed to load URLs</h3>
        <p className="text-muted-foreground">There was an error loading your shortened URLs. Please try again later.</p>
      </div>
    )
  }

  if (!data?.urls.length) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
          <LinkIcon className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">No links yet</h3>
        <p className="text-muted-foreground mb-6">Shorten your first URL above to get started!</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Links
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart2 className="h-4 w-4" />
          <span>{data.urls.length} links created</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Original URL</TableHead>
              <TableHead>Short URL</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {data.urls.map((url, index) => (
                <motion.tr
                  key={url.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <TableCell className="max-w-xs truncate font-medium">
                    <a
                      href={getFullShortUrl(url.shortCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors duration-200 flex items-center gap-1"
                    >
                      <span className="truncate">{url.originalUrl}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a
                        href={getFullShortUrl(url.shortCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline transition-all duration-200"
                      >
                        {url.shortCode}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center min-w-[40px] h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full px-2">
                      {url.clicks}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(url.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(getFullShortUrl(url.shortCode), url.id)}
                      className="relative w-9 h-9 p-0 rounded-full"
                    >
                      <AnimatePresence mode="wait">
                        {copiedId === url.id ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Copy className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
