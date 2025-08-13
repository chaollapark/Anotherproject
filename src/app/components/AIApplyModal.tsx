'use client'

import { useState, useRef, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { FaUpload, FaSpinner, FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PricingOption {
  id: string
  name: string
  price: number
  applications: number
  description: string
}

const pricingOptions: PricingOption[] = [
  {
    id: 'trial',
    name: 'Trial Package',
    price: 50,
    applications: 25,
    description: 'Perfect to test our service'
  },
  {
    id: 'full',
    name: 'Full Package',
    price: 100,
    applications: 100,
    description: 'Best value for serious job seekers'
  }
]

interface AIApplyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIApplyModal({ isOpen, onClose }: AIApplyModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<string>('trial')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      setUploadSuccess(false)
      setUploadError('')
      // Automatically upload the file
      handleFileUpload(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      // Check if it's a valid file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
      ]
      
      if (allowedTypes.includes(droppedFile.type)) {
        setFile(droppedFile)
        setUploadSuccess(false)
        setUploadError('')
        // Automatically upload the file
        handleFileUpload(droppedFile)
      } else {
        setUploadError('Please upload a valid file type (PDF, DOC, DOCX, TXT, RTF)')
      }
    }
  }

  const handleFileUpload = async (fileToUpload?: File) => {
    const uploadFile = fileToUpload || file
    if (!uploadFile) {
      setUploadError('Please select a CV file')
      return
    }

    setIsUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', uploadFile)

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setUploadSuccess(true)
      
      // Store the file URL for later use
      localStorage.setItem('cvFileUrl', result.fileUrl)
      
    } catch (error) {
      setUploadError('Upload failed. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCheckout = async () => {
    if (!uploadSuccess) {
      setUploadError('Please upload your CV first')
      return
    }

    setIsProcessing(true)
    setUploadError('')

    try {
      const cvFileUrl = localStorage.getItem('cvFileUrl')
      
      const response = await fetch('/api/create-ai-apply-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package: selectedPackage,
          cvFileUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Checkout failed')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to initialize')

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setUploadError(err.message || 'Something went wrong')
      console.error('Checkout error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedOption = pricingOptions.find(option => option.id === selectedPackage)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Apply with AI — You Approve Every Application
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimesCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Being the first 5% of applicant raises your chances by 13x
            </p>
          </div>

          {/* CV Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Upload Your CV *
            </label>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : file 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {!file ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <FaUpload className="w-8 h-8" />
                  <span className="text-sm">
                    {isDragging ? 'Drop your CV here' : 'Click to select CV or drag & drop'}
                  </span>
                  <span className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, RTF</span>
                </button>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null)
                      setUploadSuccess(false)
                      setUploadError('')
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {isUploading && (
              <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
                <FaSpinner className="w-4 h-4 animate-spin" />
                Uploading CV...
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <FaCheck className="w-4 h-4" />
                CV uploaded successfully!
              </div>
            )}

            {uploadError && (
              <div className="text-red-600 text-sm">{uploadError}</div>
            )}
          </div>

          {/* Pricing Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Choose Package
            </label>
            
            <div className="space-y-2">
              {pricingOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPackage === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="package"
                    value={option.id}
                    checked={selectedPackage === option.id}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.name}</span>
                      <span className="font-bold text-lg">€{option.price}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.applications} applications • {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={!uploadSuccess || isProcessing}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Get Started - €${selectedOption?.price}`
            )}
          </button>

          {/* Info */}
          <div className="text-xs text-gray-500 text-center">
            7-day turnaround • EU Jobs & partner employers only
          </div>
        </div>
      </div>
    </div>
  )
}
