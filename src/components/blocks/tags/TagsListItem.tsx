import { useState } from 'react';

import { TagItem } from '@/components/ui';
import { Tag } from '@/requests';

import { DeleteTagModal } from './DeleteTagModal';
import { EditTagModal } from './EditTagModal';
import { TagWordsModal } from './TagWordsModal';

type Props = {
  tag: Tag;
};
export const TagsListItem = ({ tag }: Props) => {
  const { name, color } = tag;

  const [isWordsModalOpen, setIsWordsModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [isDeletingModalOpen, setIsDeletingModalOpen] = useState(false);

  return (
    <>
      <TagItem
        name={name}
        color={color}
        onClick={() => setIsWordsModalOpen(true)}
        onEdit={() => setIsEditingModalOpen(true)}
        onRemove={() => setIsDeletingModalOpen(true)}
      />
      <TagWordsModal
        isOpen={isWordsModalOpen}
        setIsOpen={setIsWordsModalOpen}
        tag={tag}
      />
      <EditTagModal
        isOpen={isEditingModalOpen}
        setIsOpen={setIsEditingModalOpen}
        tag={tag}
      />
      <DeleteTagModal
        isOpen={isDeletingModalOpen}
        setIsOpen={setIsDeletingModalOpen}
        tag={tag}
      />
    </>
  );
};
