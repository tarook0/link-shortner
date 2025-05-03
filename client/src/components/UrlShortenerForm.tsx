"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useCreateShortUrl } from "@/lib/api"
import { LinkIcon, Wand2Icon } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  customCode: z.string().optional(),
})

export function UrlShortenerForm() {
  const { toast } = useToast()
  const { mutateAsync, isPending } = useCreateShortUrl()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      customCode: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutateAsync(values)
      setIsSuccess(true)
      toast({
        title: "URL shortened successfully!",
        description: "Your link is ready to share.",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none",
      })

      // Reset success state after animation completes
      setTimeout(() => {
        setIsSuccess(false)
        form.reset()
      }, 1500)
    } catch (error) {
      console.log(error)
      toast({
        title: "Something went wrong",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Create Short Link
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>URL to shorten</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="https://example.com/very/long/url/that/needs/shortening"
                      {...field}
                      className="pl-4 pr-10 py-6 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-500"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <LinkIcon className="h-5 w-5" />
                    </div>
                  </div>
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
                <FormLabel className="text-base flex items-center gap-2">
                  <Wand2Icon className="h-4 w-4" />
                  <span>Custom short code (optional)</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="my-custom-link"
                      {...field}
                      className="pl-4 pr-10 py-6 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-500"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Wand2Icon className="h-5 w-5" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                type="submit"
                disabled={isPending || isSuccess}
                className={`w-full py-6 text-base font-medium transition-all duration-300 ${
                  isSuccess
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                }`}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Link Created!</span>
                  </div>
                ) : (
                  <span>Shorten URL</span>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </div>
  )
}
