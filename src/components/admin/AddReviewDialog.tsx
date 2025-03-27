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
import { createReview } from "@/app/actions/admin"

const reviewFormSchema = z.object({
  reviewerInitial: z.string().length(1, "Initial must be a single character"),
  reviewerName: z.string().min(1, "Reviewer name is required"),
  reviewText: z.string().min(1, "Review text is required"),
  readMoreLink: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export function AddReviewDialog() {
  const [open, setOpen] = React.useState(false)
  const form = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewerInitial: "",
      reviewerName: "",
      reviewText: "",
      readMoreLink: "",
      order: 0,
      isActive: true,
    },
  })

  async function onSubmit(data: z.infer<typeof reviewFormSchema>) {
    try {
      const result = await createReview(data)
      if (result.success) {
        toast.success('Review created successfully')
        form.reset()
        setOpen(false)
      } else {
        toast.error(result.error as string)
      }
    } catch (error) {
      toast.error('Failed to create review')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add New Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Review</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reviewerInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer Initial</FormLabel>
                  <FormControl>
                    <Input maxLength={1} placeholder="D" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reviewerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reviewText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Review content..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="readMoreLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Read More Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Review</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 