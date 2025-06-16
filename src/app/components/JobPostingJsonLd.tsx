'use client';

import { Job } from '@/models/Job';

interface JobPostingJsonLdProps {
  job: Job;
  currentUrl?: string; // Add current URL for canonical link generation
}

const JobPostingJsonLd: React.FC<JobPostingJsonLdProps> = ({ job, currentUrl }) => {
  // Convert employment type to Schema.org format
  const getEmploymentType = (type: string) => {
    const types: { [key: string]: string } = {
      'full': 'FULL_TIME',
      'part': 'PART_TIME',
      'contract': 'CONTRACTOR',
      'temporary': 'TEMPORARY',
      'intern': 'INTERN',
    };
    return types[type.toLowerCase()] || type.toUpperCase();
  };
  
  // Helper for kebab-case conversion
  const toKebabCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
      .replace(/\-\-+/g, '-')        // Replace multiple - with single -
      .replace(/^-+/, '')               // Trim - from start
      .replace(/-+$/, '');              // Trim - from end
  };

  // Generate canonical URL for a job using existing slug
  const getCanonicalUrl = (host: string = 'eujobs.co'): string => {
    // Use the job's existing slug instead of generating a new one
    return `https://${host}/jobs/${job.slug}`;
  };

  // Map job level to valid OccupationalExperienceRequirements for Google
  const getExperienceRequirements = () => {
    // If a numeric value is already provided, use it
    if (typeof job.experienceRequirements === 'number') {
      return {
        value: {
          '@type': 'OccupationalExperienceRequirements',
          monthsOfExperience: job.experienceRequirements * 12,
          description: `${job.experienceRequirements} years of experience`
        }
      };
    }

    // Infer from seniority or title
    const title = job.title?.toLowerCase() || '';
    const seniority = job.seniority?.toLowerCase() || '';
    const combinedText = `${title} ${seniority}`;

    if (combinedText.includes('intern') || combinedText.includes('junior')) {
      return {
        value: {
          '@type': 'OccupationalExperienceRequirements',
          monthsOfExperience: 0,
          description: 'No experience required'
        }
      };
    } else if (combinedText.includes('mid')) {
      return {
        value: {
          '@type': 'OccupationalExperienceRequirements',
          monthsOfExperience: 60,
          description: 'At least 5 years of experience'
        }
      };
    } else if (combinedText.includes('senior')) {
      return {
        value: {
          '@type': 'OccupationalExperienceRequirements',
          monthsOfExperience: 96,
          description: 'At least 8 years of experience'
        }
      };
    }

    // Fallback: if a string is present, use as description only
    if (job.experienceRequirements && typeof job.experienceRequirements === 'string') {
      return {
        value: {
          '@type': 'OccupationalExperienceRequirements',
          description: job.experienceRequirements
        }
      };
    }

    return { value: undefined };
  };

  
  // Estimate salary based on seniority or title
  const estimateBaseSalary = () => {
    if (job.salary) return null; // Don't estimate if salary exists
    
    const title = job.title?.toLowerCase() || '';
    const seniority = job.seniority?.toLowerCase() || '';
    const combinedText = `${title} ${seniority}`;
    
    if (combinedText.includes('intern')) {
      return {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          value: 12000,
          unitText: 'YEAR',
        },
      };
    } else if (combinedText.includes('junior')) {
      return {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          value: 45000,
          unitText: 'YEAR',
        },
      };
    } else if (combinedText.includes('mid')) {
      return {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          value: 70000,
          unitText: 'YEAR',
        },
      };
    } else if (combinedText.includes('senior')) {
      return {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          value: 100000,
          unitText: 'YEAR',
        },
      };
    }
    return null;
  };
  
  // Calculate validThrough date if missing
  const getValidThrough = () => {
    if (job.expiresOn) return job.expiresOn;
    if (!job.createdAt) return undefined;
    
    try {
      const postedDate = new Date(job.createdAt);
      const validThroughDate = new Date(postedDate);
      validThroughDate.setDate(postedDate.getDate() + 60); // 60 days from posting date
      return validThroughDate.toISOString();
    } catch (error) {
      console.error('Error calculating validThrough date:', error);
      return undefined;
    }
  };

  // Prepare job location data with defaults where necessary
  const jobLocationAddress = {
    '@type': 'PostalAddress',
    streetAddress: job.street || "Rue de la Loi 100",
    addressLocality: job.city || "Brussels",
    postalCode: job.postalCode || "1000",
    addressRegion: job.state || "Brussels-Capital",
    addressCountry: job.country || "BE"
  };
  
  // Calculate estimated salary if needed
  const estimatedSalary = estimateBaseSalary();
  
  // Check if applicationUrl is on our domain or needs to be canonical
  const getApplicationUrl = () => {
    // Extract host from currentUrl if provided
    let currentHost = 'eujobs.co';
    if (currentUrl) {
      try {
        const url = new URL(currentUrl);
        currentHost = url.hostname;
      } catch (e) {
        console.error('Error parsing currentUrl:', e);
      }
    }
    
    // If no applyLink exists, use our canonical URL
    if (!job.applyLink) {
      return getCanonicalUrl(currentHost);
    }
    
    // Check if existing applyLink is on our domain
    try {
      const applyUrl = new URL(job.applyLink);
      if (applyUrl.hostname === currentHost) {
        // Link already points to our domain, keep it
        return job.applyLink;
      }
      // Link points elsewhere, use canonical URL
      return getCanonicalUrl(currentHost);
    } catch (e) {
      // Invalid URL, use canonical URL
      return getCanonicalUrl(currentHost);
    }
  };
  
  // Process experience requirements
  const experienceData = getExperienceRequirements();
  
  // Handle qualifications
  let qualifications = '';
  if (experienceData.value && experienceData.value.description) {
    qualifications = experienceData.value.description;
  }
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: getValidThrough(),

    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName,
    },
    jobLocation: {
      '@type': 'Place',
      address: jobLocationAddress,
    },
    employmentType: getEmploymentType(job.type),
    url: getCanonicalUrl(currentHost),
    
    // Add salary if available or estimated
    ...(job.salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salary,
          unitText: 'YEAR',
        },
      },
    }),
    // Add estimated salary if necessary
    ...(estimatedSalary && {
      baseSalary: estimatedSalary,
    }),
    // Add contact information if available
    ...(job.contactEmail && {
      applicationContact: {
        '@type': 'ContactPoint',
        email: job.contactEmail,
        ...(job.contactPhone && { telephone: job.contactPhone }),
        ...(job.contactName && { name: job.contactName }),
      },
    }),
    // Add experience requirements if available
    ...(experienceData.value && {
      experienceRequirements: experienceData.value
    }),
    // Add qualifications if available
    ...(qualifications && {
      qualifications: qualifications
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JobPostingJsonLd;
