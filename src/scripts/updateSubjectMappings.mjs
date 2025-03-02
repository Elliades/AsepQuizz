#!/usr/bin/env node
/**
 * Script to update subject mappings based on quiz files
 * 
 * This script scans all quiz files, extracts the subject IDs,
 * and updates the subject mapper with any new subject IDs.
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the existing subject mapper
async function loadSubjectMapper() {
  const mapperPath = path.resolve(__dirname, '../utils/subjectMapper.ts');
  const content = await fs.readFile(mapperPath, 'utf8');
  
  // Extract the subject map using a regex
  const mapRegex = /const subjectMap: Record<string, string> = \{([\s\S]*?)\};/;
  const match = content.match(mapRegex);
  
  if (!match) {
    throw new Error('Could not find subject map in subjectMapper.ts');
  }
  
  // Parse the map content
  const mapContent = match[1];
  const entries = mapContent.match(/'([^']+)':\s*'([^']+)'/g) || [];
  
  // Convert to a JavaScript object
  const subjectMap = {};
  entries.forEach(entry => {
    const [key, value] = entry.split(':').map(part => 
      part.trim().replace(/'/g, '')
    );
    subjectMap[key] = value;
  });
  
  return { content, mapContent, subjectMap };
}

// Find all quiz files and extract subject IDs
async function findQuizSubjectIds() {
  const quizPattern = path.resolve(__dirname, '../data/quizzes/**/*.json');
  const quizFiles = glob.sync(quizPattern);
  console.log(`Found ${quizFiles.length} quiz files`);
  
  const subjectIds = new Set();
  
  for (const quizFile of quizFiles) {
    try {
      const quiz = await fs.readJson(quizFile);
      if (quiz.subjectId) {
        subjectIds.add(quiz.subjectId);
      }
    } catch (error) {
      console.error(`Error reading quiz file ${quizFile}:`, error);
    }
  }
  
  return Array.from(subjectIds);
}

// Update the subject mapper with new subject IDs
async function updateSubjectMapper(subjectIds) {
  const { content, mapContent, subjectMap } = await loadSubjectMapper();
  let updated = false;
  
  // Add new subject IDs to the map
  for (const subjectId of subjectIds) {
    if (!subjectMap[subjectId]) {
      subjectMap[subjectId] = 'INCOSE_SEHB5'; // Default mapping
      updated = true;
      console.log(`Added new subject ID mapping: ${subjectId} -> INCOSE_SEHB5`);
    }
  }
  
  if (!updated) {
    console.log('No new subject IDs found. Subject mapper is up to date.');
    return false;
  }
  
  // Generate the new map content
  const newMapContent = Object.entries(subjectMap)
    .map(([key, value]) => `  '${key}': '${value}'`)
    .join(',\n');
  
  // Replace the old map content with the new one
  const newContent = content.replace(mapContent, `\n${newMapContent}\n`);
  
  // Write the updated file
  const mapperPath = path.resolve(__dirname, '../utils/subjectMapper.ts');
  await fs.writeFile(mapperPath, newContent, 'utf8');
  
  console.log('Subject mapper updated successfully!');
  return true;
}

async function main() {
  try {
    console.log('Starting subject mapping update...');
    
    // Find all quiz subject IDs
    const subjectIds = await findQuizSubjectIds();
    console.log(`Found ${subjectIds.length} unique subject IDs in quiz files:`, subjectIds);
    
    // Update the subject mapper
    const updated = await updateSubjectMapper(subjectIds);
    
    if (updated) {
      console.log('Subject mapper updated successfully!');
    } else {
      console.log('No updates needed.');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating subject mappings:', error);
    return false;
  }
}

main()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 