/**
 * Sources Utility for Browser
 * 
 * This utility provides functions to work with the sources data in a browser environment.
 */
import { Source, SourceChapter, SourceSection } from './sourcesTypes';
import indexData from '../data/subjects/index.json';

/**
 * Gets all sources
 * @returns Array of all sources
 */
export function getAllSources(): Source[] {
  return indexData.subjects.map(subject => ({
    id: subject.id,
    name: subject.name,
    description: subject.description,
    chapters: subject.chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      subjectId: chapter.subjectId,
      topics: chapter.topics,
      sections: [] // Note: sections are not included in the index.json
    }))
  }));
}

/**
 * Gets a source by ID
 * @param sourceId The ID of the source to retrieve
 * @returns The source object or null if not found
 */
export function getSourceById(sourceId: string): Source | null {
  const subject = indexData.subjects.find(s => s.id === sourceId);
  if (!subject) return null;
  
  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    chapters: subject.chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      subjectId: chapter.subjectId,
      topics: chapter.topics,
      sections: [] // Note: sections are not included in the index.json
    }))
  };
}

/**
 * Gets all chapters from all sources
 * @returns Array of all chapters
 */
export function getAllChapters(): SourceChapter[] {
  return indexData.subjects.flatMap(subject => 
    subject.chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      subjectId: chapter.subjectId,
      topics: chapter.topics,
      sections: [] // Note: sections are not included in the index.json
    }))
  );
}

/**
 * Gets a chapter by ID
 * @param chapterId The ID of the chapter to retrieve
 * @returns The chapter object or null if not found
 */
export function getChapterById(chapterId: string): SourceChapter | null {
  for (const subject of indexData.subjects) {
    const chapter = subject.chapters.find(c => c.id === chapterId);
    if (chapter) {
      return {
        id: chapter.id,
        name: chapter.name,
        description: chapter.description,
        subjectId: chapter.subjectId,
        topics: chapter.topics,
        sections: [] // Note: sections are not included in the index.json
      };
    }
  }
  return null;
}

export default {
  getAllSources,
  getSourceById,
  getAllChapters,
  getChapterById
}; 