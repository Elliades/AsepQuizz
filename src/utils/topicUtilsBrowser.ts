/**
 * Topic Utilities for Browser
 * 
 * This utility provides functions to work with topics as the central organizing
 * principle for connecting source materials with quiz content.
 * 
 * This is a browser-compatible version that works with pre-loaded data.
 */
import { IndexData, Topic, TopicsMap } from './sourcesTypes';
import indexData from '../data/subjects/index.json';

// Cache the index data
const indexCache = indexData as IndexData;

/**
 * Gets all topics
 * @returns Array of all topics
 */
export function getAllTopics(): Topic[] {
  // If topicsArray exists, use it
  if (indexCache.topicsArray) {
    return indexCache.topicsArray;
  }
  
  // Otherwise, convert the topics object to an array
  return Object.values(indexCache.topics || {});
}

/**
 * Gets a topic by name
 * @param topicName The name of the topic to retrieve
 * @returns The topic object or null if not found
 */
export function getTopicByName(topicName: string): Topic | null {
  // Direct lookup from the topics object (more efficient)
  if (indexCache.topics && indexCache.topics[topicName]) {
    return indexCache.topics[topicName];
  }
  
  // Fallback to array search
  return getAllTopics().find(topic => topic.name === topicName) || null;
}

/**
 * Gets topics by source ID
 * @param sourceId The ID of the source
 * @returns Array of topics related to the source
 */
export function getTopicsBySourceId(sourceId: string): Topic[] {
  return getAllTopics().filter(topic => 
    topic.sources.some(source => source.id === sourceId)
  );
}

/**
 * Gets topics by chapter ID
 * @param chapterId The ID of the chapter
 * @returns Array of topics related to the chapter
 */
export function getTopicsByChapterId(chapterId: string): Topic[] {
  return getAllTopics().filter(topic => 
    topic.chapters.some(chapter => chapter.id === chapterId)
  );
}

/**
 * Gets topics by section ID
 * @param sectionId The ID of the section
 * @returns Array of topics related to the section
 */
export function getTopicsBySectionId(sectionId: string): Topic[] {
  return getAllTopics().filter(topic => 
    topic.sections.some(section => section.id === sectionId)
  );
}

/**
 * Searches for topics by keyword
 * @param keyword The keyword to search for
 * @returns Array of topics that match the keyword
 */
export function searchTopics(keyword: string): Topic[] {
  const lowerKeyword = keyword.toLowerCase();
  
  // If we have the topics object, we can do a more efficient search
  if (indexCache.topics) {
    return Object.values(indexCache.topics).filter(topic => 
      topic.name.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // Fallback to array search
  return getAllTopics().filter(topic => 
    topic.name.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Gets related topics for a given topic
 * @param topicName The name of the topic
 * @returns Array of related topics
 */
export function getRelatedTopics(topicName: string): Topic[] {
  const topic = getTopicByName(topicName);
  if (!topic) return [];
  
  const relatedTopics: Topic[] = [];
  
  // Find topics that share sources, chapters, or sections
  for (const otherTopic of getAllTopics()) {
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
  getAllTopics,
  getTopicByName,
  getTopicsBySourceId,
  getTopicsByChapterId,
  getTopicsBySectionId,
  searchTopics,
  getRelatedTopics
}; 