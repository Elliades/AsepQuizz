/**
 * Subject Mapper
 * 
 * This utility helps map quiz subject IDs to the standardized subject IDs
 * in the index.json file. It provides a bidirectional mapping between
 * quiz-specific subject IDs and the canonical subject IDs in the index.
 */
import subjects from '../data/subjects/index.json';

// Map of quiz subject IDs to index subject IDs
const subjectMap: Record<string, string> = {
  'se-lifcycle': 'INCOSE_SEHB5',
  'se-analyses': 'INCOSE_SEHB5',
  'se-tailoring': 'INCOSE_SEHB5',
  'se-practice': 'INCOSE_SEHB5',
  'se-introduction': 'INCOSE_SEHB5',
  'se-review': 'INCOSE_SEHB5',
  'se-fundamentals': 'INCOSE_SEHB5',
  'se-lifecycle-processes': 'INCOSE_SEHB5',
  'se-technical-processes': 'INCOSE_SEHB5',
  'se-management-processes': 'INCOSE_SEHB5',
  'se-agreement-processes': 'INCOSE_SEHB5',
  'se-organizational-processes': 'INCOSE_SEHB5',
  'se-tailoring-application': 'INCOSE_SEHB5',
  'se-in-practice': 'INCOSE_SEHB5',
  'se-case-studies': 'INCOSE_SEHB5',
  // Add more mappings as needed
};

/**
 * Gets the standardized subject ID for a quiz subject ID
 * 
 * @param quizSubjectId The subject ID from the quiz
 * @returns The corresponding subject ID from the index, or the original ID if not found
 */
export function getStandardizedSubjectId(quizSubjectId: string): string {
  return subjectMap[quizSubjectId] || quizSubjectId;
}

/**
 * Gets all quiz subject IDs that map to a given index subject ID
 * 
 * @param indexSubjectId The subject ID from the index
 * @returns Array of quiz subject IDs that map to the index subject ID
 */
export function getQuizSubjectIds(indexSubjectId: string): string[] {
  return Object.entries(subjectMap)
    .filter(([_, value]) => value === indexSubjectId)
    .map(([key, _]) => key);
}

/**
 * Checks if a subject ID is valid (either a quiz subject ID or an index subject ID)
 * 
 * @param subjectId The subject ID to check
 * @returns True if the subject ID is valid, false otherwise
 */
export function isValidSubjectId(subjectId: string): boolean {
  // Check if it's a direct quiz subject ID
  if (subjectMap[subjectId]) {
    return true;
  }
  
  // Check if it's a direct index subject ID
  if (subjects.subjects.some(subject => subject.id === subjectId)) {
    return true;
  }
  
  // Check if it's a quiz subject ID that maps to an index subject ID
  return Object.keys(subjectMap).includes(subjectId);
}

/**
 * Gets all valid subject IDs (both quiz and index)
 * 
 * @returns Array of all valid subject IDs
 */
export function getAllSubjectIds(): string[] {
  const indexSubjectIds = subjects.subjects.map(subject => subject.id);
  const quizSubjectIds = Object.keys(subjectMap);
  
  // Combine and deduplicate
  return [...new Set([...indexSubjectIds, ...quizSubjectIds])];
}

/**
 * Registers a new quiz subject ID and maps it to an index subject ID
 * 
 * @param quizSubjectId The subject ID from the quiz
 * @param indexSubjectId The subject ID from the index (defaults to INCOSE_SEHB5)
 * @returns The standardized subject ID
 */
export function registerSubjectId(quizSubjectId: string, indexSubjectId: string = 'INCOSE_SEHB5'): string {
  if (!subjectMap[quizSubjectId]) {
    console.log(`Registering new subject ID mapping: ${quizSubjectId} -> ${indexSubjectId}`);
    subjectMap[quizSubjectId] = indexSubjectId;
  }
  return indexSubjectId;
}

export default {
  getStandardizedSubjectId,
  getQuizSubjectIds,
  isValidSubjectId,
  getAllSubjectIds,
  registerSubjectId
}; 