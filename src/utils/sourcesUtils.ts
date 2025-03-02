/**
 * Sources Utility
 * 
 * This utility provides functions to search and retrieve data from the sources.json file.
 * It offers various ways to query the hierarchical structure of subjects, chapters, sections, and topics.
 */
import fs from 'fs';
import path from 'path';

// Types for sources data
interface SourceSection {
  id: string;
  name: string;
  subjectId?: string;
  topics: string[];
  sections?: SourceSection[];
}

interface SourceChapter {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  startPage: number;
  topics: string[];
  sections: SourceSection[];
}

interface Source {
  id: string;
  name: string;
  description: string;
  chapters: SourceChapter[];
}

interface SourcesData {
  sources: Source[];
}

// Cache the sources data to avoid repeated file reads
let sourcesCache: SourcesData | null = null;

/**
 * Loads the sources data from sources.json
 * @returns The sources data object
 */
export function loadSources(): SourcesData {
  if (sourcesCache) {
    return sourcesCache;
  }

  try {
    const sourcesPath = path.join(__dirname, '../data/subjects/sources.json');
    const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8')) as SourcesData;
    sourcesCache = sourcesData;
    return sourcesData;
  } catch (error) {
    console.error('Error loading sources data:', error);
    return { sources: [] };
  }
}

/**
 * Gets all sources
 * @returns Array of all sources
 */
export function getAllSources(): Source[] {
  return loadSources().sources;
}

/**
 * Gets a source by ID
 * @param sourceId The ID of the source to retrieve
 * @returns The source object or null if not found
 */
export function getSourceById(sourceId: string): Source | null {
  return loadSources().sources.find(source => source.id === sourceId) || null;
}

/**
 * Gets all chapters from all sources
 * @returns Array of all chapters
 */
export function getAllChapters(): SourceChapter[] {
  return loadSources().sources.flatMap(source => source.chapters);
}

/**
 * Gets a chapter by ID
 * @param chapterId The ID of the chapter to retrieve
 * @returns The chapter object or null if not found
 */
export function getChapterById(chapterId: string): SourceChapter | null {
  const allChapters = getAllChapters();
  return allChapters.find(chapter => chapter.id === chapterId) || null;
}

/**
 * Gets chapters for a specific source
 * @param sourceId The ID of the source
 * @returns Array of chapters for the source
 */
export function getChaptersBySourceId(sourceId: string): SourceChapter[] {
  const source = getSourceById(sourceId);
  return source ? source.chapters : [];
}

/**
 * Gets all sections from all chapters
 * @returns Array of all sections
 */
export function getAllSections(): SourceSection[] {
  return getAllChapters().flatMap(chapter => chapter.sections || []);
}

/**
 * Gets a section by ID
 * @param sectionId The ID of the section to retrieve
 * @returns The section object or null if not found
 */
