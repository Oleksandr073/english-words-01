import { apiSlice } from '@/redux/api/apiSlice';
import { ApiTagIdEnum } from '@/redux/api/ApiTagIdEnum';
import { ApiTagTypesEnum } from '@/redux/api/ApiTagTypesEnum';
import { handleOnQueryStarted } from '@/redux/api/handleOnQueryStarted';
import {
  createWord,
  deleteWord,
  editWord,
  getWord,
  getWords,
} from '@/requests';
import {
  Word,
  CreateWordRequestBody,
  GetWordData,
  GetWordsParams,
  EditWordRequestBody,
} from '@/requests/types';

import { errorMessages } from './errorMessages';

const wordsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getWords: build.query<Word[], GetWordsParams>({
      providesTags: [{ type: ApiTagTypesEnum.Words, id: ApiTagIdEnum.List }],
      queryFn: async (params) => {
        try {
          const result = await getWords(params);
          return { data: result };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.getWords,
        });
      },
    }),
    getWord: build.query<GetWordData, string>({
      providesTags: (_result, _error, wordId) => {
        return [
          { type: ApiTagTypesEnum.Words, id: wordId },
          { type: ApiTagTypesEnum.Words, id: ApiTagIdEnum.ListItem },
        ];
      },
      queryFn: async (id: string) => {
        try {
          const result = await getWord(id);
          return { data: result };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.getWord,
        });
      },
    }),
    createWord: build.mutation<string, CreateWordRequestBody>({
      invalidatesTags: [
        { type: ApiTagTypesEnum.Words, id: ApiTagIdEnum.List },
        { type: ApiTagTypesEnum.Tags, id: ApiTagIdEnum.List },
      ],
      queryFn: async (body) => {
        try {
          const result = await createWord(body);
          return { data: result };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.createWord,
        });
      },
    }),
    editWord: build.mutation<void, EditWordRequestBody>({
      invalidatesTags: (
        _result,
        _error,
        { id, word, translation, status, tags },
      ) => {
        const invalidateTags = [{ type: ApiTagTypesEnum.Words, id: id }];
        // Update the words list if any of the fields that are rendered in the list are changed
        if (
          word !== undefined ||
          translation !== undefined ||
          tags !== undefined ||
          status !== undefined
        ) {
          invalidateTags.push({
            type: ApiTagTypesEnum.Words,
            id: ApiTagIdEnum.List,
          });
        }
        if (tags !== undefined) {
          invalidateTags.push({
            type: ApiTagTypesEnum.Tags,
            id: ApiTagIdEnum.List,
          });
        }
        return invalidateTags;
      },
      queryFn: async (body) => {
        try {
          await editWord(body);
          return { data: undefined };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.editWord,
        });
      },
    }),
    deleteWord: build.mutation<void, string>({
      invalidatesTags: [{ type: ApiTagTypesEnum.Words, id: ApiTagIdEnum.List }],
      queryFn: async (id: string) => {
        try {
          await deleteWord(id);
          return { data: undefined };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      onQueryStarted(_, { queryFulfilled }) {
        handleOnQueryStarted({
          processFunction: () => queryFulfilled,
          errorMessage: errorMessages.deleteWord,
        });
      },
    }),
  }),
});

export const {
  useGetWordsQuery,
  useGetWordQuery,
  useCreateWordMutation,
  useEditWordMutation,
  useDeleteWordMutation,
} = wordsApiSlice;
