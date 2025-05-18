import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrganizationBySlug, getRelatedOrganizations, generateWhyWorkHere, getOrganizationsByCategory } from '@/utils/orgs';

// Mark this page as dynamically rendered
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface OrganizationPageProps {
  params: {
    category: string;
    slug: string;
  };
}

// Generate metadata for each organization page
export function generateMetadata({ params }: OrganizationPageProps): Metadata {
  const { category, slug } = params;
  const organization = getOrganizationBySlug(category, slug);
  
  if (!organization) {
    return {
      title: 'Organization Not Found — EUJobs Public Affairs Directory',
      robots: 'noindex,nofollow',
    };
  }
  
  // Get primary sectors/interests for meta description
  const sectors = organization.interests ? 
    organization.interests.slice(0, 3).map(i => i.n).join(', ') : 
    'policy areas';
  
  const categoryName = {
    'ngo': 'NGO',
    'company': 'company',
    'think-tank': 'think tank',
    'other': 'organization'
  }[category];
  
  return {
    title: `${organization.originalName} — EUJobs Public Affairs Directory`,
    description: `Learn about ${organization.originalName}, an EU-focused ${categoryName} working in ${sectors}. See jobs, mission, and funding insights.`,
    robots: 'index,follow',
  };
}

export default function OrganizationPage({ params }: OrganizationPageProps) {
  const { category, slug } = params;
  const organization = getOrganizationBySlug(category, slug);
  
  // Return 404 if organization not found
  if (!organization) {
    notFound();
  }
  
  const whyWorkHere = generateWhyWorkHere(organization);
  const relatedOrganizations = getRelatedOrganizations(category, slug, 3);
  
  // Format website URL for display and linking
  const websiteUrl = organization.webSiteURL ? 
    (organization.webSiteURL.startsWith('http') ? organization.webSiteURL : `http://${organization.webSiteURL}`) : 
    null;
  
  // Get funding sources if available and ensure it's an array
  const fundingSources = Array.isArray(organization.financialData?.closedYear?.fundingSources) 
    ? organization.financialData.closedYear.fundingSources.map((src: {source: string}) => src.source)
    : [];
  
  // Get total budget if available
  const totalBudget = organization.financialData?.closedYear?.totalBudget?.absoluteCost;
  
  // Get organization schema.org JSON-LD data
  const orgSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': organization.originalName,
    'url': websiteUrl,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': organization.headOffice?.city,
      'addressCountry': organization.headOffice?.country,
      'postalCode': organization.headOffice?.postCode,
      'streetAddress': organization.headOffice?.address
    },
    'description': organization.goals || `${organization.originalName} is an organization registered in the EU Transparency Register.`
  };
  
  return (
    <>
      {/* Add Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgSchemaData)
        }}
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/org" className="hover:underline">Directory</Link>
            <span className="mx-2">›</span>
            <Link href={`/org/${category}`} className="hover:underline">
              {category === 'ngo' ? 'NGOs' : 
               category === 'company' ? 'Companies' : 
               category === 'think-tank' ? 'Think Tanks' : 
               'Other Organizations'}
            </Link>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-900">{organization.originalName}</span>
          </div>
        </div>
        
        {/* Organization header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{organization.originalName}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {organization.acronym && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {organization.acronym}
              </span>
            )}
            {organization.entityForm && (
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {organization.entityForm}
              </span>
            )}
          </div>
          
          <div className="text-gray-700">
            {organization.headOffice?.city && organization.headOffice?.country && (
              <p className="mb-2">
                <strong>Head Office:</strong> {organization.headOffice.city}, {organization.headOffice.country}
              </p>
            )}
            
            {websiteUrl && (
              <p className="mb-2">
                <strong>Website:</strong> <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{organization.webSiteURL}</a>
              </p>
            )}
          </div>
        </header>
        
        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Goals section */}
            {organization.goals && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Goals & Mission</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{organization.goals}</p>
                </div>
              </section>
            )}
            
            {/* EU Legislative priorities */}
            {organization.EULegislativeProposals && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">EU Legislative Priorities</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{organization.EULegislativeProposals}</p>
                </div>
              </section>
            )}
            
            {/* Funding and budget */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Funding & Budget</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {fundingSources.length > 0 && (
                  <div className="mb-3">
                    <h3 className="font-medium mb-1">Funding Sources:</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {fundingSources.map((source, index) => (
                        <li key={index}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {totalBudget && (
                  <div>
                    <h3 className="font-medium mb-1">Most Recent Total Budget:</h3>
                    <p className="text-gray-700">&euro;{typeof totalBudget === 'number' ? totalBudget.toLocaleString() : totalBudget}</p>
                  </div>
                )}
                
                {fundingSources.length === 0 && !totalBudget && (
                  <p className="text-gray-700">Funding information not available.</p>
                )}
              </div>
            </section>
            
            {/* Why work here section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Why Work Here?</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{whyWorkHere}</p>
              </div>
            </section>
            
            {/* Current jobs section (placeholder) */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Current Open Jobs</h2>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-3">No current job listings from this organization.</p>
                <Link href="/" className="text-blue-600 hover:underline">
                  Browse all job listings
                </Link>
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Related organizations */}
            {relatedOrganizations.length > 0 && (
              <section className="mb-8 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Similar Organizations</h2>
                <ul className="space-y-3">
                  {relatedOrganizations.map(org => (
                    <li key={org.identificationCode}>
                      <Link 
                        href={`/org/${org.category}/${org.slug}`}
                        className="block hover:bg-gray-100 p-3 rounded-md transition-colors"
                      >
                        <h3 className="font-medium">{org.originalName}</h3>
                        {org.headOffice?.city && (
                          <p className="text-gray-600 text-sm">{org.headOffice.city}, {org.headOffice.country}</p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Interests and sectors */}
            {organization.interests && organization.interests.length > 0 && (
              <section className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Sectors & Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {organization.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest.n}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
