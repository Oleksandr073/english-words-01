import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction as runFBTransaction,
  Transaction as FBTransaction,
  updateDoc,
  where,
  orderBy,
  Timestamp,
  limit,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '@/config';

import {
  Tag,
  CreateTagRequestBody,
  EditTagRequestBody,
  Word,
  CreateWordRequestBody,
  EditWordRequestBody,
  GetWordsParams,
  GetWordData,
} from './types';

const getUserId = () => {
  const { currentUser } = auth;
  if (!currentUser) {
    throw new Error('There is no user');
  }
  return currentUser.uid;
};

const getUserDocRef = (id?: string) => {
  const userId = id ?? getUserId();
  return doc(db, 'users', userId);
};

const getWordsRef = () => {
  const userRef = getUserDocRef();
  return collection(userRef, 'words');
};
const getWordsDocRef = (id: string) => {
  const wordsRef = getWordsRef();
  return doc(wordsRef, id);
};

const getTagsRef = () => {
  const userRef = getUserDocRef();
  return collection(userRef, 'tags');
};
const getTagsDocRef = (id: string) => {
  const tagsRef = getTagsRef();
  return doc(tagsRef, id);
};

export const ensureUserProfileExists = async (userId: string) => {
  const userRef = getUserDocRef(userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) return;
  await setDoc(userRef, {
    createdAt: Timestamp.now(),
  });
};

export const getTags = async (): Promise<Tag[]> => {
  const tagsRef = getTagsRef();
  const q = query(tagsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Tag);
};

export const getTag = async (id: string): Promise<Tag> => {
  const docRef = getTagsDocRef(id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw new Error(`Tag with ID ${id} not found`);
  }
  return { ...snapshot.data(), id: snapshot.id } as Tag;
};

export const checkIfTagNameExist = async (
  name: string,
  excludeId?: string,
): Promise<boolean> => {
  const nameLower = name.trim().toLowerCase();
  const tagsRef = getTagsRef();
  const q = query(tagsRef, where('nameLower', '==', nameLower), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return false;
  }
  const existedTag = snapshot.docs[0];
  if (!existedTag) {
    return false;
  }
  if (excludeId !== undefined) {
    return existedTag.id !== excludeId;
  }
  return true;
};

export const createTag = async ({
  name,
  color,
}: CreateTagRequestBody): Promise<Tag> => {
  if (!name.trim()) {
    throw new Error("Tag name can't be empty");
  }

  const userId = getUserId();
  const data: Omit<Tag, 'id'> = {
    name: name.trim(),
    nameLower: name.trim().toLowerCase(),
    color,
    userId,
    createdAt: Timestamp.now(),
  };

  const isTagNameExist = await checkIfTagNameExist(name);
  if (isTagNameExist) {
    throw new Error(
      'A tag with this name already exists. Please choose a different name.',
    );
  }

  const tagsRef = getTagsRef();
  const { id } = await addDoc(tagsRef, data);
  const createdDoc = await getTag(id);
  return createdDoc;
};

export const editTag = async ({
  id,
  name,
  color,
}: EditTagRequestBody): Promise<Tag> => {
  if (name === undefined && color === undefined) {
    throw new Error(
      'At least one of the fields (name, color) must be provided.',
    );
  }

  if (name !== undefined) {
    const isTagNameExist = await checkIfTagNameExist(name, id);
    if (isTagNameExist) {
      throw new Error(
        'A tag with this name already exists. Please choose a different name.',
      );
    }
  }

  const docRef = getTagsDocRef(id);
  await updateDoc(docRef, {
    ...(name !== undefined && {
      name: name.trim(),
      nameLower: name.trim().toLowerCase(),
    }),
    ...(color !== undefined && { color }),
    updatedAt: Timestamp.now(),
  });
  const updatedDoc = await getTag(id);
  return updatedDoc;
};

export const deleteTag = async (id: string): Promise<void> => {
  const wordsRef = getWordsRef();
  const tagRef = getTagsDocRef(id);

  await runFBTransaction(db, async (fbTransaction) => {
    const q = query(wordsRef, where('tags', 'array-contains', id));
    const wordsSnapshot = await getDocs(q);

    wordsSnapshot.forEach((docSnap) => {
      const wordData = docSnap.data() as Word;
      fbTransaction.update(docSnap.ref, {
        tags: (wordData.tags || []).filter((tagId) => tagId !== id),
      });
    });

    fbTransaction.delete(tagRef);
  });
};

