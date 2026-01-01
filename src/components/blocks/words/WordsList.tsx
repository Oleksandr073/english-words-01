import { LinkWithBack } from '@/components/ui';
import { Tag, Word } from '@/requests';

import { WordsListItem } from './WordsListItem';

type Props = {
  words: Word[];
  tags?: Tag[];
  emptyMessage?: string;
};

export const WordsList = ({
  words,
  tags,
  emptyMessage = 'No words found',
}: Props) => {
  if (words.length === 0) {
    return (
      <div className="mb-4">
        <p className="text-gray-500 text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <ul className="space-y-3">
        {words.map((word) => (
          <li key={word.id}>
            <LinkWithBack to={word.id}>
              <WordsListItem word={word} tags={tags} />
            </LinkWithBack>
          </li>
        ))}
      </ul>
    </div>
  );
};
