'use client';

import { saveJobAction } from "@/app/actions/jobActions";
import type { Job } from "@/models/Job";
import { faEnvelope, faPhone, faRoad, faUser, faCalendar, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, RadioGroup, TextArea, TextField, Theme } from "@radix-ui/themes";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import { loadStripe } from '@stripe/stripe-js';
import posthog from 'posthog-js';
import RichTextEditor from "./jobform/RichTextEditor";
import DiscountCodeInput from "./jobform/DiscountCodeProps";

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
  const [seniority, setSeniority] = useState(jobDoc?.seniority || 'junior');
  const [plan, setPlan] = useState(jobDoc?.plan || 'basic');
  const [price, setPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0); // Store the discounted price
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState(false);
  const [jobDescription, setJobDescription] = useState(jobDoc?.description || '');

  const planPrices: Record<string, number> = {
    
    basic: 200,
    pro: 400,
    recruiter: 500,
  };

  useEffect(() => {
    const selectedPlanPrice = planPrices[plan];
    setPrice(selectedPlanPrice);
    setDiscountedPrice(selectedPlanPrice); // Reset the discounted price when plan changes
  }, [plan]);

  const planFeatures = {
    basic: [
      'Job listing live for 30 days on our high-traffic homepage',
      'Reach 110 000+ targeted professionals searching for EU jobs',
      'Instant job posting—go live in minutes',
      'Unlimited edits & updates to your listing anytime',
      'Included in our bi-weekly newsletter',
    ],
    pro: [
      'Everything in the Basic Plan, plus:',
      'Priority placement at the top of our homepage',
      'Highlighted listing—stand out and attract more applicants',
      'Featured in our bi-weekly newsletter',
    ],
    recruiter: [
      'Everything in the Pro Plan, plus:',
      'Full candidate vetting & meeting scheduling',
      'You pay us after you hire one of our candidates',
      'We vet candidates and set up meetings',
      '500 upfront and 1300 after you hire',
    ],
  };

async function handleSaveJob(data: FormData) {
  setIsSubmitting(true);
  setError(null);

  try {
    // Add required fields to the form data
    data.set('country', countryName);
    data.set('state', stateName);
    data.set('city', cityName);
    data.set('countryId', countryId.toString());
    data.set('stateId', stateId.toString());
    data.set('cityId', cityId.toString());
    data.set('seniority', seniority);
    data.set('description', jobDescription);
    data.set('price', discountedPrice.toString()); // Pass the discounted price to the backend

    // Handle the "Basic" plan FREE
    // if (plan === 'basic') {
    //   data.set('plan', 'basic'); // Explicitly set the plan as "basic"
    // } else {
    //   data.set('plan', 'pending'); // Use "pending" for paid plans until payment is completed
    // }
    // Paid Basic Plan
    if (plan === 'basic' || plan === 'pro' || plan === 'recruiter') {
      data.set('plan', 'pending'); // Set all plans to "pending" until payment is completed
    }

    // Save the job and get the job ID
    const savedJob = await saveJobAction(data);

    // Redirect immediately for the "Basic" plan
    // if (plan === 'basic') {
    //   router.push('/');
    //   return;
    // }

    // For paid plans, initiate Stripe checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize.');
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: savedJob._id, // Job ID from the backend
        plan, // Selected plan
        price: discountedPrice, // Final price after discount
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Checkout session creation failed: ${responseData.error || 'Unknown error'}`);
    }

    if (!responseData.sessionId) {
      throw new Error('No session ID returned from the server.');
    }
    
    posthog.capture('proceeded_to_checkout', {
      plan,
      price: discountedPrice
    });

    const result = await stripe.redirectToCheckout({
      sessionId: responseData.sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error during job save or checkout:', error);
    setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
  } finally {
    setIsSubmitting(false);
  }
}

  const showPlanSelection = !jobDoc;

  return (
    <Theme className="md:w-1/2">
      <h1 className="text-4xl font-extrabold mb-2">Post Your Job in the EU&apos;s Capital</h1>
        <h4 className="text-md text-gray-600">For Questions, contact us on <a className="text-blue-600 hover:text-blue-700" href="mailto:ceo@zatjob.com">ceo@zatjob.com</a></h4>
        
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
                    <RadioGroup.Item value="mid-level" className="w-4 h-4 rounded-full border border-gray-300" />
                    <span className="ml-2 text-gray-700">mid-level</span>
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

            <div className="pb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
              <span className="text-red-500">*</span>
              </label>
                <RichTextEditor jobDoc={jobDoc} onChange={(html) => setJobDescription(html)} />
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
            onValueChange={(value) => {
              setPlan(value);
              setDiscountedPrice(planPrices[value]);
              posthog.capture('selected_plan', {
                plan: value,
                price: planPrices[value]
              });
            }}
                className="space-y-4s"
              >
                  <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <RadioGroup.Item 
                      value="basic" 
                      id="basic"
                      className="w-4 h-4 rounded-full mr-2 cursor-pointer"
                    />
                        <label className="pl-2 font-bold text-lg cursor-pointer" htmlFor="basic">Basic (€200)</label>
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
                      <label className="pl-2 font-bold text-lg cursor-pointer" htmlFor="pro">Pro (€400)</label>
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

                  {/* Recruiter plan */}
                  <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-500 transition-colors">
                    <div className="flex items-center mb-2">
                      <RadioGroup.Item 
                      value="recruiter" 
                      id="recruiter"
                      className="w-4 h-4 rounded-full mr-2 cursor-pointer"
                    />
                      <div className="pl-2">
                        <label className="font-bold text-lg cursor-pointer" htmlFor="recruiter">
                        Recruiter (€500 upfront + 1300 Success Fee)
                        </label>
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

              <DiscountCodeInput
                originalPrice={price}
                onApplyDiscount={(discountedPrice) => setDiscountedPrice(discountedPrice)}
              />
              </div>
          )}

            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-md">
                {error}
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
