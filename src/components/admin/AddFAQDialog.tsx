'use client'

import * as React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createFAQ } from "@/app/actions/admin"

const faqFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  locale: z.string().default("en"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export function AddFAQDialog() {
  const [open, setOpen] = React.useState(false)
  const form = useForm({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      locale: "en",
      order: 0,
      isActive: true,
    },
  })

  async function onSubmit(data: z.infer<typeof faqFormSchema>) {
    try {
      const result = await createFAQ(data)
      if (result.success) {
        toast.success('FAQ created successfully')
        form.reset()
        setOpen(false)
      } else {
        toast.error(result.error as string)
      }
    } catch (error) {
      toast.error('Failed to create FAQ')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add New FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New FAQ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="FAQ title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="FAQ content..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Category..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded-md p-2"
                      {...field}
                    >
                      <option value="en">English</option>
                      <option value="ko">Korean</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create FAQ</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 