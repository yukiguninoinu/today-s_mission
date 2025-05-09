"use client";
import React from "react";
import Style from "./SidebarButton.module.css";
import { supabase } from "../../../lib/supabaseClient";

type SidebarButtonProps = {
  onAdd: (newList: { id: string; name: string }) => void;
};

export function SidebarButton({ onAdd }: SidebarButtonProps) {
  const handleClick = async () => {
    const name = prompt("新しいリスト名を入力してください");
    if (!name) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("lists")
      .insert([{ name, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("リスト追加失敗:", error.message);
      return;
    }

    onAdd({ id: data.id, name: data.name });
  };

  return (
    <button className={Style.plus_btn} onClick={handleClick}>
      +
    </button>
  );
}
