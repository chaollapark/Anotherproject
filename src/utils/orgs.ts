import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export interface Organization {
  identificationCode: string;
  registrationDate: string;
  lastUpdateDate: string;
  originalName: string;
  acronym?: string;
  entityForm?: string;
  webSiteURL?: string;
  registrationCategory: string;
  headOffice: {
    address?: string;
    postCode?: string;
    city?: string;
    country?: string;
  };
  goals?: string;
  EULegislativeProposals?: string;
  interests?: Array<{n: string}>;
  financialData?: {
    closedYear?: {
      startDate?: string;
      endDate?: string;
      totalBudget?: {
        absoluteCost?: string | number;
      };
      fundingSources?: Array<{source: string}>;
    };
  };
}

export interface ParsedOrganization extends Organization {
  category: 'ngo' | 'company' | 'think-tank' | 'other';
  slug: string;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function determineCategory(registrationCategory: string): 'ngo' | 'company' | 'think-tank' | 'other' {
  if (registrationCategory.includes('Non-governmental')) {
    return 'ngo';
  } else if (
    registrationCategory.includes('Trade') ||
    registrationCategory.includes('Business') ||
    registrationCategory.includes('Commercial')
  ) {
    return 'company';
  } else if (registrationCategory.includes('Think tanks')) {
    return 'think-tank';
  } else {
    return 'other';
  }
}

export function getOrganizations(): ParsedOrganization[] {
  const xmlFilePath = path.join(process.cwd(), 'public/data/ODP_30-06-2024.xml');
  const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name) => ['interestRepresentative', 'levelOfInterest', 'interest', 'fundingSource'].includes(name),
  });
  
  const result = parser.parse(xmlData);
  const organizations = result.ListOfIRPublicDetail.resultList.interestRepresentative || [];
  
  return organizations.map(org => {
    // Extract originalName from nested structure
    const originalName = org.n?.originalName || 'Unknown Organization';
    
    // Parse and transform the organization data
    const parsedOrg: ParsedOrganization = {
      ...org,
      originalName,
      category: determineCategory(org.registrationCategory),
      slug: generateSlug(originalName),
    };
    
    return parsedOrg;
  });
}

export function getOrganizationsByCategory(category: string): ParsedOrganization[] {
  return getOrganizations().filter(org => org.category === category);
}

export function getOrganizationBySlug(category: string, slug: string): ParsedOrganization | undefined {
  return getOrganizations().find(
    org => org.category === category && org.slug === slug
  );
}

export function getRelatedOrganizations(category: string, currentSlug: string, limit = 5): ParsedOrganization[] {
  const orgsInCategory = getOrganizationsByCategory(category);
  
  // Exclude the current organization and pick random ones
  const filteredOrgs = orgsInCategory.filter(org => org.slug !== currentSlug);
  
  // Shuffle array to get random selection
  const shuffled = [...filteredOrgs].sort(() => 0.5 - Math.random());
  
  // Return limited number of organizations
  return shuffled.slice(0, limit);
}

export function generateWhyWorkHere(org: ParsedOrganization): string {
  let summary = `${org.originalName} is an EU-focused ${org.category === 'ngo' ? 'non-governmental organization' : 
    org.category === 'company' ? 'company' : 
    org.category === 'think-tank' ? 'think tank' : 'organization'}`;
  
  // Add information about their goals if available
  if (org.goals && org.goals.length > 10) {
    // Extract first sentence or partial content
    const firstSentence = org.goals.split('.')[0] + '.';
    summary += ` that ${firstSentence.toLowerCase().startsWith('to ') ? firstSentence.substring(3) : firstSentence}`;
  }
  
  // Add information about interests/sectors if available
  if (org.interests && org.interests.length > 0) {
    const sectors = org.interests.slice(0, 3).map(interest => interest.n).join(', ');
    summary += ` Their work focuses on ${sectors}.`;
  }
  
  // Add information about location if available
  if (org.headOffice?.city && org.headOffice?.country) {
    summary += ` Based in ${org.headOffice.city}, ${org.headOffice.country},`;
  }
  
  // Add general appeal
  summary += ` joining ${org.originalName} offers an opportunity to contribute to important EU policy work${org.EULegislativeProposals ? ' including ' + org.EULegislativeProposals.split('.')[0].toLowerCase() : ''}.`;
  
  return summary;
}
