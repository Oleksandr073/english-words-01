import { TagsList } from '@/components/blocks/tags';
import { useGetTagsQuery } from '@/redux/tags';

export const TagsPage = () => {
  const { data, isLoading, isError } = useGetTagsQuery();
  return (
    <div className="p-4">
      {isLoading && <p className="text-gray-500 p-">Loading tags...</p>}

      {!isLoading && isError && (
        <p className="text-red-500 p-">Error loading tags</p>
      )}

      {!isLoading && !isError && data && (
        <>
          {data.length ? (
            <TagsList tags={data} />
          ) : (
            <p className="text-gray-500">No tags found.</p>
          )}
        </>
      )}
    </div>
  );
};
