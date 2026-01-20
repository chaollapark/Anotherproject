import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { JobModel } from '@/models/Job';
import LobbyingEntity from '@/models/LobbyingEntity';
import CareerGuideModel from '@/models/CareerGuide';
import {
  SearchResult,
  SearchResponse,
  escapeRegex,
  extractSnippet,
  calculateScore,
  searchBlogPosts,
} from '@/lib/searchUtils';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const typesParam = searchParams.get('types'); // comma-separated: job,entity,blog,career-guide
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Validate query
    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (query.length > 200) {
      return NextResponse.json(
        { error: 'Search query too long' },
        { status: 400 }
      );
    }

    // Parse options
    const types = typesParam
      ? (typesParam.split(',') as ('job' | 'entity' | 'blog' | 'career-guide')[])
      : ['job', 'entity', 'blog', 'career-guide'];
    const limit = Math.min(parseInt(limitParam || String(DEFAULT_LIMIT), 10), MAX_LIMIT);
    const offset = parseInt(offsetParam || '0', 10);

    await dbConnect();

    const results: SearchResult[] = [];
    const searchRegex = new RegExp(escapeRegex(query), 'i');

    // Search Jobs
    if (types.includes('job')) {
      const jobResults = await searchJobs(query, searchRegex, limit);
      results.push(...jobResults);
    }

    // Search Lobbying Entities
    if (types.includes('entity')) {
      const entityResults = await searchEntities(query, searchRegex, limit);
      results.push(...entityResults);
    }

    // Search Blog Posts
    if (types.includes('blog')) {
      const blogResults = searchBlogPosts(query, limit);
      results.push(...blogResults);
    }

    // Search Career Guides
    if (types.includes('career-guide')) {
      const guideResults = await searchCareerGuides(query, searchRegex, limit);
      results.push(...guideResults);
    }

    // Sort all results by score
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    const response: SearchResponse = {
      results: paginatedResults,
      total: results.length,
      query,
      took: Date.now() - startTime,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

async function searchJobs(
  query: string,
  searchRegex: RegExp,
  limit: number
): Promise<SearchResult[]> {
  const jobs = await JobModel.find({
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { companyName: searchRegex },
      { city: searchRegex },
      { country: searchRegex },
    ],
    plan: { $ne: 'pending' }, // Only show approved jobs
  })
    .select('_id title slug description companyName city country seniority createdAt')
    .limit(limit * 2) // Get more to allow for scoring
    .lean();

  return jobs.map((job: any) => ({
    id: job._id.toString(),
    type: 'job' as const,
    title: job.title || 'Untitled Job',
    description: extractSnippet(job.description || '', query),
    url: `/jobs/${job.slug}`,
    score: calculateScore({ title: job.title, description: job.description }, query),
    metadata: {
      companyName: job.companyName,
      city: job.city,
      country: job.country,
      seniority: job.seniority,
      createdAt: job.createdAt,
    },
  }));
}

async function searchEntities(
  query: string,
  searchRegex: RegExp,
  limit: number
): Promise<SearchResult[]> {
  const entities = await LobbyingEntity.find({
    $or: [
      { name: searchRegex },
      { originalName: searchRegex },
      { description: searchRegex },
      { goals: searchRegex },
      { interests: searchRegex },
      { acronym: searchRegex },
    ],
  })
    .select('_id name slug description goals interests registrationCategory')
    .limit(limit * 2)
    .lean();

  return entities.map((entity: any) => ({
    id: entity._id.toString(),
    type: 'entity' as const,
    title: entity.name || 'Unknown Entity',
    description: extractSnippet(entity.goals || entity.description || '', query),
    url: `/lobbying-entities/${entity.slug}`,
    score: calculateScore({ name: entity.name, description: entity.goals || entity.description }, query),
    metadata: {
      category: entity.registrationCategory,
      interests: entity.interests?.slice(0, 3),
    },
  }));
}

async function searchCareerGuides(
  query: string,
  searchRegex: RegExp,
  limit: number
): Promise<SearchResult[]> {
  try {
    const guides = await CareerGuideModel.find({
      $or: [
        { title: searchRegex },
        { organization: searchRegex },
      ],
      success: true,
    })
      .select('_id title organization entityId wordCount')
      .limit(limit * 2)
      .lean();

    return guides.map((guide: any) => ({
      id: guide._id.toString(),
      type: 'career-guide' as const,
      title: guide.title || `Career Guide - ${guide.organization}`,
      description: `Complete career guide for ${guide.organization}`,
      url: `/lobbying-entities/${guide.entityId}#career-guide`,
      score: calculateScore({ title: guide.title, description: guide.organization }, query),
      metadata: {
        organization: guide.organization,
        wordCount: guide.wordCount,
      },
    }));
  } catch (error) {
    // Career guides collection might not exist yet
    console.warn('Career guides search failed:', error);
    return [];
  }
}
