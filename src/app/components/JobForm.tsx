'use client';

import { saveJobAction } from "@/app/actions/jobActions";
import type { Job } from "@/models/Job";
import { faEnvelope, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, RadioGroup, TextArea, TextField, Theme } from "@radix-ui/themes";
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

  const planFeatures = {
    basic: [
      'Your job visible on the homepage for 30 days',
      'Instant post after submission',
      'Unlimited revisions',
    ],
    pro: [
      'Your vacancy on the homepage for 30 days',
      'Priority placement + Highlighted',
      'Instant post after submission',
      'Unlimited revisions',
    ],
    Recruiter:[
      'You join the call we do the rest',
      'We fiter the job applications and give you best 20',
      'You can customize what applicant you want',
      'We organize the interviews for you',
      'Everything the pro plan has'
    ]
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
    <Theme>
      <form action={handleSaveJob} className="container mt-6 max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
        )}

        {jobDoc && <input type="hidden" name="id" value={jobDoc._id} />}

        <div className="space-y-6">
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-red-500">*</span>
            </label>
            <TextField.Root required name="title" placeholder="e.g. Senior Frontend Developer" defaultValue={jobDoc?.title || ''} />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
            </label>
            <TextField.Root required name="companyName" placeholder="e.g. Acme Inc." defaultValue={jobDoc?.companyName || ''} />
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
                <RadioGroup.Root defaultValue={seniority} name="seniority" onValueChange={setSeniority} className="">
                  <div className="flex items-center">
                    <RadioGroup.Item value="intern" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Intern</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="entry" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Entry</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="mid" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Mid</span>
                  </div>
                  <div className="flex items-center">
                    <RadioGroup.Item value="senior" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">Senior</span>
                  </div>
                </RadioGroup.Root>
              </div>
            </div>


          <div className="">
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary
            </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                <input
                type="number"
                name="salary"
                defaultValue={jobDoc?.salary?.toString() || ''}
                className="pl-8 pr-16 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">k/year</span>
              </div>
            </div>
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
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-3">Contact Information</label>
            <div className="grid sm:grid-cols-3 gap-4">
              <TextField.Root
              placeholder="Contact Name"
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
              <TextField.Root
              placeholder="Email Address"
              type="email"
              name="contactEmail"
              required
              defaultValue={jobDoc?.contactEmail || ''}>
                <TextField.Slot>
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </TextField.Slot>
                <span className="text-red-500">*</span>
              </TextField.Root>

            </div>
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <TextArea
            defaultValue={jobDoc?.description || ''}
            placeholder="Describe the role, responsibilities, requirements, and benefits..."
            resize="vertical"
            name="description"
            className="min-h-32"
          />
          </div>

          {showPlanSelection && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Select a plan</h3>
                <RadioGroup.Root 
                defaultValue={plan} 
                name="plan" 
                onValueChange={setPlan}
                className="space-y-4"
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
                      value="Recruiter" 
                      id="Recruiter"
                      className="w-4 h-4 rounded-full mr-2 cursor-pointer"
                    />
                      <label className="pl-2 font-bold text-lg cursor-pointer" htmlFor="Recruiter">Recruiter (€999.99)</label>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {planFeatures.Recruiter.map((feature, index) => (
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

          <div className="flex justify-center pt-6">
            <Button size="3" disabled={isSubmitting} className="min-w-32">
              <span className="px-8">{isSubmitting ? 'Saving...' : (jobDoc ? 'Update' : 'Save')}</span>
            </Button>
          </div>
        </div>
      </form>
      </Theme>
  );
}
