import { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

export const metadata: Metadata = {
  title: 'Search | EU Jobs',
  description: 'Search for jobs, organizations, articles, and career guides across the EU Jobs platform.',
};

export default function SearchPage() {
  return <SearchPageClient />;
}
