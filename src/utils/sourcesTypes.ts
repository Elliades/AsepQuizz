/**
 * Types for sources data
 * 
 * These types define the structure of the sources.json file and are used
 * by both the sourcesUtils.ts and generateIndex.ts files.
 */

export interface SourceSection {
  id: string;
  name: string;
  subjectId?: string;
  description?: string;
  topics: string[];
  sections?: SourceSection[];
}

export interface SourceChapter {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  startPage?: number;
  topics: string[];
  sections: SourceSection[];
}

export interface Source {
  id: string;
  name: string;
  description: string;
  chapters: SourceChapter[];
}

export interface SourcesData {
  sources: Source[];
}

// New types for the topic-centric index

export interface TopicSource {
  id: string;
  name: string;
}

export interface TopicChapter {
  id: string;
  name: string;
  sourceId: string;
  sourceName: string;
}

export interface TopicSection {
  id: string;
  name: string;
  chapterId: string;
  chapterName: string;
  sourceId: string;
  sourceName: string;
}

export interface Topic {
  name: string;
  sources: TopicSource[];
  chapters: TopicChapter[];
  sections: TopicSection[];
}

export interface TopicsMap {
  [topicName: string]: Topic;
}

export interface IndexMetadata {
  version: string;
  generated: string;
  topicCount: number;
  subjectCount: number;
}

export interface IndexData {
  // Topics as the primary structure (object with topic names as keys)
  topics: TopicsMap;
  
  // Keep the array version for backward compatibility
  topicsArray: Topic[];
  
  // Include subjects for backward compatibility
  subjects: {
    id: string;
    name: string;
    description: string;
    chapters: {
      id: string;
      name: string;
      description: string;
      topics: string[];
      subjectId: string;
    }[];
  }[];
  
  metadata: IndexMetadata;
} 