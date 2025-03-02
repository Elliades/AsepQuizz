/**
 * Quiz Topic Mapper
 * 
 * This utility helps map quiz chapter/topic references to the standardized topics
 * in the index.json file. It provides functions to find the correct topic name
 * for a given chapter name or section name.
 */
import { Topic } from './sourcesTypes';
import topicUtils from './topicUtilsBrowser';

// Cache for chapter/section to topic mappings
const chapterToTopicCache = new Map<string, string>();
const sectionToTopicCache = new Map<string, string>();

/**
 * Normalizes a string for comparison by removing punctuation,
 * converting to lowercase, and removing extra spaces
 * 
 * @param str The string to normalize
 * @returns The normalized string
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Replace multiple spaces with a single space
    .trim();
}

/**
 * Finds the best matching topic for a given chapter name
 * 
 * @param chapterName The chapter name from the quiz
 * @returns The matching topic name or the original chapter name if no match is found
 */
export function findTopicForChapter(chapterName: string): string {
  // Check cache first
  if (chapterToTopicCache.has(chapterName)) {
    return chapterToTopicCache.get(chapterName)!;
  }

  const normalizedChapterName = normalizeString(chapterName);
  const allTopics = topicUtils.getAllTopics();
  
  // First, try to find an exact match in topic names
  const exactMatch = allTopics.find(topic => 
    normalizeString(topic.name) === normalizedChapterName
  );
  
  if (exactMatch) {
    chapterToTopicCache.set(chapterName, exactMatch.name);
    return exactMatch.name;
  }
  
  // Next, try to find a match in chapter names
  for (const topic of allTopics) {
    for (const chapter of topic.chapters) {
      if (normalizeString(chapter.name) === normalizedChapterName) {
        chapterToTopicCache.set(chapterName, topic.name);
        return topic.name;
      }
    }
  }
  
  // If no match is found, try to find a partial match in topic names
  const partialMatch = allTopics.find(topic => 
    normalizeString(topic.name).includes(normalizedChapterName) ||
    normalizedChapterName.includes(normalizeString(topic.name))
  );
  
  if (partialMatch) {
    chapterToTopicCache.set(chapterName, partialMatch.name);
    return partialMatch.name;
  }
  
  // If still no match, return the original chapter name
  chapterToTopicCache.set(chapterName, chapterName);
  return chapterName;
}

/**
 * Finds the best matching topic for a given section name
 * 
 * @param sectionName The section name from the quiz
 * @returns The matching topic name or the original section name if no match is found
 */
export function findTopicForSection(sectionName: string): string {
  // Check cache first
  if (sectionToTopicCache.has(sectionName)) {
    return sectionToTopicCache.get(sectionName)!;
  }

  const normalizedSectionName = normalizeString(sectionName);
  const allTopics = topicUtils.getAllTopics();
  
  // First, try to find an exact match in topic names
  const exactMatch = allTopics.find(topic => 
    normalizeString(topic.name) === normalizedSectionName
  );
  
  if (exactMatch) {
    sectionToTopicCache.set(sectionName, exactMatch.name);
    return exactMatch.name;
  }
  
  // Next, try to find a match in section names
  for (const topic of allTopics) {
    for (const section of topic.sections) {
      if (normalizeString(section.name) === normalizedSectionName) {
        sectionToTopicCache.set(sectionName, topic.name);
        return topic.name;
      }
    }
  }
  
  // If no match is found, try to find a partial match in topic names
  const partialMatch = allTopics.find(topic => 
    normalizeString(topic.name).includes(normalizedSectionName) ||
    normalizedSectionName.includes(normalizeString(topic.name))
  );
  
  if (partialMatch) {
    sectionToTopicCache.set(sectionName, partialMatch.name);
    return partialMatch.name;
  }
  
  // If still no match, return the original section name
  sectionToTopicCache.set(sectionName, sectionName);
  return sectionName;
}

/**
 * Finds the best matching topic for a given question
 * 
 * @param question The question object with topic and chapter fields
 * @returns The best matching topic name
 */
export function findTopicForQuestion(question: { topic?: string, chapter?: string }): string {
  // If the question already has a topic, try to match it
  if (question.topic) {
    const topicMatch = findTopicForChapter(question.topic);
    if (topicMatch !== question.topic) {
      return topicMatch;
    }
  }
  
  // If no topic match or no topic, try to match by chapter
  if (question.chapter) {
    return findTopicForChapter(question.chapter);
  }
  
  // If no matches found, return a default topic
  return "General";
}

export default {
  normalizeString,
  findTopicForChapter,
  findTopicForSection,
  findTopicForQuestion
}; 