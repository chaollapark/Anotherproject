'use client';

import { useState } from 'react';
import { Theme } from '@radix-ui/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const FixEPSoPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the purpose of this petition?",
      answer: "The petition aims to address issues related to the EPSO selection process and advocate for improvements."
    },
    {
      question: "How can I support the petition?",
      answer: "You can support the petition by filling out the form above and sharing it with your network."
    },
    {
      question: "What happens after I submit the form?",
      answer: "After submission, your response will be recorded, and we will keep you updated on the progress of the petition."
    },
    {
      question: "Is my information confidential?",
      answer: "Yes, your information will be kept confidential and used solely for the purpose of this petition."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Theme>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Fix EPSO Petition</h1>
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSc0c-7CdxHZMhtnaDWq0Yyx2Oc0rI5tI8gmXDpax78w1mJMqQ/viewform?embedded=true" 
          width="640" 
          height="1518" 
          frameBorder="0" 
          marginHeight="0" 
          marginWidth="0"
          className="mb-8"
        >
          Loading…
        </iframe>

        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-2">
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left font-semibold text-gray-800 hover:text-blue-600 transition duration-300"
              >
                <span>{faq.question}</span>
                <FontAwesomeIcon 
                  icon={activeIndex === index ? faChevronUp : faChevronDown} 
                  className="text-gray-500 h-4"
                />
              </button>
              {activeIndex === index && (
                <div className="mt-2 text-gray-700 text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Theme>
  );
};

export default FixEPSoPage; 