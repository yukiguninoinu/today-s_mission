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
  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);
  const [currentView, setCurrentView] = useState<"main" | "sidebar" | "input">(
    "main",
  );
  const [isMobile, setIsMobile] = useState(false);
  // ✅ ウィンドウ幅によってモバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile(); // 初期判定
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    await fetchLists(); // リストを再取得してUIを更新
  };

  const fetchLists = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("lists")
      .select("id, name")
      .eq("user_id", userId);

    if (error) {
      console.error("リスト取得エラー:", error.message);
    } else {
      setLists(data);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);
  return (
    <div>
      <Header setCurrentView={setCurrentView} />
      <div className={Style.MainPage}>
        {/* <Sidebar
          lists={lists}
          fetchLists={fetchLists}
          setSelectedListId={setSelectedListId}
          setSelectedListName={setSelectedListName}
        />
        <Main
          todos={todos}
          setTodos={setTodos}
          selectedListId={selectedListId}
          selectedListName={selectedListName}
          setSelectedListId={setSelectedListId}
          setSelectedTodo={setSelectedTodo}
          deleteList={deleteList}
          setSelectedListName={setSelectedListName}
          fetchLists={fetchLists}
        />
        <Input
          selectedListId={selectedListId}
          onTodoAdded={handleTodoAddedOrUpdated}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
        /> */}

        {/* {currentView === "sidebar" && (
          <Sidebar
            lists={lists}
            fetchLists={fetchLists}
            setSelectedListId={setSelectedListId}
            setSelectedListName={setSelectedListName}
          />
        )}
        {currentView === "main" && (
          <Main
            todos={todos}
            setTodos={setTodos}
            selectedListId={selectedListId}
            selectedListName={selectedListName}
            setSelectedListId={setSelectedListId}
            setSelectedListName={setSelectedListName}
            setSelectedTodo={setSelectedTodo}
            deleteList={deleteList}
            fetchLists={fetchLists}
          />
        )}
        {currentView === "input" && (
          <Input
            selectedListId={selectedListId}
            onTodoAdded={handleTodoAddedOrUpdated}
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
          />
        )}
      </div>
    </div> */}

        {isMobile ? (
          <>
            {currentView === "sidebar" && (
              <Sidebar
                lists={lists}
                fetchLists={fetchLists}
                setSelectedListId={setSelectedListId}
                setSelectedListName={setSelectedListName}
              />
            )}
            {currentView === "main" && (
              <Main
                todos={todos}
                setTodos={setTodos}
                selectedListId={selectedListId}
                selectedListName={selectedListName}
                setSelectedListId={setSelectedListId}
                setSelectedListName={setSelectedListName}
                setSelectedTodo={setSelectedTodo}
                deleteList={deleteList}
                fetchLists={fetchLists}
              />
            )}
            {currentView === "input" && (
              <Input
                selectedListId={selectedListId}
                onTodoAdded={handleTodoAddedOrUpdated}
                selectedTodo={selectedTodo}
                setSelectedTodo={setSelectedTodo}
              />
            )}
          </>
        ) : (
          // ✅ PC表示：常に3つ並べる
          <>
            <Sidebar
              lists={lists}
              fetchLists={fetchLists}
              setSelectedListId={setSelectedListId}
              setSelectedListName={setSelectedListName}
            />
            <Main
              todos={todos}
              setTodos={setTodos}
              selectedListId={selectedListId}
              selectedListName={selectedListName}
              setSelectedListId={setSelectedListId}
              setSelectedListName={setSelectedListName}
              setSelectedTodo={setSelectedTodo}
              deleteList={deleteList}
              fetchLists={fetchLists}
            />
            <Input
              selectedListId={selectedListId}
              onTodoAdded={handleTodoAddedOrUpdated}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
          </>
        )}
      </div>
    </div>
  );
}
