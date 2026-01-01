import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

import { TAG_COLORS } from './config';
import { TagItem } from './TagItem';

export type TagType = {
  id: string;
  name: string;
  color: string;
};

type Props = {
  tags: TagType[];
  setTags: (tags: TagType[]) => void;
  suggestions?: TagType[];
  readOnly?: boolean;
};
export const Tags = ({
  tags,
  setTags,
  suggestions,
  readOnly = false,
}: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const addTag = (newTag: TagType) => {
    if (newTag.name && !tags.find(({ name }) => name === newTag.name)) {
      setTags([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter(({ id }) => id !== tagId));
  };

  const handleChange = (value: string) => {
    if (/[,\s]$/.test(value)) {
      const trimmed = value.trim().replace(/[,\s]+$/, '');
      if (trimmed) {
        addTag({
          id: trimmed,
          name: trimmed,
          color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
        });
      }
    } else {
      setInputValue(value);
    }
  };

  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    return suggestions.filter(({ name }) =>
      name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [suggestions, inputValue]);

  return (
    <div className="w-full bg-white max-w-md p-4 border rounded-lg">
      {tags.length > 0 && (
        <div className={cn('flex flex-wrap gap-2', { 'mb-2': !readOnly })}>
          {tags.map(({ id, name, color }) => (
            <TagItem
              key={id}
              name={name}
              color={color}
              onRemove={readOnly ? undefined : () => removeTag(id)}
            />
          ))}
        </div>
      )}
      {!readOnly && (
        <div className="relative">
          <Input
            type="text"
            className="w-full"
            placeholder="Введіть тег..."
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          />
          {filteredSuggestions.length > 0 && isFocused && (
            <ul className="absolute left-0 right-0 mt-1 z-10 px-2 py-3 rounded-lg bg-white border border-gray-400 flex flex-col gap-3 items-start">
              {filteredSuggestions.map((tag) => (
                <li key={tag.id}>
                  <TagItem
                    name={tag.name}
                    color={tag.color}
                    onClick={() => addTag(tag)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
