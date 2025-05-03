import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { useToast } from '@/components/ui/use-toast'
import { useCreateShortUrl } from '@/lib/api'

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  customCode: z.string().optional(),
})

export function UrlShortenerForm() {
//   const { toast } = useToast()
  const { mutateAsync, isPending } = useCreateShortUrl()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      customCode: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutateAsync(values)
    //   toast({
    //     title: 'Success!',
    //     description: 'URL shortened successfully',
    //   })
      form.reset()
    } catch (error) {
        console.log(error)
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to shorten URL',
    //     variant: 'destructive',
    //   })
    }
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL to shorten</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom short code (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="my-custom-link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </form>
      </Form>
    </div>
  )
}