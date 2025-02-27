/**
 * Utility to generate index.json from sources.json
 * 
 * This script reads the detailed sources.json file and generates a simplified
 * index.json file that the application uses for navigation and organization.
 */
import fs from 'fs';
import path from 'path';

// Read the sources.json file
const sourcesPath = path.join(__dirname, '../data/subjects/sources.json');
const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

// Create the simplified structure for index.json
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
        topics: chapter.topics || []
      };
    })
  };
});

// Write the index.json file
const indexData = { subjects };
const indexPath = path.join(__dirname, '../data/subjects/index.json');
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

console.log('Successfully generated index.json from sources.json'); 