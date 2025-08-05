"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface SupabaseUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  bucket?: string
}

export function SupabaseUpload({ 
  value, 
  onChange, 
  maxFiles = 5, 
  bucket = "product-images" 
}: SupabaseUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file)

        if (error) throw error

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path)

        return urlData.publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...value, ...uploadedUrls])
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async (indexToRemove: number) => {
    const urlToRemove = value[indexToRemove]
    onChange(value.filter((_, index) => index !== indexToRemove))

    // Optional: Delete from Supabase storage
    try {
      const fileName = urlToRemove.split('/').pop()
      if (fileName) {
        await supabase.storage.from(bucket).remove([fileName])
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative group">
            <Image
              src={url}
              alt={`Upload ${index + 1}`}
              width={200}
              height={200}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {value.length < maxFiles && (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="w-full h-32 border-dashed"
          >
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {uploading ? "Uploading..." : "Click to upload images"}
              </span>
              <span className="text-xs text-muted-foreground">
                {value.length}/{maxFiles} images
              </span>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}