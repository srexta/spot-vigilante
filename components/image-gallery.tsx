'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  title?: string
  maxDisplay?: number
  className?: string
}

export default function ImageGallery({ 
  images, 
  title = "Evidence Photos", 
  maxDisplay = 4,
  className = ""
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (images.length === 0) return null

  const displayImages = images.slice(0, maxDisplay)
  const remainingCount = images.length - maxDisplay

  const openModal = (index: number) => {
    setSelectedImage(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {images.length} photo{images.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {displayImages.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Evidence ${index + 1}`}
              className="w-full h-20 object-cover rounded-md border border-gray-200 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => openModal(index)}
            />
          ))}
          {remainingCount > 0 && (
            <div 
              className="w-full h-20 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 text-xs cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => openModal(maxDisplay)}
            >
              +{remainingCount} more
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={images[selectedImage]}
              alt={`Evidence ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
