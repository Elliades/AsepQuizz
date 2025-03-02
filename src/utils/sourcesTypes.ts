/**
 * Types for sources data
 * 
 * These types define the structure of the sources.json file and are used
 * by both the sourcesUtils.ts and generateIndex.ts files.
 */

export interface SourceSection {
  id: string;
  name: string;
  subjectId?: string;
  description?: string;
  topics: string[];
  sections?: SourceSection[];
}

export interface SourceChapter {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  startPage?: number;
  topics: string[];
  sections: SourceSection[];
}

export interface Source {
  id: string;
  name: string;
  description: string;
  chapters: SourceChapter[];
}

export interface SourcesData {
  sources: Source[];
} 