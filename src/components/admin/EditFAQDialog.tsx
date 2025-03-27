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
import { updateFAQ, deleteItem } from "@/app/actions/admin"
import { Pencil, Trash2 } from 'lucide-react'

const editFAQSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  locale: z.string(),
  order: z.number(),
  isActive: z.boolean(),
})

type FAQ = z.infer<typeof editFAQSchema>

interface EditFAQDialogProps {
  faq: FAQ
}

export function EditFAQDialog({ faq }: EditFAQDialogProps) {
  const [open, setOpen] = React.useState(false)
  const form = useForm<FAQ>({
    resolver: zodResolver(editFAQSchema),
    defaultValues: faq
  })

  async function onSubmit(data: FAQ) {
    try {
      const result = await updateFAQ(data)
      if (result.success) {
        toast.success('FAQ updated successfully')
        setOpen(false)
      } else {
        toast.error(result.error as string)
      }
    } catch (error) {
      toast.error('Failed to update FAQ')
    }
  }

  async function onDelete() {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const result = await deleteItem({ id: faq.id, type: 'FAQ' })
        if (result.success) {
          toast.success('FAQ deleted successfully')
          setOpen(false)
        } else {
          toast.error(result.error as string)
        }
      } catch (error) {
        toast.error('Failed to delete FAQ')
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
          <DialogTitle>Edit FAQ</DialogTitle>
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
              <Button type="submit">Update FAQ</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 