export function getSectionById(sectionId: string): SourceSection | null {
  // Helper function to search for a section recursively
  function findSection(sections: SourceSection[]): SourceSection | null {
    for (const section of sections) {
      if (section.id === sectionId) {
        return section;
      }
      if (section.sections && section.sections.length > 0) {
        const found = findSection(section.sections);
        if (found) return found;
      }
    }
    return null;
  }

  const allChapters = getAllChapters();
  for (const chapter of allChapters) {
    if (chapter.sections && chapter.sections.length > 0) {
      const found = findSection(chapter.sections);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Gets sections for a specific chapter
 * @param chapterId The ID of the chapter
 * @returns Array of sections for the chapter
 */
export function getSectionsByChapterId(chapterId: string): SourceSection[] {
  const chapter = getChapterById(chapterId);
  return chapter ? chapter.sections || [] : [];
}

/**
 * Searches for topics across all sources
 * @param query The search query
 * @returns Array of matching topics with their context
 */
export function searchTopics(query: string): { 
  topic: string; 
  sourceId: string; 
  sourceName: string;
  chapterId: string;
  chapterName: string;
  sectionId?: string;
  sectionName?: string;
}[] {
  const results: {
    topic: string;
    sourceId: string;
    sourceName: string;
    chapterId: string;
    chapterName: string;
    sectionId?: string;
    sectionName?: string;
  }[] = [];

  const sources = getAllSources();
  const lowerQuery = query.toLowerCase();

  // Helper function to search for topics in a section
  function searchSectionTopics(
    section: SourceSection, 
    sourceId: string, 
    sourceName: string,
    chapterId: string,
    chapterName: string
  ) {
    if (section.topics) {
      section.topics.forEach(topic => {
        if (topic.toLowerCase().includes(lowerQuery)) {
          results.push({
            topic,
            sourceId,
            sourceName,
            chapterId,
            chapterName,
            sectionId: section.id,
            sectionName: section.name
          });
        }
      });
    }

    // Recursively search subsections
    if (section.sections) {
      section.sections.forEach(subsection => {
        searchSectionTopics(subsection, sourceId, sourceName, chapterId, chapterName);
      });
    }
  }

  // Search through all sources, chapters, and sections
  sources.forEach(source => {
    source.chapters.forEach(chapter => {
      // Search chapter topics
      if (chapter.topics) {
        chapter.topics.forEach(topic => {
          if (topic.toLowerCase().includes(lowerQuery)) {
            results.push({
              topic,
              sourceId: source.id,
              sourceName: source.name,
              chapterId: chapter.id,
              chapterName: chapter.name
            });
          }
        });
      }

      // Search section topics
      if (chapter.sections) {
        chapter.sections.forEach(section => {
          searchSectionTopics(section, source.id, source.name, chapter.id, chapter.name);
        });
      }
    });
  });

  return results;
}

/**
 * Gets the full path to a section (source > chapter > section > subsection)
 * @param sectionId The ID of the section
 * @returns The full path as an array of objects or null if not found
 */
export function getSectionPath(sectionId: string): {
  type: 'source' | 'chapter' | 'section';
  id: string;
  name: string;
}[] | null {
  // Helper function to find a section and build its path
  function findSectionPath(
    sections: SourceSection[], 
    currentPath: { type: 'source' | 'chapter' | 'section'; id: string; name: string; }[]
  ): { type: 'source' | 'chapter' | 'section'; id: string; name: string; }[] | null {
    for (const section of sections) {
      const newPath = [...currentPath, { type: 'section', id: section.id, name: section.name }];
      
      if (section.id === sectionId) {
        return newPath;
      }
      
      if (section.sections && section.sections.length > 0) {
        const found = findSectionPath(section.sections, newPath);
        if (found) return found;
      }
    }
    return null;
  }

  const sources = getAllSources();
  for (const source of sources) {
    const sourcePath = [{ type: 'source' as const, id: source.id, name: source.name }];
    
    for (const chapter of source.chapters) {
      const chapterPath = [...sourcePath, { type: 'chapter' as const, id: chapter.id, name: chapter.name }];
      
      if (chapter.sections && chapter.sections.length > 0) {
        const found = findSectionPath(chapter.sections, chapterPath);
        if (found) return found;
      }
    }
  }
  
  return null;
}

/**
 * Gets related topics for a given topic
 * @param topic The topic to find related topics for
 * @returns Array of related topics
 */
export function getRelatedTopics(topic: string): string[] {
  const results = searchTopics(topic);
  if (results.length === 0) return [];
  
  // Get the first result's context
  const firstResult = results[0];
  
  // Find all topics in the same section/chapter
  const relatedTopics: string[] = [];
  
  const sources = getAllSources();
  sources.forEach(source => {
    if (source.id === firstResult.sourceId) {
      source.chapters.forEach(chapter => {
        if (chapter.id === firstResult.chapterId) {
          // Add chapter topics
          chapter.topics.forEach(t => {
            if (t !== topic && !relatedTopics.includes(t)) {
              relatedTopics.push(t);
            }
          });
          
          // If we have a section, add section topics
          if (firstResult.sectionId) {
            const findSection = (sections: SourceSection[]): SourceSection | null => {
              for (const section of sections) {
                if (section.id === firstResult.sectionId) {
                  return section;
                }
                if (section.sections && section.sections.length > 0) {
                  const found = findSection(section.sections);
                  if (found) return found;
                }
              }
              return null;
            };
            
            const section = findSection(chapter.sections);
            if (section) {
              section.topics.forEach(t => {
                if (t !== topic && !relatedTopics.includes(t)) {
                  relatedTopics.push(t);
                }
              });
            }
          }
        }
      });
    }
  });
  
  return relatedTopics;
}

export default {
  loadSources,
  getAllSources,
  getSourceById,
  getAllChapters,
  getChapterById,
  getChaptersBySourceId,
  getAllSections,
  getSectionById,
  getSectionsByChapterId,
  searchTopics,
  getSectionPath,
  getRelatedTopics
}; 