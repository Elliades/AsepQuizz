import sources from '../data/subjects/sources.json';
import subjectsIndex from '../data/subjects/index.json';
import { Question } from '../types';

/**
 * Computes source information for a question based on its topic and chapter
 * @param topic Question topic
 * @param chapter Question chapter reference
 * @returns Source information string
 */
export const computeQuestionSource = (topic: string, chapter?: string): string => {
  // Find topic in index
  const topicInfo = subjectsIndex.topics[topic];
  
  if (!topicInfo) {
    return 'Unknown source';
  }
  
  // Get primary source
  const primarySource = topicInfo.sources[0];
  
  if (!primarySource) {
    return 'Unknown source';
  }
  
  // Find detailed source info
  const sourceDetail = sources.sources.find(s => s.id === primarySource.id);
  
  if (!sourceDetail) {
    return primarySource.name;
  }
  
  // If no chapter is provided, just return the source name
  if (!chapter) {
    return sourceDetail.name;
  }
  
  // Find chapter info if provided
  const chapterInfo = sourceDetail.chapters.find(c => 
    c.name === chapter || c.id === chapter
  );
  
  if (chapterInfo) {
    return `${sourceDetail.name}, Chapter ${chapterInfo.name} (p.${chapterInfo.startPage})`;
  }
  
  // If we couldn't find the chapter, just return the source name
  return sourceDetail.name;
};

/**
 * Ensures question has proper source information
 * @param question Question to process
 * @returns Question with computed source info
 */
export const ensureQuestionSource = (question: Question): Question => {
  const updatedQuestion = {...question};
  
  // Compute source if not provided
  if (!updatedQuestion.source) {
    updatedQuestion.source = computeQuestionSource(
      updatedQuestion.topic,
      updatedQuestion.chapter
    );
  }
  
  // Set default sourceQuestion if not provided
  // Handle both sourceQuestion (new) and source-question (old) formats
  if (!updatedQuestion.sourceQuestion && !updatedQuestion['source-question']) {
    updatedQuestion.sourceQuestion = 'ChatGPT';
  } else if (updatedQuestion['source-question'] && !updatedQuestion.sourceQuestion) {
    // Migrate old format to new format
    updatedQuestion.sourceQuestion = updatedQuestion['source-question'];
    delete updatedQuestion['source-question'];
  }
  
  return updatedQuestion;
}; 