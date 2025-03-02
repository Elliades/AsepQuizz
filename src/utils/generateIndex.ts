/**
 * Utility to generate index.json from sources.json
 * 
 * This script reads the detailed sources.json file and generates a simplified
 * index.json file that the application uses for navigation and organization.
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { Source, SourceChapter, SourcesData } from './sourcesTypes.js';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the sources.json file
async function generateIndex() {
  try {
    console.log('Starting index generation...');
    
    const sourcesPath = path.join(__dirname, '../data/subjects/sources.json');
    console.log(`Reading sources from: ${sourcesPath}`);
    
    // Check if the file exists
    if (!await fs.pathExists(sourcesPath)) {
      throw new Error(`Sources file not found at: ${sourcesPath}`);
    }
    
    // Read and parse the file
    const sourcesData = await fs.readJson(sourcesPath) as SourcesData;
    console.log(`Successfully read sources data with ${sourcesData.sources.length} sources`);
    
    // Create the simplified structure for index.json
    const subjects = sourcesData.sources.map((source: Source) => {
      return {
        id: source.id,
        name: source.name,
        description: source.description,
        chapters: source.chapters.map((chapter: SourceChapter) => {
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
    console.log(`Writing index to: ${indexPath}`);
    
    await fs.writeJson(indexPath, indexData, { spaces: 2 });
    console.log('Successfully generated index.json from sources.json');
    
    return true;
  } catch (error) {
    console.error('Error generating index:', error);
    return false;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
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
}

export default generateIndex; 