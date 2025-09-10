import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { uploadImage, uploadVideo } from '@/lib/cloudinary'
import { z } from 'zod'

const submissionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  location: z.string().min(1),
  spottedAt: z.string().min(1, 'Spotted date is required'),
  videoUrl: z.string().url().min(1, 'Video URL is required'),
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    const rateLimit = await checkRateLimit(ip, 'submission')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Submission limit reached. You can submit 10 reports per day.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      spottedAt: formData.get('spottedAt') as string,
      videoUrl: formData.get('videoUrl') as string,
    }


    const validatedData = submissionSchema.parse(data)

    // Handle file uploads - images are mandatory
    const images: string[] = []
    const files = formData.getAll('images') as File[]
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }
    
    for (const file of files) {
      if (file.size > 0) {
        try {
          const imageUrl = await uploadImage(file)
          images.push(imageUrl)
        } catch (error) {
          console.error('Image upload error:', error)
          return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
          )
        }
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid image is required' },
        { status: 400 }
      )
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        ...validatedData,
        images,
        spottedAt: new Date(validatedData.spottedAt)
      }
    })

    return NextResponse.json(submission)

  } catch (error) {
    console.error('Submission error:', error)
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return NextResponse.json(
        { error: 'Invalid data', details: errorMessages },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Submission failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const location = searchParams.get('location')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause with multiple filters
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }
    
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          location: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Validate sort parameters
    const validSortFields = ['createdAt', 'updatedAt', 'spottedAt', 'title', 'status']
    const validSortOrders = ['asc', 'desc']
    
    const orderBy: any = {}
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.createdAt = 'desc' // default
    }

    const submissions = await prisma.submission.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.submission.count({ where })

    // Get status counts for dashboard
    const statusCounts = await prisma.submission.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        status,
        location,
        search,
        sortBy,
        sortOrder
      },
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}