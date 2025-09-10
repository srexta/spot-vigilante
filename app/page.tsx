'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, Upload, CheckCircle } from 'lucide-react'

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setSubmitSuccess(true)
        e.currentTarget.reset()
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const error = await response.json()
        if (error.details) {
          alert(`Validation Error:\n${error.details.join('\n')}`)
        } else {
          alert(error.error)
        }
      }
    } catch (error) {
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit the Spot</h1>
          <p className="text-gray-600 mt-2">Report suspicious vigilante activities safely and anonymously</p>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Report submitted successfully! Thank you for your contribution.</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Submit Report
            </CardTitle>
            <CardDescription>
              Provide evidence and details. All submissions are reviewed by our team. Rate limit: 10 submissions per day per IP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Report Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Brief description of the incident"
                  required 
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe what you observed, when it happened, and any other relevant details..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location" 
                  name="location" 
                  placeholder="Street address, landmark, or general area"
                  required 
                />
              </div>

              <div>
                <Label htmlFor="spottedAt">When was this spotted? *</Label>
                <Input 
                  id="spottedAt" 
                  name="spottedAt" 
                  type="datetime-local" 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="videoUrl">Video Link *</Label>
                <Input 
                  id="videoUrl" 
                  name="videoUrl" 
                  type="url" 
                  placeholder="YouTube, Vimeo, or other video platform URL"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Video evidence is required for all reports.
                </p>
              </div>

              <div>
                <Label htmlFor="images">Photos *</Label>
                <Input 
                  id="images" 
                  name="images" 
                  type="file" 
                  multiple 
                  accept="image/*"
                  required
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  At least one photo is required. You can upload multiple images.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}