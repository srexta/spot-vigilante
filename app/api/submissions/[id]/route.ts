import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'INVESTIGATING'])
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { status } = updateStatusSchema.parse(body)
    
    // Update the submission status
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json(updatedSubmission)
    
  } catch (error) {
    console.error('Update status error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid status', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const submission = await prisma.submission.findUnique({
      where: { id }
    })
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(submission)
    
  } catch (error) {
    console.error('Get submission error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}
