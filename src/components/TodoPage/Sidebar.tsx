"use client";

import Styles from "./Sidebar.module.css";
import { SidebarButton } from "../Button/SidebarButton";
import { supabase } from "../../../lib/supabaseClient";
import { Message } from "./Messages";

type SidebarProps = {
  lists: { id: string; name: string }[];
  fetchLists: () => Promise<void>;
  setSelectedListId: (id: string) => void;
  setSelectedListName: (name: string) => void;
};

export function Sidebar({
  lists,
  fetchLists,
  setSelectedListId,
  setSelectedListName,
}: SidebarProps) {
  const initialMessage = "あなたはできる！";

  return (
    <div className={Styles.Sidebar}>
      <div>
        <Message initialMessage={initialMessage} />
      </div>
      <SidebarButton fetchLists={fetchLists} />
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

export async function fetchSidebarLists(
  setLists: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>
) {
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
}
