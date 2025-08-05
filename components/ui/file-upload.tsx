"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from './button'
import { toast } from 'sonner'
import Image from 'next/image'

interface FileUploadProps {
  onFilesUploaded: (urls: string[]) => void
  maxFiles?: number
  existingFiles?: string[]
  onFileRemoved?: (url: string) => void
}

export function FileUpload({ 
  onFilesUploaded, 
  maxFiles = 6, 
  existingFiles = [],
  onFileRemoved 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(existingFiles)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`)
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      acceptedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { urls } = await response.json()
      const newFiles = [...uploadedFiles, ...urls]
      setUploadedFiles(newFiles)
      onFilesUploaded(newFiles)
      
      toast.success(`${urls.length} image(s) uploaded successfully`)
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }, [uploadedFiles, maxFiles, onFilesUploaded])

  const removeFile = async (url: string) => {
    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      const newFiles = uploadedFiles.filter(file => file !== url)
      setUploadedFiles(newFiles)
      onFilesUploaded(newFiles)
      onFileRemoved?.(url)
      
      toast.success('Image removed successfully')
    } catch (error) {
      toast.error('Failed to remove image')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    disabled: isUploading || uploadedFiles.length >= maxFiles
  })

  return (
    <div className="space-y-4">
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((url, index) => (
            <div key={url} className="relative group">
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-stone-400 bg-stone-50' 
              : 'border-stone-300 hover:border-stone-400'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-stone-400 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-stone-400" />
            )}
            
            <div>
              <p className="text-stone-600">
                {isDragActive
                  ? 'Drop images here...'
                  : 'Drag and drop images here, or click to browse'
                }
              </p>
              <p className="text-sm text-stone-400 mt-1">
                {uploadedFiles.length}/{maxFiles} images • PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}