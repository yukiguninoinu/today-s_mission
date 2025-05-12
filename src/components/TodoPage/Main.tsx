"use client";
import { Dispatch, SetStateAction, useState } from "react";
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
  setSelectedListName: Dispatch<SetStateAction<string>>;
  setSelectedTodo: (todo: Todo | null) => void;
  deleteList: (listId: string) => void; // リスト削除のための関数
  fetchLists: () => Promise<void>;
};

export function Main({
  todos,
  setTodos,
  selectedListId,
  selectedListName,
  setSelectedListName,
  setSelectedTodo,
  deleteList, // 親から渡されたリスト削除関数
  fetchLists,
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
        prev.map((t) => (t.id === todo.id ? { ...t, is_done: updated } : t)),
      );
    }
  };

  const handleDeleteList = () => {
    if (!selectedListId) return;

    const confirmDelete = window.confirm("本当にこのリストを削除しますか？");

    if (!confirmDelete) return;

    deleteList(selectedListId);
  };

  const priorityOrder: Record<string, number> = {
    高い: 3,
    普通: 2,
    低い: 1,
  };

  const activeTodos = todos
    .filter((todo) => !todo.is_done)
    .sort(
      (a: Todo, b: Todo) =>
        priorityOrder[b.priority] - priorityOrder[a.priority],
    );

  // 完了したTODOリスト（is_done === true）
  const doneTodos = todos.filter((todo) => todo.is_done);

  // Mainコンポーネント内
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(selectedListName);

  useEffect(() => {
    setEditTitle(selectedListName); // selectedListName が変わったら同期
  }, [selectedListName]);

  const handleTitleUpdate = async () => {
    const { error } = await supabase
      .from("lists") // リストのテーブル名
      .update({ name: editTitle })
      .eq("id", selectedListId);

    if (error) {
      console.error("タイトル更新エラー:", error.message);
    } else {
      setIsEditing(false);
      setSelectedListName(editTitle);
      fetchLists();
    }
  };

  return (
    <div className={Style.Main}>
      <div className={Style.TodoArea}>
        {/* リスト削除ボタン */}
        <DeleteButton onClick={handleDeleteList} />
        {/* <h2 className={Style.TodoTitle}>{selectedListName}</h2> */}
        {isEditing ? (
          <div className={Style.EditTitle}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <button onClick={handleTitleUpdate}>保存</button>
            <button onClick={() => setIsEditing(false)}>キャンセル</button>
          </div>
        ) : (
          <h2 className={Style.TodoTitle} onClick={() => setIsEditing(true)}>
            {selectedListName}
          </h2>
        )}

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
                    onClick={() => setSelectedTodo(todo)}
                    label="編集"
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
