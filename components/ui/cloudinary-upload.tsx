"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface CloudinaryUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

export function CloudinaryUpload({ value, onChange, maxFiles = 5 }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = (result: any) => {
    const newUrl = result.info.secure_url
    onChange([...value, newUrl])
    setUploading(false)
  }

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove))
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
        <CldUploadWidget
          uploadPreset="luxecustomized_uploads" // Create this in Cloudinary Settings → Upload
          onUpload={handleUpload}
          onOpen={() => setUploading(true)}
          onClose={() => setUploading(false)}
          options={{
            maxFiles: 1,
            resourceType: "image",
            folder: "luxecustomized/products"
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              onClick={() => open()}
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
          )}
        </CldUploadWidget>
      )}
    </div>
  )
}