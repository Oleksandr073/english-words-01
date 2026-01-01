import { apiSlice } from '@/redux/api/apiSlice';
import { ApiTagIdEnum } from '@/redux/api/ApiTagIdEnum';
import { ApiTagTypesEnum } from '@/redux/api/ApiTagTypesEnum';
import { handleOnQueryStarted } from '@/redux/api/handleOnQueryStarted';
import { createTag, editTag, getTags, getTag, deleteTag } from '@/requests';
import {
  Tag,
  CreateTagRequestBody,
  EditTagRequestBody,
} from '@/requests/types';

import { errorMessages } from './errorMessages';

const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<Tag[], void>({
      providesTags: [{ type: ApiTagTypesEnum.Tags, id: ApiTagIdEnum.List }],
      queryFn: async () => {
        try {
          const result = await getTags();
          return { data: result };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.getTags,
        });
      },
    }),
    getTag: build.query<Tag, string>({
      providesTags: (_result, _error, tagId) => {
        return [{ type: ApiTagTypesEnum.Tags, id: tagId }];
      },
      queryFn: async (tagId) => {
        try {
          const result = await getTag(tagId);
          return { data: result };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.getTag,
        });
      },
    }),
    createTag: build.mutation<Tag, CreateTagRequestBody>({
      invalidatesTags: [{ type: ApiTagTypesEnum.Tags, id: ApiTagIdEnum.List }],
      queryFn: async (body) => {
        try {
          const result = await createTag(body);
          return { data: result };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.createTag,
        });
      },
    }),
    editTag: build.mutation<Tag, EditTagRequestBody>({
      invalidatesTags: (_result, _error, { id }) => {
        return [
          { type: ApiTagTypesEnum.Tags, id: id },
          { type: ApiTagTypesEnum.Tags, id: ApiTagIdEnum.List },
          { type: ApiTagTypesEnum.Words, id: ApiTagIdEnum.List },
        ];
      },
      queryFn: async (body) => {
        try {
          const result = await editTag(body);
          return { data: result };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.editTag,
        });
      },
    }),
    deleteTag: build.mutation<void, string>({
      invalidatesTags: [
        { type: ApiTagTypesEnum.Tags, id: ApiTagIdEnum.List },
        { type: ApiTagTypesEnum.Words, id: ApiTagIdEnum.List },
        { type: ApiTagTypesEnum.Words, id: ApiTagIdEnum.ListItem },
      ],
      queryFn: async (id) => {
        try {
          await deleteTag(id);
          return { data: undefined };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.deleteTag,
        });
      },
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagQuery,
  useCreateTagMutation,
  useEditTagMutation,
  useDeleteTagMutation,
} = tagsApiSlice;
