"use client";
import React, { useEffect } from "react";
import Style from "./Main.module.css";
import { supabase } from "../../../lib/supabaseClient";
import { DeleteButton } from "../Button/DeleteButton"; // このボタンを使用してリスト削除
import { Todo } from "./Types/todo";
import { ActionButton } from "../Button/ActionButtons"; // 削除ボタンのスタイルを使用

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
      // 優先順位でソート (降順)
      const sortedData = data?.sort((a, b) => b.priority - a.priority);
      setTodos(sortedData || []);
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

  // タスクの完了状態を切り替え
  const handleToggleDone = async (todo: Todo) => {
    const updated = !todo.is_done;

    // supabaseでis_doneを更新
    const { error } = await supabase
      .from("todo")
      .update({ is_done: updated })
      .eq("id", todo.id);

    if (error) {
      console.error("完了状態更新エラー:", error.message);
    } else {
      // localStateのtodosを更新
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, is_done: updated } : t))
      );
    }
  };

  // リスト削除
  const handleDeleteList = () => {
    if (!selectedListId) return;

    deleteList(selectedListId); // 親から渡された関数でリストを削除
  };

  const activeTodos = todos.filter((todo) => !todo.is_done);

  // 完了したTODOリスト（is_done === true）
  const doneTodos = todos.filter((todo) => todo.is_done);

  return (
    <div className={Style.Main}>
      <div className={Style.TodoArea}>
        {/* リスト削除ボタン */}
        <DeleteButton onClick={handleDeleteList} />
        <h2 className={Style.TodoTitle}>{selectedListName}</h2>
        <ul>
          {activeTodos.length === 0 ? (
            <p className={Style.messege}>タスクはありません</p>
          ) : (
            activeTodos.map((todo) => (
              <li key={todo.id} className={Style.TodoItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.is_done}
                    onChange={() => handleToggleDone(todo)} // チェックボックスで完了状態を切り替える
                  />
                  <strong>{todo.title}</strong>（優先度: {todo.priority}）{" "}
                </label>
                <br />
                <small>{todo.note}</small>
                <div className={Style.TodoButtons}>
                  <ActionButton
                    onClick={() => setSelectedTodo(todo)}
                    label="編集"
                  />
                  {/* 削除ボタンをActionButtonに置き換え */}
                  <ActionButton
                    onClick={() => handleDeleteTodo(todo.id)}
                    label="削除"
                  />
                </div>
              </li>
            ))
          )}
        </ul>
        <hr />
        <ul>
          {doneTodos.length === 0 ? (
            <p className={Style.messege}>完了タスクはありません</p>
          ) : (
            doneTodos.map((todo) => (
              <li key={todo.id} className={Style.TodoItem}>
                <input
                  type="checkbox"
                  checked={todo.is_done}
                  onChange={() => handleToggleDone(todo)} // チェックボックスで完了状態を切り替える
                />
                <s>{todo.title}</s> {/* 完了タスクは取り消し線 */}
                <div className={Style.TodoButtons}>
                  <ActionButton
                    onClick={() => handleDeleteTodo(todo.id)}
                    label="削除"
                  />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
