'use client';

import React from 'react';
import { useState } from 'react';
import { Theme } from '@radix-ui/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const FixEPSoPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What opportunities are available through EUjobs?",
      answer: "EUjobs offers a scholarship of at least 1,000€ based on academic merit, as well as a paid internship opportunity. Both can be applied for using the same form."
    },
    {
      question: "How can I apply for the scholarship or internship?",
      answer: "You can apply by filling out the form above. Be sure to provide all required information to be considered for the opportunities."
    },
    {
      question: "What is the goal of EUjobs in offering these opportunities?",
      answer: "Our goal is to make careers in the EU bubble more accessible, especially for individuals outside the traditional networks of EU institutions and diplomatic circles."
    },
    {
      question: "When will the winners be announced?",
      answer: "We will announce the winners on September 1st."
    },
    {
      question: "Why is EUjobs offering these opportunities?",
      answer: "In addition to fostering greater inclusion in EU careers, we want to be transparent that offering these opportunities also provides us with a tax benefit."
    },
    {
      question: "Is my information confidential?",
      answer: "Yes, your information will be kept confidential and used solely for processing your application and related communication."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Theme>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">EUjobs Scholarship</h1>
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSdYhjvRoeBEOIXHxtUU7xaNEEqihkURpppGKjjwQ5xFe33Upg/viewform?embedded=true" 
          width="640" 
          height="1518" 
          style={{ border: 'none' }} 
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