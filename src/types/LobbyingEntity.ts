// src/types/LobbyingEntity.ts

import mongoose from 'mongoose';

// Placeholder interfaces for complex nested objects.
// These can be expanded with specific properties if known.
export interface EUOfficeDetails {
  // Example properties, adjust as needed based on actual data structure
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  [key: string]: any; // Allows for other unspecified properties
}

export interface FinancialDataDetails {
  // Example properties
  turnoverMin?: number;
  turnoverMax?: number;
  costMin?: number;
  costMax?: number;
  currency?: string;
  financialYear?: string;
  [key: string]: any;
}

export interface HeadOfficeDetails {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
  [key: string]: any;
}

export interface MembersDetails {
  count?: number;
  memberType?: string; // Or a more specific type if known
  [key: string]: any;
}

export interface StructureDetails {
  // Example properties
  numberOfNaturalPersons?: number;
  numberOfOrganisations?: number;
  [key: string]: any;
}

export interface LobbyingEntity {
  // Standardized website URL field based on sample data
  webSiteURL?: string; 
  _id: string; // MongoDB ObjectId as a string
  slug: string; 
  name: string; 
  originalName?: string; 
  acronym?: string; 
  
  description?: string; 
  goals?: string; 
  


  identificationCode?: string;
  EPAccreditedNumber?: number | string; // Sample shows 0, could be string in other cases
  EULegislativeProposals?: string;
  EUOffice?: EUOfficeDetails;
  EUSupportedForumsAndPlatforms?: string;
  
  communicationActivities?: string;
  entityForm?: string; 
  
  financialData?: FinancialDataDetails;
  
  headOffice?: HeadOfficeDetails;
  interOrUnofficalGroupings?: string;
  interestRepresented?: string;
  interests?: string[]; 
  
  lastUpdateDate?: string; // ISO date string
  levelsOfInterest?: string[]; 
  
  members?: MembersDetails;
  rawXML?: string; // Stringified XML/JSON, consider if this should be parsed into an object
  registrationCategory?: string;
  registrationDate?: string; // ISO date string
  
  structure?: StructureDetails;
  structureType?: string;
  isMemberOf?: string;
  organisationMembers?: string;

  // Timestamps from Mongoose schema (if timestamps: true)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // __v is a Mongoose internal, usually not needed in frontend types
}

// This type can be used for the .lean() result from Mongoose queries
// when you select a subset of fields and _id is still an ObjectId.
// K represents the keys from LobbyingEntity that are actually fetched.
export type LeanLobbyingEntity<K extends keyof LobbyingEntity = keyof LobbyingEntity> = 
  Pick<LobbyingEntity, K> & { _id: mongoose.Types.ObjectId };

// Specific lean type for the getEntityBySlug function's projection
// It includes all fields that are selected in the query and are part of the LobbyingEntity interface.
export type LeanLobbyingEntityForPage = 
  Pick<LobbyingEntity, 
    'slug' | 'name' | 'originalName' | 'acronym' | 'description' | 'goals' | 'webSiteURL' | 
    'identificationCode' | 'EPAccreditedNumber' | 'EULegislativeProposals' | 
    'EUSupportedForumsAndPlatforms' | 'communicationActivities' | 'entityForm' | 
    'interOrUnofficalGroupings' | 'interestRepresented' | 'interests' | 
    'levelsOfInterest' | 'rawXML' | 'registrationCategory' | 'structureType' | 'isMemberOf' | 'organisationMembers'
  > & 
  {
    // Fields that are objects or might need special handling from lean()
    EUOffice?: EUOfficeDetails; 
    financialData?: FinancialDataDetails;
    headOffice?: HeadOfficeDetails;
    members?: MembersDetails;
    structure?: StructureDetails;

    // Date fields from DB (Mongoose timestamps are already Date)
    // Other date fields might be Date or string from lean(), handle accordingly
    lastUpdateDate?: Date | string;
    registrationDate?: Date | string;
    _id: mongoose.Types.ObjectId;
    createdAt: Date; 
    updatedAt: Date; 
  };

// Type for generateStaticParams which only needs the slug
export type LobbyingEntityForStaticParams = Pick<LobbyingEntity, 'slug'>;
