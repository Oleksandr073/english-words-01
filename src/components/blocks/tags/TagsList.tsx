import { Tag } from '@/requests';

import { TagsListItem } from './TagsListItem';

type Props = {
  tags: Tag[];
};
export const TagsList = ({ tags }: Props) => {
  return (
    <ul className="flex flex-col items-start gap-3">
      {tags.map((tag) => (
        <li className="mb-2" key={tag.id}>
          <TagsListItem tag={tag} />
        </li>
      ))}
    </ul>
  );
};
