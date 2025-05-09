"use client";
import { Main } from "@/components/TodoPage/Main";
import { Sidebar } from "@/components/TodoPage/Sidebar";
import Style from "./page.module.css";
import { Input } from "@/components/TodoPage/Input";
import { Header } from "@/components/TodoPage/Header";
import { useState, useEffect } from "react";
import { supabase } from "@/../lib/supabaseClient";
import { Todo } from "@/components/TodoPage/Types/todo";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [selectedListName, setSelectedListName] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleListSelect = (id: string, name: string) => {
    setSelectedListId(id);
    setSelectedListName(name);
  };
  // listId が変わるたびに TODO を取得（冗長だけど再確認）
  useEffect(() => {
    if (selectedListId) {
      fetchTodos(selectedListId);
    }
  }, [selectedListId]);

  const fetchTodos = async (listId: string) => {
    const { data, error } = await supabase
      .from("todo")
      .select("*")
      .eq("list_id", listId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTodos(data);
    } else {
      console.error("TODO取得エラー:", error?.message);
    }
  };

  const handleTodoAddedOrUpdated = () => {
    if (selectedListId) {
      fetchTodos(selectedListId);
      setSelectedTodo(null); // 編集後はリセット
    }
  };

  const deleteList = async (listId: string) => {
    // リスト削除処理
    const { error } = await supabase.from("lists").delete().eq("id", listId);

    if (error) {
      console.error("リスト削除エラー:", error.message);
      return;
    }

    console.log("リスト削除成功");
    // リスト削除後、サイドバーや他のUIを更新する処理を追加する場合もある
  };

  return (
    <div>
      <Header />
      <div className={Style.MainPage}>
        <Sidebar
          setSelectedListId={setSelectedListId}
          setSelectedListName={setSelectedListName}
        />
        <Main
          todos={todos}
          setTodos={setTodos}
          selectedListId={selectedListId}
          setSelectedTodo={setSelectedTodo}
          deleteList={deleteList}
          selectedListName={selectedListName}
        />
        <Input
          selectedListId={selectedListId}
          onTodoAdded={handleTodoAddedOrUpdated}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
        />
      </div>
    </div>
  );
}
