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
import { createMiceCard } from "@/app/actions/admin"
import { ImageIcon, Loader2 } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/cloudinary'

const miceCardFormSchema = z.object({
  label: z.string().min(1, "Label is required"),
  date: z.string().min(1, "Date is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  imageAlt: z.string().min(1, "Image alt text is required"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

export function AddMiceCardDialog() {
  const [open, setOpen] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm({
    resolver: zodResolver(miceCardFormSchema),
    defaultValues: {
      label: "",
      date: "",
      content: "",
      imageUrl: "",
      imageAlt: "",
      order: 0,
      isActive: true,
    },
  })

  async function onSubmit(data: z.infer<typeof miceCardFormSchema>) {
    try {
      const result = await createMiceCard(data)
      if (result.success) {
        toast.success('MICE Card created successfully')
        form.reset()
        setOpen(false)
      } else {
        toast.error(result.error as string)
      }
    } catch (error) {
      toast.error('Failed to create MICE Card')
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
        <Button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New MICE Card</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Card label..." {...field} />
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
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <Textarea placeholder="Card content..." {...field} />
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
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && (
                        <div className="relative w-full h-48">
                          <Image
                            src={field.value}
                            alt="Preview"
                            fill
                            className="rounded-lg object-cover"
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
                        className="w-full"
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
            <FormField
              control={form.control}
              name="imageAlt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Image alt text..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create MICE Card</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 