export const getWords = async ({
  tags,
  status,
  limit: lim,
  dateFrom,
  dateTo,
}: GetWordsParams): Promise<Word[]> => {
  const wordsRef = getWordsRef();
  let q = query(wordsRef, orderBy('createdAt', 'desc'));

  if (tags && tags.length > 0) {
    q = query(q, where('tags', 'array-contains-any', tags));
  }

  if (status) {
    q = query(q, where('status', '==', status));
  }

  if (dateFrom) {
    const start = new Date(dateFrom);
    start.setHours(0, 0, 0, 0);

    q = query(q, where('createdAt', '>=', Timestamp.fromDate(start)));
  }

  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);

    q = query(q, where('createdAt', '<=', Timestamp.fromDate(end)));
  }

  if (lim) {
    q = query(q, limit(lim));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Word);
};

export const getWord = async (id: string): Promise<GetWordData> => {
  const docRef = getWordsDocRef(id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw new Error(`Word with ID ${id} not found`);
  }

  return { ...snapshot.data(), id: snapshot.id } as Word;
};

export const createWord = async (
  body: CreateWordRequestBody,
): Promise<string> => {
  if (!body.word || !body.word.trim()) {
    throw new Error('Word field is required');
  }

  const userId = getUserId();
  const tags = (await getTags()) || [];

  return await runFBTransaction(db, async (fbTransaction) => {
    const inputTags = body.tags;
    let wordTags: string[] = [];
    if (inputTags && inputTags.length > 0) {
      wordTags = createTagsViaFBTransaction(
        fbTransaction,
        userId,
        tags,
        inputTags,
      );
    }

    const now = Timestamp.now();
    const wordsRef = getWordsRef();
    const wordDocRef = doc(wordsRef);
    const wordId = wordDocRef.id;

    const data: Omit<Word, 'id'> = {
      word: body.word.trim(),
      translation: body.translation?.trim() || '',
      tags: wordTags,
      definition: body.definition?.trim() || '',
      examples: body.examples || [],
      notes: body.notes?.trim() || '',
      status: body.status || 'not_learning',
      userId,
      createdAt: now,
      updatedAt: now,
    };

    fbTransaction.set(wordDocRef, data);
    return wordId;
  });
};

export const editWord = async ({
  id,
  word,
  translation,
  tags: inputTags,
  definition,
  examples,
  notes,
  status,
}: EditWordRequestBody): Promise<void> => {
  if (
    word === undefined &&
    translation === undefined &&
    inputTags === undefined &&
    definition === undefined &&
    examples === undefined &&
    notes === undefined &&
    status === undefined
  ) {
    throw new Error(
      'At least one of the fields (word, translation, tags, definition, examples, notes, status) must be provided.',
    );
  }

  const userId = getUserId();
  const docRef = getWordsDocRef(id);

  if (inputTags) {
    const tags = (await getTags()) || [];
    await runFBTransaction(db, async (fbTransaction) => {
      const tagsIds = createTagsViaFBTransaction(
        fbTransaction,
        userId,
        tags,
        inputTags,
      );
      fbTransaction.update(docRef, {
        ...(word !== undefined && { word: word.trim() }),
        ...(translation !== undefined && { translation: translation.trim() }),
        tags: tagsIds,
        ...(definition !== undefined && { definition: definition.trim() }),
        ...(examples !== undefined && { examples }),
        ...(notes !== undefined && { notes: notes.trim() }),
        ...(status !== undefined && { status }),
        updatedAt: Timestamp.now(),
      });
    });
  } else {
    await updateDoc(docRef, {
      ...(word !== undefined && { word: word.trim() }),
      ...(translation !== undefined && { translation: translation.trim() }),
      ...(definition !== undefined && { definition: definition.trim() }),
      ...(examples !== undefined && { examples }),
      ...(notes !== undefined && { notes: notes.trim() }),
      ...(status !== undefined && { status }),
      updatedAt: Timestamp.now(),
    });
  }
};

export const deleteWord = async (id: string): Promise<void> => {
  const docRef = getWordsDocRef(id);
  await deleteDoc(docRef);
};

const createTagsViaFBTransaction = (
  fbTransaction: FBTransaction,
  userId: string,
  tags: Tag[],
  inputTags: CreateTagRequestBody[],
): string[] => {
  const tagsIds = [];
  const tagsToCreate: CreateTagRequestBody[] = [];

  for (const inputTag of inputTags) {
    const nameLower = inputTag.name.trim().toLowerCase();
    const existedTag = tags.find((tag) => tag.nameLower === nameLower);
    if (existedTag) {
      tagsIds.push(existedTag.id);
    } else {
      tagsToCreate.push(inputTag);
    }
  }

  const tagsRef = getTagsRef();
  for (const tagToCreate of tagsToCreate) {
    const newTag: Omit<Tag, 'id'> = {
      name: tagToCreate.name.trim(),
      nameLower: tagToCreate.name.trim().toLowerCase(),
      color: tagToCreate.color,
      userId: userId,
      createdAt: Timestamp.now(),
    };
    const tagDocRef = doc(tagsRef);
    fbTransaction.set(tagDocRef, newTag);
    tagsIds.push(tagDocRef.id);
  }

  return tagsIds;
};
