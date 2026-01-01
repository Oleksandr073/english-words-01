import { TagItem } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Tag, Word, WordStatus } from '@/requests';

type Props = {
  word: Word;
  tags?: Tag[];
};

const getStatusStyles = (status: WordStatus) => {
  switch (status) {
    case 'not_learning':
      return {
        container: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      };
    case 'learning':
      return {
        container: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      };
    case 'learned':
      return {
        container: 'bg-green-50 border-green-200 hover:bg-green-100',
      };
    default:
      return {
        container: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      };
  }
};

export const WordsListItem = ({ word, tags }: Props) => {
  const { word: wordText, status, tags: wordTagIds } = word;
  const styles = getStatusStyles(status);

  const wordTags =
    tags && wordTagIds ? tags.filter((tag) => wordTagIds.includes(tag.id)) : [];

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
        styles.container,
      )}
    >
      <div className="flex-1 min-w-0">
        <div
          className={cn({
            'mb-2': wordTags.length > 0,
          })}
        >
          <h3 className="text-lg font-semibold text-gray-900">{wordText}</h3>
        </div>
        {wordTags.length > 0 && (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 min-w-max">
              {wordTags.map((tag) => (
                <TagItem
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
