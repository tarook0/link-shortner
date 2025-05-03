import { useGetUrlList } from '@/lib/api'
import { getFullShortUrl } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {  CopyIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export function UrlList() {
  const { data, isLoading, isError } = useGetUrlList()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mt-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full max-w-4xl mt-8 text-center text-destructive">
        Failed to load URLs
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Original URL</TableHead>
            <TableHead>Short URL</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.urls.map((url) => (
            <TableRow key={url.id}>
              <TableCell className="max-w-xs truncate">
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {url.originalUrl}
                </a>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <a
                    href={getFullShortUrl(url.shortCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {url.shortCode}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(getFullShortUrl(url.shortCode))}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{url.clicks}</TableCell>
              <TableCell>
                {new Date(url.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}