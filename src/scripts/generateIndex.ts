/**
 * Script to generate index.json from sources.json
 * 
 * Run this script with: npm run generate-index
 */
import { execSync } from 'child_process';
import path from 'path';

try {
  console.log('Generating index.json from sources.json...');
  
  const generateIndexPath = path.resolve(__dirname, '../utils/generateIndex.ts');
  execSync(`ts-node ${generateIndexPath}`, { stdio: 'inherit' });
  
  console.log('Index generation completed successfully!');
} catch (error) {
  console.error('Error generating index:', error);
  process.exit(1);
} 