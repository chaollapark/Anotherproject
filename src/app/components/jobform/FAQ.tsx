import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Define the type for an FAQ item
interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Why post on EUjobs and not linkedin?",
      answer: "EUjobs is a niche, local job board designed to connect you with candidates who are already in your industry and region. Unlike the broad reach of LinkedIn, EUjobs helps you target a more relevant pool of applicants—people who are more likely to have the right skills, background, and motivation for your role. It’s a smarter, more efficient way to hire."
    },
    {
      question: "Differences EUjobs vs other 17 job boards?",
      answer: "EUjobs stands out by offering everything in one place. It’s the most visited platform because job seekers don’t have to browse multiple websites—they come straight to us. Plus, EUjobs is the most affordable option, powered by modern, user-friendly technology that makes hiring faster and easier."
    },
    {
      question: "Does EUjobs also offer headhunting?",
      answer: "Yes! EUjobs offers headhunting services. You pay 200 Euros upfront, and 1800 if you hire one of the suggested candidates."
    },
    {
      question: "How does Headhunter work?",
      answer: "You pay us € 500 upfront and get a premium listing. Then we only get paid if you hire one of the suggested candidates."
    },
    {
      question: "What is the Headhunting process?",
      answer: "Users upload their CVs, we match them with your job offer. You just show up to the call we set up."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
      
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
  );
};

export default FAQ;
