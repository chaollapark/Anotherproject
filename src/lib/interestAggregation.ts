import dbConnect from '@/lib/dbConnect';
import LobbyingEntityModel from '@/models/LobbyingEntity';

export interface InterestCount {
  interest: string;
  count: number;
}

export interface InterestAggregation {
  topInterests: InterestCount[];
  otherInterestsCount: number;
  totalEntitiesWithInterests: number;
}

/**
 * Get the top 10 most common interests and count of remaining interests
 */
export async function getTopInterests(): Promise<InterestAggregation> {
  await dbConnect();

  // Aggregate to unwind interests array and count occurrences
  const aggregationResult = await LobbyingEntityModel.aggregate([
    // Only include documents that have interests
    { $match: { interests: { $exists: true, $ne: null, $not: { $size: 0 } } } },
    // Unwind the interests array to create a document for each interest
    { $unwind: '$interests' },
    // Filter out empty or null interests
    { $match: { $and: [{ interests: { $ne: null } }, { interests: { $ne: '' } }] } },
    // Group by interest and count
    { 
      $group: { 
        _id: '$interests', 
        count: { $sum: 1 } 
      } 
    },
    // Sort by count descending
    { $sort: { count: -1 } },
    // Collect all results into a single document
    { 
      $group: {
        _id: null,
        interests: { 
          $push: { 
            interest: '$_id', 
            count: '$count' 
          } 
        }
      }
    }
  ]);

  // Also get total count of entities that have interests
  const totalEntitiesWithInterests = await LobbyingEntityModel.countDocuments({
    interests: { $exists: true, $ne: null, $not: { $size: 0 } }
  });

  if (!aggregationResult || aggregationResult.length === 0) {
    return {
      topInterests: [],
      otherInterestsCount: 0,
      totalEntitiesWithInterests
    };
  }

  const allInterests = aggregationResult[0].interests || [];
  const topInterests = allInterests.slice(0, 10);
  const otherInterests = allInterests.slice(10);
  const otherInterestsCount = otherInterests.reduce((sum: number, item: InterestCount) => sum + item.count, 0);

  return {
    topInterests,
    otherInterestsCount,
    totalEntitiesWithInterests
  };
}

/**
 * Get all interests with their counts (for the "Other interests" view)
 */
export async function getAllInterests(): Promise<InterestCount[]> {
  await dbConnect();

  const aggregationResult = await LobbyingEntityModel.aggregate([
    { $match: { interests: { $exists: true, $ne: null, $not: { $size: 0 } } } },
    { $unwind: '$interests' },
    { $match: { $and: [{ interests: { $ne: null } }, { interests: { $ne: '' } }] } },
    { 
      $group: { 
        _id: '$interests', 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        interest: '$_id',
        count: 1
      }
    }
  ]);

  return aggregationResult;
}
