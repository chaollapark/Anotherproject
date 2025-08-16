'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { FaUpload, FaSpinner, FaCheck, FaTimes, FaTimesCircle, FaArrowRight } from 'react-icons/fa'
import { Metadata } from 'next'

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

export default function ApplyWithAIPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<string>('trial')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [clickCount, setClickCount] = useState(1673)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize counter from localStorage or start with 1673
  useEffect(() => {
    const savedCount = localStorage.getItem('aiApplyClickCount')
    if (savedCount) {
      setClickCount(parseInt(savedCount))
    }
  }, [])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      setUploadSuccess(false)
      setUploadError('')
      handleFileUpload(selectedFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
      ]
      
      if (allowedTypes.includes(droppedFile.type)) {
        setFile(droppedFile)
        setUploadSuccess(false)
        setUploadError('')
        handleFileUpload(droppedFile)
      } else {
        setUploadError('Please upload a valid file type (PDF, DOCX, TXT, RTF)')
      }
    }
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) {
          const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/rtf'
          ]
          
          if (allowedTypes.includes(file.type)) {
            setFile(file)
            setUploadSuccess(false)
            setUploadError('')
            handleFileUpload(file)
          } else {
            setUploadError('Please paste a valid file type (PDF, DOCX, TXT, RTF)')
          }
        }
        break
      }
    }
  }, [])

  const handleFileUpload = async (fileToUpload?: File) => {
    const fileToProcess = fileToUpload || file
    if (!fileToProcess) {
      setUploadError('Please select a CV file')
      return
    }

    setIsUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', fileToProcess)

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setUploadSuccess(true)
      localStorage.setItem('cvFileId', result.id)
      
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

    // Increment counter and save to localStorage
    const newCount = clickCount + 1
    setClickCount(newCount)
    localStorage.setItem('aiApplyClickCount', newCount.toString())

    setIsProcessing(true)
    setUploadError('')

    try {
      const cvFileId = localStorage.getItem('cvFileId')
      
      const response = await fetch('/api/create-ai-apply-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package: selectedPackage,
          cvFileId,
        }),
      })

      if (!response.ok) {
        throw new Error('Checkout failed')
      }

      const { sessionId } = await response.json()

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Apply with AI — You Approve Every Application
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Get noticed quickly with AI-powered job applications. We find high-fit roles, you tap Approve, we send from your email and track replies.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <span>🔥</span>
              <span>{clickCount.toLocaleString()} people have started their AI application journey</span>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* CV Upload Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Upload Your CV</h2>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : file 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onPaste={handlePaste}
                tabIndex={0}
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
                    className="flex flex-col items-center gap-4 text-gray-600 hover:text-gray-800"
                  >
                    <FaUpload className="w-12 h-12" />
                    <div>
                      <p className="text-lg font-medium">
                        {isDragging ? 'Drop your CV here' : 'Click to select CV or drag & drop'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PDF, DOCX, TXT, RTF</p>
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaCheck className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null)
                        setUploadSuccess(false)
                        setUploadError('')
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {file && isUploading && (
                <div className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  Uploading CV...
                </div>
              )}

              {uploadSuccess && (
                <div className="mt-4 flex items-center gap-2 text-green-600 text-lg">
                  <FaCheck className="w-5 h-5" />
                  CV uploaded successfully!
                </div>
              )}

              {uploadError && (
                <div className="mt-4 text-red-600 text-lg">{uploadError}</div>
              )}
            </div>

            {/* Pricing Options */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choose Your Package</h2>
              
              <div className="grid gap-4">
                {pricingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-semibold">{option.name}</span>
                        <span className="text-2xl font-bold text-blue-600">€{option.price}</span>
                      </div>
                      <div className="text-gray-600">
                        <p className="font-medium">{option.applications} applications</p>
                        <p className="text-sm">{option.description}</p>
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
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xl flex items-center justify-center gap-3 transition-all duration-200"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Get Started - €{selectedOption?.price}
                  <FaArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Info */}
            <div className="mt-6 text-center text-gray-500">
              <p className="text-sm">7-day turnaround • EU Jobs & partner employers only</p>
              <p className="text-sm mt-1">You approve every application before it&apos;s sent</p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Questions about the AI application service?</p>
            <a href="mailto:ceo@zatjob.com" className="text-blue-600 font-semibold hover:text-blue-700">
              Contact us: ceo@zatjob.com
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
