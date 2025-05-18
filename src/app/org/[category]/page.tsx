import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrganizationsByCategory } from '@/utils/orgs';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Valid categories
const validCategories = ['ngo', 'company', 'think-tank', 'other'];

// Generate static paths for all categories
export function generateStaticParams() {
  return validCategories.map(category => ({ category }));
}

// Generate metadata for each category page
export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const { category } = params;
  
  if (!validCategories.includes(category)) {
    return {
      title: 'Category Not Found — EUJobs Public Affairs Directory',
      robots: 'noindex,nofollow',
    };
  }
  
  const categoryTitle = {
    'ngo': 'NGOs',
    'company': 'Companies',
    'think-tank': 'Think Tanks',
    'other': 'Other Organizations',
    // Default case to ensure it's always defined
    'default': 'Organizations'
  }[validCategories.includes(category) ? category : 'default'];
  
  // By this point categoryTitle is guaranteed to be defined due to our default case
  return {
    title: `${categoryTitle} — EUJobs Public Affairs Directory`,
    description: `Browse EU-focused ${categoryTitle?.toLowerCase() || 'organizations'} registered in the EU Transparency Register. Find information about their work, mission, and more.`,
    robots: 'index,follow',
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  
  // Return 404 for invalid categories
  if (!validCategories.includes(category)) {
    notFound();
  }
  
  // Get organizations for this category
  const organizations = getOrganizationsByCategory(category);
  
  // Get category display name
  const categoryTitle = {
    'ngo': 'NGOs',
    'company': 'Companies',
    'think-tank': 'Think Tanks',
    'other': 'Other Organizations',
    // Default case to ensure it's always defined
    'default': 'Organizations'
  }[validCategories.includes(category) ? category : 'default'];
  
  const categoryDescription = {
    'ngo': 'Non-governmental organizations registered in the EU Transparency Register',
    'company': 'Companies and businesses registered in the EU Transparency Register',
    'think-tank': 'Think tanks and research institutions registered in the EU Transparency Register',
    'other': 'Other organizations registered in the EU Transparency Register',
    // Default case to ensure it's always defined
    'default': 'Organizations registered in the EU Transparency Register'
  }[validCategories.includes(category) ? category : 'default'];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/org" className="text-blue-600 hover:underline">
          ← Back to Directory
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{categoryTitle}</h1>
      <p className="text-gray-600 mb-8">{categoryDescription}</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map(org => (
          <Link 
            key={org.identificationCode}
            href={`/org/${category}/${org.slug}`}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{org.originalName}</h2>
            {org.acronym && <p className="text-gray-700 mb-1">Acronym: {org.acronym}</p>}
            {org.headOffice?.city && org.headOffice?.country && (
              <p className="text-gray-700 mb-1">
                Location: {org.headOffice.city}, {org.headOffice.country}
              </p>
            )}
            {org.interests && org.interests.length > 0 && (
              <p className="text-gray-600 mt-2">
                Interests: {org.interests.slice(0, 3).map(i => i.n).join(', ')}
                {org.interests.length > 3 ? '...' : ''}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
