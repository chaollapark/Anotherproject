import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEuroSign, 
  faClock, 
  faShieldAlt, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';

const ValueProposition = () => {
  const competitorPricing = [
    { name: 'Eurobrussels', price: '€2000' },
    { name: 'Euractiv Jobs', price: '€1000' },
    { name: 'Eujobs Brussels', price: '€200', highlight: true }
  ];

  return (
    <div className="w-full mb-8">
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose <span className='text-blue-900'>EUjobs.co?</span></h2>
        
        {/* Pricing Comparison */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faEuroSign} className="mr-2 text-green-600 h-4" />
            Unbeatable Pricing
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {competitorPricing.map((competitor) => (
              <div 
                key={competitor.name} 
                className={`px-4 py-2 border rounded-lg ${competitor.highlight ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                <p className="font-medium">{competitor.name}</p>
                <p className={`text-lg font-bold ${competitor.highlight ? 'text-green-600' : 'text-gray-800'}`}>
                  {competitor.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="space-y-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-3 text-blue-600 h-4" />
            <p className="text-gray-700">110,000+ monthly users in March.</p>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-3 text-purple-600 h-4" />
            <p className="text-gray-700">OpenAI, SEC, and 34+ companies trust us.</p>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="mr-3 text-green-600" />
            <p className="text-gray-700">Why visit 17 Policy jobsites, all jobs are here</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn&apos;t find a candidate 100% moneyback guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;
