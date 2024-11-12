import dbConnect from '@/lib/dbConnect';
import Hero from "@/app/components/Hero";
import Events from "@/app/components/Events";
import { fetchEvents } from "@/models/Event";
import { searchEvents } from "@/app/actions/eventActions";

export const revalidate = 60; // revalidate this page every 60 seconds

export default async function EventsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  await dbConnect();
  
  const searchPhrase = typeof searchParams.search === 'string' ? searchParams.search : '';
  
  const events = searchPhrase
    ? await searchEvents(searchPhrase)
    : await fetchEvents(10);
    
  const header = searchPhrase ? `Search Results for "${searchPhrase}"` : "Upcoming Events";

  return (
    <>
      {/*<Hero />*/}
      <Events header={header} initialEvents={events} isSearchResult={!!searchPhrase} />
    </>
  );
}
