'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertTriangle, MapPin, Calendar, Video, Image, RefreshCw, Search, X } from 'lucide-react'
import ImageGallery from '@/components/image-gallery'

interface Submission {
  id: string
  title: string
  description?: string
  location: string
  spottedAt: string
  videoUrl: string
  images: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INVESTIGATING'
  createdAt: string
}

export default function SpotsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/submissions')
      
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
        setFilteredSubmissions(data.submissions || [])
        setError(null)
      } else {
        setError('Failed to fetch submissions')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  // Filter submissions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions)
    } else {
      const filtered = submissions.filter(submission =>
        submission.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (submission.description && submission.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredSubmissions(filtered)
    }
  }, [searchTerm, submissions])

  const clearSearch = () => {
    setSearchTerm('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'INVESTIGATING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchSubmissions} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">View All Spots</h1>
            <p className="text-gray-600 mt-2">Browse all submitted vigilante activity reports</p>
          </div>
          <Button onClick={fetchSubmissions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by location, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredSubmissions.length} result{filteredSubmissions.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          )}
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-600">Be the first to report suspicious vigilante activity.</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or clear the search to see all submissions.</p>
            <Button onClick={clearSearch} variant="outline" className="mt-4">
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{submission.title}</CardTitle>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {submission.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submission.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {submission.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(submission.spottedAt)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-red-500" />
                      <a 
                        href={submission.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        View Video Evidence
                      </a>
                    </div>
                    
                    {submission.images.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Evidence Photos
                          </span>
                        </div>
                        <ImageGallery 
                          images={submission.images} 
                          maxDisplay={4}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-400">
                      Submitted: {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
