import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EU Public Affairs Directory — EUJobs',
  description: 'Browse organizations registered in the EU Transparency Register. Find NGOs, companies, think tanks and more.',
  robots: 'index,follow',
};

export default function OrgDirectory() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">EU Public Affairs Directory</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/org/ngo"
          className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">NGOs</h2>
          <p className="text-gray-600">Non-governmental organizations working on EU policy issues</p>
        </Link>
        
        <Link 
          href="/org/company"
          className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Companies</h2>
          <p className="text-gray-600">Businesses and commercial entities engaged in EU affairs</p>
        </Link>
        
        <Link 
          href="/org/think-tank"
          className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Think Tanks</h2>
          <p className="text-gray-600">Research institutions and policy think tanks</p>
        </Link>
        
        <Link 
          href="/org/other"
          className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Other Organizations</h2>
          <p className="text-gray-600">Other entities in the EU Transparency Register</p>
        </Link>
      </div>
    </div>
  );
}
