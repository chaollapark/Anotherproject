'use client'

import { useState } from 'react'
import AIApplyModal from './AIApplyModal'



export default function AIApplyExpandingHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <span>Apply with AI</span>
      </button>

      {/* Modal */}
      <AIApplyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
