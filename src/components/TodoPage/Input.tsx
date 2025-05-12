"use client";
import React, { useEffect, useState } from "react";
import Style from "./Input.module.css";
import { ActionButton } from "../Button/ActionButtons";
import { supabase } from "../../../lib/supabaseClient";
import { DeleteButton } from "../Button/DeleteButton";
import { Todo } from "./Types/todo";

type InputProps = {
  selectedListId: string;
  onTodoAdded: () => void;
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
};

export function Input({
  selectedListId,
  onTodoAdded,
  selectedTodo,
  setSelectedTodo,
}: InputProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("普通");
  const [note, setNote] = useState("");

  // 編集モードならフォームに内容を反映
  useEffect(() => {
    if (selectedTodo) {
      setTitle(selectedTodo.title);
      setPriority(selectedTodo.priority);
      setNote(selectedTodo.note);
    } else {
      setTitle("");
      setPriority("普通");
      setNote("");
    }
  }, [selectedTodo]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("TODOを入力してください");
      return;
    }

    if (!selectedListId) {
      alert("リストを選択してください");
      return;
    }

    if (selectedTodo) {
      // 編集処理
      const { error } = await supabase
        .from("todo")
        .update({ title, priority, note })
        .eq("id", selectedTodo.id);

      if (error) {
        console.error("TODO更新失敗:", error.message);
        return;
      }
    } else {
      // 新規追加
      const { error } = await supabase.from("todo").insert([
        {
          title,
          priority,
          note,
          list_id: selectedListId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("TODO追加失敗:", error.message);
        return;
      }
    }

    onTodoAdded(); // TODOリストの更新
    setSelectedTodo(null); // 編集終了後、リセット
    setTitle(""); // フォームの入力値リセット
    setPriority("普通");
    setNote("");
  };

  const handleDelete = async () => {
    if (!selectedTodo) return;

    const { error } = await supabase
      .from("todo")
      .delete()
      .eq("id", selectedTodo.id);
    if (error) {
      console.error("TODO削除失敗:", error.message);
      return;
    }

    onTodoAdded(); // TODOリストの更新
    setSelectedTodo(null); // 削除後、フォームをリセット
  };

  return (
    <div className={Style.InputArea}>
      {/* 削除ボタン */}
      {selectedTodo && <DeleteButton onClick={handleDelete} />}

      <h2 className={Style.InputTitle}>
        {selectedTodo ? "TODOを編集" : "NEW TODO"}
      </h2>

      <label htmlFor="inputtitle">TODO</label>
      <input
        id="inputtitle"
        type="text"
        className={Style.InputTodo}
        placeholder="TODOを入力"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="inputpriority">優先度</label>
      <select
        id="inputpriority"
        className={Style.InputPriority}
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="普通">普通</option>
        <option value="高い">高い</option>
        <option value="低い">低い</option>
      </select>

      <label htmlFor="inputnote">詳細</label>
      <textarea
        id="inputnote"
        rows={5}
        maxLength={200}
        className={Style.InputMemo}
        placeholder="詳細を入力"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className={Style.InputButtonArea}>
        <ActionButton
          label={selectedTodo ? "キャンセル" : "リセット"}
          onClick={() => {
            setSelectedTodo(null); // 編集キャンセル
            setTitle("");
            setPriority("普通");
            setNote("");
          }}
        />
        <ActionButton
          label={selectedTodo ? "更新" : "追加"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
