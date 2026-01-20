/**
 * Search utilities for the EU Jobs website
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface SearchResult {
  id: string;
  type: 'job' | 'entity' | 'blog' | 'career-guide';
  title: string;
  description: string;
  url: string;
  highlights?: string[];
  metadata?: Record<string, any>;
  score?: number;
}

export interface SearchOptions {
  query: string;
  types?: ('job' | 'entity' | 'blog' | 'career-guide')[];
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number; // milliseconds
}

/**
 * Escape special regex characters in search query
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create a case-insensitive regex for search
 */
export function createSearchRegex(query: string): RegExp {
  const escaped = escapeRegex(query.trim());
  return new RegExp(escaped, 'i');
}

/**
 * Extract a snippet around the matched text
 */
export function extractSnippet(
  text: string,
  query: string,
  maxLength: number = 200
): string {
  if (!text) return '';
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) {
    // No match found, return beginning of text
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  }
  
  // Calculate start and end positions for snippet
  const snippetStart = Math.max(0, index - 50);
  const snippetEnd = Math.min(text.length, index + query.length + 150);
  
  let snippet = text.substring(snippetStart, snippetEnd);
  
  // Add ellipsis if needed
  if (snippetStart > 0) snippet = '...' + snippet;
  if (snippetEnd < text.length) snippet = snippet + '...';
  
  return snippet;
}

/**
 * Highlight matching text in a string
 */
export function highlightMatch(text: string, query: string): string {
  if (!text || !query) return text;
  
  const regex = createSearchRegex(query);
  return text.replace(regex, '<mark>$&</mark>');
}

/**
 * Calculate a simple relevance score
 */
export function calculateScore(
  item: { title?: string; description?: string; name?: string },
  query: string
): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;
  
  const title = (item.title || item.name || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  
  // Exact title match gets highest score
  if (title === lowerQuery) score += 100;
  // Title starts with query
  else if (title.startsWith(lowerQuery)) score += 75;
  // Title contains query
  else if (title.includes(lowerQuery)) score += 50;
  
  // Description contains query
  if (description.includes(lowerQuery)) score += 25;
  
  // Word boundary matches get bonus
  const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(lowerQuery)}\\b`, 'i');
  if (wordBoundaryRegex.test(title)) score += 20;
  if (wordBoundaryRegex.test(description)) score += 10;
  
  return score;
}

/**
 * Get all blog posts for search
 */
export function getBlogPosts(): Array<{
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  date?: string;
}> {
  const blogDir = path.join(process.cwd(), 'src', 'blog');
  
  if (!fs.existsSync(blogDir)) {
    return [];
  }
  
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  return files.map(filename => {
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      slug: filename.replace('.md', ''),
      title: data.title || filename.replace('.md', '').replace(/-/g, ' '),
      content: content,
      excerpt: data.excerpt || content.substring(0, 200),
      date: data.date,
    };
  });
}

/**
 * Search blog posts
 */
export function searchBlogPosts(
  query: string,
  limit: number = 10
): SearchResult[] {
  const posts = getBlogPosts();
  const regex = createSearchRegex(query);
  
  const results: SearchResult[] = [];
  
  for (const post of posts) {
    const titleMatch = regex.test(post.title);
    const contentMatch = regex.test(post.content);
    
    if (titleMatch || contentMatch) {
      results.push({
        id: post.slug,
        type: 'blog',
        title: post.title,
        description: extractSnippet(post.content, query),
        url: `/blog/${post.slug}`,
        score: calculateScore({ title: post.title, description: post.content }, query),
        metadata: {
          date: post.date,
        },
      });
    }
  }
  
  // Sort by score and limit
  return results
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);
}
