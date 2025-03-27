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
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
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
                    <Input placeholder="Reviewer initial..." {...field} />
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
                    <Input placeholder="Reviewer name..." {...field} />
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
                    <Textarea placeholder="Review text..." {...field} />
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
                  <FormLabel>Read More Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Read more link..." {...field} />
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
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Active</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="button" variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button type="submit">Update Review</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 