'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Video, 
  Image, 
  RefreshCw, 
  Search, 
  X, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Settings,
  Lock
} from 'lucide-react'
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
  updatedAt: string
}

interface StatusCounts {
  PENDING?: number
  APPROVED?: number
  REJECTED?: number
  INVESTIGATING?: number
}

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({})
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<string>('desc')

  // Admin password from environment variable
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_LOGIN || 'spotvigilante2024admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError('')

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setAuthError('Invalid password. Access denied.')
    }
    
    setIsLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    setAuthError('')
  }

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (locationFilter) params.append('location', locationFilter)
      if (searchTerm) params.append('search', searchTerm)
      if (sortBy) params.append('sortBy', sortBy)
      if (sortOrder) params.append('sortOrder', sortOrder)
      
      const response = await fetch(`/api/submissions?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
        setStatusCounts(data.statusCounts || {})
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

  const updateSubmissionStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Refresh the submissions list
        fetchSubmissions()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      alert('Error updating status')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions()
    }
  }, [isAuthenticated, statusFilter, locationFilter, searchTerm, sortBy, sortOrder])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      case 'INVESTIGATING':
        return <Eye className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  const clearFilters = () => {
    setStatusFilter('')
    setLocationFilter('')
    setSearchTerm('')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to access the admin dashboard</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full"
                  />
                </div>
                
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{authError}</p>
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Access Dashboard
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

  // Show loading state only when authenticated and loading data
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage and review all vigilante activity reports</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchSubmissions} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <Lock className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.APPROVED || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.REJECTED || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investigating</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.INVESTIGATING || 0}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="INVESTIGATING">Investigating</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  type="text"
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="spottedAt-desc">Most Recent Spotted</option>
                  <option value="spottedAt-asc">Oldest Spotted</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <p className="text-sm text-gray-600">
                Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">Error: {error}</span>
          </div>
        )}

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{submission.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {submission.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1">{submission.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Submission Details */}
                    <div className="lg:col-span-2 space-y-4">
                      {submission.description && (
                        <p className="text-sm text-gray-600">{submission.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Spotted: {formatDate(submission.spottedAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Submitted: {formatDate(submission.createdAt)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-red-500" />
                          <a 
                            href={submission.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
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
                              maxDisplay={6}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Update Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant={submission.status === 'PENDING' ? 'default' : 'outline'}
                          onClick={() => updateSubmissionStatus(submission.id, 'PENDING')}
                          className="text-xs"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Button>
                        <Button
                          size="sm"
                          variant={submission.status === 'APPROVED' ? 'default' : 'outline'}
                          onClick={() => updateSubmissionStatus(submission.id, 'APPROVED')}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant={submission.status === 'REJECTED' ? 'default' : 'outline'}
                          onClick={() => updateSubmissionStatus(submission.id, 'REJECTED')}
                          className="text-xs bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant={submission.status === 'INVESTIGATING' ? 'default' : 'outline'}
                          onClick={() => updateSubmissionStatus(submission.id, 'INVESTIGATING')}
                          className="text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Investigate
                        </Button>
                      </div>
                    </div>
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
