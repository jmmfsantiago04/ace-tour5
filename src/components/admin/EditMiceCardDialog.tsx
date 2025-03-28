'use client'

import * as React from 'react'
import * as z from 'zod'
import Image from 'next/image'
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
import { updateMiceCard, deleteItem } from "@/app/actions/admin"
import { Pencil, Trash2, ImageIcon, Loader2 } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/cloudinary'

const editMiceCardSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  date: z.string().min(1, "Date is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  imageAlt: z.string().min(1, "Image alt text is required"),
  order: z.number(),
  isActive: z.boolean(),
})

type MiceCard = z.infer<typeof editMiceCardSchema>

interface EditMiceCardDialogProps {
  miceCard: MiceCard
}

export function EditMiceCardDialog({ miceCard }: EditMiceCardDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<MiceCard>({
    resolver: zodResolver(editMiceCardSchema),
    defaultValues: {
      ...miceCard,
      date: new Date(miceCard.date).toISOString().split('T')[0]
    }
  })

  async function onSubmit(data: MiceCard) {
    try {
      const result = await updateMiceCard(data)
      if (result.success) {
        toast.success('MICE Card updated successfully')
        setOpen(false)
      } else {
        toast.error(result.error as string)
      }
    } catch (error) {
      toast.error('Failed to update MICE Card')
    }
  }

  async function onDelete() {
    if (confirm('Are you sure you want to delete this MICE Card?')) {
      try {
        const result = await deleteItem({ id: miceCard.id, type: 'MICE_CARD' })
        if (result.success) {
          toast.success('MICE Card deleted successfully')
          setOpen(false)
        } else {
          toast.error(result.error as string)
        }
      } catch (error) {
        toast.error('Failed to delete MICE Card')
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const result = await uploadToCloudinary(file)
      
      if (result.success) {
        form.setValue('imageUrl', result.url)
        form.setValue('imageAlt', result.originalFilename || '')
        toast.success('Image uploaded successfully')
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
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
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Edit MICE Card</DialogTitle>
          <p className="text-sm text-muted-foreground">Update the information below to modify this MICE card.</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Label</FormLabel>
                    <FormControl>
                      <Input className="border-gray-200 focus:border-blue-500" placeholder="Card label..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Date</FormLabel>
                    <FormControl>
                      <Input className="border-gray-200 focus:border-blue-500" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="min-h-[120px] border-gray-200 focus:border-blue-500" 
                      placeholder="Card content..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={field.value}
                            alt="Preview"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-12 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            {field.value ? 'Change Image' : 'Upload Image'}
                          </>
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="imageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Image Alt Text</FormLabel>
                    <FormControl>
                      <Input className="border-gray-200 focus:border-blue-500" placeholder="Image alt text..." {...field} />
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
                      When checked, this MICE card will be visible on the website.
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
                Delete Card
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Update MICE Card
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 