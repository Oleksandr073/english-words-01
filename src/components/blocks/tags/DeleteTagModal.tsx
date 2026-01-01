import { WordsListItem } from '@/components/blocks/words';
import { Modal, TagItem } from '@/components/ui';
import { useDeleteTagMutation } from '@/redux/tags';
import { useGetWordsQuery } from '@/redux/words';
import { Tag } from '@/requests';

type Props = {
  isOpen: boolean;
  setIsOpen(v: boolean): void;
  tag: Tag;
};
export const DeleteTagModal = ({ isOpen, setIsOpen, tag }: Props) => {
  const { id, name, color } = tag;

  const {
    data: words,
    isLoading: isWordsLoading,
    isError: isWordsError,
  } = useGetWordsQuery({ tags: [id] });

  const isWordsLoaded = !isWordsLoading && !isWordsError && words;

  const [deleteTag, { isLoading: isTagDeleting }] = useDeleteTagMutation();

  const onDeleteTag = async () => {
    try {
      await deleteTag(id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`Видалення тегу "${name}"`}
    >
      {isWordsLoading && (
        <p className="text-gray-500 p-">Завантаження слів...</p>
      )}
      {!isWordsLoading && isWordsError && (
        <p className="text-red-500 p-">Помилка завантаження слів</p>
      )}
      {isWordsLoaded && (
        <div>
          <p className="mb-4 text-gray-900 font-bold">
            Ви впевнені що хочете видалити цей тег?
          </p>

          <div className="mb-4">
            <TagItem name={name} color={color} />
          </div>

          <div className="mb-4">
            {words.length ? (
              <>
                <p className="mb-4 text-gray-900 font-semibold">
                  Тег буде видалено в наступних словах:
                </p>
                <ul className="max-h-[40vh] overflow-auto">
                  {words.map((word) => (
                    <li key={word.id} className="mb-3">
                      <WordsListItem word={word} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-gray-900 font-medium">
                Тег ще не використовувався в жодному слові
              </p>
            )}
          </div>

          <button
            type="button"
            className="w-full inline-block border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
            onClick={onDeleteTag}
            disabled={isTagDeleting}
          >
            Видалити
          </button>
        </div>
      )}
    </Modal>
  );
};
