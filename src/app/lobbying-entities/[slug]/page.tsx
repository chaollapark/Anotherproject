import dbConnect from '@/lib/dbConnect';
import LobbyingEntityModel from '@/models/LobbyingEntity';
import mongoose from 'mongoose';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { 
  LobbyingEntity, 
  LeanLobbyingEntityForPage, 
  LobbyingEntityForStaticParams 
} from '@/types/LobbyingEntity';

export const revalidate = 86400; // Revalidate daily (24 hours in seconds)

async function getEntityBySlug(slug: string): Promise<LobbyingEntity | null> {
  await dbConnect();

  const entityDoc = await LobbyingEntityModel.findOne(
    { slug: slug }, 
    // Expanded projection to include all relevant fields
    '_id slug name originalName acronym description goals webSiteURL identificationCode EPAccreditedNumber EULegislativeProposals EUOffice EUSupportedForumsAndPlatforms communicationActivities entityForm financialData headOffice interOrUnofficalGroupings interestRepresented interests lastUpdateDate levelsOfInterest members rawXML registrationCategory registrationDate structure createdAt updatedAt structureType isMemberOf organisationMembers'
  ).lean<LeanLobbyingEntityForPage>();
  
  if (!entityDoc) return null;

  // Defensive check and logging for missing name
  // Use originalName as a fallback if name is missing
  const displayName = entityDoc.name || entityDoc.originalName;

  if (!displayName) {
    console.error(`[getEntityBySlug] Entity found for slug '${slug}', but both 'name' and 'originalName' fields are missing or empty. EntityDoc:`, entityDoc);
    // Potentially return null or throw an error if no name can be determined
  }

  // Transform the lean document to the LobbyingEntity type
  // Helper to convert Date or string to ISO string, or return undefined
  const toISOStringOrUndefined = (date?: Date | string): string | undefined => {
    if (!date) return undefined;
    return typeof date === 'string' ? date : date.toISOString();
  };

  const result: LobbyingEntity = {
    _id: entityDoc._id.toString(),
    slug: entityDoc.slug,
    name: displayName || '',
    originalName: entityDoc.originalName,
    acronym: entityDoc.acronym,
    description: entityDoc.description,
    goals: entityDoc.goals,
    webSiteURL: entityDoc.webSiteURL, // Standardized field name
    identificationCode: entityDoc.identificationCode,
    EPAccreditedNumber: entityDoc.EPAccreditedNumber,
    EULegislativeProposals: entityDoc.EULegislativeProposals,
    EUOffice: entityDoc.EUOffice, // Assuming direct assignment is fine
    EUSupportedForumsAndPlatforms: entityDoc.EUSupportedForumsAndPlatforms,
    communicationActivities: entityDoc.communicationActivities,
    entityForm: entityDoc.entityForm,
    financialData: entityDoc.financialData, // Assuming direct assignment
    headOffice: entityDoc.headOffice, // Assuming direct assignment
    interOrUnofficalGroupings: entityDoc.interOrUnofficalGroupings,
    interestRepresented: entityDoc.interestRepresented,
    interests: entityDoc.interests, // Assuming direct assignment (string[])
    levelsOfInterest: entityDoc.levelsOfInterest, // Assuming direct assignment (string[])
    members: entityDoc.members, // Assuming direct assignment
    rawXML: entityDoc.rawXML,
    registrationCategory: entityDoc.registrationCategory,
    structure: entityDoc.structure, // Assuming direct assignment
    structureType: entityDoc.structureType,
    isMemberOf: entityDoc.isMemberOf,
    organisationMembers: entityDoc.organisationMembers,

    // Dates (ensure conversion to ISO string)
    lastUpdateDate: toISOStringOrUndefined(entityDoc.lastUpdateDate),
    registrationDate: toISOStringOrUndefined(entityDoc.registrationDate),
    createdAt: entityDoc.createdAt.toISOString(), // Already Date from lean()
    updatedAt: entityDoc.updatedAt.toISOString(), // Already Date from lean()
  };

  // Note: The LobbyingEntity type in src/types/LobbyingEntity.ts has many optional fields.
  // If this page needs to display them, ensure they are:
  // 1. Added to the projection string above.
  // 2. Added to the LeanLobbyingEntityForPage type in src/types/LobbyingEntity.ts (as Date if timestamp, else appropriate type).
  // 3. Mapped here in the result object (converting Dates to ISOStrings if necessary).

  return result;
}

