"use client";

import React from "react";
import Style from "./SidebarButton.module.css";
import { supabase } from "../../../lib/supabaseClient";

type SidebarButtonProps = {
  fetchLists: () => Promise<void>;
};

export function SidebarButton({ fetchLists }: SidebarButtonProps) {
  const handleClick = async () => {
    const name = prompt("新しいリスト名を入力してください");
    if (!name) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from("lists")
      .insert([{ name, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("リスト追加失敗:", error.message);
      return;
    }

    fetchLists();
  };

  return (
    <button className={Style.plus_btn} onClick={handleClick}>
      +
    </button>
  );
}
