import { FormEvent, useState } from 'react';

import { Modal, Input } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { useEditTagMutation } from '@/redux/tags';
import { Tag } from '@/requests';

type Props = {
  isOpen: boolean;
  setIsOpen(v: boolean): void;
  tag: Tag;
};
export const EditTagModal = ({
  isOpen,
  setIsOpen,
  tag: { id, name, color },
}: Props) => {
  const [newName, setNewName] = useState(name);
  const [newColor, setNewColor] = useState(color);

  const [editTag, { isLoading }] = useEditTagMutation();

  const onEditTag = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!newName.trim()) {
        toast({
          title: "Tag name can't be empty",
          variant: 'destructive',
        });
        return;
      }

      await editTag({
        id,
        name: newName.trim(),
        color: newColor,
      }).unwrap();

      setIsOpen(false);
    } catch (error) {
      setNewName(name);
      setNewColor(color);
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Edit tag data">
      <div>
        <form onSubmit={onEditTag}>
          <div className="mb-2">
            <label className="block mb-1" htmlFor="name">
              Name
            </label>
            <Input
              className="w-full"
              id="name"
              value={newName}
              onChange={setNewName}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1" htmlFor="balance">
              Color
            </label>
            <Input
              className="w-full"
              id="Color"
              type="color"
              value={newColor}
              onChange={setNewColor}
              disabled={isLoading}
              style={{ backgroundColor: newColor }}
            />
          </div>

          <button
            type="submit"
            className="w-full inline-block border-2 py-2 px-3 rounded-md font-medium transition-colors duration-300 border-gray-400 hover:border-blue-500 hover:text-blue-500"
            disabled={isLoading}
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};
