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
import { Pencil } from "lucide-react"

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
        <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Pencil className="h-4 w-4 mr-2" />
          Add New Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-4 sm:p-6 w-[95%]">
        <DialogHeader className="space-y-3 mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Add New Review</DialogTitle>
          <p className="text-sm text-muted-foreground">Fill in the information below to create a new review.</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reviewerInitial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Reviewer Initial</FormLabel>
                    <FormControl>
                      <Input 
                        maxLength={1} 
                        className="border-gray-200 focus:border-blue-500" 
                        placeholder="D" 
                        {...field} 
                      />
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
                    <FormLabel className="text-sm font-medium">Reviewer Name</FormLabel>
                    <FormControl>
                      <Input 
                        className="border-gray-200 focus:border-blue-500" 
                        placeholder="Full name..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="reviewText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Review Text</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="min-h-[120px] border-gray-200 focus:border-blue-500" 
                      placeholder="Review content..." 
                      {...field} 
                    />
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
                  <FormLabel className="text-sm font-medium">Read More Link (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      className="border-gray-200 focus:border-blue-500" 
                      placeholder="https://..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors h-11"
            >
              Create Review
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 