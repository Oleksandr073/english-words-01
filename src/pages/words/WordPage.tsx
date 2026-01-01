import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { WordStatusSelect } from '@/components/blocks/words';
import { Editor, Icon, Tags, TagType } from '@/components/ui';
import { useGetTagsQuery } from '@/redux/tags';
import {
  useDeleteWordMutation,
  useEditWordMutation,
  useGetWordQuery,
} from '@/redux/words';
import { WordStatus } from '@/requests/types';
import { getHumanReadableDateTime } from '@/utils';

export const WordPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isWordEditing, setIsWordEditing] = useState(false);
  const [isTranslationEditing, setIsTranslationEditing] = useState(false);
  const [isDefinitionEditing, setIsDefinitionEditing] = useState(false);
  const [isExamplesEditing, setIsExamplesEditing] = useState(false);
  const [isNotesEditing, setIsNotesEditing] = useState(false);
  const [isTagsEditing, setIsTagsEditing] = useState(false);
  const [isStatusEditing, setIsStatusEditing] = useState(false);

  const { data: word, isLoading, isError } = useGetWordQuery(id ?? skipToken);
  const {
    data: tags,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useGetTagsQuery();

  const [newWord, setNewWord] = useState(word?.word || '');
  const [newTranslation, setNewTranslation] = useState(word?.translation || '');
  const [newDefinition, setNewDefinition] = useState(word?.definition || '');
  const [newExamples, setNewExamples] = useState<string[]>(
    word?.examples || [],
  );
  const [newNotes, setNewNotes] = useState(word?.notes || '');
  const [newStatus, setNewStatus] = useState<WordStatus>(
    word?.status || 'not_learning',
  );
  const [newTags, setNewTags] = useState<TagType[]>(
    tags && word?.tags
      ? tags.filter((tag) => word?.tags?.includes(tag.id))
      : [],
  );

  const isFirstRenderWithData = useRef(true);
  useEffect(() => {
    if (word && isFirstRenderWithData.current) {
      isFirstRenderWithData.current = false;
      setNewWord(word.word || '');
      setNewTranslation(word.translation || '');
      setNewDefinition(word.definition || '');
      setNewExamples(word.examples || []);
      setNewNotes(word.notes || '');
      setNewStatus(word.status || 'not_learning');
    }
  }, [word]);

  const isFirstRenderWithTags = useRef(true);
  useEffect(() => {
    if (word && tags && isFirstRenderWithTags.current) {
      isFirstRenderWithTags.current = false;
      const tagsIds = word.tags;
      setNewTags(
        tags && tagsIds ? tags.filter((tag) => tagsIds.includes(tag.id)) : [],
      );
    }
  }, [word, tags]);

  const [editWord, { isLoading: isUpdating }] = useEditWordMutation();
  const [deleteWord, { isLoading: isDeleting }] = useDeleteWordMutation();

  if (!id) {
    return (
      <div>
        <b>Word ID not specified</b>
        <div>
          <Link to="/">All words</Link>
        </div>
      </div>
    );
  }

  const onUpdateWord = async () => {
    setIsWordEditing(false);
    try {
      await editWord({
        id,
        word: newWord.trim(),
      }).unwrap();
    } catch (error) {
      console.error(error);
      setNewWord(word?.word || '');
    }
  };

  const onUpdateTranslation = async () => {
    setIsTranslationEditing(false);
    try {
      await editWord({
        id,
        translation: newTranslation.trim(),
      }).unwrap();
    } catch (error) {
      console.error(error);
      setNewTranslation(word?.translation || '');
    }
  };

  const onUpdateDefinition = async () => {
    setIsDefinitionEditing(false);
    try {
      await editWord({
        id,
        definition: newDefinition.trim(),
      }).unwrap();
    } catch (error) {
      console.error(error);
      setNewDefinition(word?.definition || '');
    }
  };

  const onUpdateExamples = async () => {
    setIsExamplesEditing(false);
    try {
      await editWord({
        id,
        examples: newExamples.filter((ex) => ex.trim()),
      }).unwrap();
    } catch (error) {
      console.error(error);
      setNewExamples(word?.examples || []);
    }
  };

  const onUpdateNotes = async () => {
    setIsNotesEditing(false);
    try {
      await editWord({
        id,
        notes: newNotes.trim() || undefined,
      }).unwrap();
    } catch (error) {
      console.error(error);
      setNewNotes(word?.notes || '');
    }
  };

  const onUpdateTags = async () => {
    setIsTagsEditing(false);
    try {
      await editWord({
        id,
        tags: newTags.map((tag) => ({
          name: tag.name,
          color: tag.color,
        })),
      }).unwrap();
    } catch (error) {
      console.error(error);
      const tagsIds = word?.tags;
      setNewTags(
        tags && tagsIds ? tags.filter((tag) => tagsIds.includes(tag.id)) : [],
      );
    }
  };

  const onUpdateStatus = async () => {
    setIsStatusEditing(false);
    try {
      await editWord({
        id,
        status: newStatus,
      }).unwrap();
    } catch (error) {
      console.error(error);
      setNewStatus(word?.status || 'not_learning');
    }
  };

  const onDeleteWord = async () => {
    try {
      await deleteWord(id).unwrap();
      navigate('/words', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const addExample = () => {
    setNewExamples([...newExamples, '']);
  };

  const updateExample = (index: number, value: string) => {
    const newExamplesArray = [...newExamples];
    newExamplesArray[index] = value;
    setNewExamples(newExamplesArray);
  };

  const removeExample = (index: number) => {
    if (newExamples.length > 1) {
      setNewExamples(newExamples.filter((_, i) => i !== index));
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Loading word...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Error loading word</p>;
  }

  if (!word) {
    return <p className="text-gray-500">Word data not found</p>;
  }

  if (isTagsLoading) {
    return <p className="text-gray-500">Loading tags...</p>;
  }

  if (isTagsError) {
    return <p className="text-red-500">Error loading tags</p>;
  }

  if (!tags) {
    return <p className="text-gray-500">Tags not found</p>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col items-center">
        <p className="text-2xl font-bold mb-2">{word.word}</p>
        {word.translation && (
          <p className="text-lg text-gray-600 mb-2">{word.translation}</p>
        )}
        <p className="mb-2 text-sm text-gray-600">
          Created: {getHumanReadableDateTime(word.createdAt.toDate())}
        </p>
        {word.updatedAt && (
          <p className="mb-2 text-sm text-gray-600">
            Updated: {getHumanReadableDateTime(word.updatedAt.toDate())}
          </p>
        )}
      </div>

      <div className="h-[2px] rounded-full mb-4 bg-gray-200"></div>

      <div className="mb-4">
        <button
          className="mb-2 flex items-center gap-2"
          type="button"
          onClick={() => setIsWordEditing(true)}
          disabled={isDeleting || isUpdating}
        >
          <span className="text-lg font-medium">Word</span>
          <Icon name="pen" />
        </button>

        <div className="mb-2">
          {isWordEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2"
                disabled={isUpdating}
              />
              <button
                type="button"
                className="px-3 py-2 border-2 border-red-400 text-red-500 rounded-md hover:bg-red-50"
                onClick={() => {
                  setNewWord(word.word || '');
                  setIsWordEditing(false);
                }}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                onClick={onUpdateWord}
                disabled={isUpdating}
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-lg">{word.word}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <button
          className="mb-2 flex items-center gap-2"
          type="button"
          onClick={() => setIsTranslationEditing(true)}
          disabled={isDeleting || isUpdating}
        >
          <span className="text-lg font-medium">Translation</span>
          <Icon name="pen" />
        </button>

        <div className="mb-2">
          {isTranslationEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2"
                placeholder="Enter translation"
                disabled={isUpdating}
              />
              <button
                type="button"
                className="px-3 py-2 border-2 border-red-400 text-red-500 rounded-md hover:bg-red-50"
                onClick={() => {
                  setNewTranslation(word.translation || '');
                  setIsTranslationEditing(false);
                }}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                onClick={onUpdateTranslation}
                disabled={isUpdating}
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-lg text-gray-600">
              {word.translation || 'Translation not specified'}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <button
          className="mb-2 flex items-center gap-2"
          type="button"
          onClick={() => setIsDefinitionEditing(true)}
          disabled={isDeleting || isUpdating}
        >
          <span className="text-lg font-medium">Definition</span>
          <Icon name="pen" />
        </button>

        <div className="mb-2">
          <Editor
            initialData={word.definition || ''}
            onUpdate={setNewDefinition}
            isReadOnly={!isDefinitionEditing || isDeleting}
            key={
              (isDefinitionEditing ? 'editing' : 'read-only') + word.definition
            }
          />
        </div>

        {!isDeleting && isDefinitionEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-red-500 hover:text-red-500"
              onClick={() => {
                setNewDefinition(word.definition || '');
                setIsDefinitionEditing(false);
              }}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
              onClick={onUpdateDefinition}
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <button
          className="mb-2 flex items-center gap-2"
          type="button"
          onClick={() => setIsExamplesEditing(true)}
          disabled={isDeleting || isUpdating}
        >
          <span className="text-lg font-medium">Examples</span>
          <Icon name="pen" />
        </button>

        <div className="mb-2">
          {isExamplesEditing ? (
            <div>
              {newExamples.map((example, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={example}
                    onChange={(e) => updateExample(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded p-2"
                    placeholder={`Example ${index + 1}`}
                    disabled={isUpdating}
                  />
                  {newExamples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="px-3 py-2 border-2 border-red-400 text-red-500 rounded-md hover:bg-red-50"
                      disabled={isUpdating}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addExample}
                className="mt-2 inline-block border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
                disabled={isUpdating}
              >
                Add example
              </button>
            </div>
          ) : (
            <div>
              {word.examples && word.examples.length > 0 ? (
                <ul className="list-disc list-inside">
                  {word.examples.map((example, index) => (
                    <li key={index} className="mb-1">
                      {example}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Examples not specified</p>
              )}
            </div>
          )}
        </div>

        {!isDeleting && isExamplesEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-red-500 hover:text-red-500"
              onClick={() => {
                setNewExamples(word.examples || []);
                setIsExamplesEditing(false);
              }}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
              onClick={onUpdateExamples}
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <button
          className="mb-2 flex items-center gap-2"
          type="button"
          onClick={() => setIsTagsEditing(true)}
          disabled={isDeleting || isUpdating}
        >
          <span className="text-lg font-medium">Tags</span>
          <Icon name="pen" />
        </button>

        <div className="mb-2">
          <Tags
            tags={newTags}
            setTags={setNewTags}
            suggestions={tags}
            readOnly={!isTagsEditing}
          />
        </div>

        {!isDeleting && isTagsEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-red-500 hover:text-red-500"
              onClick={() => {
                const tagsIds = word.tags;
                setNewTags(
                  tagsIds ? tags.filter((tag) => tagsIds.includes(tag.id)) : [],
                );
                setIsTagsEditing(false);
              }}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
              onClick={onUpdateTags}
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <button
          className="mb-2 flex items-center gap-2"
          type="button"
          onClick={() => setIsNotesEditing(true)}
          disabled={isDeleting || isUpdating}
        >
          <span className="text-lg font-medium">Notes</span>
          <Icon name="pen" />
        </button>

        <div className="mb-2">
          <Editor
            initialData={word.notes || ''}
            onUpdate={setNewNotes}
            isReadOnly={!isNotesEditing || isDeleting}
            key={(isNotesEditing ? 'editing' : 'read-only') + word.notes}
          />
        </div>

        {!isDeleting && isNotesEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-red-500 hover:text-red-500"
              onClick={() => {
                setNewNotes(word.notes || '');
                setIsNotesEditing(false);
              }}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
              onClick={onUpdateNotes}
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <button
          className="mb-2 flex items-center gap-2"
          type="button"
          onClick={() => setIsStatusEditing(true)}
          disabled={isDeleting || isUpdating}
        >
          <span className="text-lg font-medium">Status</span>
          <Icon name="pen" />
        </button>

        <div className="mb-2">
          {isStatusEditing ? (
            <div className="flex gap-2">
              <WordStatusSelect
                value={newStatus}
                onValueChange={setNewStatus}
                disabled={isUpdating}
                className="flex-1"
              />
              <button
                type="button"
                className="px-3 py-2 border-2 border-red-400 text-red-500 rounded-md hover:bg-red-50"
                onClick={() => {
                  setNewStatus(word?.status || 'not_learning');
                  setIsStatusEditing(false);
                }}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                onClick={onUpdateStatus}
                disabled={isUpdating}
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-lg text-gray-600">
              {word.status === 'not_learning' && 'Not learning right now'}
              {word.status === 'learning' && 'Learning right now'}
              {word.status === 'learned' && 'Learned'}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-lg font-medium mb-2">Delete word</p>

        <button
          type="button"
          className="w-full flex justify-center items-center border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-red-500 hover:text-red-500"
          onClick={onDeleteWord}
          disabled={isDeleting || isUpdating}
        >
          <Icon name="trash" />
          <span className="ml-2">Delete</span>
        </button>
      </div>
    </div>
  );
};
