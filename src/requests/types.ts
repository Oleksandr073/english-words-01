import { Timestamp } from 'firebase/firestore';

export type ServerMetadataFields = {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

// Word collection
export type WordStatus = 'not_learning' | 'learning' | 'learned';

export type WordDetails = {
  word: string;
  status: WordStatus;
  translation?: string;
  tags?: string[];
  definition?: string;
  examples?: string[];
  notes?: string;
};

export type Word = WordDetails & ServerMetadataFields;

export type CreateWordRequestBody = Omit<WordDetails, 'tags'> & {
  tags?: CreateTagRequestBody[];
};

export type EditWordRequestBody = {
  id: string;
  word?: string;
  translation?: string;
  tags?: CreateTagRequestBody[];
  definition?: string;
  examples?: string[];
  notes?: string;
  status?: WordStatus;
};

export type GetWordsParams = {
  tags?: string[];
  status?: WordStatus;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
};

export type GetWordData = Word;

// Tag collection
export type TagDetails = {
  name: string;
  nameLower: string;
  color: string;
};

export type Tag = TagDetails & ServerMetadataFields;

export type CreateTagRequestBody = Omit<TagDetails, 'nameLower'>;

export type EditTagRequestBody = {
  id: string;
  name?: string;
  color?: string;
};
