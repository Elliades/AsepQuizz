#!/usr/bin/env node
/**
 * Script to update quiz topics to match the standardized topics in index.json
 * 
 * This script reads all quiz files, updates the topic fields to match the
 * standardized topics in index.json, and writes the updated files back.
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the index.json file
async function loadIndex() {
  const indexPath = path.resolve(__dirname, '../data/subjects/index.json');
  return await fs.readJson(indexPath);
}

// Normalize a string for comparison
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Replace multiple spaces with a single space
    .trim();
}

// Find the best matching topic for a chapter name
function findTopicForChapter(chapterName, topics) {
  const normalizedChapterName = normalizeString(chapterName);
  
  // First, try to find an exact match in topic names
  const exactMatch = Object.values(topics).find(topic => 
    normalizeString(topic.name) === normalizedChapterName
  );
  
  if (exactMatch) {
    return exactMatch.name;
  }
  
  // Next, try to find a match in chapter names
  for (const topic of Object.values(topics)) {
    for (const chapter of topic.chapters) {
      if (normalizeString(chapter.name) === normalizedChapterName) {
        return topic.name;
      }
    }
  }
  
  // If no match is found, try to find a partial match in topic names
  const partialMatch = Object.values(topics).find(topic => 
    normalizeString(topic.name).includes(normalizedChapterName) ||
    normalizedChapterName.includes(normalizeString(topic.name))
  );
  
  if (partialMatch) {
    return partialMatch.name;
  }
  
  // If still no match, return the original chapter name
  return chapterName;
}

// Find the best matching topic for a question
function findTopicForQuestion(question, topics) {
  // If the question already has a topic, try to match it
  if (question.topic) {
    const topicMatch = findTopicForChapter(question.topic, topics);
    if (topicMatch !== question.topic) {
      return topicMatch;
    }
  }
  
  // If no topic match or no topic, try to match by chapter
  if (question.chapter) {
    return findTopicForChapter(question.chapter, topics);
  }
  
  // If no matches found, return a default topic
  return "General";
}

// Update all quiz files
async function updateQuizFiles() {
  try {
    console.log('Starting quiz topic update...');
    
    // Load the index
    const indexData = await loadIndex();
    console.log(`Loaded index with ${Object.keys(indexData.topics).length} topics`);
    
    // Find all quiz files
    const quizPattern = path.resolve(__dirname, '../data/quizzes/**/*.json');
    const quizFiles = glob.sync(quizPattern);
    console.log(`Found ${quizFiles.length} quiz files`);
    
    // Process each quiz file
    for (const quizFile of quizFiles) {
      console.log(`Processing ${quizFile}...`);
      
      // Read the quiz file
      const quiz = await fs.readJson(quizFile);
      let updated = false;
      
      // Update each question
      for (const question of quiz.questions) {
        const originalTopic = question.topic;
        const newTopic = findTopicForQuestion(question, indexData.topics);
        
        if (newTopic !== originalTopic) {
          question.topic = newTopic;
          updated = true;
          console.log(`  Updated question ${question.id}: ${originalTopic} -> ${newTopic}`);
        }
      }
      
      // Write the updated quiz file if changes were made
      if (updated) {
        await fs.writeJson(quizFile, quiz, { spaces: 2 });
        console.log(`  Saved updated quiz file: ${quizFile}`);
      } else {
        console.log(`  No changes needed for: ${quizFile}`);
      }
    }
    
    console.log('Quiz topic update completed successfully!');
    return true;
  } catch (error) {
    console.error('Error updating quiz topics:', error);
    return false;
  }
}

updateQuizFiles()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 