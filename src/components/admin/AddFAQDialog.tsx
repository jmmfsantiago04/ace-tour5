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
import { Pencil } from 'lucide-react'

const faqFormSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleKo: z.string().min(1, "Korean title is required"),
  contentEn: z.string().min(1, "English content is required"),
  contentKo: z.string().min(1, "Korean content is required"),
  category: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export function AddFAQDialog() {
  const [open, setOpen] = React.useState(false)
  const form = useForm({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      titleEn: "",
      titleKo: "",
      contentEn: "",
      contentKo: "",
      category: "",
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
        <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Pencil className="h-4 w-4 mr-2" />
          Add New FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto w-[95%]">
        <DialogHeader className="space-y-3 mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Add New FAQ</DialogTitle>
          <p className="text-sm text-muted-foreground">Fill in the information below to create a new FAQ entry.</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* English Section */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-4">English Version</h3>
                  <FormField
                    control={form.control}
                    name="titleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Title (English)</FormLabel>
                        <FormControl>
                          <Input 
                            className="border-gray-200 focus:border-blue-500" 
                            placeholder="FAQ title in English..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contentEn"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-sm font-medium">Content (English)</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[200px] border-gray-200 focus:border-blue-500" 
                            placeholder="FAQ content in English..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Korean Section */}
              <div className="space-y-4">
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800 mb-4">Korean Version</h3>
                  <FormField
                    control={form.control}
                    name="titleKo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Title (Korean)</FormLabel>
                        <FormControl>
                          <Input 
                            className="border-gray-200 focus:border-blue-500" 
                            placeholder="FAQ title in Korean..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contentKo"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-sm font-medium">Content (Korean)</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[200px] border-gray-200 focus:border-blue-500" 
                            placeholder="FAQ content in Korean..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Category (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        className="border-gray-200 focus:border-blue-500" 
                        placeholder="Category..." 
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
                        placeholder="0"
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
                      When checked, this FAQ will be visible on the website.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors h-11"
            >
              Create FAQ
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 