export async function generateStaticParams() {
  try {
    await dbConnect();
    // Use LobbyingEntityForStaticParams for the type of lean() result
    // Explicitly type `entities` as LobbyingEntityForStaticParams[] and let .lean() infer its specific object structure.
    // Mongoose's .find().lean() returns an array of plain objects. For a query selecting 'slug',
    // these objects will be like { _id: ..., slug: ... }, which is compatible with LobbyingEntityForStaticParams ({ slug: string }).
    const entities = (await LobbyingEntityModel.find({}, 'slug').lean()) as unknown as LobbyingEntityForStaticParams[];
    
    return entities.filter(entity => entity.slug).map((entity) => ({
      slug: entity.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for lobbying entities:", error);
    return [];
  }
}

type Props = {
  params: { slug: string };
};

// Helper function to safely get a string value for metadata
const getMetaString = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) return value.join(', ');
  return value;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entity = await getEntityBySlug(params.slug);

  if (!entity) {
    return {
      title: 'Lobbying Entity Not Found',
      description: 'The requested EU lobbying entity could not be found.',
    };
  }

  const pageTitle = `${entity.name || 'Lobbying Entity'} | EU Lobbying Profile`;
  const pageDescription = getMetaString(entity.goals) || getMetaString(entity.description) || `Detailed profile of ${entity.name || 'Unknown Entity'}, an EU lobbying organization. Learn about their interests, goals, and activities.`;
  const entityPageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/lobbying-entities/${entity.slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: entityPageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: entityPageUrl,
      siteName: 'EU Jobs Co', // Consider if this site name is universally applicable
      type: 'article',
      // Article-specific properties are direct children of openGraph when type is 'article'
      publishedTime: entity.registrationDate || entity.createdAt, // Uses existing ISO string dates
      modifiedTime: entity.updatedAt, // Uses existing ISO string date
      authors: entity.name ? [entity.name] : undefined, // The organization as the author of its profile content
      tags: entity.interests || undefined, // Uses the entity's interests as tags
      // Example for images - uncomment and adapt if you have logo URLs
      // images: entity.webSiteURL && entity.webSiteURL.includes('logo.png') ? 
      //   [{ url: entity.webSiteURL }] : 
      //   (process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE ? [{ url: process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE }] : []),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      // images: entity.logo ? [entity.logo] : [], // Placeholder for logo
    },
  };
}

