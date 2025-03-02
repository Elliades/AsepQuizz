#!/usr/bin/env node
/**
 * Simple script to generate index.json from sources.json
 * 
 * This script creates a topic-centric index that serves as a bridge between
 * source materials and quiz content, with topics as the primary keys.
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIndex() {
  try {
    console.log('Starting index generation...');
    
    const sourcesPath = path.resolve(__dirname, '../data/subjects/sources.json');
    console.log(`Reading sources from: ${sourcesPath}`);
    
    // Check if the file exists
    if (!await fs.pathExists(sourcesPath)) {
      throw new Error(`Sources file not found at: ${sourcesPath}`);
    }
    
    // Read and parse the file
    const sourcesData = await fs.readJson(sourcesPath);
    console.log(`Successfully read sources data with ${sourcesData.sources.length} sources`);
    
    // Create a topic-centric structure
    const topicMap = new Map();
    
    // Process all sources and extract topics
    sourcesData.sources.forEach(source => {
      source.chapters.forEach(chapter => {
        // Process chapter-level topics
        chapter.topics.forEach(topicName => {
          if (!topicMap.has(topicName)) {
            topicMap.set(topicName, {
              name: topicName,
              sources: [],
              chapters: [],
              sections: []
            });
          }
          
          const topicEntry = topicMap.get(topicName);
          
          // Add source if not already included
          if (!topicEntry.sources.some(s => s.id === source.id)) {
            topicEntry.sources.push({
              id: source.id,
              name: source.name
            });
          }
          
          // Add chapter
          topicEntry.chapters.push({
            id: chapter.id,
            name: chapter.name,
            sourceId: source.id,
            sourceName: source.name
          });
        });
        
        // Process section-level topics
        if (chapter.sections) {
          const processSection = (section, parentChapter) => {
            section.topics.forEach(topicName => {
              if (!topicMap.has(topicName)) {
                topicMap.set(topicName, {
                  name: topicName,
                  sources: [],
                  chapters: [],
                  sections: []
                });
              }
              
              const topicEntry = topicMap.get(topicName);
              
              // Add source if not already included
              if (!topicEntry.sources.some(s => s.id === source.id)) {
                topicEntry.sources.push({
                  id: source.id,
                  name: source.name
                });
              }
              
              // Add section
              topicEntry.sections.push({
                id: section.id,
                name: section.name,
                chapterId: parentChapter.id,
                chapterName: parentChapter.name,
                sourceId: source.id,
                sourceName: source.name
              });
            });
            
            // Process nested sections recursively
            if (section.sections) {
              section.sections.forEach(subSection => {
                processSection(subSection, parentChapter);
              });
            }
          };
          
          chapter.sections.forEach(section => {
            processSection(section, chapter);
          });
        }
      });
    });
    
    // Convert the topic map to an object with topic names as keys
    const topicsObject = {};
    topicMap.forEach((value, key) => {
      topicsObject[key] = value;
    });
    
    // Also include the original subject structure for backward compatibility
    const subjects = sourcesData.sources.map(source => {
      return {
        id: source.id,
        name: source.name,
        description: source.description,
        chapters: source.chapters.map(chapter => {
          return {
            id: chapter.id,
            name: chapter.name,
            description: chapter.description,
            topics: chapter.topics || [],
            subjectId: chapter.subjectId || source.id
          };
        })
      };
    });
    
    // Write the index.json file with topics as the primary structure
    const indexData = { 
      // Topics as the primary structure (object with topic names as keys)
      topics: topicsObject,
      
      // Keep the array version for backward compatibility
      topicsArray: Array.from(topicMap.values()),
      
      // Include subjects for backward compatibility
      subjects,
      
      // Add a metadata section for version tracking
      metadata: {
        version: "2.0.0",
        generated: new Date().toISOString(),
        topicCount: Object.keys(topicsObject).length,
        subjectCount: subjects.length
      }
    };
    
    const indexPath = path.resolve(__dirname, '../data/subjects/index.json');
    console.log(`Writing index to: ${indexPath}`);
    
    await fs.writeJson(indexPath, indexData, { spaces: 2 });
    console.log(`Successfully generated index.json with ${Object.keys(topicsObject).length} topics`);
    
    return true;
  } catch (error) {
    console.error('Error generating index:', error);
    return false;
  }
}

generateIndex()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 