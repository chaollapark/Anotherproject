# Task: Implement Search Feature

## Overview
Add a comprehensive search feature to the EU Jobs website that allows users to search across jobs, lobbying entities, blog posts, and career guides.

## Implementation Plan

### 1. Backend - Search API ✅
- [x] Create `/api/search` endpoint
- [x] Implement search across multiple collections:
  - [x] Jobs (title, description, companyName, city, country)
  - [x] Lobbying Entities (name, description, goals, interests)
  - [x] Blog Posts (title, content)
  - [x] Career Guides (title, organization)
- [x] Add pagination support
- [x] Add filtering by type (jobs, entities, blog, guides)

### 2. Search Utilities ✅
- [x] Create searchUtils.ts with helper functions
- [x] Regex escaping and search pattern creation
- [x] Snippet extraction with context
- [x] Relevance scoring algorithm
- [x] Blog post file system search

### 3. Frontend Components ✅
- [x] Create SearchBar component (header integration ready)
- [x] Create SearchModal with instant results
- [x] Create SearchResultCard components for each type
- [x] Add keyboard shortcuts (Cmd/Ctrl + K)
- [x] Add recent searches (localStorage)

### 4. Search Results Page ✅
- [x] Create /search page
- [x] Categorized results display with filters
- [x] Highlight matching text
- [x] Load more pagination
- [x] Mobile-responsive design

### 5. Testing
- [ ] Unit tests for search API
- [ ] Component tests for SearchBar

## Files Created
- src/lib/searchUtils.ts - Search utility functions
- src/app/api/search/route.ts - Search API endpoint
- src/app/components/SearchBar.tsx - Search trigger button
- src/app/components/SearchModal.tsx - Instant search modal
- src/app/components/SearchResultCard.tsx - Result display card
- src/app/search/page.tsx - Search results page
- src/app/search/SearchPageClient.tsx - Client-side search page

## Usage
1. Add SearchBar component to header/navbar
2. Press Cmd/Ctrl + K to open search modal
3. Navigate to /search for full search page