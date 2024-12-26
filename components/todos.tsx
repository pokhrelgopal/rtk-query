"use client";

import { useState } from "react";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from "@/lib/todoApi";
import type { Todo } from "@/lib/todoApi";

export function Todos() {
  // the "refetch" function is used to refetch the data from the server after creating a new todo.
  const {
    data: todos,
    error,
    isLoading,
  } = useGetTodosQuery(undefined, {
    skip: false,
  });
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [newTodo, setNewTodo] = useState({
    title: "",
    completed: false,
  });

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    try {
      await createTodo(newTodo).unwrap();
      setNewTodo({
        title: "",
        completed: false,
      });
      // The refetch is defined above and is used to refetch the data from the server after creating a new todo.
    } catch (err) {
      console.error("Failed to create the todo: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error:{" "}
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </div>
    );
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id).unwrap();
    } catch (err) {
      console.error("Failed to delete the todo: ", err);
    }
  };

  const markAsCompleted = async (id: number) => {
    try {
      await updateTodo({
        id,
        completed: true,
      });
    } catch (err) {
      console.error("Failed to mark the todo as completed: ", err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Create a New Todo
        </h2>
        <form onSubmit={handleCreateTodo} className="flex items-center gap-2">
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            placeholder="Todo title"
            className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isCreating || !newTodo.title.trim()}
            className={`w-60 p-2 text-white ${
              isCreating || !newTodo.title.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "btn-primary"
            }`}
          >
            {isCreating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Todo"
            )}
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todos?.map((todo: Todo) => (
          <div
            key={todo.id}
            className="bg-white shadow-md overflow-hidden flex flex-col"
          >
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {todo.title}
              </h2>
              <p className="text-gray-600">
                Status: {todo.completed ? "Completed" : "Pending"}
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-2 text-sm text-gray-500 flex items-center justify-between">
              {!todo.completed && (
                <p
                  onClick={() =>
                    todo.completed ? null : markAsCompleted(todo.id)
                  }
                  className="cursor-pointer"
                >
                  Mark as Completed
                </p>
              )}
              <p
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 cursor-pointer"
              >
                Delete
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
