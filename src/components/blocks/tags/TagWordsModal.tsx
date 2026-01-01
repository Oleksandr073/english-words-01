import { WordsListItem } from '@/components/blocks/words';
import { LinkWithBack, Modal } from '@/components/ui';
import { useGetWordsQuery } from '@/redux/words';
import { GetWordsParams, Tag } from '@/requests';

type Props = {
  isOpen: boolean;
  setIsOpen(v: boolean): void;
  tag: Tag;
  queryParams?: Omit<GetWordsParams, 'tags'>;
};
export const TagWordsModal = ({
  isOpen,
  setIsOpen,
  tag,
  queryParams,
}: Props) => {
  const { id, name } = tag;

  const {
    data: words,
    isLoading: isWordsLoading,
    isError: isWordsError,
  } = useGetWordsQuery({ ...queryParams, tags: [id] });

  const isWordsLoaded = !isWordsLoading && !isWordsError && words;

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`Слова з тегом "${name}"`}
    >
      {isWordsLoading && (
        <p className="text-gray-500 p-">
          Завантаження слів з тегом "${name}"...
        </p>
      )}
      {!isWordsLoading && isWordsError && (
        <p className="text-red-500 p-">
          Помилка завантаження слів з тегом "${name}"
        </p>
      )}
      {isWordsLoaded && (
        <div>
          <div className="mb-4">
            {words.length ? (
              <ul className="max-h-[40vh] overflow-auto">
                {words.map((word) => (
                  <li key={word.id} className="mb-3">
                    <LinkWithBack to={word.id}>
                      <WordsListItem word={word} />
                    </LinkWithBack>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-900 font-medium">
                Тег "${name}" ще не використовувався в жодному слові
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