// Helper function to safely render values
const renderValue = (value: any): ReactNode => {
  if (value === null || typeof value === 'undefined') {
    return null;
  }
  
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc list-inside ml-4">
        {value.map((item, index) => <li key={index}>{renderValue(item)}</li>)}
      </ul>
    );
  }
  
  if (typeof value === 'object') {
    // Handle specific object types
    if (value.url || value.href) {
      const url = value.url || value.href;
      return (
        <a 
          href={url.startsWith('http') ? url : `http://${url}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          {url}
        </a>
      );
    }
    
    // Handle phone objects
    if (value.number || value.phone) {
      return <span>{value.number || value.phone}</span>;
    }
    
    // Handle address-like objects
    if (value.street || value.city || value.country) {
      const addressParts = [
        value.street,
        value.city,
        value.postalCode,
        value.country
      ].filter(Boolean);
      return <span>{addressParts.join(', ')}</span>;
    }
    
    // For other objects, render key-value pairs
    const entries = Object.entries(value).filter(([_, v]) => v !== null && v !== undefined && v !== '');
    if (entries.length === 0) return null;
    
    return (
      <div className="ml-4 space-y-1">
        {entries.map(([key, val]) => (
          <div key={key} className="text-sm">
            <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>{' '}
            <span>{renderValue(val)}</span>
          </div>
        ))}
      </div>
    );
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }
  
  return <span>{String(value)}</span>;
};

// Helper components for rendering sections
const DetailItem: React.FC<{ label: string; value?: ReactNode }> = ({ label, value }) => {
  if (value === null || typeof value === 'undefined' || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
    return null;
  }
  
  const renderedValue = typeof value === 'object' && value !== null && !Array.isArray(value) && !React.isValidElement(value) 
    ? renderValue(value) 
    : value;
  
  if (!renderedValue) return null;
  
  return (
    <div className="mb-2">
      <strong className="font-semibold">{label}:</strong>{' '}
      {Array.isArray(value) ? (
        <ul className="list-disc list-inside ml-4">
          {value.map((item, index) => <li key={index}>{renderValue(item)}</li>)}
        </ul>
      ) : (
        renderedValue
      )}
    </div>
  );
};

const ObjectDetails: React.FC<{ label: string; data?: Record<string, any> | null, excludeKeys?: string[] }> = ({ label, data, excludeKeys = [] }) => {
  if (!data || Object.keys(data).length === 0) return null;
  const filteredEntries = Object.entries(data).filter(([key]) => !excludeKeys.includes(key));
  if (filteredEntries.length === 0) return null;

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-md">
      <h3 className="text-xl font-semibold mb-2">{label}</h3>
      {filteredEntries.map(([key, value]) => (
        <DetailItem key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} value={value} />
      ))}
    </div>
  );
};

export default async function LobbyingEntityPage({ params }: Props) {
  const entity = await getEntityBySlug(params.slug);

  if (!entity) {
    notFound(); // Use Next.js notFound function
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Fallback for local dev
  const entityUrl = `${siteUrl}/lobbying-entities/${entity.slug}`;

  const primaryAddress = entity.headOffice || entity.EUOffice;

  // Define base properties, allowing for undefined values
  const baseJsonLdProperties: { [key: string]: any } = {
    "@context": "https://schema.org",
    "@type": "Organization" as const,
    name: entity.name,
    legalName: entity.originalName || entity.name,
    alternateName: entity.acronym,
    url: entityUrl,
    sameAs: entity.webSiteURL ? [entity.webSiteURL] : undefined,
    description: getMetaString(entity.goals) || getMetaString(entity.description) || `Profile of ${entity.name}.`,
    identifier: entity.identificationCode,
    category: entity.registrationCategory,
    foundingDate: entity.registrationDate ? new Date(entity.registrationDate).toISOString().split('T')[0] : undefined,
    address: primaryAddress ? {
        "@type": "PostalAddress" as const,
        streetAddress: primaryAddress.street,
        addressLocality: primaryAddress.city,
        postalCode: primaryAddress.postalCode,
        addressCountry: primaryAddress.country,
      } : undefined,
    contactPoint: entity.headOffice?.phone ? {
         "@type": "ContactPoint" as const,
         telephone: entity.headOffice.phone,
         contactType: "General inquiries"
       } : undefined,
    // logo: entity.logoUrl || undefined, 
    // memberOf: entity.isMemberOf ? { "@type": "Organization", name: entity.isMemberOf } : undefined,
  };

  const keywordsArray = [
    ...(entity.interests || []),
    ...(entity.levelsOfInterest || []),
    entity.registrationCategory,
  ].filter(Boolean);
  const keywordsString = keywordsArray.join(', ');

  if (keywordsString) {
    baseJsonLdProperties.keywords = keywordsString;
  }

  // Create the final jsonLd object by filtering out undefined properties
  const jsonLd: { [key: string]: any } = {};
  Object.keys(baseJsonLdProperties).forEach(key => {
    if (baseJsonLdProperties[key] !== undefined) {
      jsonLd[key] = baseJsonLdProperties[key];
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} // Added null, 2 for pretty print in source
      />
      <article className="prose lg:prose-xl max-w-none">
        <header className="mb-6 pb-4 border-b">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{entity.name}</h1>
          {entity.originalName && entity.originalName !== entity.name && (
            <p className="text-xl text-slate-600 mt-1">Original Name: {entity.originalName}</p>
          )}
          {entity.acronym && <p className="text-lg text-slate-500">Acronym: {entity.acronym}</p>}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">General Information</h2>
            <DetailItem label="Identification Code" value={entity.identificationCode} />
            <DetailItem label="Website" value={entity.webSiteURL} />
            <DetailItem label="Entity Form" value={entity.entityForm} />
            <DetailItem label="Registration Category" value={entity.registrationCategory} />
            <DetailItem label="Registration Date" value={entity.registrationDate ? new Date(entity.registrationDate).toLocaleDateString() : undefined} />
            <DetailItem label="Last Update" value={entity.lastUpdateDate ? new Date(entity.lastUpdateDate).toLocaleDateString() : undefined} />
            <DetailItem label="EP Accredited Number" value={entity.EPAccreditedNumber} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">Mission & Interests</h2>
            <DetailItem label="Goals" value={entity.goals} />
            <DetailItem label="Description" value={entity.description} />
            <DetailItem label="Interests Represented" value={entity.interestRepresented} />
            <DetailItem label="Interests" value={entity.interests} />
            <DetailItem label="Levels of Interest" value={entity.levelsOfInterest} />
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800">Activities</h2>
          <DetailItem label="Main EU Legislative Proposals" value={entity.EULegislativeProposals} />
          <DetailItem label="Communication Activities" value={entity.communicationActivities} />
          <DetailItem label="EU Supported Forums and Platforms" value={entity.EUSupportedForumsAndPlatforms} />
          <DetailItem label="Inter-institutional or Unofficial Groupings" value={entity.interOrUnofficalGroupings} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ObjectDetails label="Head Office" data={entity.headOffice} />
          <ObjectDetails label="EU Office" data={entity.EUOffice} />
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ObjectDetails label="Financial Data" data={entity.financialData} />
          <ObjectDetails label="Membership Information" data={entity.members} />
        </section>

        <section className="mb-6">
           <ObjectDetails label="Structure" data={entity.structure} />
           <DetailItem label="Structure Type" value={entity.structureType} />
           <DetailItem label="Is Member Of" value={entity.isMemberOf} />
           <DetailItem label="Organisation Members" value={entity.organisationMembers} />
        </section>

      </article>
    </div>
  );
}
