import { useMemo, useState } from 'react';

import { WordsList } from '@/components/blocks/words';
import {
  Icon,
  Input,
  LinkWithBack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tags,
  TagType,
} from '@/components/ui';
import { useGetTagsQuery } from '@/redux/tags';
import { useGetWordsQuery } from '@/redux/words';
import { GetWordsParams, WordStatus } from '@/requests/types';

export const WordsListPage = () => {
  const [filterTags, setFilterTags] = useState<TagType[]>([]);
  const [filterWord, setFilterWord] = useState('');
  const [filterStatus, setFilterStatus] = useState<WordStatus | 'all'>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const resetFilters = () => {
    setFilterTags([]);
    setFilterWord('');
    setFilterStatus('all');
  };

  const wordsParams = useMemo(() => {
    const params: GetWordsParams = {
      tags: filterTags.map(({ id }) => id),
      status: filterStatus !== 'all' ? filterStatus : undefined,
    };
    return params;
  }, [filterTags, filterStatus]);

  const {
    data: words,
    isLoading: isWordsLoading,
    isError: isWordsError,
  } = useGetWordsQuery(wordsParams);
  const {
    data: tags,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useGetTagsQuery();

  const isWordsLoaded = words && !isWordsLoading && !isWordsError;
  const isTagsLoaded = tags && !isTagsLoading && !isTagsError;

  const isDataLoaded = isWordsLoaded && isTagsLoaded;

  const filteredWords = useMemo(() => {
    if (!words || !filterWord.trim()) return words || [];
    const searchTerm = filterWord.toLowerCase();
    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(searchTerm) ||
        word.translation?.toLowerCase().includes(searchTerm) ||
        word.definition?.toLowerCase().includes(searchTerm),
    );
  }, [words, filterWord]);

  return (
    <div className="p-4">
      <div className="fixed right-8 bottom-24 bg-blue-500 rounded-full">
        <LinkWithBack to="create">
          <div className="p-2">
            <Icon name="plus" width={40} className="text-white" />
          </div>
        </LinkWithBack>
      </div>

      {isWordsLoading && (
        <p className="text-gray-500 font-semibold">Loading words...</p>
      )}
      {isWordsError && (
        <p className="text-red-500 font-semibold">Error loading words</p>
      )}

      {isTagsLoading && (
        <p className="text-gray-500 font-semibold">Loading tags...</p>
      )}
      {isTagsError && (
        <p className="text-red-500 font-semibold">Error loading tags</p>
      )}

      {isDataLoaded && (
        <div>
          <div className="mb-6 p-2 bg-gray-50 rounded-md">
            <button
              type="button"
              className="w-full bg-white inline-block border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
              onClick={() => setIsFiltersOpen((isOpen) => !isOpen)}
            >
              Filters
            </button>

            {isFiltersOpen && (
              <div className="mt-4">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Status:
                  </label>
                  <Select
                    value={filterStatus}
                    onValueChange={(value: string) =>
                      setFilterStatus(value as WordStatus | 'all')
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="not_learning">
                        Not learning right now
                      </SelectItem>
                      <SelectItem value="learning">
                        Learning right now
                      </SelectItem>
                      <SelectItem value="learned">Learned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {tags.length > 0 && (
                  <div className="mb-4">
                    <p className="block mb-2 text-sm font-medium">
                      Select tags:
                    </p>
                    <Tags
                      tags={filterTags}
                      setTags={setFilterTags}
                      suggestions={tags}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <p className="block mb-2 text-sm font-medium">Word:</p>
                  <Input
                    value={filterWord}
                    onChange={setFilterWord}
                    className="w-full"
                    placeholder="Enter word or translation"
                  />
                </div>

                <button
                  type="button"
                  className="w-full bg-white inline-block border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
                  onClick={resetFilters}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          <p className="block mb-4 text-lg font-semibold text-center">Words</p>

          <WordsList
            words={filteredWords}
            tags={tags}
            emptyMessage={
              words.length === 0
                ? 'No words found'
                : 'No words found matching the filters'
            }
          />
        </div>
      )}
    </div>
  );
};
