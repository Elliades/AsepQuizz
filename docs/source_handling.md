# Source Handling in ASEP Quiz

The ASEP Quiz application automatically handles source information for quiz questions to ensure proper attribution and reference to the original materials.

## How Source Attribution Works

1. When a quiz is loaded, the system checks each question for source information
2. If a question doesn't have a source, one is computed based on:
   - The question's topic (mapped to sources in index.json)
   - The question's chapter (if provided, with page numbers from sources.json)
3. If a question doesn't have a sourceQuestion, it defaults to "ChatGPT"

## Source Format

Sources are displayed in the following format:
- Basic: "Systems Engineering Handbook 5.0"
- With chapter: "Systems Engineering Handbook 5.0, Chapter 3 (p.159)"
- With section: "Systems Engineering Handbook 5.0, Section 3.2 (p.180)"

## Manual Override

You can manually specify source information in quiz JSON files:

```json
{
  "id": "question-1",
  "text": "What is Systems Engineering?",
  "source": "INCOSE Handbook 5.0, Chapter 1 (p.15)",
  "sourceQuestion": "INCOSE Certification Team"
}
```

## Implementation Details

The source handling is implemented in the following files:

1. `src/utils/sourceUtils.ts` - Contains the core logic for computing sources
2. `src/utils/quizLoader.ts` - Applies source handling during quiz loading
3. `src/components/questions/QuestionLayout.tsx` - Displays source information

## Source Data

Source information is derived from:

1. `src/data/subjects/index.json` - Maps topics to sources
2. `src/data/subjects/sources.json` - Contains detailed source information including page numbers 