import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import LobbyingEntityModel from '@/models/LobbyingEntity';
import { Metadata } from 'next';
import { getTopInterests, InterestAggregation } from '@/lib/interestAggregation';

interface LobbyingEntityTeaser {
  _id: string;
  slug: string;
  name: string; // This will hold the display name (name or originalName)
  originalName?: string; // Optional, for reference if needed
}

// Interface for the raw document structure from .lean()
interface FetchedLobbyingDoc {
  _id: { toString: () => string }; // Mongoose ObjectId has toString()
  name?: string; // Name might be missing
  originalName?: string; // originalName might be missing or be the primary source
  slug: string;
}

const ITEMS_PER_PAGE = 20; // Adjust as needed

async function getLobbyingEntities(page: number = 1, interestFilter?: string) {
  await dbConnect();
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  // Build query filter
  const query: any = {};
  if (interestFilter) {
    query.interests = { $in: [interestFilter] };
  }
  
  const entityDocs = await LobbyingEntityModel.find(query, 'name originalName slug _id') // Select specific fields, including originalName
    .sort({ name: 1 }) // Sort by name alphabetically
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .lean<FetchedLobbyingDoc[]>(); // Specify the type for lean objects

  const totalEntities = await LobbyingEntityModel.countDocuments(query);
  
  // Mongoose .lean() with select should give plain objects with _id as string if it's an ObjectId
  // but explicitly mapping to ensure the interface is met, especially for _id.
  // With FetchedLobbyingDoc, 'doc' is now correctly typed.
  const entities: LobbyingEntityTeaser[] = entityDocs.map(doc => {
    const displayName = doc.name || doc.originalName;
    return {
      _id: doc._id.toString(),
      name: displayName || '', // Ensure name is always a string
      originalName: doc.originalName,
      slug: doc.slug,
    };
  });

  return {
    entities,
    totalEntities,
    totalPages: Math.ceil(totalEntities / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export const metadata: Metadata = {
  title: 'EU Lobbying Entities Directory',
  description: 'Browse a comprehensive directory of EU lobbying organizations and their profiles.',
};

export default async function LobbyingEntitiesIndexPage({ searchParams }: { searchParams?: { page?: string; interest?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const interestFilter = searchParams?.interest;
  const { entities, totalEntities, totalPages } = await getLobbyingEntities(currentPage, interestFilter);
  
  // Get top interests for filter chips
  const interestData = await getTopInterests();

  // Helper function to build URL with interest filter
  const getFilterUrl = (interest?: string, page: number = 1) => {
    const params = new URLSearchParams();
    if (interest) params.set('interest', interest);
    if (page > 1) params.set('page', page.toString());
    return `/lobbying-entities${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">EU Lobbying Entities Directory</h1>
      
      {/* Interest Filter Chips */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Filter by Interest:</h2>
        <div className="flex flex-wrap gap-2">
          {/* All/Clear filter chip */}
          <Link 
            href={getFilterUrl()}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !interestFilter 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({totalEntities})
          </Link>
          
          {/* Top 10 interest chips */}
          {interestData.topInterests.map((item) => (
            <Link
              key={item.interest}
              href={getFilterUrl(item.interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                interestFilter === item.interest
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.interest} ({item.count})
            </Link>
          ))}
          
          {/* Other interests chip */}
          {interestData.otherInterestsCount > 0 && (
            <Link
              href="/lobbying-entities/interests"
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-dashed border-gray-400"
            >
              Other interests ({interestData.otherInterestsCount})
            </Link>
          )}
        </div>
        
        {/* Active filter indicator */}
        {interestFilter && (
          <div className="mt-3 text-sm text-gray-600">
            Showing entities with interest: <span className="font-semibold">{interestFilter}</span>
            {' • '}
            <Link href={getFilterUrl()} className="text-blue-600 hover:underline">
              Clear filter
            </Link>
          </div>
        )}
      </div>
      
      {entities.length > 0 ? (
        <>
          <ul className="space-y-4">
            {entities.map((entity) => (
              <li key={entity._id.toString()} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/lobbying-entities/${entity.slug}`} className="text-xl font-semibold text-blue-700 hover:underline">
                  {entity.name || entity.slug} {/* Display slug if name is falsy */}
                </Link>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav className="mt-8 flex justify-center items-center space-x-4" aria-label="Pagination">
              {currentPage > 1 && (
                <Link href={getFilterUrl(interestFilter, currentPage - 1)} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  &laquo; Previous
                </Link>
              )}
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={getFilterUrl(interestFilter, currentPage + 1)} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  Next &raquo;
                </Link>
              )}
            </nav>
          )}
          <p className="text-center mt-4 text-sm text-gray-600">Total entities: {totalEntities}</p>
        </>
      ) : (
        <p className="text-lg">No lobbying entities found at the moment. Please check back later.</p>
      )}
    </div>
  );
}
