"use client";
import React, { useEffect } from "react";
import Style from "./Main.module.css";
import { supabase } from "../../../lib/supabaseClient";
import { DeleteButton } from "../Button/DeleteButton"; // このボタンを使用してリスト削除
import { Todo } from "./Types/todo";

type MainProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  selectedListId: string;
  selectedListName: string;
  setSelectedTodo: (todo: Todo | null) => void;
  deleteList: (listId: string) => void; // リスト削除のための関数
};

export function Main({
  todos,
  setTodos,
  selectedListId,
  selectedListName,
  setSelectedTodo,
  deleteList, // 親から渡されたリスト削除関数
}: MainProps) {
  useEffect(() => {
    if (selectedListId) {
      fetchTodos(selectedListId);
    }
  }, [selectedListId]);

  // TODO取得
  const fetchTodos = async (listId: string) => {
    const { data, error } = await supabase
      .from("todo")
      .select("*")
      .eq("list_id", listId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("TODO取得エラー:", error.message);
    } else {
      setTodos(data || []);
    }
  };

  // TODO削除
  const handleDeleteTodo = async (id: string) => {
    const { error } = await supabase.from("todo").delete().eq("id", id);
    if (error) {
      console.error("削除失敗:", error.message);
      return;
    }

    // 再取得
    fetchTodos(selectedListId);
  };

  // リスト削除
  const handleDeleteList = () => {
    if (!selectedListId) return;

    deleteList(selectedListId); // 親から渡された関数でリストを削除
  };

  return (
    <div className={Style.Main}>
      <div className={Style.TodoArea}>
        {/* リスト削除ボタン */}
        <DeleteButton onClick={handleDeleteList} />
        <h2 className={Style.TodoTitle}>{selectedListName}</h2>
        <ul>
          {todos.length === 0 ? (
            <p>TODOリストはありません</p>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className={Style.TodoItem}>
                <strong>{todo.title}</strong>（優先度: {todo.priority}）<br />
                <small>{todo.note}</small>
                <div className={Style.TodoButtons}>
                  <button onClick={() => setSelectedTodo(todo)}>編集</button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>
                    削除
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
