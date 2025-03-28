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
import { updateReview, deleteItem } from "@/app/actions/admin"
import { Pencil, Trash2 } from 'lucide-react'

const editReviewSchema = z.object({
  id: z.string(),
  reviewerInitial: z.string().min(1, "Reviewer initial is required"),
  reviewerName: z.string().min(1, "Reviewer name is required"),
  reviewText: z.string().min(1, "Review text is required"),
  readMoreLink: z.string().min(1, "Read more link is required"),
  order: z.number(),
  isActive: z.boolean(),
})

type Review = z.infer<typeof editReviewSchema>

interface EditReviewDialogProps {
  review: Review
}

export function EditReviewDialog({ review }: EditReviewDialogProps) {
  const [open, setOpen] = React.useState(false)
  const form = useForm<Review>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: review
  })

  async function onSubmit(data: Review) {
    try {
      const result = await updateReview(data)
      if (result.success) {
        toast.success('Review updated successfully')
        setOpen(false)
      } else {
        toast.error(result.error as string)
      }
    } catch (error) {
      toast.error('Failed to update Review')
    }
  }

  async function onDelete() {
    if (confirm('Are you sure you want to delete this Review?')) {
      try {
        const result = await deleteItem({ id: review.id, type: 'REVIEW' })
        if (result.success) {
          toast.success('Review deleted successfully')
          setOpen(false)
        } else {
          toast.error(result.error as string)
        }
      } catch (error) {
        toast.error('Failed to delete Review')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-blue-50">
          <Pencil className="h-4 w-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-4 sm:p-6 w-[95%]">
        <DialogHeader className="space-y-3 mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Edit Review</DialogTitle>
          <p className="text-sm text-muted-foreground">Update the information below to modify this review.</p>
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
                      placeholder="Review text..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="readMoreLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Read More Link</FormLabel>
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
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="border-gray-200 focus:border-blue-500"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="!mt-0 text-sm font-medium">Active</FormLabel>
                    <p className="text-[13px] text-muted-foreground">
                      When checked, this review will be visible on the website.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Review
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Update Review
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 