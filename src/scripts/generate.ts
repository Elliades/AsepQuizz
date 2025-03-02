/**
 * CLI script to generate index.json from sources.json
 * 
 * Behavior:
 * - Reads sources.json
 * - Generates index.json by calling generateIndex.js
 * - Writes index.json to data/subjects/index.json
 * 
 * Run with: npm run generate-index
 */
import generateIndex from '../utils/generateIndex.js';

console.log('Starting index generation process...');

generateIndex()
  .then(success => {
    if (success) {
      console.log('Index generation completed successfully!');
    } else {
      console.error('Index generation failed.');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unhandled error during index generation:', err);
    process.exit(1);
  }); 