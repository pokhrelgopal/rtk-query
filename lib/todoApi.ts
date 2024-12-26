import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
  }),

  //The command below is used to prefetch data when the page is focused. Lets say user has switched to another tab and then comes back to the tab where the app is running, the data will be prefetched to show the latest data. ⬇️
  refetchOnFocus: true,

  // The command below is used to keep unused data for 20 seconds at API level. ⬇️
  // keepUnusedDataFor:20,
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos",
      providesTags: ["Todo"],
      // The command below is used to keep unused data for 20 seconds at endpoint level. ⬇️
      keepUnusedDataFor: 20,
    }),
    getTodo: builder.query<Todo, number>({
      query: (id) => `todos/${id}`,
      providesTags: ["Todo"],
    }),
    createTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (newTodo) => ({
        url: "todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: ["Todo"],
    }),
    updateTodo: builder.mutation<Todo, Partial<Todo>>({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
