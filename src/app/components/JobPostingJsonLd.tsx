'use client';

import { Job } from '@/models/Job';

interface JobPostingJsonLdProps {
  job: Job;
}

const JobPostingJsonLd: React.FC<JobPostingJsonLdProps> = ({ job }) => {
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
  
  // Get experience requirements based on seniority
  const getExperienceRequirements = (seniority: string | undefined) => {
    if (!seniority) return undefined;
    
    const seniorityLower = seniority.toLowerCase();
    if (seniorityLower.includes('intern') || seniorityLower.includes('junior')) {
      return 'EntryLevel';
    } else if (seniorityLower.includes('mid')) {
      return 'MidLevel';
    } else if (seniorityLower.includes('senior')) {
      return 'SeniorLevel';
    }
    return undefined;
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
  
  // Get proper experience requirements
  const experienceReq = job.experienceRequirements || getExperienceRequirements(job.seniority);
  
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
    // Add direct apply link if available
    ...(job.applyLink && {
      applicationUrl: job.applyLink
    }),
    // Add experience level if available
    ...(experienceReq && {
      experienceRequirements: experienceReq
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
