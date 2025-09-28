import Link from 'next/link';
import { Metadata } from 'next';
import { getAllInterests } from '@/lib/interestAggregation';

export const metadata: Metadata = {
  title: 'All EU Lobbying Interests | EU Lobbying Entities Directory',
  description: 'Browse all interests represented by EU lobbying organizations.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function AllInterestsPage() {
  const allInterests = await getAllInterests();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/lobbying-entities" 
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Lobbying Entities
        </Link>
        <h1 className="text-3xl font-bold">All EU Lobbying Interests</h1>
        <p className="text-gray-600 mt-2">
          Complete list of all interests represented by EU lobbying organizations
        </p>
      </div>

      {allInterests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allInterests.map((item) => (
            <Link
              key={item.interest}
              href={`/lobbying-entities?interest=${encodeURIComponent(item.interest)}`}
              className="block p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900 flex-1 mr-2">
                  {item.interest}
                </h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  {item.count} {item.count === 1 ? 'entity' : 'entities'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No interests found</h2>
          <p className="text-gray-500">
            No lobbying entities have interests recorded in the database.
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Total unique interests: {allInterests.length}
        </p>
      </div>
    </div>
  );
}
