import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth-server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

      const blob = await put(filename, file.stream(), {
        access: 'public',
      })

      uploadedUrls.push(blob.url)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter required' },
        { status: 400 }
      )
    }

    // Import del function dynamically to avoid issues with server/client boundary
    const { del } = await import('@vercel/blob')
    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}