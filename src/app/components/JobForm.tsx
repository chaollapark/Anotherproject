'use client';

import { saveJobAction } from "@/app/actions/jobActions";
import type { Job } from "@/models/Job";
import { faEnvelope, faPhone, faRoad, faUser, faCalendar, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, RadioGroup, TextArea, TextField, Theme } from "@radix-ui/themes";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface JobFormProps {
  jobDoc?: Job;
}

export default function JobForm({ jobDoc }: JobFormProps) {
  const router = useRouter();
  // Default to Belgium (ID: 21)
  const [countryId, setCountryId] = useState(jobDoc?.countryId ? parseInt(jobDoc.countryId) : 21);
  // Default to Brussels-Capital Region (ID: 254)
  const [stateId, setStateId] = useState(jobDoc?.stateId ? parseInt(jobDoc.stateId) : 254);
  // Default to Brussels (ID: 34248)
  const [cityId, setCityId] = useState(jobDoc?.cityId ? parseInt(jobDoc.cityId) : 34248);
  // Set default location names
  const [countryName, setCountryName] = useState(jobDoc?.country || 'Belgium');
  const [stateName, setStateName] = useState(jobDoc?.state || 'Brussels-Capital Region');
  const [cityName, setCityName] = useState(jobDoc?.city || 'Brussels');
  const [seniority, setSeniority] = useState(jobDoc?.seniority || 'entry');
  const [plan, setPlan] = useState(jobDoc?.plan || 'basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState(false);

  const planFeatures = {
    basic: [
      'Job listing visible on our homepage for 30 days',
      'Instant post after submission',
      'Unlimited revisions',
    ],
    pro: [
      'Everything in the Basic Plan, plus:',
      'Priority placement at the top of the homepage',
      'Highlighted listing to stand out from the crowd',
    ],
    recruiter: [
      'We handle everything—you join the call, and we take care of the rest.',
      'Filter and deliver the top 20 candidates tailored to your needs.',
      "You’re in control: Choose how many candidates you’d like to interview.",
      'Customize your ideal candidate profile.',
      'Interview scheduling (Zoom or in-person)—seamlessly organized for you.',
      'Includes all features of the Pro Plan.'
    ],
  };

  async function handleSaveJob(data: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      data.set('country', countryName);
      data.set('state', stateName);
      data.set('city', cityName);
      data.set('countryId', countryId.toString());
      data.set('stateId', stateId.toString());
      data.set('cityId', cityId.toString());
      data.set('seniority', seniority);
      data.set('plan', plan);

      const applyLink = data.get('applyLink') as string;
      if (applyLink && applyLink.trim() === '') {
        data.delete('applyLink'); // Remove the field if it's empty
      }

      const savedJob = await saveJobAction(data);

      // If we're editing (jobDoc exists), skip the Stripe checkout
      if (!jobDoc) {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId: savedJob._id,
            plan: plan,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`Failed to create checkout session: ${responseData.error || 'Unknown error'}`);
        }

        if (!responseData.sessionId) {
          throw new Error('No session ID returned from the server');
        }

        const result = await stripe.redirectToCheckout({
          sessionId: responseData.sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        // For edits, redirect back to the job listings page
        router.push('/job-listings');
      }
    } catch (error) {
      console.error('Error during job save or checkout:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const showPlanSelection = !jobDoc;

  return (
    <Theme className="md:w-1/2">
      <h1 className="text-4xl font-extrabold mb-2">Post Your Job in the EU&apos;s Capital</h1>
        <h4 className="text-md text-gray-600">For Questions, contact us on <a className="text-blue-600 hover:text-blue-700" href="mailto:ceo@zmantic.com">ceo@zmantic.com</a></h4>
        <form action={handleSaveJob} className="mt-6 mx-auto">

        {jobDoc && <input type="hidden" name="id" value={jobDoc._id} />}

        <div className="space-y-6">
          {/* Mandatory Fields */}
          <div className="space-y-6 bg-gray-50 rounded-md p-4">
            <h2 className="text-xl font-semibold text-gray-900">Required Information</h2>

            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-red-500">*</span>
              </label>
              <TextField.Root required name="title" placeholder="e.g. Policy Officer" defaultValue={jobDoc?.title || ''} />
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
              </label>
              <TextField.Root required name="companyName" placeholder="e.g. Park Consulting Inc." defaultValue={jobDoc?.companyName || ''} />
            </div>

            <div className="flex flex-row gap-8">
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type <span className="text-red-500">*</span>
                </label>
                <RadioGroup.Root defaultValue={jobDoc?.type || 'full'} name="type">
                  <div className="flex items-center">
                    <RadioGroup.Item value="project" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Project</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="part" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Part-time</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="full" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Full-time</span>
                  </div>
                </RadioGroup.Root>
              </div>

              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Seniority Level <span className="text-red-500">*</span>
                </label>
                <RadioGroup.Root defaultValue={jobDoc?.seniority || 'junior'} name="seniority" onValueChange={setSeniority}>
                  <div className="flex items-center">
                    <RadioGroup.Item value="intern" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Intern</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="junior" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Junior</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="medior" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Medior</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="senior" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Senior</span>
                  </div>
                </RadioGroup.Root>
              </div>
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email <span className="text-red-500">*</span>
              </label>
              <TextField.Root
              placeholder="Email Address"
              type="email"
              name="contactEmail"
              required
              defaultValue={jobDoc?.contactEmail || ''}>
                <TextField.Slot>
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </div>

            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
              <span className="text-red-500">*</span>
              </label>
              <TextArea
              defaultValue={jobDoc?.description || ''}
              placeholder="Describe the role, responsibilities, requirements, and benefits..."
              resize="vertical"
              name="description"
              className="min-h-32"
              required
            />
            </div>

          </div>

          {/* Optional Fields Toggle */}
          <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
            <span className="text-lg font-medium text-gray-700">Optional Information</span>
            <FontAwesomeIcon 
            icon={showOptional ? faChevronUp : faChevronDown} 
            className="w-5 h-5 text-gray-500" 
          />
          </button>

          {/* Optional Fields Content */}
          {showOptional && (
            <div className="space-y-6">
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry date 
              </label>
              <TextField.Root
              placeholder="Expiry date"
              type="date"
              name="expiresOn">
                <TextField.Slot>
                  <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                  <input
                  type="number"
                  name="salary"
                  min={0}
                  defaultValue={jobDoc?.salary?.toString() || ''}
                  className="pl-8 pr-16 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">k/year</span>
                </div>
              </div>

                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link</label>
                  <TextField.Root
                  placeholder="https://example.com/apply"
                  name="applyLink"
                  type="url"
                  defaultValue={jobDoc?.applyLink || ''}>
                    <TextField.Slot>
                      <FontAwesomeIcon icon={faLink} className="text-gray-400" />
                    </TextField.Slot>
                  </TextField.Root>
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <CountrySelect
                    defaultValue={{ id: countryId, name: countryName }}
                    onChange={(e: any) => {
                      setCountryId(e.id);
                      setCountryName(e.name);
                    }}
                    placeHolder="Select Country"
                    className="flex-1"
                  />
                    <StateSelect
                    defaultValue={{ id: stateId, name: stateName }}
                    countryid={countryId}
                    onChange={(e: any) => {
                      setStateId(e.id);
                      setStateName(e.name);
                    }}
                    placeHolder="Select State"
                    className="flex-1"
                  />
                    <CitySelect
                    defaultValue={{ id: cityId, name: cityName }}
                    countryid={countryId}
                    stateid={stateId}
                    onChange={(e: any) => {
                      setCityId(e.id);
                      setCityName(e.name);
                    }}
                    placeHolder="Select City"
                    className="flex-1"
                  />
                  </div>

                  <div className="flex gap-4 mt-2">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Name
                    </label>
                      <TextField.Root
                      placeholder="Rue de la Loi"
                      name="street"
                      id="street"
                      defaultValue={jobDoc?.street || ''}>
                        <TextField.Slot>
                          <FontAwesomeIcon icon={faRoad} className="text-gray-400" />
                        </TextField.Slot>
                      </TextField.Root>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                      <TextField.Root
                      placeholder="1000"
                      name="postalCode"
                      id="postalCode"
                      type="number"
                      min="1000"
                      max="9999"
                      defaultValue={jobDoc?.postalCode || '1000'}>
                        <TextField.Slot/>
                      </TextField.Root>
                    </div>
                  </div>
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Contact Information</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TextField.Root
                    placeholder="John Wick"
                    name="contactName"
                    defaultValue={jobDoc?.contactName || ''}>
                      <TextField.Slot>
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      </TextField.Slot>
                    </TextField.Root>
                    <TextField.Root
                    placeholder="Phone Number"
                    type="tel"
                    name="contactPhone"
                    defaultValue={jobDoc?.contactPhone || ''}>
                      <TextField.Slot>
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                      </TextField.Slot>
                    </TextField.Root>
                  </div>
                </div>

              </div>
          )}

          {showPlanSelection && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Select a plan</h3>
                <RadioGroup.Root 
                defaultValue={plan} 
                name="plan" 
                onValueChange={setPlan}
                className="space-y-4s"
              >
                  <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <RadioGroup.Item 
                      value="basic" 
                      id="basic"
                      className="w-4 h-4 rounded-full mr-2 cursor-pointer"
                    />
                      <label className="pl-2 font-bold text-lg cursor-pointer" htmlFor="basic">Basic (€99.99)</label>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {planFeatures.basic.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                            {feature}
                          </li>
                      ))}
                    </ul>
                  </div>
                  {/* Pro plan */}
                  <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <RadioGroup.Item 
                      value="pro" 
                      id="pro"
                      className="w-4 h-4 rounded-full mr-2 cursor-pointer"
                    />
                      <label className="pl-2 font-bold text-lg cursor-pointer" htmlFor="pro">Pro (€199.99)</label>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {planFeatures.pro.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                            {feature}
                          </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <RadioGroup.Item 
                      value="recruiter" 
                      id="recruiter"
                      className="w-4 h-4 rounded-full mr-2 cursor-pointer"
                    />
                      <div className="pl-2">
                        <label className="font-bold text-lg cursor-pointer" htmlFor="recruiter">
                        Recruiter
                        <span className="ml-2 text-gray-500 line-through">€2000</span>
                          <span className="ml-2 text-green-600">€999.99</span>
                        </label>
                        <div className="text-sm text-green-600">Save over 50% for a limited time!</div>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {planFeatures.recruiter.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                            {feature}
                          </li>
                      ))}
                    </ul>
                  </div>
                </RadioGroup.Root>
              </div>
          )}

          <div className="flex justify-center">
            <Button size="4" disabled={isSubmitting} className="min-w-full transition-colors bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
              <span className="px-8">{isSubmitting ? 'Loading...' : (jobDoc ? 'Update' : 'Proceed to Checkout')}</span>
            </Button>
          </div>
        </div>
      </form>
      </Theme>
  );
}
