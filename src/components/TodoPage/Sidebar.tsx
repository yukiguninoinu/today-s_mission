"use client";
import React, { useEffect, useState } from "react";
import Styles from "./Sidebar.module.css";
import { SidebarButton } from "../Button/SidebarButton";
import { supabase } from "../../../lib/supabaseClient";
import { Message } from "./Messages";

type SidebarProps = {
  setSelectedListId: (id: string) => void;
  setSelectedListName: (name: string) => void;
};

export function Sidebar({
  setSelectedListId,
  setSelectedListName,
}: SidebarProps) {
  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchLists();
  }, []);

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
    } else if (data) {
      setLists(data);
    }
  };

  const initialMessage = "あなたはできる！";

  return (
    <div className={Styles.Sidebar}>
      <div>
        <Message initialMessage={initialMessage} />
      </div>
      <SidebarButton onAdd={() => {}} />
      <ul>
        {lists.length === 0 ? (
          <p className={Styles.messege}>リストがありません</p>
        ) : (
          lists.map((list) => (
            <li key={list.id}>
              <button
                onClick={() => {
                  setSelectedListId(list.id);
                  setSelectedListName(list.name); // ← リスト名もセット！
                }}
              >
                {list.name}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
