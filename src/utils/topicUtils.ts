/**
 * Topic Utilities
 * 
 * This utility provides functions to work with topics as the central organizing
 * principle for connecting source materials with quiz content.
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { IndexData, Topic } from './sourcesTypes.js';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache the index data to avoid repeated file reads
let indexCache: IndexData | null = null;

/**
 * Loads the index data from index.json
 * @returns The index data object
 */
export async function loadIndex(): Promise<IndexData> {
  if (indexCache) {
    return indexCache;
  }

  try {
    const indexPath = path.join(__dirname, '../data/subjects/index.json');
    const indexData = await fs.readJson(indexPath) as IndexData;
    indexCache = indexData;
    return indexData;
  } catch (error) {
    console.error('Error loading index data:', error);
    return { subjects: [], topics: [], metadata: { version: "0.0.0", generated: "", topicCount: 0, subjectCount: 0 } };
  }
}

/**
 * Gets all topics
 * @returns Array of all topics
 */
export async function getAllTopics(): Promise<Topic[]> {
  const indexData = await loadIndex();
  return indexData.topics;
}

/**
 * Gets a topic by name
 * @param topicName The name of the topic to retrieve
 * @returns The topic object or null if not found
 */
export async function getTopicByName(topicName: string): Promise<Topic | null> {
  const indexData = await loadIndex();
  return indexData.topics.find(topic => topic.name === topicName) || null;
}

/**
 * Gets topics by source ID
 * @param sourceId The ID of the source
 * @returns Array of topics related to the source
 */
export async function getTopicsBySourceId(sourceId: string): Promise<Topic[]> {
  const indexData = await loadIndex();
  return indexData.topics.filter(topic => 
    topic.sources.some(source => source.id === sourceId)
  );
}

/**
 * Gets topics by chapter ID
 * @param chapterId The ID of the chapter
 * @returns Array of topics related to the chapter
 */
export async function getTopicsByChapterId(chapterId: string): Promise<Topic[]> {
  const indexData = await loadIndex();
  return indexData.topics.filter(topic => 
    topic.chapters.some(chapter => chapter.id === chapterId)
  );
}

/**
 * Gets topics by section ID
 * @param sectionId The ID of the section
 * @returns Array of topics related to the section
 */
export async function getTopicsBySectionId(sectionId: string): Promise<Topic[]> {
  const indexData = await loadIndex();
  return indexData.topics.filter(topic => 
    topic.sections.some(section => section.id === sectionId)
  );
}

/**
 * Searches for topics by keyword
 * @param keyword The keyword to search for
 * @returns Array of topics that match the keyword
 */
export async function searchTopics(keyword: string): Promise<Topic[]> {
  const indexData = await loadIndex();
  const lowerKeyword = keyword.toLowerCase();
  
  return indexData.topics.filter(topic => 
    topic.name.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Gets related topics for a given topic
 * @param topicName The name of the topic
 * @returns Array of related topics
 */
export async function getRelatedTopics(topicName: string): Promise<Topic[]> {
  const topic = await getTopicByName(topicName);
  if (!topic) return [];
  
  const indexData = await loadIndex();
  const relatedTopics: Topic[] = [];
  
  // Find topics that share sources, chapters, or sections
  for (const otherTopic of indexData.topics) {
    if (otherTopic.name === topicName) continue;
    
    // Check if they share sources
    const sharedSources = otherTopic.sources.some(source => 
      topic.sources.some(s => s.id === source.id)
    );
    
    // Check if they share chapters
    const sharedChapters = otherTopic.chapters.some(chapter => 
      topic.chapters.some(c => c.id === chapter.id)
    );
    
    // Check if they share sections
    const sharedSections = otherTopic.sections.some(section => 
      topic.sections.some(s => s.id === section.id)
    );
    
    if (sharedSources || sharedChapters || sharedSections) {
      relatedTopics.push(otherTopic);
    }
  }
  
  return relatedTopics;
}

export default {
  loadIndex,
  getAllTopics,
  getTopicByName,
  getTopicsBySourceId,
  getTopicsByChapterId,
  getTopicsBySectionId,
  searchTopics,
  getRelatedTopics
}; 