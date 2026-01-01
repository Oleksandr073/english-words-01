import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WordStatusSelect } from '@/components/blocks/words';
import { Editor, Input, Tags, TagType } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { useGetTagsQuery } from '@/redux/tags';
import { useCreateWordMutation } from '@/redux/words';
import { CreateTagRequestBody, WordStatus } from '@/requests/types';

export const CreateWordPage = () => {
  const navigate = useNavigate();

  const [word, setWord] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [definition, setDefinition] = useState<string>('');
  const [examples, setExamples] = useState<string[]>(['']);
  const [notes, setNotes] = useState<string>('');
  const [wordTags, setWordTags] = useState<Array<TagType>>([]);
  const [status, setStatus] = useState<WordStatus>('not_learning');

  const { data: tags, isLoading: isTagsLoading } = useGetTagsQuery();
  const [createWord, { isLoading: isWordCreating }] = useCreateWordMutation();

  const resetForm = () => {
    setWord('');
    setTranslation('');
    setDefinition('');
    setExamples(['']);
    setNotes('');
    setWordTags([]);
    setStatus('not_learning');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!word.trim()) {
      toast({
        title: 'Word is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const tagsToCreate: CreateTagRequestBody[] = wordTags.map((tag) => ({
        name: tag.name,
        color: tag.color,
      }));

      const newWordId = await createWord({
        word: word.trim(),
        translation: translation.trim() || undefined,
        definition: definition.trim() || undefined,
        examples:
          examples.filter((ex) => ex.trim()).length > 0
            ? examples.filter((ex) => ex.trim())
            : undefined,
        notes: notes.trim() || undefined,
        tags: tagsToCreate.length > 0 ? tagsToCreate : undefined,
        status,
      }).unwrap();

      resetForm();

      navigate(`/words/${newWordId}?backUrl=words`);
    } catch (error) {
      console.error(error);
    }
  };

  const addExample = () => {
    setExamples([...examples, '']);
  };

  const updateExample = (index: number, value: string) => {
    const newExamples = [...examples];
    newExamples[index] = value;
    setExamples(newExamples);
  };

  const removeExample = (index: number) => {
    if (examples.length > 1) {
      setExamples(examples.filter((_, i) => i !== index));
    }
  };

  if (isTagsLoading) {
    return (
      <div className="p-4">
        <b>Loading tags...</b>
      </div>
    );
  }

  if (!tags) {
    return (
      <div className="p-4">
        <b>Tags not found</b>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Create Word</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="word" className="block mb-2 font-medium">
            Word <span className="text-red-500">*</span>
          </label>
          <Input
            id="word"
            value={word}
            onChange={setWord}
            placeholder="Enter word"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="translation" className="block mb-2 font-medium">
            Translation
          </label>
          <Input
            id="translation"
            value={translation}
            onChange={setTranslation}
            placeholder="Enter translation"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="definition" className="block mb-2 font-medium">
            Definition
          </label>
          <Editor onUpdate={setDefinition} />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Examples</label>
          {examples.map((example, index) => (
            <div key={index} className="mb-2 flex gap-2">
              <Input
                value={example}
                onChange={(value) => updateExample(index, value)}
                placeholder={`Example ${index + 1}`}
                className="flex-1"
              />
              {examples.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExample(index)}
                  className="px-3 py-2 border-2 border-red-400 text-red-500 rounded-md hover:bg-red-50"
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
          >
            Add example
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block mb-2 font-medium">
            Status <span className="text-red-500">*</span>
          </label>
          <WordStatusSelect
            value={status}
            onValueChange={setStatus}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <p className="mb-2 font-medium">Tags</p>
          <Tags tags={wordTags} setTags={setWordTags} suggestions={tags} />
        </div>

        <div className="mb-4">
          <p className="mb-2 font-medium">Notes</p>
          <Editor onUpdate={setNotes} />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 disabled:bg-blue-200 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={isWordCreating}
          >
            Create word
          </button>
        </div>
      </form>
    </div>
  );
};
